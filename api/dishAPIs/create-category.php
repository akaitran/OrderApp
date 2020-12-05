<?php
	//include the connection page
	include('../../dbconfig.php');

    //get an instance
    $db = new Connection();

    $conn = $db->connect();

    $request = json_decode(file_get_contents('php://input'));
    $cate = $request->data;

    if ($cate)
    {
        $query = "INSERT INTO category VALUES
                (DEFAULT, DEFAULT, '$cate->name', '$cate->subname', '$cate->description', DEFAULT)";

        $result = mysqli_query($conn, $query);
    }
    else
    {
        header("HTTP/1.0 404 Not Found");
    }

    $conn->close();
?>