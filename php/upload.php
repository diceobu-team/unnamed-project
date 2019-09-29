<?php

session_start(); // Initialize session

require_once "config.php";

if(isset($_SESSION["loggedin"]) && $_SESSION["loggedin"] === true) {
  $target_dir="../uploads/";
  $file_name=$_POST["KML-Map-File-Name"];
  $map_name=$_POST["KML-Map-Name"];
  $_FILES["KML-Map"]["name"]=$file_name;
  $target_file=$target_dir . basename($_FILES["KML-Map"]["name"]);
  $imageFileType=strtolower(pathinfo($target_file,PATHINFO_EXTENSION));
  if(move_uploaded_file($_FILES["KML-Map"]["tmp_name"], $target_file)) {
    if(file_exists($target_file)) {
      $xml=simplexml_load_file($target_file);
      $placemarks=$xml->Document->Folder->Placemark;

      $create_sql="CREATE TABLE `".$map_name."` (rowid int NOT NULL AUTO_INCREMENT, name TEXT, id TEXT, point TEXT, coords TEXT, PRIMARY KEY (rowid))";
      $create_stmt=mysqli_prepare($link, $create_sql);
      mysqli_stmt_execute($create_stmt);

      $sql="INSERT INTO `".$map_name."` (`rowid`, `name`, `id`, `point`, `coords`) VALUES (?, ?, ?, ?, ?)";
      $stmt=mysqli_prepare($link, $sql);

      $rowid=NULL;
      for ($i=0; $i<sizeof($placemarks); $i++) {
        $name=$placemarks[$i]->name;
        $id=$placemarks[$i]{"id"};
        $point=$placemarks[$i]->MultiGeometry->Point->coordinates;
        $coords=$placemarks[$i]->MultiGeometry->Polygon->outerBoundaryIs->LinearRing->coordinates;

        if(mysqli_stmt_bind_param($stmt, "issss", $rowid, $name, $id, $point, $coords)) {
          if(mysqli_stmt_execute($stmt)) {
            echo "Name: ".$name."<br/>";
            echo "ID: ".$id."<br/>";
            echo "Point: ".$point."<br/>";
            echo "Coordinates Block: ".$coords."<br/>";
          } else {
            echo "error code 12";
          }
        } else {
          echo "error code 11";
        }
        echo "<br/>";
      }

      echo "<br/>";

      echo "status code 5";
      mysqli_stmt_close($create_stmt); // Close statement.
      mysqli_stmt_close($stmt); // Close statement.
    } else {
      echo "error code 10";
    }
  } else {
    echo "error code 9";
  }
  mysqli_close($link); // Close connection.
  echo "<script type=\"text/javascript\">location.href = '../root/control/control.html';</script>";
}
?>
