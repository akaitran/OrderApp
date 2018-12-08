<?php
	//include the connection page
	include('../../dbconfig.php');

    //get an instance
    $db = new Connection();

    $conn = $db->connect();

    $request = json_decode( file_get_contents('php://input'));
    $order = $request->data;

    $query = "INSERT INTO orders VALUES
            (DEFAULT, '$order->staffname', '$order->orderno', '$order->orderside', '$order->description', '$order->dishes', '$order->type', '$order->total', DEFAULT, DEFAULT)";

    $result = mysqli_query($conn, $query);

    $conn->close();
?>