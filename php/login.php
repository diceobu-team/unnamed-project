<?php
session_start(); // Initialize session

require_once "config.php";

if($_SERVER["REQUEST_METHOD"] == "POST"){
  if(isset($_SESSION["loggedin"]) && $_SESSION["loggedin"] === true) { // Already signed in?
    echo $_SESSION["id"], " ", $_SESSION["username"], " ", $_SESSION["displayName"];
    exit;
  } else if (isset($_POST["username"])) {
    $username = trim($_POST["username"]);
    $password = trim($_POST["password"]);
    $sql = "SELECT id, username, password, displayname FROM accounts WHERE username = ?"; // Prepare select statement
    if($stmt = mysqli_prepare($link, $sql)){ // Link to close connection later
      mysqli_stmt_bind_param($stmt, "s", $username); // Bind submitted username to prepared statement
      if(mysqli_stmt_execute($stmt)){ // Statement executed properly?
        mysqli_stmt_store_result($stmt); // Store results
        if(mysqli_stmt_num_rows($stmt) == 1){ // Username exists?
          mysqli_stmt_bind_result($stmt, $id, $username, $stored_password, $displayName); // Bind results
          if(mysqli_stmt_fetch($stmt)){ // Fetch stored results to bound variables
            if($password==$stored_password){ // Passwords match?
              $_SESSION["loggedin"] = true;
              $_SESSION["id"] = $id;
              $_SESSION["username"] = $username;
              $_SESSION["displayName"]=$displayName;
              echo $_SESSION["id"], " ", $_SESSION["username"], " ", $_SESSION["displayName"]; // Send back login info (current session)
            }
          }
        } else {
          echo "error code 1"; // Wrong username or password. Please try again.
        }
      } else{
        echo "error code 2"; // Oops! Something went wrong. Please try again later.
      }
    } else {
      echo "error code 3"; // Link could not br created.
    }
    mysqli_stmt_close($stmt); // Close statement
    mysqli_close($link); // Close connection
    exit;
  }
}
?>
