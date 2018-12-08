<?php

//include the connection page
include('../../dbconfig.php');

//get an instance
$db = new Connection();

$conn = $db->connect();

$request = json_decode( file_get_contents('php://input'));

$select_query = "SELECT id, options FROM dish";

$result = mysqli_query($conn, $select_query);

while ($row = mysqli_fetch_assoc($result)) {
  $opt = str_replace("take away","",$row['options']);
  $id = $row['id'];
  $update_query = "UPDATE dish SET options = '$opt' WHERE id = '$id'";

  $run = mysqli_query($conn, $update_query);
}

$conn->close();
?>
