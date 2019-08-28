// CSS Loader
function stopLoader() {
  $(window).on("load", function() {
    setTimeout(function() {
      var loader=$('.sk-folding-cube-wrapper');
      loader.fadeOut(1000);  // Loader Fadeout Time
    }, 0); // Fake Loading Time (Default: 2000, Dev Mode: 0)
  });
}

// Language Selection
function changeLang() {
  console.log("changeLang\tStarted");
  if(lang=="Eng") {
    console.log("changeLang\telemGr");
    Array.prototype.forEach.call(elemEng, changeToNone);
    Array.prototype.forEach.call(elemGr, changeToInitial);
    document.getElementById("dt-change-lang-button").innerHTML="Gr";
    lang="Gr";
  } else if(lang=="Gr") {
    console.log("changeLang\telemEng");
    Array.prototype.forEach.call(elemGr, changeToNone);
    Array.prototype.forEach.call(elemEng, changeToInitial);
    document.getElementById("dt-change-lang-button").innerHTML="Eng";
    lang="Eng";
  }
  console.log("changeLang\tDone");
}

function changeToNone(element) {
  element.style.display="none";
}

function changeToInitial(element) {
  element.style.display="initial";
}

// Sign in - Status Button
function checkStatus(data) {
  if(data==="") {
    console.log("No active session");
  } else if (data==="status code 1") {
    console.log("Session destroyed.");
    document.getElementById("dt-display-name-button").style.display="none";
    document.getElementById("dt-signin-button").style.display="initial";
  } else if (data==="error code 1") {
    console.log("Wrong username or password. Please try again.");
  } else if (data==="error code 2") {
    console.log("Oops! Something went wrong. Please try again later.");
  } else if (data==="error code 3") {
    console.log("Link could not br created.");
  } else {
    var dataSplit=data.split(" ");
    console.log("Session started.");
    console.log(dataSplit);
    document.getElementById("dt-signin-button").style.display="none";
    document.getElementById("dt-display-name-button").style.display="initial";
    document.getElementById("dt-display-name-actual-button").innerHTML=dataSplit[2];
  }
}
