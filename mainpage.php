<!DOCTYPE html>
<html>
<head>
<style>
</style>
</head>
<body>
</body>
<?php 
  $data = json_decode(file_get_contents('php://input'), true);

  $host = "localhost";
  $username = "root";
  $password = "Zebraking123!?0";
  $dbname = "jackdawsandkestrels";

  $conn = mysqli_connect($host, $username, $password, $dbname);

  if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
  }

  $stmt = mysqli_prepare($conn, "INSERT INTO highscores (name, score, date) VALUES (?, ?, ?)");

  $name = $data['name'];
  $score = $data['score'];
  $date = $data['date'];

  mysqli_stmt_bind_param($stmt, "sis", $name, $score, $date);

  mysqli_stmt_execute($stmt);

  if (mysqli_errno($conn)) {
    echo "Error: " . mysqli_error($conn);
}

mysqli_close($conn);
?>
</html>