<?php
// Initialize the session
session_start();
 
// Unset all of the session variables
$_SESSION = array();
 
// Destroy the session.
session_destroy();
echo "Session has been destroyed.<br/>";
echo "<a href='../root/index.html'>Back to Home.</a><br/>";
exit;
?>
