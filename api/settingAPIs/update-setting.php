<?php
	//include the connection page
	include('../../dbconfig.php');

    //get an instance
    $db = new Connection();

    $conn = $db->connect();

    $request = json_decode( file_get_contents('php://input'));
    $setting = $request->data;

    $query = "UPDATE setting
            SET value = $setting->value
            WHERE title = $setting->title";

    $result = mysqli_query($conn, $query);
    
    $conn->close();
?>