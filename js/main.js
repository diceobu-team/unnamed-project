// CSS Loader
function stopLoader() {
  $(window).on("load", function() {
    setTimeout(function() {
      var loader=$('.sk-folding-cube-wrapper');
      loader.fadeOut(1000);  // Loader Fadeout Time
    }, 0); // Fake Loading Time (Default: 2000, Dev Mode: 0)
  });
}

// Language Selection (toggle)
function changeLang() {
  console.log("\tStatus:\t\t\tchangeLang\tStarted");
  if(language=="Eng") {
    console.log("\tStatus:\t\t\tchangeLang\telemGr");
    Array.prototype.forEach.call(elemEng, changeToNone);
    Array.prototype.forEach.call(elemGr, changeToInitial);
    document.getElementById("dt-change-lang-button").innerHTML="Gr";
    language="Gr";
  } else if(language=="Gr") {
    console.log("\tStatus:\t\t\tchangeLang\telemEng");
    Array.prototype.forEach.call(elemGr, changeToNone);
    Array.prototype.forEach.call(elemEng, changeToInitial);
    document.getElementById("dt-change-lang-button").innerHTML="Eng";
    language="Eng";
  }
  console.log("\tStatus:\t\t\tchangeLang\tDone");
}

function changeToNone(element) {
  element.style.display="none";
}

function changeToInitial(element) {
  element.style.display="initial";
}

// Client Status
function checkStatus(data) {
  if(data==="status code 2") {
    console.log("\tStatus:\t\t\tGuest Session");
    return false;
  } else if (data==="status code 1") {
    console.log("\tStatus:\t\t\tSession destroyed.");
    resetUI();
    return false;
  } else if (data==="error code 1") {
    console.log("\tStatus Error:\tWrong username or password. Please try again.");
    return false;
  } else if (data==="error code 2") {
    console.log("\tStatus Error:\tOops! Something went wrong. Please try again later.");
    return false;
  } else if (data==="error code 3") {
    console.log("\tStatus Error:\tStatement could not be prepared.");
    return false;
  } else {
    console.log("\tStatus:\t\t\tSession started.");
    setUI(data);
    return true;
  }
}

function setUI(data) {
  var dataSplit=data.split(" ");
  document.getElementById("dt-signin-button").style.display="none";
  document.getElementById("dt-display-name-button").style.display="initial";
  document.getElementById("dt-display-name-actual-button").innerHTML=dataSplit[3];
  if(dataSplit[2]==0) {
    document.getElementById("dt-status-block").style.display="initial";
    document.getElementById("dt-status").innerHTML="Member";
  } else if(dataSplit[2]==1) {
    document.getElementById("dt-status-block").style.display="initial";
    document.getElementById("dt-status").innerHTML="Admin";
  }
}

function resetUI() {
  document.getElementById("dt-display-name-button").style.display="none";
  document.getElementById("dt-signin-button").style.display="initial";
}

// Additional session data
function fetchClientData(data) {
  if(sessionActive===true) { // if a session is active, request more data
    var dataSplit=data.split(" ");
    sessionId=dataSplit[0];
    // Language Data
    $.post("/unnamed-project/php/session.php", {sessionVar: "language", sessionId}, function(data, status) {
      console.log("session.php:\n\tServer replied:\t"+data+"\n\tStatus:\t\t\t"+status);
      if(checkSession(data)) { // Data fetch successful?
        if(data==language) {
          console.log("\tStatus:\t\t\tLanguage already synced.");
        } else {
          changeLang();
          console.log("\tStatus:\t\t\tLanguage changed successfully.");
        }
      } else {
        console.log("Critical Error:\t\tLanguage could not be set.");
      }
    });
  } else {
    // Load cookies
    console.log("Cookies:\t\t\tfetched");
    // checkCookie();
  }
}

function checkSession(data) {
  if(data==="error code 4") {
    console.log("\tSession Error:\tId doesn't exist.");
    return false;
  } else if (data==="error code 2") {
    console.log("\tSession Error:\tOops! Something went wrong. Please try again later.");
    return false;
  } else if (data==="error code 3") {
    console.log("\tSession Error:\tStatement could not be prepared.");
    return false;
  } else {
    console.log("\tSession:\t\tRecovered data can be used safely.");
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

function checkCookie() {
  var language=getCookie("language");
  if (language!="") {
    alert("Welcome again! Your language is "+language+".");
  } else {
     language = prompt("Please enter your language:","");
     if (language != "" && language != null) {
       setCookie("language", language, 30);
     }
  }
}