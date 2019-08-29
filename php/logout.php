<?php
// Initialize the session
session_start();
 
// Unset all of the session variables
$_SESSION = array();
 
// Destroy the session.
session_destroy();
echo "status code 1";

// Destroy perma-session too
session_name("perma-session");
session_start();
session_destroy();
exit;
?>
