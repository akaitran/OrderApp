<?php
	//include the connection page
	include('../../dbconfig.php');

    //get an instance
    $db = new Connection();

    $conn = $db->connect();

    $request = json_decode( file_get_contents('php://input'));
    $ingList = $request->data;

    foreach($ingList as $ing) {
        $query = "UPDATE ingredient
                SET price = '$ing->price',
                    unit = '$ing->unit'
                WHERE id = '$ing->id'";

        $result = mysqli_query($conn, $query);
    }
    
    $conn->close();
?>