// CSS Loader
function onPageLoad() {
  $(window).on("load", function() {
    setTimeout(function() {
      var preloader=$('.sk-folding-cube-wrapper');
      preloader.fadeOut(1000);  // Loader Fadeout Time
    }, 0); // Fake Loading Time (Default: 2000, Dev Mode: 0)
  });
}

// Language Selector
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
