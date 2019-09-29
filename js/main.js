// CSS Loader
function stopLoader() {
  var fLoadingTime=0;
  var fadeOutTime=500;
  if(!developerMode) {
    fLoadingTime+=2000;
    fadeOutTime+=1000;
  }
  $(window).on("load", function() {
    setTimeout(function() {
      var loader=$('.sk-folding-cube-wrapper');
      loader.fadeOut(fadeOutTime);  // Loader Fadeout Time
    }, fLoadingTime); // Fake Loading Time (Default: 2000, Dev Mode: 0)
  });
}

// Language selection (toggle)
function changeLang() {
  if(language=="Eng") {
    // p.langEng & p.langGr elements
    Array.prototype.forEach.call(elemEng, changeToNone);
    Array.prototype.forEach.call(elemGr, changeToInitial);
    // Status Block
    if(isAdmin!==undefined) {
      if(isAdmin) document.getElementById("dt-status").innerHTML="Διαχειριστής";
      else document.getElementById("dt-status").innerHTML="Μέλος";
    }
    // Login Form Placeholders
    document.getElementById("dt-change-lang-button").innerHTML="Ελ";
    document.getElementById("dt-form-username-input").placeholder="Όνομα Χρήστη";
    document.getElementById("dt-form-password-input").placeholder="Κωδικός Πρόσβασης";
    // Registration Form Placeholders
    if($("meta[name='page-name']").attr("content")=="register") {
      document.getElementById("dt-reg-form-username-input").placeholder="Όνομα Χρήστη";
      document.getElementById("dt-reg-form-email-input").placeholder="Ηλεκτρονική Διεύθυνση";
      document.getElementById("dt-reg-form-password-input").placeholder="Κωδικός Πρόσβασης";
      document.getElementById("dt-reg-form-repeat-password-input").placeholder="Κωδικός Πρόσβασης";
      document.getElementById("dt-reg-form-display-name-input").placeholder="Προβαλλόμενο Όνομα";
    }
    // Control Panel
    if($("meta[name='page-name']").attr("content")=="control") {
      document.getElementById("dt-control-form-map-file-name").placeholder="Όνομα KML Αρχείου";
      document.getElementById("dt-control-form-map-name").placeholder="Όνομα Χάρτη";
      document.getElementById("dt-control-form-submit-button").value="Αναίβασμα KML Αρχείου";
      document.getElementById("dt-control-form-load-map-name").placeholder="Όνομα Χάρτη";
      document.getElementById("dt-control-form-set-map-name").placeholder="Όνομα Χάρτη";
      document.getElementById("dt-control-form-delete-map-name").placeholder="Όνομα Χάρτη";
    }
    language="Gr";
  } else if(language=="Gr") {
    // p.langEng & p.langGr elements
    Array.prototype.forEach.call(elemGr, changeToNone);
    Array.prototype.forEach.call(elemEng, changeToInitial);
    // Status Block
    if(isAdmin!==undefined) {
      if(isAdmin) document.getElementById("dt-status").innerHTML="Admin";
      else document.getElementById("dt-status").innerHTML="Member";
    }
    // Login form Placeholders
    document.getElementById("dt-change-lang-button").innerHTML="Eng";
    document.getElementById("dt-form-username-input").placeholder="Username";
    document.getElementById("dt-form-password-input").placeholder="Password";
    // Registration Form Placeholders
    if($("meta[name='page-name']").attr("content")=="register") {
      document.getElementById("dt-reg-form-username-input").placeholder="Username";
      document.getElementById("dt-reg-form-email-input").placeholder="Email";
      document.getElementById("dt-reg-form-password-input").placeholder="Password";
      document.getElementById("dt-reg-form-repeat-password-input").placeholder="Password";
      document.getElementById("dt-reg-form-display-name-input").placeholder="Display Name";
    }
    // Control Panel
    if($("meta[name='page-name']").attr("content")=="control") {
      document.getElementById("dt-control-form-map-file-name").placeholder="KML File Name";
      document.getElementById("dt-control-form-map-name").placeholder="Map Name";
      document.getElementById("dt-control-form-submit-button").value="Upload KML File";
      document.getElementById("dt-control-form-load-map-name").placeholder="Map Name";
      document.getElementById("dt-control-form-set-map-name").placeholder="Map Name";
      document.getElementById("dt-control-form-delete-map-name").placeholder="Map Name";
    }
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
    console.log("Logs deactivated.");
    $("#dt-custom-switch").prop("checked", false);
    $("#dt-dev-mode-overlay-custom-switch").prop("checked", false);
  } else {
    debugLogs=true;
    console.log("Logs activated.");
    $("#dt-custom-switch").prop("checked", true);
    $("#dt-dev-mode-overlay-custom-switch").prop("checked", true);
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
    isAdmin=false;
    // Sign in button & status block
    document.getElementById("dt-status-block").style.display="initial";
    document.getElementById("dt-status").innerHTML="Member";
  } else if(dataSplit[2]==1) { // User has status Admin
    isAdmin=true;
    // Sign in button & status block
    document.getElementById("dt-status-block").style.display="initial";
    document.getElementById("dt-status").innerHTML="Admin";
    // Debug console toggler
    document.getElementById("dt-debug-console-toggler").style.display="initial";
    // Control panel button
    $("#dt-go-to-control-panel-button").show();
    // Registration button
    $("#dt-register-button").hide();
  }
}

function resetUI() {
  // Sign in button & status block
  document.getElementById("dt-display-name-button").style.display="none";
  document.getElementById("dt-signin-button").style.display="initial";
  document.getElementById("dt-display-name-actual-button").innerHTML="Guest";
  // Debug console toggler
  document.getElementById("dt-debug-console-toggler").style.display="none";
  // Control panel button
  $("#dt-go-to-control-panel-button").hide();
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

// Registration
function checkReg(data) {
  if(data==="error code 5") {
    displayConLog("register", "username is already in use", true);
    setErrorBox("usr-in-use");
    // setErrorBox();
    return true;
  } else if (data==="error code 6") {
    displayConLog("register", "already signed in, redirecting...", true); // Redirect to Home Page
    $(location).attr("href", "../index.html");
    return true;
  } else if (data==="error code 2" || data==="error code 7") {
    displayConLog("register", "Oops! Something went wrong. Please try again later.", true);
    $(location).attr("href", "register.html"); // Refresh Page
    return true;
  } else if (data==="error code 3" || data==="error code 8") {
    displayConLog("register", "Statement could not be prepared.", true);
    $(location).attr("href", "register.html"); // Refresh Page
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
  else if(code==="usr-in-use") $("#dt-reg-form-username-exists-error").show();
}

function clearErrorBox() {
  $("#dt-reg-form-error-box").hide();
  $("#dt-reg-form-username-empty-error").hide();
  $("#dt-reg-form-email-empty-error").hide();
  $("#dt-reg-form-password-empty-error").hide();
  $("#dt-reg-form-display-name-empty-error").hide();
  $("#dt-reg-form-password-mismatch-error").hide();
  $("#dt-reg-form-username-exists-error").hide();
}


// Control Panel Map
function FNC(polygonCoords, polygonUniqueID) {

  //Make polygonCoords usable (Array of Arrays)
  polygonCoords.forEach(function(value, index, array) {
    var a = polygonCoords[index].split(',');
    var b = [];
    for (var i=0; i<a.length; i=i+2){
      b.push([Number(a[i+1]),Number(a[i])]);
    }
    polygonCoords[index] = b;
  });

  // Make basemap
  const map = new L.Map('dt-control-panel-map', { center: new L.LatLng(40.6401, 22.9444), zoom: 15 });
  const osm = new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
  map.addLayer(osm);

  var drawnItems = new L.FeatureGroup().on('click',polyonclick);
  map.addLayer(drawnItems);
  var polyLayers = [];

  // Make polygons
  polygonCoords.forEach(function(value, index, array) {
    var polygons = L.polygon(polygonCoords[index],{"uid": Number(polygonUniqueID[index])});//.addTo(map);
    polyLayers.push(polygons);
  });

  // Add polygons to FeatureGroup
  for(layer of polyLayers) {
    drawnItems.addLayer(layer);	
  }

  // Click handler for polygons/featuregroup
  function polyonclick(event) {
    var uid = event.layer.options.uid;
    console.log(uid);
  }
}
