<?php
	//include the connection page
	include('../../dbconfig.php');

    //get an instance
    $db = new Connection();

    $conn = $db->connect();

    $request = json_decode( file_get_contents('php://input'));
    $zone = $request->data;

    $query = "DELETE FROM section
            WHERE id = '$zone->id'";

    $result = mysqli_query($conn, $query);

    $conn->close();
?>