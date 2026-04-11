<?PHP
  $authChk = true;
  require('app-lib.php');
  isset($_POST['a'])? $action = $_POST['a'] : $action = "";
  if(!$action) {
    isset($_REQUEST['a'])? $action = $_REQUEST['a'] : $action = "";
  }
  isset($_POST['txtSearch'])? $txtSearch = $_POST['txtSearch'] : $txtSearch = "";
  if(!$txtSearch) {
    isset($_REQUEST['txtSearch'])? $txtSearch = $_REQUEST['txtSearch'] : $txtSearch = "";
  }
  build_header($displayName);
?>
  <?PHP build_navBlock(); ?>
  <div id="content">
    <div class="PageTitle">Stock Management Search</div>

  <!-- Search Section Start -->
    <form name="frmSearchStock" method="post"
          id="frmSearchStock"
          action="<?PHP echo $_SERVER['PHP_SELF']; ?>">
      <div class="displayPane">
        <div>
            <div class="input-group mb-3">
                <input type="text" class="form-control" name="txtSearch" id="txtSearch" aria-label="Search Stock Name" aria-describedby="btnSearch" placeholder="Search Stock Name" value="<?PHP echo $txtSearch; ?>">
                <button class="btn btn-outline-primary" type="button" id="btnSearch">Search</button>
            </div>
            <button type="button" class="btn btn-primary" id="btnAddRec">Add Stock</button>
        </div>
      </div>
      <input type="hidden" name="a" value="listStock">
    </form>
    <!-- Search Section End -->
    <!-- Search Section List Start -->
    <?PHP
      if($action == "listStock") {
    ?>
    <div>
      <table class="table table-bordered table-striped table-hover">
        <tr style="background: #eeeeee">
          <td><b>Stock Code</b></td>
          <td><b>Stock Name</b></td>
          <td><b>Price</b></td>
        </tr>
    <?PHP
      openDB();
      global $db;
      $query =
        "SELECT
            *
         FROM
            lpa_stock
         WHERE
            name LIKE '%$txtSearch%' AND status <> 'D'
         ";
      $result = pg_query($db, $query);
      $row_cnt = pg_num_rows($result);
      if($row_cnt >= 1) {
        while ($row = pg_fetch_assoc($result)) {
          $sid = $row['id'];
          ?>
          <tr class="hl">
            <td onclick="loadStockItem(<?PHP echo $sid; ?>,'Edit')"
                style="cursor: pointer;">
              <?PHP echo $sid; ?>
            </td>
            <td onclick="loadStockItem(<?PHP echo $sid; ?>,'Edit')"
                style="cursor: pointer;">
                <?PHP echo $row['name']; ?>
            </td>
            <td style="text-align: right;">
              <?PHP echo $row['price']; ?>
            </td>
          </tr>
        <?PHP }
      } else { ?>
        <tr>
          <td colspan="3" style="text-align: center">
            No Records Found for: <b><?PHP echo $txtSearch; ?></b>
          </td>
        </tr>
      <?PHP } ?>
      </table>
    </div>
    <?PHP } ?>
    <!-- Search Section List End -->
  </div>
  <script>
    var action = "<?PHP echo $action; ?>";
    var search = "<?PHP echo $txtSearch; ?>";
    if(action == "recUpdate") {
      alert("Record Updated!");
      navMan("stock.php?a=listStock&txtSearch=" + search);
    }
    if(action == "recInsert") {
      alert("Record Added!");
      navMan("stock.php?a=listStock&txtSearch=" + search);
    }
    if(action == "recDel") {
      alert("Record Deleted!");
      navMan("stock.php?a=listStock&txtSearch=" + search);
    }
    function loadStockItem(ID,MODE) {
      window.location = "stockaddedit.php?sid=" +
      ID + "&a=" + MODE + "&txtSearch=" + search;
    }
    $("#btnSearch").click(function() {
      $("#frmSearchStock").submit();
    });
    $("#btnAddRec").click(function() {
      loadStockItem("","Add");
    });
    setTimeout(function(){
      $("#txtSearch").select().focus();
    },1);
  </script>
<?PHP
build_footer();
?>
