<?php
	//include the connection page
	include('../../dbconfig.php');

    //get an instance
    $db = new Connection();

    $conn = $db->connect();

    $request = json_decode( file_get_contents('php://input'));
    $cate = $request->data;

    $query = "INSERT INTO category VALUES
            (DEFAULT, '$cate->name', '$cate->subname', '$cate->description', DEFAULT)";

    $result = mysqli_query($conn, $query);

    $conn->close();
?>