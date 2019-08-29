<?php
session_start(); // Initialize session

if($_SERVER["REQUEST_METHOD"] == "POST") {

  // if(isset($_SESSION["language"])) {
  //   echo $_SESSION["language"];
  // }

  // if($_POST("sessionVar")=="language" && $_POST("set")==true) {
  //   $_SESSION["language"]=$_POST(["language"]);
  // }

  if(isset($_POST["sessionVarValue"])) {
    $_SESSION[$_POST["sessionVar"]]=$_POST["sessionVarValue"];
  }

  if(isset($_SESSION[$_POST["sessionVar"]])) {
    echo $_SESSION[$_POST["sessionVar"]];
  }

}

exit;
?>