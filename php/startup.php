<?php
session_name("perma-session");
session_start();

if($_SERVER["REQUEST_METHOD"] == "POST") {
  if(!isset($_SESSION["language"])) {
    $_SESSION["language"]="Eng";
    echo $_SESSION["language"];
  } else {
    echo "Session language already set.";
  }
}

exit;
?>