<?PHP
  $authChk = true;
  require('app-lib.php');
  isset($_REQUEST['sid'])? $sid = $_REQUEST['sid'] : $sid = "";
  if(!$sid) {
    isset($_POST['sid'])? $sid = $_POST['sid'] : $sid = "";
  }
  isset($_REQUEST['a'])? $action = $_REQUEST['a'] : $action = "";
  if(!$action) {
    isset($_POST['a'])? $action = $_POST['a'] : $action = "";
  }
  isset($_POST['txtSearch'])? $txtSearch = $_POST['txtSearch'] : $txtSearch = "";
  if(!$txtSearch) {
    isset($_REQUEST['txtSearch'])? $txtSearch = $_REQUEST['txtSearch'] : $txtSearch = "";
  }

  isset($_POST['txtSku'])? $sku = $_POST['txtSku'] : $sku = "";
  isset($_POST['txtStockName'])? $stockName = $_POST['txtStockName'] : $stockName = "";
  isset($_POST['txtStockDesc'])? $stockDesc = $_POST['txtStockDesc'] : $stockDesc = "";
  isset($_POST['txtStockOnHand'])? $stockOnHand = $_POST['txtStockOnHand'] : $stockOnHand = "0";
  isset($_POST['txtStockImage'])? $stockImage = $_POST['txtStockImage'] : $stockImage = "";
  isset($_POST['txtStockPrice'])? $stockPrice = $_POST['txtStockPrice'] : $stockPrice = "0.00";
  isset($_POST['txtStatus'])? $stockStatus = $_POST['txtStatus'] : $stockStatus = "";
  $mode = "insertRec";
  if($action == "updateRec") {
    $query =
      "UPDATE lpa_stock SET
         sku = '$sku',
         name = '$stockName',
         description = '$stockDesc',
         onhand = '$stockOnHand',
         image_url = '$stockImage',
         price = '$stockPrice',
         status = '$stockStatus'
       WHERE
         id = '$sid'
      ";
     openDB();
     $result = pg_query($db, $query);
     if(!$result) {
       printf("Errormessage: %s\n", pg_last_error($db));
       exit;
     } else {
         header("Location: stock.php?a=recUpdate&txtSearch=$txtSearch");
       exit;
     }
  }
  if($action == "insertRec") {
    $query =
      "INSERT INTO lpa_stock (
         sku,
         name,
         description,
         onhand,
         image_url,
         price,
         status
       ) VALUES (
         '$sku',
         '$stockName',
         '$stockDesc',
         '$stockOnHand',
         '$stockImage',
         '$stockPrice',
         '$stockStatus'
       )
      ";
    openDB();
    $result = pg_query($db, $query);
    if(!$result) {
      printf("Errormessage: %s\n", pg_last_error($db));
      exit;
    } else {
      header("Location: stock.php?a=recInsert&txtSearch=".$stockName);
      exit;
    }
  }

  if($action == "Edit") {
    $query = "SELECT * FROM lpa_stock WHERE id = '$sid' LIMIT 1";
    $result = pg_query($db, $query);
    $row_cnt = pg_num_rows($result);
    $row = pg_fetch_assoc($result);
    if($result) pg_free_result($result);
    $sku     = $row['sku'];
    $stockName   = $row['name'];
    $stockDesc   = $row['description'];
    $stockOnHand = $row['onhand'];
    $stockImage  = $row['image_url'];
    $stockPrice  = $row['price'];
    $stockStatus = $row['status'];
    $mode = "updateRec";
  }
  build_header($displayName);
  build_navBlock();
  $fieldSpacer = "5px";
?>

  <div id="content">
    <div class="PageTitle">Stock Record Management (<?PHP echo $action; ?>)</div>
    <form name="frmStockRec" id="frmStockRec" method="post" action="<?PHP echo $_SERVER['PHP_SELF']; ?>">
      <div>
        <input name="txtSku" id="txtSku" class="form-control" placeholder="Stock SKU" value="<?PHP echo $sku; ?>" style="width: 300px;" title="Stock SKU">
      </div>
      <div style="margin-top: <?PHP echo $fieldSpacer; ?>">
        <input name="txtStockName" id="txtStockName" class="form-control" placeholder="Stock Name" value="<?PHP echo $stockName; ?>" style="width: 400px;"  title="Stock Name">
      </div>
      <div style="margin-top: <?PHP echo $fieldSpacer; ?>">
        <textarea name="txtStockDesc" id="txtStockDesc" class="form-control" placeholder="Stock Description" style="width: 400px;height: 80px"  title="Stock Description"><?PHP echo $stockDesc; ?></textarea>
      </div>
      <div style="margin-top: <?PHP echo $fieldSpacer; ?>">
        <input name="txtStockOnHand" id="txtStockOnHand" class="form-control" placeholder="Stock On-Hand" value="<?PHP echo $stockOnHand; ?>" style="width: 90px;text-align: right"  title="Stock On-Hand">
      </div>
      <div style="margin-top: <?PHP echo $fieldSpacer; ?>">
        <input name="txtStockPrice" id="txtStockPrice" class="form-control" placeholder="Stock Price" value="<?PHP echo $stockPrice; ?>" style="width: 90px;text-align: right"  title="Stock Price">
      </div>
      <div style="margin-top: <?PHP echo $fieldSpacer; ?>">
        <div>Stock Status:</div>
          <div class="form-check">
              <input class="form-check-input" name="txtStatus" id="txtStockStatusActive" type="radio" value="A">
              <label class="form-check-label" for="txtStockStatusActive">Active</label>
          </div>
          <div class="form-check">
              <input class="form-check-input" name="txtStatus" id="txtStockStatusInactive" type="radio" value="D">
              <label class="form-check-label" for="txtStockStatusInactive">Inactive</label>
          </div>
      </div>
      <div style="margin-top: <?PHP echo $fieldSpacer; ?>">
        <input name="txtStockImage" id="txtStockImage" class="form-control" placeholder="Url Image" value="<?PHP echo $stockImage; ?>" style="width: 400px;"  title="Url Image">
      </div>
      <input name="a" id="a" value="<?PHP echo $mode; ?>" type="hidden">
      <input name="sid" id="sid" value="<?PHP echo $sid; ?>" type="hidden">
      <input name="txtSearch" id="txtSearch" value="<?PHP echo $txtSearch; ?>" type="hidden">
    </form>
    <div class="optBar">
      <button type="button" class="btn btn-primary" id="btnStockSave">Save</button>
      <button type="button" class="btn btn-secondary" onclick="navMan('stock.php')">Close</button>
    </div>
  </div>
  <script>
    var stockRecStatus = "<?PHP echo $stockStatus; ?>";
    if(stockRecStatus == "A") {
      $('#txtStockStatusActive').prop('checked', true);
    } else {
      $('#txtStockStatusInactive').prop('checked', true);
    }
    $("#btnStockSave").click(function(){
        $("#frmStockRec").submit();
    });
    setTimeout(function(){
      $("#txtSku").focus();
    },1);
  </script>
<?PHP
build_footer();
?>
