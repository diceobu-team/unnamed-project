// Global Variables
var language="Eng";
var elemEng=document.getElementsByClassName("langEng");
var elemGr=document.getElementsByClassName("langGr");
var sessionActive;
var sessionId;
var isAdmin;
var debugLogs=true;
var fatalErrorOccured=false;

// On page load
$(document).ready(function() {
  // Fetch user data
  $.post("/unnamed-project/php/login.php", function(data, status) {
    displayConLog("login.php", "\n\tServer replied:\t"+data+"\n\tStatus:\t\t\t"+status);
    sessionActive=checkStatus(data); // true if a session is active, false otherwise
    if(sessionActive) {
      displayConLog("session", "active");
    } else {
      sessionId=undefined;
      isAdmin=undefined;
      displayConLog("session", "inactive");
    }
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
      displayConLog("login.php", "Server replied: "+data+"\tStatus: "+status);
      sessionActive=checkStatus(data); // true if a session is active, false otherwise
      if(sessionActive) {
        displayConLog("session", "active");
      } else {
        sessionId=undefined;
        isAdmin=undefined;
        displayConLog("session", "inactive");
      }
       fetchClientData(data); // Depending on session status, fetches data from server database or client cookies
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
        changeDebugLogs();
        $("#dt-custom-switch").prop("checked");
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
        console.log(data);
        errorOccured=checkReg(data);
        if(!errorOccured) displayConLog("register.php", "Server replied: "+data+"\tStatus: "+status);
      });
    }
    if(errorOccured) setErrorBox();
    else {
      displayConLog("register", "logging in and redirecting to home page...");
      // Redirect to Home Page
    }
  });

  function checkReg(data) {
    if(data==="error code 5") {
      displayConLog("register", "username is already in use", true);
      return true;
    } else if (data==="error code 6") {
      displayConLog("register", "already signed in, redirecting...", true);
      // Redirect to Home Page
      return true;
    } else if (data==="error code 2") {
      displayConLog("register", "Oops! Something went wrong. Please try again later.", true);
      // Refresh Page
      return true;
    } else if (data==="error code 3") {
      displayConLog("register", "Statement could not be prepared.", true);
      // Refresh Page
      return true;
    } else if (data==="status code 4") {
      displayConLog("register", "successfully registered account");
      return false;
    } else {
      displayConLog("register", "unknown fatal error occured");
      return true
    }
  }

  function setErrorBox(code="err-box") {
    if(code==="err-box") $("#dt-reg-form-error-box").show();
    else if(code==="usr-emp") $("#dt-reg-form-username-empty-error").show();
    else if(code==="email-emp") $("#dt-reg-form-email-empty-error").show();
    else if(code==="pass-emp") $("#dt-reg-form-password-empty-error").show();
    else if(code==="disp-emp") $("#dt-reg-form-display-name-empty-error").show();
    else if(code==="pass-mismatch") $("#dt-reg-form-password-mismatch-error").show();
  }

  function clearErrorBox() {
    $("#dt-reg-form-error-box").hide();
    $("#dt-reg-form-username-empty-error").hide();
    $("#dt-reg-form-email-empty-error").hide();
    $("#dt-reg-form-password-empty-error").hide();
    $("#dt-reg-form-display-name-empty-error").hide();
    $("#dt-reg-form-password-mismatch-error").hide();
  }
});
