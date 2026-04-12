<?php
/** 
 *
 * This file contains al the functions related to database queries
 *
 */

/**
 * Performs query against $db and if successful returns $result
 */
function query_with_check(string $query) {
  global $db;

  $result = pg_query($db, $query);

  if (!$result) exit("Database query failed: " . pg_last_error($db));

  return $result;
}


/**
 * Search $db for all sales that match $txtSearch
 * Searchs by name, date or address.
 */

function search_sales(string $txt_search) {

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