<?php

error_reporting(E_ALL ^ E_NOTICE);
ini_set("display_errors", 1);

require_once "config.php";

try {
  $conn_string = "pgsql:host=" . $db_conf['host'] . ";port=5432;dbname=" . $db_conf['dbname'];
  $pdo = new PDO($conn_string, $db_conf['user'], $db_conf['password'], [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
  //      echo "Connection works!";
} catch (PDOException $e) {
  die($e->getMessage());
}

// Berätta år browsern att vi tänker skicka JSON-data
header("Content-Type: application/json");

// Vi plockar ut variablerna från URLen och sparar i $request_vars
parse_str($_SERVER['QUERY_STRING'], $request_vars); // ==> ARRAY

// vi plockar ut data från request-bodyn
$request_json = file_get_contents('php://input');
$request_body = json_decode($request_json); // ==> OBJEKT
// Vi kan casta (byta datatyp) från objekt till array så här:
$request_body_arr = (array) $request_body;
// Alla headers
$req_headers = getallheaders();

// Vår response först som en PHP-array


if (isset($req_headers['x-api-key'])) {
  $stmt = $pdo->prepare("SELECT * FROM users WHERE api_key = ?");
  $stmt->execute([$req_headers['x-api-key']]);
  $dbresult = $stmt->fetch(PDO::FETCH_ASSOC);
  $userId = $dbresult['id'];
}
// Här kollar vi att alla requests har valid API_key header, annars ge error 403 och exit.
if (($_SERVER['REQUEST_METHOD'] == "GET" || $_SERVER['REQUEST_METHOD'] == "POST" || $_SERVER['REQUEST_METHOD'] == "PUT"
  || $_SERVER['REQUEST_METHOD'] == "DELETE") && (!isset($req_headers['x-api-key']) || $req_headers['x-api-key'] != $dbresult['api_key'])) {
  echo json_encode(["error" => "403"]);
  exit();
} elseif ($_SERVER['REQUEST_METHOD'] == "GET" && $req_headers['x-api-key'] == $dbresult['api_key']) {
  $response = [
    "todo" => []
  ];

  // Sök todo från databasen med hjälp av user ID
  $stmt = $pdo->prepare("SELECT t.*, c.category_name FROM todo t INNER JOIN category c ON t.category_id = c.id WHERE t.user_id = ? ORDER BY id desc");
  $stmt->execute([$dbresult['id']]);
  $response['todo'] = $stmt->fetchAll(PDO::FETCH_ASSOC);

  // Skickar response
  echo json_encode($response);
} elseif ($_SERVER['REQUEST_METHOD'] == "POST" && $req_headers['x-api-key'] == $dbresult['api_key']) {

  try {
    $stmt = $pdo->prepare("INSERT INTO
    todo (
    user_id,
    category_id,
    title,
    done,
    due_date,
    created_at,
    updated_at,
    sort_order
    ) VALUES (
      :user_id,
      :category_id,
      :title,
      :done,
      now(),
      now(),
      now(),
      :sort_order
)");

    $stmt->execute([
    "user_id" => $userId,
    "category_id" => $request_body->tag,
    "title" => $request_body->title,
    "done" => 'false',
    "sort_order" => 1,
  ]);
    $response = ["msg" => $request_vars['title'] . " Added to database!"];
  } catch (Exception $e) {
    $response = ["error" => $e];
  }
  echo json_encode($response);

} elseif ($_SERVER['REQUEST_METHOD'] == "PUT" && $req_headers['x-api-key'] == $dbresult['api_key']) {
  try {
    $stmt = $pdo->prepare("UPDATE
      todo 
    SET done = :true
    WHERE id = :id"); // OBS: glöm aldrig WHERE i DELETE och UPDATE!!

    $stmt->execute([":id" => $request_vars['id'], "true" => true]);
    $response = ["msg" => "UPDATED " . $request_vars['id']];
  } catch (Exception $e) {
    $response = ["error" => $e];
  }
  echo json_encode($response);
} elseif ($_SERVER['REQUEST_METHOD'] == "DELETE" && $req_headers['x-api-key'] == $dbresult['api_key']) {
  try {
    $stmt = $pdo->prepare("DELETE FROM 
      todo 
    WHERE id = :id"); // OBS: glöm aldrig WHERE i DELETE och UPDATE!!

    $stmt->execute([":id" => $request_vars['id']]);
    $response = ["msg" => "DELETED booking " . $request_vars['id']];
  } catch (Exception $e) {
    $response = ["error" => $e];
  }
  echo json_encode($response);
}
