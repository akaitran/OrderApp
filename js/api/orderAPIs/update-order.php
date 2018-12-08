<?php
	//include the connection page
	include('../../dbconfig.php');

    //get an instance
    $db = new Connection();

    $conn = $db->connect();

    $request = json_decode( file_get_contents('php://input'));
    $order = $request->data;

    $query = "UPDATE orders
            SET staffname = '$order->staffname',
                orderno = '$order->orderno',
                orderside = '$order->orderside',
                description = '$order->description',
                dishes = '$order->dishes',
                type = '$order->type',
                total = '$order->total',
                status = '$order->status'
            WHERE id = '$order->id'";

    $result = mysqli_query($conn, $query);
    
    $conn->close();
?>