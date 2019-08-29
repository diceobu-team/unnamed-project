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
  if(data==="") {
    console.log("\tStatus:\t\t\tNo active session");
  } else if (data==="status code 1") {
    console.log("\tStatus:\t\t\tSession destroyed.");
    resetUI();
  } else if (data==="status code 2") {
    console.log("\tStatus:\t\t\tGuest Session");
  } else if (data==="error code 1") {
    console.log("\tStatus:\t\t\tWrong username or password. Please try again.");
  } else if (data==="error code 2") {
    console.log("\tStatus:\t\t\tOops! Something went wrong. Please try again later.");
  } else if (data==="error code 3") {
    console.log("\tStatus:\t\t\tLink could not be created.");
  } else {
    console.log("\tStatus:\t\t\tSession started.");
    setUI(data);
  }
}

function setUI(data) {
  var dataSplit=data.split(" ");
  console.log(dataSplit);
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