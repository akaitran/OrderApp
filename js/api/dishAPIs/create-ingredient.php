<?php
	//include the connection page
	include('../../dbconfig.php');

    //get an instance
    $db = new Connection();

    $conn = $db->connect();

    $request = json_decode( file_get_contents('php://input'));
    $ing = $request->data;

    $query = "INSERT INTO ingredient VALUES
            (DEFAULT, '$ing', '0')";

    $result = mysqli_query($conn, $query);

    $conn->close();
?>