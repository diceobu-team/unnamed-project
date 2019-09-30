// Global Variables
var developerMode=true;
var devModeOverlaySlide=350;
var language="Eng";
var hour;
var min;
var elemEng=document.getElementsByClassName("langEng");
var elemGr=document.getElementsByClassName("langGr");
var sessionActive;
var sessionId;
var isAdmin;
var polygonDetails=new Array;
var details_array = [];
var selected_polygon_id;
var polyLayers = [];
var map;
var drawnItems;


if(developerMode) var debugLogs=true;
else var debugLogs=false;
var fatalErrorOccured=false;

// On page load
$(document).ready(function() {
  // Time
  var d=new Date();
  hour=d.getHours();
  min=d.getMinutes();
  displayConLog("time", hour+":"+min);
  // Dev Mode Badge
  if(developerMode) $("#dt-dev-mode-badge").show()
  // Tool Page
  if($("meta[name='page-name']").attr("content")=="tool") loadTool();
  // Fetch user data
  $.post("/unnamed-project/php/login.php", function(data, status) {
    displayConLog("login.php", "\n\tServer replied:\t"+data+"\n\tStatus:\t\t\t"+status);
    sessionActive=checkStatus(data); // true if a session is active, false otherwise
    if(sessionActive) {
      displayConLog("session", "active");
      if($("meta[name='page-name']").attr("content")=="register") $(location).attr("href", "../index.html");
      if(!isAdmin) if($("meta[name='page-name']").attr("content")=="control") $(location).attr("href", "../index.html");
    } else {
      sessionId=undefined;
      isAdmin=undefined;
      displayConLog("session", "inactive");
      if($("meta[name='page-name']").attr("content")=="control") $(location).attr("href", "../index.html");
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
      if($("meta[name='page-name']").attr("content")=="control") $(location).attr("href", "../index.html");
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

  // Control Panel Map Load
  $("#dt-control-panel-load-button").click(function() {
    displayConLog("control", "requesting map information");
    var mapName=$("#dt-control-form-load-map-name").val();
    $.post("/unnamed-project/php/load.php", {mapName}, function(data, status) {
      displayConLog("load.php", "Server replied: "+data+"\tStatus: "+status);
      if(data==="error code 13") displayConLog("load.php", "requested data could not be fetched");
      else {
        var rawPolygons=data.split("|#|");
        var polygonUniqueID=new Array;
        var polygonName=new Array;
        var polygonID=new Array;
        var polygonPoint=new Array;
        var polygonCoords=new Array;
        rawPolygons.forEach(function(value, index, array) {
          if(index>0) {
            var rawPolygonsRow=value.split("\n");
            polygonUniqueID[index-1]=rawPolygonsRow[0];
            polygonName[index-1]=rawPolygonsRow[1];
            polygonID[index-1]=rawPolygonsRow[2];
            polygonPoint[index-1]=rawPolygonsRow[3];
            polygonCoords[index-1]=rawPolygonsRow[4].replace(/ /g, ",");
            polygonDetails[index-1]=rawPolygonsRow[5];
          }
        });
        console.log(polygonUniqueID);
        console.log(polygonName);
        console.log(polygonID);
        console.log(polygonPoint);
        console.log(polygonCoords);
        console.log(polygonDetails);
  
        console.log(polygonDetails);
        polygonDetails.forEach(function(value, index, array) {
        details_array.push(JSON.parse(polygonDetails[index]));
        });
        console.log(details_array);
        // D3-EDITS START
        FNC(polygonCoords,polygonUniqueID);



        // D3-EDITS END
      }
    });
  });

  // Control Panel Map Set
  $("#dt-control-panel-set-button").click(function() {
    displayConLog("control", "setting main map");
    var mapName=$("#dt-control-form-set-map-name").val();
    $.post("/unnamed-project/php/set.php", {mapName}, function(data, status) {
      displayConLog("set.php", "Server replied: "+data+"\tStatus: "+status);
      if(data==="status code 5") displayConLog("set.php", "no active map found, specified map was set to active");
      else if(data==="status code 6") displayConLog("set.php", "active map found and was reset, specified map was set to active");
      else displayConLog("set.php", "fatal error occured");
    });
  })

  // Control Panel Map Delete
  $("#dt-control-panel-delete-button").click(function() {
    displayConLog("control", "setting main map");
    var mapName=$("#dt-control-form-delete-map-name").val();
    $.post("/unnamed-project/php/delete.php", {mapName}, function(data, status) {
      displayConLog("delete.php", "Server replied: "+data+"\tStatus: "+status);
      if(data==="status code 7") displayConLog("delete.php", "given map was deleted successfully");
      else if(data==="error code 14") displayConLog("delete.php", "could not delete map reference");
      else displayConLog("delete.php", "fatal error occured");
    });
  });
  
  // Control Panel Set Time
  $("#dt-tool-set-time-button").click(function() {
    displayConLog("set time", "setting simulation time");
    var absoluteTime=$("#dt-tool-set-time-input-absolute").val();
    var relativeTime=$("#dt-tool-set-time-input-relative").val();
    if(absoluteTime=="") {
      relativeTime=Number(relativeTime);
      console.log(Math.floor((min+relativeTime)/60));
      hour+=Math.floor((min+relativeTime)/60);
      hour=hour%24;
      min+=relativeTime;
      min=min%60;
      displayConLog("simulation time", hour+":"+min);
    } else {
      var absoluteTimeHM=absoluteTime.split(":");
      hour=Number(absoluteTimeHM[0]);
      min=Number(absoluteTimeHM[1]);
      displayConLog("simulation time", hour+":"+min);
    }    
    CityOverview(details_array, hour);
  });

  // Control Panel Pop-up
  $("#dt-control-panel-edit-polygon-button").click(function() {
    var temp_residents=$("#dt-control-form-edit-polygon-residents").val();
    var temp_spots=$("#dt-control-form-edit-polygon-spots").val();

    if (selected_polygon_id > 0)
    {
      polyLayers.forEach(function(value, index, array) 
      {
        if (selected_polygon_id === polyLayers[index].options.uid)
        {
          if (temp_residents != "")
          {
            ###
          }
          if (temp_spots != "")
          {
            ###
          }
        }
      }
    }
    else
    {
      console.log("Please select a polygon first!");
    }
    console.log(temp_residents);
    console.log(temp_spots);
  });

});
