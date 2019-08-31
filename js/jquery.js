// Global Variables
var language="Eng";
var elemEng=document.getElementsByClassName("langEng");
var elemGr=document.getElementsByClassName("langGr");
var sessionActive;
var sessionId;
var debugLogs=false;

// On page load
$(document).ready(function() {
  // Fetch user data
  $.post("/unnamed-project/php/login.php", function(data, status) {
    if(debugLogs)console.log("login.php:\n\tServer replied:\t"+data+"\n\tStatus:\t\t\t"+status);
    sessionActive=checkStatus(data); // true if a session is active, false otherwise
    if(!sessionActive)sessionId=undefined;
    if(debugLogs)console.log("Session active:\t\t"+sessionActive);
    fetchClientData(data); // Depending on session status, fetches data from server database or client cookies
  });
});

// Loader (stop after 2 seconds or cancel completely on small devices)
$(document).ready(function() {
  var screenWidth=$(window).width()
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
    storeClientData("language", language); // Depending on session status, stores language data to the server database or the client cookies
  });

  // Debug toggler
  $("#dt-custom-switch").click(function() {
    changeDebugLogs();
  });

  // Login
  $("#dt-login-button").click(function() {
    var username=$("#dt-form-username-input").val();
    var password=$("#dt-form-password-input").val();
    $.post("/unnamed-project/php/login.php", {username, password}, function(data, status) {
      if(debugLogs)console.log("login.php:\n\tServer replied:\t"+data+"\n\tStatus:\t\t\t"+status);
      sessionActive=checkStatus(data); // true if a session is active, false otherwise
      if(!sessionActive)sessionId=undefined;
      if(debugLogs)console.log("Session active:\t\t"+sessionActive);
      fetchClientData(data); // Depending on session status, fetches data from server database or client cookies
    });
  });

  // Logout
  $("#dt-logout-button").click(function() {
    $.post("/unnamed-project/php/logout.php", function(data, status) {
      if(debugLogs)console.log("logout.php:\n\tServer replied:\t"+data+"\n\tStatus:\t\t\t"+status);
      sessionActive=checkStatus(data); // true if a session is active, false otherwise
      if(!sessionActive)sessionId=undefined;
      if(debugLogs)console.log("Session active:\t\t"+sessionActive);
      fetchClientData(data); // Depending on session status, fetches data from server database or client cookies
      if(debugLogs)changeDebugLogs();
    });
  });
});
