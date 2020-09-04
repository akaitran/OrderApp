<?php

//include the connection page
include('../../dbconfig.php');

//get an instance
$db = new Connection();

$conn = $db->connect();

$request = json_decode( file_get_contents('php://input'));

$select_query = "SELECT id FROM category";

$result = mysqli_query($conn, $select_query);
$index = 0;

while ($row = mysqli_fetch_assoc($result)) {
  $id = $row['id'];
  
  while ($row = mysqli_fetch_assoc($result)) {
    $index++;
    $update_query = "UPDATE category SET indexno = '$index' WHERE id = '$id'";

    $run = mysqli_query($conn, $update_query);
  }
}

$conn->close();
?>
