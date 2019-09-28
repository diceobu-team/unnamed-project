// Global Variables
var developerMode=false;
var devModeOverlaySlide=350;
var language="Eng";
var elemEng=document.getElementsByClassName("langEng");
var elemGr=document.getElementsByClassName("langGr");
var sessionActive;
var sessionId;
var isAdmin;
if(developerMode) var debugLogs=true;
else var debugLogs=false;
var fatalErrorOccured=false;

// On page load
$(document).ready(function() {
  // Dev Mode Badge
  if(developerMode) $("#dt-dev-mode-badge").show()
  // Fetch user data
  $.post("/unnamed-project/php/login.php", function(data, status) {
    displayConLog("login.php", "\n\tServer replied:\t"+data+"\n\tStatus:\t\t\t"+status);
    sessionActive=checkStatus(data); // true if a session is active, false otherwise
    if(sessionActive) {
      displayConLog("session", "active");
      if($("meta[name='page-name']").attr("content")=="register") $(location).attr("href", "../index.html");
    } else {
      sessionId=undefined;
      isAdmin=undefined;
      displayConLog("session", "inactive");
    }
    fetchClientData(data); // Depending on session status, fetches data from server database or client cookies
    if(debugLogs) {
      $("#dt-custom-switch").prop("checked", true);
      $("#dt-dev-mode-overlay-custom-switch").prop("checked", true);
    }
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

  // Debug togglers
  $("#dt-custom-switch").click(function() {
    changeDebugLogs();
  });
  
  $("#dt-dev-mode-overlay-custom-switch").click(function() {
    changeDebugLogs();
  })

  // Login
  $("#dt-login-button").click(function() {
    var username=$("#dt-form-username-input").val();
    var password=$("#dt-form-password-input").val();
    $.post("/unnamed-project/php/login.php", {username, password}, function(data, status) {
      displayConLog("login.php", "Server replied: "+data+"\tStatus: "+status);
      sessionActive=checkStatus(data); // true if a session is active, false otherwise
      if(sessionActive) {
        displayConLog("session", "active");
        if($("meta[name='page-name']").attr("content")=="register") $(location).attr("href", "../index.html");
      } else {
        sessionId=undefined;
        isAdmin=undefined;
        displayConLog("session", "inactive");
      }
       fetchClientData(data); // Depending on session status, fetches data from server database or client cookies
       if(debugLogs) $("#dt-custom-switch").prop("checked", true);
    });
  });

  // Logout
  $("#dt-logout-button").click(function() {
    $.post("/unnamed-project/php/logout.php", function(data, status) {
      displayConLog("logout.php", "Server replied: "+data+"\tStatus: "+status);
      sessionActive=checkStatus(data); // true if a session is active, false otherwise
      if(sessionActive) {
        displayConLog("session", "active");
      } else {
        sessionId=undefined;
        isAdmin=undefined;
        displayConLog("session", "inactive");
      }
      fetchClientData(data); // Depending on session status, fetches data from server database or client cookies
      if(debugLogs) {
        if(!developerMode) {
          changeDebugLogs();
          $("#dt-custom-switch").prop("checked", false);
        }
      }
    });
  });

  // Register
  $("#dt-sign-up-button").click(function() {
    clearErrorBox();
    var username=$("#dt-reg-form-username-input").val();
    var email=$("#dt-reg-form-email-input").val();
    var password=$("#dt-reg-form-password-input").val();
    var repeatPassword=$("#dt-reg-form-repeat-password-input").val();
    var displayName=$("#dt-reg-form-display-name-input").val();
    var errorOccured=false;
    if(username==="") {
      errorOccured=true;
      displayConLog("register", "username cannot be empty.", true);
      setErrorBox("usr-emp");
    }
    if(email==="") {
      errorOccured=true;
      displayConLog("register", "email cannot be empty.", true);
      setErrorBox("email-emp");
    }
    if(password==="") {
      errorOccured=true;
      displayConLog("register", "password cannot be empty.", true);
      setErrorBox("pass-emp");
    } else {
      if(password!=repeatPassword) {
        errorOccured=true;
        displayConLog("register", "passwords must match.", true);
        setErrorBox("pass-mismatch");
      }
    }
    if(displayName==="") {
      errorOccured=true;
      displayConLog("register", "display name cannot be empty.", true);
      setErrorBox("disp-emp");
    }
    if(!errorOccured){
      $.post("/unnamed-project/php/register.php", {username, email, password, displayName, language}, function(data, status) {
        displayConLog("register.php", "Server replied: "+data+"\tStatus: "+status);
        errorOccured=checkReg(data);
        if(errorOccured) setErrorBox();
        else {
          displayConLog("register", "logging in and redirecting to home page...");
          $(location).attr("href", "../index.html"); // Redirect to Home Page
        }
      });
    } else {
      setErrorBox();
    }
  });

  // Dev Mode Overlay
  $("#dt-dev-mode-badge").click(function() {
    $("#dt-body").css("filter", "blur(2px)");
    displayConLog("dev mode", "overlay active");
    $("#dt-dev-mode-overlay").slideDown(devModeOverlaySlide, function(){
    });
  });
  
  $("#dt-dev-mode-overlay-x").click(function() {
    $("#dt-dev-mode-overlay").slideUp(devModeOverlaySlide, function(){
      displayConLog("dev mode", "overlay idle");
      $("#dt-body").css("filter", "blur(0px)");
    });
  });

});
