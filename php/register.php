<?php
session_start(); // Initialize session

require_once "config.php";

if($_SERVER["REQUEST_METHOD"]=="POST") {
  if(isset($_SESSION["loggedin"]) && $_SESSION["loggedin"] === true) { // Already signed in?
    echo "error code 6";
  } else {
    $username=$_POST["username"];
    $email=$_POST["email"];
    $password=$_POST["password"];
    $displayName=$_POST["displayName"];
    $language=$_POST["language"];
    $sql="SELECT id FROM accounts WHERE username = ?"; // Prepare select statement
    if($stmt=mysqli_prepare($link, $sql)) { // Statement prepared properly?
      mysqli_stmt_bind_param($stmt, "s", $id); // Bind id to prepared statement
      if(mysqli_stmt_execute($stmt)) { // Statement executed properly?
        if(mysqli_stmt_num_rows($stmt)==0) { // Username NOT in use?
          // $ins_sql="INSERT INTO `accounts` (`id`, `username`, `password`, `admin`, `email`, `displayname`, `language`) VALUES (NULL, `" . $username . "`, `" . $password . "`, `0`, `" . $email . "`, `" . $displayName . "`, `" . $language . "`)";
          // $ins_sql="INSERT INTO \"accounts\" (\"id\", \"username\", \"password\", \"admin\", \"email\", \"displayname\", \"language\") VALUES (NULL, \"" . $username . "\", \"" . $password . "\", \"0\", \"" . $email . "\", \"" . $displayName . "\", \"" . $language . "\")";
          // $ins_sql="INSERT INTO accounts (id, username, password, admin, email, displayname, language) VALUES (NULL, " . $username . ", " . $password . ", 0, " . $email . ", " . $displayName . ", " . $language . ")";
          // $ins_sql="INSERT INTO accounts (id, username, password, admin, email, displayname, language) VALUES (NULL, '";
          // $ins_sql.=$username;
          // $ins_sql.="', '";
          // $ins_sql.=$password;
          // $ins_sql.="', '0', '";
          // $ins_sql.=$email;
          // $ins_sql.="', '";
          // $ins_sql.=$displayName;
          // $ins_sql.="', '";
          // $ins_sql.=$language;
          // $ins_sql.="')";
          // $ins_sql="INSERT INTO accounts (id, username, password, admin, email, displayname, language) VALUES ('NULL', 'yikes', 'dwda', '0', 'john@example.com', 'dawfa', 'Eng')";
          // $ins_sql="INSERT INTO `accounts` (`id`, `username`, `password`, `admin`, `email`, `displayname`, `language`) VALUES (NULL, 'abcde', 'abcde', '0', 'abcde', 'abcde', 'abcde')";
          $ins_sql="SELECT * FROM accounts WHERE username=obdsf";
          if(mysqli_query($link, $ins_sql)) {
            echo "status code 4";
          } else {
            // echo "error code 7";
            echo $ins_sql;
          }
          // $new_stmt=mysqli_prepare($link, $ins_sql);
          // mysqli_stmt_bind_param($new_stmt, "s", $id);
          // mysqli_stmt_execute($new_stmt);
          // echo "status code 4";
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
    // mysqli_stmt_close($new_stmt); // Close statement.
    mysqli_close($link); // Close connection.
  }
}
?>