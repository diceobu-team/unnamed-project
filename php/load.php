<?php

session_start(); // Initialize session

require_once "config.php";

if(isset($_SESSION["loggedin"]) && $_SESSION["loggedin"] === true) {
  $map_name=$_POST["mapName"];
  $table_data;
  $sql="SELECT * FROM $map_name";
  if($result=mysqli_query($link, $sql)) {
    while($row=mysqli_fetch_array($result)){
      echo "|#|".$row['rowid']."\n".$row['name']."\n".$row['id']."\n".$row['point']."\n".$row['coords']."\n";
    }
  } else {
      echo "error code 13";
  }
  mysqli_close($link);
}
?>
