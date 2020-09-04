<?php
	//include the connection page
	include('../../dbconfig.php');
    header("Content-Type: application/json");
    
    //get an instance
    $db = new Connection();

    $conn = $db->connect();

    $request = json_decode(file_get_contents('php://input'));
    $apikey = $request->apikey;

    if ($apikey === "80f50985-23de-406e-946f-f826bc133b5a")
    {
        $query = "SELECT * FROM ingredient";

        $result = mysqli_query($conn, $query );

        $data = array();
        
        while ($row = mysqli_fetch_assoc($result))
        {
            array_push($data, $row);
        }
        echo json_encode($data);
    }
    else
    {
        header("HTTP/1.0 404 Not Found");
    }

    $conn->close();
?>