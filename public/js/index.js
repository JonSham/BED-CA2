document.addEventListener("DOMContentLoaded", function () {
  const riftButton = document.getElementById("riftButton");

  // Check if token exists in local storage
  const token = localStorage.getItem("token");

  if (!token) {
    // Token does not exist
    riftButton.addEventListener("click", function () {
      console.log("Access Denied. Redirecting to login page...");
      window.location.href = currentUrl + "/login.html";
    });
  } else {
    // Token exists, allow access
    riftButton.addEventListener("click", function () {
      console.log("Access Granted");
      window.location.href = currentUrl + "/summoners-rift.html";
    });
  }
});
