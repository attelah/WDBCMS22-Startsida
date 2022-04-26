<?php

error_reporting(E_ALL);
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
if (($_SERVER['REQUEST_METHOD'] == "GET" || $_SERVER['REQUEST_METHOD'] == "POST") && (!isset($req_headers['x-api-key']) || $req_headers['x-api-key'] != $dbresult['api_key'])) {

    echo json_encode(["error" => "403"]);
    exit();
} else {

    $response = [
        "todo" => []
    ];

    // Sök todo från databasen med hjälp av user ID
    $stmt = $pdo->prepare("SELECT t.*, c.category_name FROM todo t INNER JOIN category c ON t.category_id = c.id WHERE t.user_id = ?");
    $stmt->execute([$dbresult['id']]);
    $response['todo'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Skickar response
    echo json_encode($response);
}
