<?php
/** 
 *
 * This file contains al the functions related to database queries
 *
 */

require_once('validation_functions.php');



/**
 * Performs query against $db and if successful returns $result
 */
function query_with_check(string $query) : mixed {
  global $db;

  $result = pg_query($db, $query);

  if (!$result) exit("Database query failed: " . pg_last_error($db));

  return $result;
}


/**
 * Search $db for all sales that match $txtSearch
 * Searchs by name, date or address.
 */

function search_sales(string $txt_search) : mixed {

  $query =
    "SELECT
	*
     FROM
	lpa_invoices
     WHERE 
	( invoice_number LIKE '%$txt_search%'
     OR
	client_name LIKE '%$txt_search%'
     OR
	client_address LIKE '%$txt_search%' )

     AND status <> 'D'
    ORDER BY created_at DESC

     ";

  $result = query_with_check($query);

  return $result;
  
}

function search_clients(string $txt_search) : mixed {

  $query =
    "SELECT
	*
     FROM
	lpa_clients
     WHERE 
	( lpa_client_ID LIKE '%$txt_search%'
     OR
	lpa_client_firstname LIKE '%$txt_search%'
     OR
	lpa_client_lastname LIKE '%$txt_search%'
     OR
	lpa_client_address LIKE '%$txt_search%' 
     OR
	lpa_client_phone LIKE '%$txt_search%' )

     AND lpa_client_status <> 'D'

     ";

  $result = query_with_check($query);

  return $result;
  
}



/**
 * Changes the status of sale to D
 */
function delete_sale_by_id(int $id) {

  $query = 
    "UPDATE 
      lpa_invoices 
    SET 
      lpa_inv_status = 'D' 
    WHERE 
      lpa_inv_no = '$id' 
    ";

  return query_with_check($query);
}




/**
 * Insert $sale into $db !TODO
 */
function insert_sale(array $sale) : mixed {
  global $db;

  if (!is_valid_sale($sale)) return false;

  $sale = array_db_escape($sale);

  $date = date('Y-m-d H:i:s', strtotime($sale['date']));
  $client_id = $sale['client_id'];
  $client_name = $sale['client_name'];
  $client_address = $sale['client_address'];
  $amount = $sale['amount'];
  $status = $sale['status'];

  $query =
    "INSERT INTO lpa_invoices (
      lpa_inv_date,
      lpa_inv_client_ID,
      lpa_inv_client_name,
      lpa_inv_client_address,
      lpa_inv_amount,
      lpa_inv_status)
    VALUES (
      '$date',
      '$client_id',
      '$client_name',
      '$client_address',
      '$amount',
      '$status'
    )";

    return query_with_check($query);
}




/**
 * Lookup sale on $db using id
 */
function get_sale_by_id(int $id) : ?array {
  $id = db_escape($id);

  $query = 
    "SELECT 
       * 
     FROM 
       lpa_invoices
     WHERE
       lpa_inv_no = $id
     LIMIT 1
    ";

  $result = query_with_check($query);

  $sale = pg_fetch_assoc($result);

  if($result) pg_free_result($result);

  return $sale;
  
  
}

/**
 * Lookup client on $db using id
 */
function get_client_by_id(string $id) : ?array {
  $id = db_escape($id);

  $query = 
    "SELECT 
       * 
     FROM 
       lpa_clients
     WHERE
       lpa_client_ID = '$id'
     LIMIT 1
    ";

  $result = query_with_check($query);

  $client = pg_fetch_assoc($result);

  if($result) pg_free_result($result);

  return $client;
  
}

function get_next_auto_increment_from_table($table_name) {
  $table_name = db_escape($table_name);

  $query = "SELECT nextval('lpa_invoices_lpa_inv_no_seq')";

  $result = query_with_check($query);

  $next_auto_increment_value = pg_fetch_row($result)[0];

  if($result) pg_free_result($result);

  return $next_auto_increment_value;

 
}

/**
 * Lookup client on $db using id
 */
function get_item_by_id(int $id) : ?array{
  $id = db_escape($id);

  $query = 
    "SELECT 
       * 
     FROM 
       lpa_stock
     WHERE
       lpa_stock_ID = '$id'
     LIMIT 1
    ";

  $result = query_with_check($query);

  $item = pg_fetch_assoc($result);

  if($result) pg_free_result($result);

  return $item;
  
}




/**
 * 
 */
function update_sale(array $sale) {
  
  pre_var_dump($sale);

  if (!is_valid_sale($sale)) return false;

  $id = $sale['id'];
  $date = date('Y-m-d H:i:s', strtotime($sale['date']));
  $client_name = $sale['client_name'];
  $client_address = $sale['client_address'];
  $client_id = $sale['client_id'];
  $amount = $sale['amount'];
  $status = $sale['status'];

  $query =
    "UPDATE
      lpa_invoices
    SET
      lpa_inv_date = '$date',
      lpa_inv_client_name = '$client_name',
      lpa_inv_client_address = '$client_address',
      lpa_inv_client_ID = '$client_id',
      lpa_inv_amount = '$amount',
      lpa_inv_status = '$status'
    WHERE
      lpa_inv_no = '$id'
    ";

  return query_with_check($query);

}

function insert_user(array $user) : mixed {

  $user = array_db_escape($user);

  $first_name = $user['first_name'];
  $last_name = $user['last_name'];
  $address = $user['address'];
  $username = $user['username'];
  $password = password_hash($user['password'], PASSWORD_BCRYPT);
  $group = 'user';
  $status = 1;


  $query = 
    "INSERT INTO lpa_users (
      lpa_user_firstname,
      lpa_user_lastname,
      lpa_user_address,
      lpa_user_username,
      lpa_user_password,
      lpa_user_group,
      lpa_user_status)
      VALUES (
        '$first_name',
        '$last_name',
        '$address',
        '$username',
        '$password',
        '$group',
        '$status'
    )";

  return query_with_check($query);
}











