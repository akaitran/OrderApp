<?php
//include the connection page
include('../../dbconfig.php');
//get an instance
$db = new Connection();
$conn = $db->connect();

$request = json_decode(file_get_contents('php://input'));

$order = $request->data;

date_default_timezone_set("Australia/Melbourne");
$date = date("Y-m-d H:i:s", strtotime($order->date));

$query = "INSERT INTO orders VALUES
            (DEFAULT, '$order->staffname', '$order->orderno', '$order->orderside', '$order->description', '$order->dishes', '$order->type', '$order->total', DEFAULT, DEFAULT)";
try {
    $result = mysqli_query($conn, $query);
    echo "success";
} catch (Exception $e) {
    echo "failed";
}
$conn->close();
