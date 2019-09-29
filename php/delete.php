<?php

session_start(); // Initialize session

require_once "config.php";

if(isset($_SESSION["loggedin"]) && $_SESSION["loggedin"] === true) {
  $name=$_POST["mapName"];
  $sql="DROP TABLE $name";
  mysqli_query($link, $sql);
  $sql="DELETE FROM maps WHERE name = ?";
  $stmt=mysqli_prepare($link, $sql);
  mysqli_stmt_bind_param($stmt, "s", $name);
  if(mysqli_stmt_execute($stmt)) {
    echo "status code 7";
  } else {
    echo "error code 14";
  }
  
  mysqli_stmt_close($stmt);
  mysqli_close($link);
}
?>
