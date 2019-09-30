<?php

session_start(); // Initialize session

require_once "config.php";

if(isset($_SESSION["loggedin"]) && $_SESSION["loggedin"] === true) {
  $selected_map_name=$_POST["selected_map_name"];
  $selected_polygon_id=$_POST["selected_polygon_id"];
  $sql="SELECT details FROM $selected_map_name WHERE rowid = $selected_polygon_id";
  $result=mysqli_query($link, $sql);
  $row=mysqli_fetch_array($result);
  $details=$row[0];
  echo $details;
  echo "\n";
  $detailsJSON=json_decode($details);
  if(isset($_POST["temp_residents"])) {
    $residents=$_POST["temp_residents"];
    $detailsJSON->residents=intval($residents);
  } else if(isset($_POST["temp_spots"])) {
    $spots=$_POST["temp_spots"];
    $detailsJSON->total_spots=intval($spots);
  } else {
    echo "error code 20";
  }
  $details=json_encode($detailsJSON);
  echo $details;
  $sql="UPDATE $selected_map_name SET details = '$details' WHERE rowid = ?";
  if($stmt=mysqli_prepare($link, $sql)) {
    mysqli_stmt_bind_param($stmt, "i", $selected_polygon_id);
    mysqli_stmt_execute($stmt);
    echo "REEEEEEEEEE";
  } else {
    echo "kappa";
  }

  mysqli_close($link);
}
?>
