<?php
	//include the connection page
	include('../../dbconfig.php');

    //get an instance
    $db = new Connection();

    $conn = $db->connect();

    $request = json_decode( file_get_contents('php://input'));
    $table = $request->data;

    $query = "INSERT INTO seat VALUES
            (DEFAULT, '$table->name', '$table->zoneid', '$table->shape', DEFAULT)";

    $result = mysqli_query($conn, $query);

    $conn->close();
?>