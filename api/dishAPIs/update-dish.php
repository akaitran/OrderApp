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
        $query = "UPDATE dish
                SET name = '$dish->name',
                    subname = '$dish->subname',
                    description = '$dish->description',
                    cateid = '$dish->cateid',
                    area = '$dish->area',
                    session = '$dish->session',
                    sizes = '$dish->sizes',
                    ingredients = '$dish->ingredients',
                    options = '$dish->options',
                    seperator = '$dish->seperator'
                WHERE id = '$dish->id'";

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
