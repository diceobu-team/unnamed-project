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
    displayConLog("server", "Guest Session");
    return false;
  } else if (data==="status code 1") {
    displayConLog("server", "Session destroyed");
    resetUI();
    return false;
  } else if (data==="error code 1") {
    displayConLog("server", "Wrong username or password. Please try again.", true)
    return false;
  } else if (data==="error code 2") {
    displayConLog("server", "Oops! Something went wrong. Please try again later.", true);
    return false;
  } else if (data==="error code 3") {
    displayConLog("server", "Statement could not be prepared.", true);
    return false;
  } else {
    displayConLog("server", "Session started.");
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
    // Registration button
    $("#dt-register-button").hide();
  }
}

function resetUI() {
  // Sign in button & status block
  document.getElementById("dt-display-name-button").style.display="none";
  document.getElementById("dt-signin-button").style.display="initial";
  // Debug console toggler
  document.getElementById("dt-debug-console-toggler").style.display="none";
  // Registration button
  $("#dt-register-button").show();
}

// Additional session data :: DIF between fetchClientData and storeClientData: fetch recalls everything at once
function fetchClientData(data) { // while, store, stores everything on demand (one by one when called)
  if(sessionActive===true) { // if a session is active, request more data
    var dataSplit=data.split(" ");
    sessionId=dataSplit[0];
    // Language Data
    $.post("/unnamed-project/php/session.php", {sessionVar: "language", sessionId}, function(data, status) {
      displayConLog("session.php", "server replied: "+data+"\tstatus: "+status);
      if(checkSession(data)) { // Data fetch successful?
        if(data==language) {
          displayConLog("", "Language already synced");
        } else {
          changeLang();
          displayConLog("", "Language changed successfully");
        }
      } else {
        displayConLog("", "Language could not be set", true);
      }
    });
  } else {
    // Load cookies
    displayConLog("cookies", "Fetched");
    checkCookies();
  }
}

function storeClientData(sessionVar, sessionVarValue) { // Update session variables (and database) or client cookies, depending on session status
  if(sessionActive===true) { // Session active?
    displayConLog("store", "Storing data to database");
    $.post("/unnamed-project/php/session.php", {sessionVar, sessionVarValue, sessionId}, function(data, status) {
      displayConLog("session.php", "Server replied: "+data+"\tStatus: "+status);
      if(checkSession(data)) { // Data stored successfully?
        displayConLog("session.php", "Data stored successfully");
      } else {
        displayConLog("session.php", "Data could not be stored", true);
      }
    });
  } else {
    displayConLog("store", "Storing data to cookies");
    setCookie("language", language, 1);
    displayConLog("cookies", "Language cookie set to "+language);
  }
}

function checkSession(data) {
  if(data==="error code 4") {
    displayConLog("session", "ID doesn't exist", true);
    return false;
  } else if (data==="error code 2") {
    displayConLog("session", "Oops! Something went wrong. Please try again later.", true);
    return false;
  } else if (data==="error code 3") {
    displayConLog("session", "Statement could not be prepared", true);
    return false;
  } else if (data==="status code 3") {
    displayConLog("session", "Data stored successfully");
    return true;
  } else {
    displayConLog("session", "Recovered data can be used safely");
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
      displayConLog("cookies", "language change to "+clanguage);
    } else {
      displayConLog("cookies", "language cookie is already synced");
    }
  } else {
    setCookie("language", language, 1);
    displayConLog("cookies", "language cookie set to "+language);
  }
}

function displayConLog(source, str, isError=false) {
  if(debugLogs) {
    if(!source=="") source=source+" - ";
    if(isError) console.log(source+"error:\t"+str);
    else console.log(source+"status:\t"+str);
  }
}
