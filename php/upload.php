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

      $create_sql="CREATE TABLE $map_name (rowid int NOT NULL AUTO_INCREMENT, name TEXT, id TEXT, point TEXT, coords TEXT, details JSON, PRIMARY KEY (rowid))";
      if($create_stmt=mysqli_prepare($link, $create_sql)) echo "STATEMENT PREPARED<br/>";
      else echo "STATEMENT NOT PREPARED<br/>";

      if(mysqli_stmt_execute($create_stmt)) echo "TABLE CREATED<br/>";
      else echo "TABLE NOT CREATED<br/>";

      $sql="INSERT INTO `".$map_name."` (`rowid`, `name`, `id`, `point`, `coords`, `details`) VALUES (?, ?, ?, ?, ?, ?)";
      if($stmt=mysqli_prepare($link, $sql)) echo "STATEMENT PREPARED<br/>";
      else echo "STATEMENT NOT PREPARED<br/>";

      $rowid=NULL;
      for ($i=0; $i<sizeof($placemarks); $i++) {
        $name=$placemarks[$i]->name;
        $id=$placemarks[$i]{"id"};
        $point=$placemarks[$i]->MultiGeometry->Point->coordinates;
        $coords=$placemarks[$i]->MultiGeometry->Polygon->outerBoundaryIs->LinearRing->coordinates;
        $residents=rand(1, 250);
        $total_spots=rand(50, 350);
        $residence_type=rand(0, 2);
        if($residence_type==0) {
          $demand[0]=0.75;
          $demand[1]=0.55;
          $demand[2]=0.46;
          $demand[3]=0.19;
          $demand[4]=0.2;
          $demand[5]=0.2;
          $demand[6]=0.39;
          $demand[7]=0.55;
          $demand[8]=0.67;
          $demand[9]=0.8;
          $demand[10]=0.95;
          $demand[11]=0.9;
          $demand[12]=0.95;
          $demand[13]=0.9;
          $demand[14]=0.88;
          $demand[15]=0.83;
          $demand[16]=0.7;
          $demand[17]=0.62;
          $demand[18]=0.74;
          $demand[19]=0.8;
          $demand[20]=0.8;
          $demand[21]=0.95;
          $demand[22]=0.92;
          $demand[23]=0.76;
        } else if($residence_type==1) {
          $demand[0]=0.69;
          $demand[1]=0.71;
          $demand[2]=0.73;
          $demand[3]=0.68;
          $demand[4]=0.69;
          $demand[5]=0.7;
          $demand[6]=0.67;
          $demand[7]=0.55;
          $demand[8]=0.49;
          $demand[9]=0.43;
          $demand[10]=0.34;
          $demand[11]=0.45;
          $demand[12]=0.48;
          $demand[13]=0.53;
          $demand[14]=0.5;
          $demand[15]=0.56;
          $demand[16]=0.73;
          $demand[17]=0.41;
          $demand[18]=0.42;
          $demand[19]=0.48;
          $demand[20]=0.54;
          $demand[21]=0.6;
          $demand[22]=0.72;
          $demand[23]=0.66;
        } else if($residence_type==2) {
          $demand[0]=0.18;
          $demand[1]=0.17;
          $demand[2]=0.21;
          $demand[3]=0.25;
          $demand[4]=0.22;
          $demand[5]=0.17;
          $demand[6]=0.16;
          $demand[7]=0.39;
          $demand[8]=0.54;
          $demand[9]=0.77;
          $demand[10]=0.78;
          $demand[11]=0.83;
          $demand[12]=0.78;
          $demand[13]=0.78;
          $demand[14]=0.8;
          $demand[15]=0.76;
          $demand[16]=0.78;
          $demand[17]=0.79;
          $demand[18]=0.84;
          $demand[19]=0.57;
          $demand[20]=0.38;
          $demand[21]=0.24;
          $demand[22]=0.19;
          $demand[23]=0.23;
        }
        $demands=json_encode($demand);
        // echo $demands;
        // echo "<br/>";
        $details='{"residents":'.$residents.', "total_spots":'.$total_spots.', "residence_type":'.$residence_type.', "demand":'.$demands.'}';
        echo $details;

        if(mysqli_stmt_bind_param($stmt, "isssss", $rowid, $name, $id, $point, $coords, $details)) {
          if(mysqli_stmt_execute($stmt)) {
            echo "Name: ".$name."<br/>";
            echo "ID: ".$id."<br/>";
            echo "Point: ".$point."<br/>";
            echo "Coordinates Block: ".$coords."<br/>";
            echo "Details (JSON): ".$details."<br/>";
          } else {
            echo "error code 12";
          }
        } else {
          echo "error code 11";
        }
        echo "<br/>";
      }

      $sql="SELECT id FROM maps WHERE name = ?";
      $stmt=mysqli_prepare($link, $sql);
      mysqli_stmt_bind_param($stmt, "s", $map_name);
      mysqli_stmt_execute($stmt);
      mysqli_stmt_store_result($stmt);
      if(mysqli_stmt_num_rows($stmt)==0) {
        $sql="INSERT INTO `maps` (`id`, `name`, `active`) VALUES (?, ?, '0')";
        $stmt=mysqli_prepare($link, $sql);
        mysqli_stmt_bind_param($stmt, "is", $rowid, $map_name);
        mysqli_stmt_execute($stmt);
      }

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
