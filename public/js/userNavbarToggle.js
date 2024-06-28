document.addEventListener("DOMContentLoaded", function () {
  const loginButton = document.getElementById("loginButton");
  const registerButton = document.getElementById("registerButton");
  const profileButton = document.getElementById("profileButton");
  const logoutButton = document.getElementById("logoutButton");

  // Check if token exists in local storage
  const token = localStorage.getItem("token");
  if (token) {
    // Token exists, show profile button and hide login and register buttons
    loginButton.classList.add("d-none");
    registerButton.classList.add("d-none");
    profileButton.classList.remove("d-none");
    logoutButton.classList.remove("d-none");
  } else {
    // Token does not exist, show login and register buttons and hide profile and logout buttons
    loginButton.classList.remove("d-none");
    registerButton.classList.remove("d-none");
    profileButton.classList.add("d-none");
    logoutButton.classList.add("d-none");
  }

  logoutButton.addEventListener("click", function () {
    // Remove the token from local storage and redirect to index.html
    localStorage.removeItem("token");
    // reload page
    window.location.reload();
  });
});

function toggleDropdown() {
  var dropdown = document.getElementById("dropdown");
  dropdown.style.display =
    dropdown.style.display === "block" ? "none" : "block";
}

function logout() {
  alert("Logging out...");
}

document.addEventListener("DOMContentLoaded", function () {
  const token = localStorage.getItem("token");

  if (document.getElementById("profileName") == undefined) {
    return;
  }

  if (token) {
    const callback = (responseStatus, responseData) => {
      console.log("responseStatus:", responseStatus);
      console.log("responseData:", responseData);
      const profileName = document.getElementById("profileName");

      profileName.innerText = responseData[0].name;
    };

    fetchMethod(
      currentUrl + "/api/champions/token",
      callback,
      "GET",
      null,
      localStorage.getItem("token")
    );
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const pfp = document.getElementById("pfpShow");
  const token = localStorage.getItem("token");
  const tokens = localStorage.getItem("token")?.split(".");
  const champion_id = tokens ? JSON.parse(atob(tokens[1])).userId : null;

  if (token) {
    if (!pfp) {
      return;
    }

    const callback = (responseStatus, responseData) => {
      console.log("responseStatus:", responseStatus);
      console.log("responseData:", responseData);

      pfp.src = responseData[0].profile_picture;
    };

    fetchMethod(
      currentUrl + `/api/champions/view/${champion_id}`,
      callback,
      "GET",
      null,
      localStorage.getItem("token")
    );
  } else {
    pfp.src = "";
  }
});
