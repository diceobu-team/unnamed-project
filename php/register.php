<?php
session_start(); // Initialize session

require_once "config.php";

if($_SERVER["REQUEST_METHOD"]=="POST") {
  if(isset($_SESSION["loggedin"]) && $_SESSION["loggedin"] === true) { // Already signed in?
    echo "error code 6";
  } else {
    $id=NULL;
    $username=$_POST["username"];
    $password=$_POST["password"];
    $admin=0;
    $email=$_POST["email"];
    $displayName=$_POST["displayName"];
    $language=$_POST["language"];
    $sql="SELECT id FROM accounts WHERE username = ?"; // Prepare select statement
    if($stmt=mysqli_prepare($link, $sql)) { // Statement prepared properly?
      mysqli_stmt_bind_param($stmt, "s", $username); // Bind username to prepared statement
      if(mysqli_stmt_execute($stmt)) { // Statement executed properly?
        mysqli_stmt_store_result($stmt);
        if(mysqli_stmt_num_rows($stmt)==0) { // Username NOT in use?
          $ins_sql="INSERT INTO accounts (id, username, password, admin, email, displayname, language) VALUES (?, ?, ?, ?, ?, ?, ?)";
          if($ins_stmt=mysqli_prepare($link, $ins_sql)) {
            mysqli_stmt_bind_param($ins_stmt, "ississs", $id, $username, $password, $admin, $email, $displayName, $language);
            if(mysqli_stmt_execute($ins_stmt)) {
              mysqli_stmt_execute($stmt);
              mysqli_stmt_store_result($stmt);
              mysqli_stmt_bind_result($stmt, $id);
              mysqli_stmt_fetch($stmt);
              $_SESSION["loggedin"]=true;
              $_SESSION["id"]=$id;
              $_SESSION["username"]=$username;
              $_SESSION["admin"]=$admin;
              $_SESSION["displayName"]=$displayName;
              echo "status code 4";
            } else {
              echo "error code 7";
            }
            mysqli_stmt_close($ins_stmt); // Close statement.
          } else {
            echo "error code 8"; // Statement could not be prepared.
          }
        } else {
          echo "error code 5"; // Username is already in use.
        }
      } else{
        echo "error code 2"; // Oops! Something went wrong. Please try again later.
      }
    } else {
      echo "error code 3"; // Statement could not be prepared.
    }
    mysqli_stmt_close($stmt); // Close statement.
    mysqli_close($link); // Close connection.
  }
}
?>