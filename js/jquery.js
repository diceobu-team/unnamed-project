// On page load (get session data from server)
$(document).ready(function() {
  // STARTUP
  $.post("/unnamed-project/php/startup.php", function(data, status) {
    console.log("startup.php:\n\tServer replied:\t"+data+"\n\tStatus:\t\t\t"+status);
  });

  // Login data
  $.post("/unnamed-project/php/login.php", function(data, status) {
    console.log("login.php:\n\tServer replied:\t"+data+"\n\tStatus:\t\t\t"+status);
    checkStatus(data);
  });
 
  // Other status data
  var sessionVar="language";
  var sessionVarValue=language;
  $.post("/unnamed-project/php/session.php", {sessionVar, sessionVarValue}, function(data, status) {
    console.log("session.php:\n\tServer replied:\t"+data+"\n\tStatus:\t\t\t"+status);
  });
});

// Loader (stop after 2 seconds or cancel completely on small devices)
$(document).ready(function() {
  var screenWidth=$(window).width()
  console.log(screenWidth);
  if(screenWidth>=992) {
    stopLoader();
  } else {
    document.getElementById("dt-loader").style.display="none";
  }
});

// Event Handlers
$(document).ready(function() {
  // Language Selection
  $("#dt-change-lang-button").click(function() {
    changeLang();
  });

  // Login
  $("#dt-login-button").click(function() {
    var username=$("#dt-form-username-input").val();
    var password=$("#dt-form-password-input").val();
    $.post("/unnamed-project/php/login.php", {username, password}, function(data, status) {
      console.log("login.php:\n\tServer replied:\t"+data+"\n\tStatus:\t\t\t"+status);
      checkStatus(data);
    });
  });

  // Logout
  $("#dt-logout-button").click(function() {
    $.post("/unnamed-project/php/logout.php", function(data, status) {
      console.log("logout.php:\n\tServer replied:\t"+data+"\n\tStatus:\t\t\t"+status);
      checkStatus(data);
    });
  });
});
