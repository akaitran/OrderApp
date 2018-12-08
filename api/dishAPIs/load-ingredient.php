<?php
	//include the connection page
	include('../../dbconfig.php');

    //get an instance
    $db = new Connection();

    $conn = $db->connect();

    $request = json_decode( file_get_contents('php://input'));

    $query = "SELECT * FROM ingredient";

    $result = mysqli_query($conn, $query );

    $data = array();
    
    while( $row = mysqli_fetch_assoc( $result))
    {
        array_push($data, $row);
    }
    echo json_encode($data);

    $conn->close();
?>