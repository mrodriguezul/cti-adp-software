<?php

/**
 * This script contains general app functions
 */


function redirect_to(string $url) : void {
  header("Location: " . $url);
  exit();
}

function is_request(string $method) : bool {
  return $_SERVER['REQUEST_METHOD'] === $method;
}

function is_post_request() : bool {
  return is_request("POST");
}

function is_get_request() : bool {
  return is_request("GET");
}

/**
 * formats sale date
 */
function format_sale_date(DateTime $date) : string {
  $day = $date->format("d/m/Y");
  $hour = $date->format("H:i:s");
  return "$day <i>at $hour</i>";
}