<?php
	//include the connection page
	include('../../dbconfig.php');

    //get an instance
    $db = new Connection();

    $conn = $db->connect();

    $request = json_decode( file_get_contents('php://input'));
    $dish = $request->data;

    if ($dish)
    {
        $dish->ingredient = mb_strtolower($dish->ingredient, 'UTF-8');

        $query = "INSERT INTO dish VALUES

                (DEFAULT, '$dish->name', '$dish->subname', '$dish->description', '$dish->cateid', '$dish->area', '$dish->size', '$dish->price', '$dish->ingredient', '$dish->options', DEFAULT, '$dish->seperator')";

        $result = mysqli_query($conn, $query);

        $array = explode(", ", $dish->ingredient);

        foreach($array as $ing) {
            $select_query = "SELECT * FROM ingredient WHERE name = '$ing'";
            $selectResult = mysqli_query($conn, $select_query);

            if( !mysqli_num_rows($selectResult) ) {
                $insert_query = "INSERT INTO ingredient VALUES
                    (DEFAULT, '$ing', 0, DEFAULT)";

                $run = mysqli_query($conn, $insert_query);
            }
        }
    }
    else
    {
        header("HTTP/1.0 404 Not Found");
    }

    $conn->close();
?>
