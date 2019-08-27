<?php
session_start(); // Initialize session

if(isset($_SESSION["loggedin"]) && $_SESSION["loggedin"] === true) { // Already signed in?
  // DO SOMETHING (like changing the status to logged in with JS)
  exit;
}

require_once "config.php";

// $username = $password = "";

if($_SERVER["REQUEST_METHOD"] == "POST"){
  $username = trim($_POST["username"]);
  $password = trim($_POST["password"]);
  $sql = "SELECT id, username, password FROM accounts WHERE username = ?"; // Prepare select statement
  if($stmt = mysqli_prepare($link, $sql)){ // Link to close connection later
    mysqli_stmt_bind_param($stmt, "s", $username); // Bind submitted username to prepared statement
    if(mysqli_stmt_execute($stmt)){ // Statement executed properly?
      mysqli_stmt_store_result($stmt); // Store results
      if(mysqli_stmt_num_rows($stmt) == 1){ // Username exists?
        mysqli_stmt_bind_result($stmt, $id, $username, $stored_password); // Bind Results
        if(mysqli_stmt_fetch($stmt)){ // Fetch stored results to bound variables
          if($password==$stored_password){ // Passwords match?
            session_start();
            $_SESSION["loggedin"] = true;
            $_SESSION["id"] = $id;
            $_SESSION["username"] = $username;
            header("../root/index.html");// DO SOMETHING (like changing the status to logged in with JS)
          }
        }
      } else {
        echo "Wrong username or password. Please try again.";
      }
    } else{
      echo "Oops! Something went wrong. Please try again later.";
      // DO SOMETHING (like alerting the user that something went wrong with a pop up)
    }
  }
  mysqli_stmt_close($stmt); // Close statement
  mysqli_close($link); // Close connection
}
?>