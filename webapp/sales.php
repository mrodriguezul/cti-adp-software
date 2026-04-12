<?PHP

$authChk = true;
require_once('app-lib.php');

$txt_search = '';
$sales_table = '';


if (is_post_request()) {
  $txt_search = $_POST['txt_search'] ?? '';
  $sales_result = search_sales($txt_search);
  $sales_table = build_sales_table($sales_result);
}

build_layout_with_template(
  'sales_search.php',
  array(
    'txt_search' => $txt_search,
    'sales_table' => $sales_table
  )
);
