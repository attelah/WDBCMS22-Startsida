<?php

error_reporting(E_ALL);
ini_set("display_errors", 1);

    require_once("hotel_config.php");

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

// Vår response först som en PHP-array
$response = [
  "bookings" => [], 
  "guests" => [],
  "conf" => $db_conf["hello"]
];

if ($_SERVER['REQUEST_METHOD'] == "GET") {
  
  // Hämta alla gäster
  $stmt = $pdo->prepare("SELECT 
    *
    FROM hotel_guest
    ORDER BY lastname
  ");
  $stmt->execute();
  $response['guests'] = $stmt->fetchAll(PDO::FETCH_ASSOC);

  // Hämta alla bokningar med namn!
  $stmt = $pdo->prepare("SELECT  
    b.*,
    g.firstname,
    g.lastname,
    g.firstname || ' ' || g.lastname AS guestname
    /* dubbel-pipe || konkatenerar teckensträngar i PostgreSQL */
  FROM 
    hotel_booking b
  INNER JOIN hotel_guest g ON
    b.guest_id = g.id");

  $stmt->execute();
  $response['bookings'] = $stmt->fetchAll(PDO::FETCH_ASSOC);

}

    // Omvandla PHP-arrayen till JSON och skriv ut
    echo json_encode($response);




