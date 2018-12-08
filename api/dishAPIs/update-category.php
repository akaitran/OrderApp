<?php
	//include the connection page
	include('../../dbconfig.php');

    //get an instance
    $db = new Connection();

    $conn = $db->connect();

    $request = json_decode( file_get_contents('php://input'));
    $cate = $request->data;

    $query = "UPDATE category
            SET name = '$cate->name',
                subname = '$cate->subname',
                description = '$cate->description'
            WHERE id = '$cate->id'";

    $result = mysqli_query($conn, $query);
    
    $conn->close();
?>