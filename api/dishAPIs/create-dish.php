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

                (DEFAULT, '$dish->name', '$dish->subname', '$dish->description', '$dish->cateid', '$dish->area', '$dish->sizes', '$dish->ingredients', '$dish->options', DEFAULT, '$dish->seperator')";

        $result = mysqli_query($conn, $query);

        $dish_id = $conn->insert_id;

        $array = json_encode($dish->ingredients);

        foreach($array as $ing) {
            $select_query = "SELECT * FROM ingredient WHERE name = '$ing->name' AND dish_id = '$dish_id'";
            $selectResult = mysqli_query($conn, $select_query);

            if( !mysqli_num_rows($selectResult) ) {
                $insert_query = "INSERT INTO ingredient VALUES
                    (DEFAULT, '$dish_id', '$ing->name', '$ing->price', DEFAULT)";

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
