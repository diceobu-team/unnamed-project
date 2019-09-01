// CSS Loader
function stopLoader() {
  $(window).on("load", function() {
    setTimeout(function() {
      var loader=$('.sk-folding-cube-wrapper');
      loader.fadeOut(1000);  // Loader Fadeout Time
    }, 0); // Fake Loading Time (Default: 2000, Dev Mode: 0)
  });
}

// Language selection (toggle)
function changeLang() {
  if(language=="Eng") {
    Array.prototype.forEach.call(elemEng, changeToNone);
    Array.prototype.forEach.call(elemGr, changeToInitial);
    document.getElementById("dt-change-lang-button").innerHTML="Ελ";
    document.getElementById("dt-form-username-input").placeholder="Όνομα Χρήστη";
    document.getElementById("dt-form-password-input").placeholder="Κωδικός Πρόσβασης";
    language="Gr";
  } else if(language=="Gr") {
    Array.prototype.forEach.call(elemGr, changeToNone);
    Array.prototype.forEach.call(elemEng, changeToInitial);
    document.getElementById("dt-change-lang-button").innerHTML="Eng";
    document.getElementById("dt-form-username-input").placeholder="Username";
    document.getElementById("dt-form-password-input").placeholder="Password";
    language="Eng";
  }
}

function changeToNone(element) {
  element.style.display="none";
}

function changeToInitial(element) {
  element.style.display="initial";
}

// Debug console on/off (toggle)
function changeDebugLogs() {
  if(debugLogs) {
    debugLogs=false;
  } else {
    debugLogs=true;
  }
  if(debugLogs) {
    console.log("Logs activated.");
  } else {
    console.log("Logs deactivated.");
  }
}

// User Status
function checkStatus(data) {
  if(data==="status code 2") {
    if(debugLogs)console.log("\tStatus:\t\t\tGuest Session");
    return false;
  } else if (data==="status code 1") {
    if(debugLogs)console.log("\tStatus:\t\t\tSession destroyed.");
    resetUI();
    return false;
  } else if (data==="error code 1") {
    if(debugLogs)console.log("\tStatus Error:\tWrong username or password. Please try again.");
    return false;
  } else if (data==="error code 2") {
    if(debugLogs)console.log("\tStatus Error:\tOops! Something went wrong. Please try again later.");
    return false;
  } else if (data==="error code 3") {
    if(debugLogs)console.log("\tStatus Error:\tStatement could not be prepared.");
    return false;
  } else {
    if(debugLogs)console.log("\tStatus:\t\t\tSession started.");
    setUI(data);
    return true;
  }
}

function setUI(data) {
  var dataSplit=data.split(" ");
  document.getElementById("dt-signin-button").style.display="none";
  document.getElementById("dt-display-name-button").style.display="initial";
  document.getElementById("dt-display-name-actual-button").innerHTML=dataSplit[3];
  if(dataSplit[2]==0) { // User has status Member
    // Sign in button & status block
    document.getElementById("dt-status-block").style.display="initial";
    document.getElementById("dt-status").innerHTML="Member";
  } else if(dataSplit[2]==1) { // User has status Admin
    // Sign in button & status block
    document.getElementById("dt-status-block").style.display="initial";
    document.getElementById("dt-status").innerHTML="Admin";
    // Debug console toggler
    document.getElementById("dt-debug-console-toggler").style.display="initial";
  }
}

function resetUI() {
  // Sign in button & status block
  document.getElementById("dt-display-name-button").style.display="none";
  document.getElementById("dt-signin-button").style.display="initial";
  // Debug console toggler
  document.getElementById("dt-debug-console-toggler").style.display="none";
}

// Additional session data :: DIF between fetchClientData and storeClientData: fetch recalls everything at once
function fetchClientData(data) { // while, store, stores everything on demand (one by one when called)
  if(sessionActive===true) { // if a session is active, request more data
    var dataSplit=data.split(" ");
    sessionId=dataSplit[0];
    // Language Data
    $.post("/unnamed-project/php/session.php", {sessionVar: "language", sessionId}, function(data, status) {
      if(debugLogs)console.log("session.php:\n\tServer replied:\t"+data+"\n\tStatus:\t\t\t"+status);
      if(checkSession(data)) { // Data fetch successful?
        if(data==language) {
          if(debugLogs)console.log("\tStatus:\t\t\tLanguage already synced.");
        } else {
          changeLang();
          if(debugLogs)console.log("\tStatus:\t\t\tLanguage changed successfully.");
        }
      } else {
        if(debugLogs)console.log("Critical Error:\t\tLanguage could not be set.");
      }
    });
  } else {
    // Load cookies
    if(debugLogs)console.log("Cookies:\t\t\tfetched");
    checkCookies();
  }
}

function storeClientData(sessionVar, sessionVarValue) { // Update session variables (and database) or client cookies, depending on session status
  if(sessionActive===true) { // Session active?
    if(debugLogs)console.log("\tStore:\t\t\tStoring data to database.");
    $.post("/unnamed-project/php/session.php", {sessionVar, sessionVarValue, sessionId}, function(data, status) {
      if(debugLogs)console.log("session.php:\n\tServer replied:\t"+data+"\n\tStatus:\t\t\t"+status);
      if(checkSession(data)) { // Data stored successfully?
        if(debugLogs)console.log("\tStatus:\t\t\tData stored successfully.");
      } else {
        if(debugLogs)console.log("Critical Error:\t\tData could not be stored.");
      }
    });
  } else {
    if(debugLogs)console.log("\tStore:\t\t\tStoring data to cookies.");
    setCookie("language", language, 1);
    if(debugLogs)console.log("\tCookie status:\tlanguage cookie set to "+language);
  }
}

function checkSession(data) {
  if(data==="error code 4") {
    if(debugLogs)console.log("\tSession Error:\tId doesn't exist.");
    return false;
  } else if (data==="error code 2") {
    if(debugLogs)console.log("\tSession Error:\tOops! Something went wrong. Please try again later.");
    return false;
  } else if (data==="error code 3") {
    if(debugLogs)console.log("\tSession Error:\tStatement could not be prepared.");
    return false;
  } else if (data==="status code 3") {
    if(debugLogs)console.log("\tSession Status:\tData stored successfully.");
    return true;
  } else {
    if(debugLogs)console.log("\tSession Status:\tRecovered data can be used safely.");
    return true;
  }
}

// Cookies
function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  var expires = "expires=" + d.toGMTString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function checkCookies() {
  // Language cookie
  var clanguage=getCookie("language");
  if (clanguage!="") {
    if(clanguage!=language) {
      changeLang();
      language=clanguage;
      if(debugLogs)console.log("\tCookie status:\tlanguage changed to "+clanguage);
    } else {
      if(debugLogs)console.log("\tCookie status:\tlanguage cookie is already synced");
    }
  } else {
    setCookie("language", language, 1);
    if(debugLogs)console.log("\tCookie status:\tlanguage cookie set to "+language);
  }
}
