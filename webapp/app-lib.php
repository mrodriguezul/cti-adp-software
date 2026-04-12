<?PHP
declare(strict_types=1);


require_once('functions.php');
require_once('database.php');
require_once('query_functions.php');
require_once('validation_functions.php');


/**
 * Set the global time zone
 *   - for Brisbane Australia (GMT +10)
 */
date_default_timezone_set('Australia/Queensland');


/**
 * Global variables and constants
 */

define('TEMPLATE_PATH', "templates/");
define('DATE_REGEX', "(0?[1-9]|[12][0-9]|3[01])([-\\/ ]?)(0?[1-9]|1[0-2])\2(?:19|20)[0-9]{2}"); 



// Database instance variable
$db = null;
$displayName = "";


// Start the session
session_name("lpaecomms");
session_start();

// $authUser = $_SESSION["authUser"] ?? "";
isset($_SESSION["authUser"])?
  $authUser = $_SESSION["authUser"] :
  $authUser = "";
isset($_SESSION["isAdmin"])?
  $isAdmin = $_SESSION["isAdmin"] :
  $isAdmin = "";

if(isset($authChk) == true) {
  if($authUser) {
    openDB();
    global $db;
    $query = "SELECT * FROM lpa_users WHERE id = '$authUser' LIMIT 1";
    $result = pg_query($db, $query);
    $row = pg_fetch_assoc($result);
    if($result) pg_free_result($result);
    $displayName = $row['firstname']." ".$row['lastname'];
  } else {
    header("location: login.php");
  }
}

if(isset($adminChk) == true) {
	if(!$isAdmin)
	{
		header("location: index.php");
	}
}



/**
 * System Logout check
 *
 *  - Check if the logout button has been clicked, if so kill session.
 */
if(isset($_REQUEST['killses']) == "true") {
  session_destroy();
  if (ini_get("session.use_cookies")) {
    $params = session_get_cookie_params();
    setcookie(session_name(), '', time() - 42000,
      $params["path"], $params["domain"],
      $params["secure"], $params["httponly"]
    );
  }
  session_destroy();
  header("location: login.php");
}




/**
 *  Build the page header function
 */
function build_header() {
  global $displayName;

  include_once 'header.php';
}


/**
 * Build the Navigation block
 */
function build_navBlock() { 
	$isAdmin = $_SESSION["isAdmin"] ?? "";
	?>
    <div id="navBlock">
      <div id="navHeader">MAIN MENU</div>
      <div class="navItem" onclick="navMan('index.php')">HOME</div>
      <div class="navItem" onclick="navMan('stock.php')">STOCK</div>
      <div class="navItem" onclick="navMan('sales.php')">SALES</div>
      <div class="menuSep"></div>
      <div class="navItem" onclick="navMan('login.php?killses=true')">Logout</div>
    </div>
<?PHP
}



/**
 *  Build the page footer function
 */
function build_footer() {
  include_once 'footer.php';
}

function build_client_row(array $client) : string {
  $client = array_map('htmlentities', $client);
  $id = $client['lpa_client_ID'];
  $firstname = $client['lpa_client_firstname'];
  $lastname = $client['lpa_client_lastname'];
  $name = $firstname . ' ' . $lastname;
  $address = $client['lpa_client_address'];
  $phone = $client['lpa_client_phone'];

  return "<tr class='hl client' data-id='$id'>
	    <td>$id</td>
	    <td>$name</td>
	    <td>$address</td>
	    <td>$phone</td>
	  </tr>";
}

function build_clients_table($clients) : string {

  $header = 
    "<thead>
      <th>ID</th>
      <th>Name</th>
      <th>Address</th>
      <th>Phone</th>
    </thead>";

  $rows = "";

  while ($client = pg_fetch_assoc($clients)) {
    $rows .= build_client_row($client);
  }


  return 
    '<table id="clientsTable" class="table table-bordered table-striped table-hover clients-table">' .
      ($rows ? $header : "") .
      "<tbody>
	$rows
      </tbody>
    </table>";

}

/**
 * builds a sale row with html
 */
function build_sale_row(array $sale) : string {
  $sale = array_map('htmlentities', $sale);
  $id = $sale['invoice_number'];
  $date = format_sale_date(date_create($sale['created_at']));
  $client = $sale['client_name'];
  $amount = $sale['amount'];

  return "<tr class='hl sale' data-id='$id'>
	    <td>$id</td>
	    <td>$client</td>
	    <td>$date</td>
	    <td>$amount</td>
	  </tr>";
  
}


/**
 * build sales table result from search
 */
function build_sales_table($sales) : string {

  $rows = "";
  $total_amount = 0;

  while ($sale = pg_fetch_assoc($sales)) {
    $rows .= build_sale_row($sale);
    $total_amount += $sale['amount'];
  }

  $formatted_amount = sprintf('%.2f', $total_amount);

  return "<table class='table table-bordered table-striped table-hover sales-table'>
	    <thead>
	      <th>Invoice Number</th>
	      <th>Client</th>
	      <th>Date</th>
	      <th>Amount</th>
	    </thead>
	    <tbody>
	      $rows
	    </tbody>
	    <tfoot>
	      <tr>
	        <td colspan='3'>Total</td>
	        <td style='text-align: right'>$formatted_amount</td>
	      </tr>
	    </tfoot>
	  </table>";

}


function build_layout_with_template(string $template, array $variables = []) : void {

  $template = TEMPLATE_PATH . $template;

  build_header();
  build_navBlock(); 

  // puts $variables in $template scope
  if ($variables) {
    foreach ($variables as $key => $value) {
      if ($key) ${$key} = $value;
    }
  }

?>

  <div id="content"?> 
  <?php if(file_exists($template)) include_once($template); 
	else echo 'Couldn\'t find template'; ?>
  </div>

  <?php
  build_footer();
}


function build_cart($cart) { ?>
    <table class="table table-bordered table-striped table-hover">
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Price</th>
          <th>Quantity</th>
          <th>Amount</th>
          <th>Delete</th>
        </tr>
      </thead>
      <tbody> <?php 
        $total = 0;
        foreach($cart as $item) {
          $id = $item['lpa_stock_ID'];
          $name = $item['lpa_stock_name'];
          $price = $item['lpa_stock_price'];
          $quantity = $item['quantity'];
          $amount = $price * $quantity;
          $total += $amount;
          $btnRemove = "<button class='btn btn-danger' onclick='removeFromCart($id)'>Remove</button>";
          echo "<tr><td>$id</td><td>$name</td><td>$price</td><td>$quantity</td><td>$amount</td><td>$btnRemove</td></tr>";
        } ?>
      <tfoot>
        <tr>
          <td colspan="4">Total</td><td><?= $total ?></td><td></td>
        </tr>
      </tfoot>
      </table> <?php 
}



function lpa_log($log_msg) {
  $log_dir = 'log';
  if (!file_exists($log_dir)) mkdir($log_dir, 0777, true);
  $log_file = $log_dir . '/lpalog.log';
  $log_msg = 
    'LOG - IP address: ' . $_SERVER['REMOTE_ADDR'] .  PHP_EOL . 
    date('d/m/Y H:i:s') . " - {$log_msg}" . PHP_EOL . 
    '----------------' . PHP_EOL;
  file_put_contents($log_file, $log_msg, FILE_APPEND);
}
