<?php
	//include the connection page
	include('../../dbconfig.php');

    //get an instance
    $db = new Connection();

    $conn = $db->connect();

    $request = json_decode( file_get_contents('php://input'));
    $filter = $request->data;

    if ($filter === "30mins") {
        $duration = "0.5 HOUR";
    } elseif ($filter === "1hour") {
        $duration = "1 HOUR";
    } elseif ($filter === "1month") {
        $duration = "1 MONTH";
    } elseif ($filter === "1week") {
        $duration = "1 WEEK";
    } elseif ($filter === "today") {
        $duration = "1 DAY";
    }

    $query = "SELECT * FROM orders WHERE time >= DATE_SUB(NOW(),INTERVAL " . "$duration)";

    $result = mysqli_query($conn, $query );

    $data = array();
    
    while( $row = mysqli_fetch_assoc($result))
    {
        array_push($data, $row);
    }

    echo json_encode($data);

    $conn->close();
?>