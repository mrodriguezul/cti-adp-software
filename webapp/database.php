<?php

/**
 * This script contains database related functions
 */

require_once('database_credentials.php');

/**
 * Connect to database Function
 * - Connect to the local PostgreSQL database and create an instance
 */
function openDB() {
  global $db;
  if (!$db) {
    $connection_string = "host=" . DB_HOST .
                        " port=" . DB_PORT .
                        " user=" . DB_USER .
                        " password=" . DB_PASSWORD .
                        " dbname=" . DB_NAME;

    $db = pg_connect($connection_string);
    if (!$db) {
      echo "Failed to connect to PostgreSQL: " . pg_last_error();
    } else {
      // Set the schema
      pg_query($db, "SET search_path TO " . DB_SCHEMA);
    }
  }
}



/**
 * Close connection to database Function
 * - Close a connection to the local PostgreSQL database instance
 * @throws Exception
 */
function closeDB() {
  global $db;
  try {
    if ($db) {
      pg_close($db);
      $db = null;
    }
  } catch (Exception $e) {
    throw new Exception('Error closing database', 0, $e);
  }
}



function db_escape(string $val) : string {
  global $db;

  return pg_escape_string($db, $val);
}


function array_db_escape(array $array) : array {
  return array_map(fn($field) => db_escape($field), $array);
}
