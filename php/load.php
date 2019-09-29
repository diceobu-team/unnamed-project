<?php

session_start(); // Initialize session

require_once "config.php";

if(isset($_SESSION["loggedin"]) && $_SESSION["loggedin"] === true) {
  $map_name=$_POST["mapName"];
  $table_data;
  $sql="SELECT * FROM $map_name";
  // $stmt=mysqli_prepare($link, $sql);
  // mysqli_stmt_bind_param($stmt, "s", $table_data);
  // mysqli_stmt_execute($stmt);
  // mysqli_stmt_store_result($stmt);
  // mysqli_stmt_fetch($stmt);
  if( $result = mysqli_query($link, $sql)) {
    while($row = mysqli_fetch_array($result)){   //Creates a loop to loop through results
      echo "|#|".$row['rowid']."\n".$row['name']."\n".$row['id']."\n".$row['point']."\n".$row['coords']."\n";  //$row['index'] the index here is a field name
    }
  } else {
      echo "failed to fetch array";
  }
}
?>
