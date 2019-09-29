<?php

session_start(); // Initialize session

require_once "config.php";

if(isset($_SESSION["loggedin"]) && $_SESSION["loggedin"] === true) {
  $sql="SELECT id FROM maps WHERE active = 1";
  $result=mysqli_query($link, $sql);
  $row=mysqli_fetch_array($result);
  $id=$row[0];
  if($id=="") { // No Active Map
    echo "status code 5";
  } else { // Active Map found
    echo "status code 6";
    $sql="UPDATE maps SET active = 0 WHERE id = ?";
    $stmt=mysqli_prepare($link, $sql);
    mysqli_stmt_bind_param($stmt, "i", $id);
    mysqli_stmt_execute($stmt);
  }
  $name=$_POST["mapName"];
  $sql="UPDATE maps SET active = 1 WHERE name = ?";
  $stmt=mysqli_prepare($link, $sql);
  mysqli_stmt_bind_param($stmt, "s", $name);
  mysqli_stmt_execute($stmt);

  mysqli_stmt_close($stmt);
  mysqli_close($link);
}
?>
