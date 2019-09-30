<?php

session_start(); // Initialize session

require_once "config.php";

if($_SERVER["REQUEST_METHOD"]=="POST") {
  $error=false;
  if(isset($_POST["mapName"])) { // Request from Control Panel
    $map_name=$_POST["mapName"];
  } else { // Request from Tool Page
    $sql="SELECT name FROM maps WHERE active = 1";
    $result=mysqli_query($link, $sql);
    $row=mysqli_fetch_array($result);
    $name=$row[0];
    if($name=="") { // No Active Map
      $error=true;
    } else { // Active Map found
      $map_name=$name;
    }
  }
  if($error==false) {
    $sql="SELECT * FROM $map_name";
    if($result=mysqli_query($link, $sql)) {
      while($row=mysqli_fetch_array($result)){
        echo "|#|".$row['rowid']."\n".$row['name']."\n".$row['id']."\n".$row['point']."\n".$row['coords']."\n".$row['details']."\n";
      }
    } else {
        echo "error code 13";
    }
  } else {
    echo "error code 14";
  }
}

mysqli_close($link);

?>
