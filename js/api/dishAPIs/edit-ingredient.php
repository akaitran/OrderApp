<?php

//include the connection page
include('../../dbconfig.php');

//get an instance
$db = new Connection();

$conn = $db->connect();

$request = json_decode( file_get_contents('php://input'));

$select_query = "SELECT id, ingredient FROM dish";

$result = mysqli_query($conn, $select_query);

while ($row = mysqli_fetch_assoc($result)) {
  $array = explode(", ", $row['ingredient']);
  $id = $row['id'];

  foreach($array as $ing) {
    $select_query = "SELECT * FROM ingredient WHERE name = '$ing'";
    $selectResult = mysqli_query($conn, $select_query);

    if( !mysqli_num_rows($selectResult) ) {
      $insert_query = "INSERT INTO ingredient VALUES
                    (DEFAULT, '$ing', 0)";

      $run = mysqli_query($conn, $insert_query);
    }
  }
}

$conn->close();
?>
