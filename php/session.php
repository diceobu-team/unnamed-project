<?php
session_start(); // Initialize session

require_once "config.php";

if($_SERVER["REQUEST_METHOD"]=="POST") {
  if(isset($_SESSION["loggedin"]) && $_SESSION["loggedin"]===true) {
    $error=0;
    $status=0;
    if(!isset($_SESSION[$_POST["sessionVar"]]) && isset($_POST["sessionId"])) { // Load from server database (into session)
      $id=$_POST["sessionId"];
      $sessionVar=$_POST["sessionVar"];
      $sql="SELECT $sessionVar FROM accounts WHERE id = ?"; // Prepare select statement
      if($stmt = mysqli_prepare($link, $sql)) { // Statement prepared properly?
        mysqli_stmt_bind_param($stmt, "i", $id); // Bind id to prepared statement
        if(mysqli_stmt_execute($stmt)) { // Statement executed properly?
          mysqli_stmt_store_result($stmt); // Store results
          if(mysqli_stmt_num_rows($stmt)==1) { // Id exist?
            mysqli_stmt_bind_result($stmt, $sessionVarValue); // Bind results
            if(mysqli_stmt_fetch($stmt)) { // Fetch stored results to bound variables
              $_SESSION[$sessionVar]=$sessionVarValue;
            }
          } else {
            echo "error code 4"; // Id doesn't exist. (EXTREMELY RARE) :: Occurs ONLY on real time database manipulation
            $error=1;
          }
        } else{
          echo "error code 2"; // Oops! Something went wrong. Please try again later.
          $error=1;
        }
      } else {
        echo "error code 3"; // Statement could not be prepared.
        $error=1;
      }
      mysqli_stmt_close($stmt); // Close statement
      mysqli_close($link); // Close connection
    } else if(isset($_POST["sessionVarValue"]) && isset($_POST["sessionVar"])) { // Change value in session (and server database if sessionId specified)
      $sessionVar=$_POST["sessionVar"];                                          // Normally session variables and server variables must be synced
      $sessionVarValue=$_POST["sessionVarValue"];
      $_SESSION[$sessionVar]=$sessionVarValue;
      if(isset($_POST["sessionId"])) {
        $id=$_POST["sessionId"];
        $sql="UPDATE accounts SET $sessionVar = '$sessionVarValue' WHERE id = ?"; // Prepare update statement
        if($stmt = mysqli_prepare($link, $sql)) { // Statement prepared properly?
          mysqli_stmt_bind_param($stmt, "s", $id); // Bind id to prepared statement
          if(mysqli_stmt_execute($stmt)) { // Statement executed properly?
            echo "status code 3"; // Data stored successfully
            $status=1;
          } else{
            echo "error code 2"; // Oops! Something went wrong. Please try again later.
            $error=1;
          }
        } else {
          echo "error code 3"; // Statement could not be prepared.
          $error=1;
        }
        mysqli_stmt_close($stmt); // Close statement
        mysqli_close($link); // Close connection
      }
    }
    if($error==1) exit;
    if($status==1) exit;
    if(isset($_SESSION[$_POST["sessionVar"]])) { // Return session data
      echo $_SESSION[$_POST["sessionVar"]];
    }
  }
}
?>
