<?php
    // Berätta år browsern att vi tänker skicka JSON-data
    header("Content-Type: application/json");
    // Vår response först som en PHP-array
    $response = [ "ip" => $_SERVER["REMOTE_ADDR"]];
    // Omvandla PHP-arrayen till JSON och skriv ut
    echo json_encode($response);
?>