<?php 

  $hostname = "localhost";
  $username = "root";
  $password = "Zebraking123!?0";
  $database = "jackdawsandkestrels";

  $conn = mysqli_connect($hostname, $username, $password, $database);

  $table = $_GET['table'];

  $sql = "SELECT * FROM $table ORDER BY score DESC LIMIT 10";

  $result = mysqli_query($conn, $sql);

  $data = array();

  while ($row = mysqli_fetch_assoc($result)) {
    $data[] = $row;
  }
  mysqli_close($conn);

  echo json_encode($data);
?>