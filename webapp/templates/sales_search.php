
<div class="PageTitle">Sales Management Search</div>

<!-- Status msg -->
<?php 
if(isset($_SESSION['status_msg'])) {
  echo '<p><b>'.$_SESSION['status_msg'].'</b></p>';
  unset($_SESSION['status_msg']);
}
?>

<!-- Search Section Start -->
<form name="searchSalesForm" method="POST"
      id="searchSalesForm"
      action="<?= $_SERVER['SCRIPT_NAME'] ?>">
  <div class="displayPane">
      <div>
          <div class="input-group mb-3">
              <input type="text" class="form-control" name="txt_search" id="txtSearch" aria-label="Search Sales" aria-describedby="btnSearch" placeholder="Search Sales" value="<?PHP echo $txt_search; ?>">
              <button class="btn btn-outline-primary" type="submit" id="btnSearch">Search</button>
          </div>
      </div>
  </div>
  <input type="hidden" name="a" value="listSale">
</form>
<!-- Search Section End -->

<!-- Search Results Start -->
<?php echo $sales_table ?>
<!-- Search Results End -->



