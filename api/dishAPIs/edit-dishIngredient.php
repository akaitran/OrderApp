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
  $id = $row['id'];
  $ingList = mb_strtolower($row['ingredient'], 'UTF-8');
  $update_query = "UPDATE dish
            SET ingredient = '$ingList'
            WHERE id = '$id'";

  $run = mysqli_query($conn, $update_query);
}

$conn->close();
?>
