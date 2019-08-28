$(document).ready(function() {
  // On page load (get session data from server)
  $.post("../php/login.php", function(data, status) {
    console.log("Data: "+data+"\nStatus: "+status);
    checkStatus(data);
  });

  // Loader (stop after 2 seconds or cancel completely on small devices)
  var screenWidth=$(window).width()
  console.log(screenWidth);
  if(screenWidth>=992) {
    stopLoader();
  } else {
    document.getElementById("dt-loader").style.display="none";
  }

  // Login Form
  $("#dt-login-button").click(function() {
    var username=$("#dt-form-username-input").val();
    var password=$("#dt-form-password-input").val();
    $.post("../php/login.php", {username, password}, function(data, status) {
      console.log("Server replied: "+data+"\nStatus: "+status);
      checkStatus(data);
    });
  });

  $("#dt-logout-button").click(function() {
    $.post("../php/logout.php", function(data, status) {
      console.log("Server replied: "+data+"\nStatus: "+status);
      checkStatus(data);
    });
  });
});
