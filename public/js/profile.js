// for the edit bttn
function enableEdit() {
  var email = document.getElementById("email");
  var name = document.getElementById("name");

  var editButton = document.getElementById("editButton");
  var saveButton = document.getElementById("saveButton");
  var cancelButton = document.getElementById("cancelButton");
  var deleteButton = document.getElementById("deleteButton");

  // enable edit mode
  email.readOnly = false;
  name.readOnly = false;
  email.pattern = true;
  email.require = true;

  editButton.style.display = "none";
  saveButton.style.display = "inline-block";
  cancelButton.style.display = "inline-block";
  deleteButton.style.display = "inline-block";
}

// for save bttn
function saveChanges() {
  // get values from the form
  var emailValue = document.getElementById("email").value;
  var nameValue = document.getElementById("name").value;

  let champion_id;

  const callback = (responseStatus, responseData) => {
    console.log("responseStatus:", responseStatus);
    console.log("responseData:", responseData);
    // champ id from res data
    champion_id = responseData[0].champion_id;

    const emailData = {
      email: emailValue,
    };

    const nameData = {
      name: nameValue,
    };

    // update requests for email and name not tgt (if not complications arise)
    fetchAndUpdate(
      `/api/champions/updateChampionEmail/${champion_id}`,
      "PUT",
      emailData
    );
    fetchAndUpdate(
      `/api/champions/updateChampionName/${champion_id}`,
      "PUT",
      nameData
    );
  };

  fetchMethod(
    currentUrl + "/api/champions/token",
    callback,
    "GET",
    null,
    localStorage.getItem("token")
  );
}

// perform the update request and handle response
function fetchAndUpdate(endpoint, method, data) {
  const token = localStorage.getItem("token");

  // perform the update request
  fetchMethod(endpoint, callback, method, data, token);
}

// function to handle the response from the server
const callback = (responseStatus, responseData) => {
  console.log("responseStatus:", responseStatus);
  console.log("responseData:", responseData);

  const warningCard = document.getElementById("warningCard");
  const warningText = document.getElementById("warningText");

  if (responseStatus === 200) {
    // check update was successful
    alert("Changes saved!");
  } else {
    alert("Error updating");
    // display a warning if error
    warningCard.classList.remove("d-none");
    warningText.innerText = responseData.message;
    var boxElement = document.querySelector(".box");
    if (boxElement) {
      boxElement.style.height = "450px";
    }

    // reload page
    window.location.reload();
  }

  // move back to view mode after saving
  disableEdit();
};

function cancelEdit() {
  // move back to view mode without saving changes
  disableEdit();
}

function disableEdit() {
  var email = document.getElementById("email");
  var name = document.getElementById("name");
  var editButton = document.getElementById("editButton");
  var saveButton = document.getElementById("saveButton");
  var cancelButton = document.getElementById("cancelButton");
  var deleteButton = document.getElementById("deleteButton");

  // disable edit mode
  email.readOnly = true;
  name.readOnly = true;
  email.pattern = false;
  email.require = false;

  editButton.style.display = "inline-block";
  saveButton.style.display = "none";
  cancelButton.style.display = "none";
  deleteButton.style.display = "none";
}

// funtion for deleting account
function deleteAcc() {
  // confirm with user about deteting acc
  const confirmDelete = confirm(
    "Are you sure you want to delete your account?"
  );

  if (confirmDelete) {
    const callback = (responseStatus, responseData) => {
      console.log("responseStatus:", responseStatus);
      console.log("responseData:", responseData);

      const champion_id = responseData[0].champion_id;

      // fetch req to del acc
      fetch(`/api/champions/delete/${champion_id}`, {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (response.ok) {
            // successful
            console.log("Account deleted successfully.");
            alert("Your account has been successfully deleted.");

            // delete token
            localStorage.removeItem("token");

            // redirect to index
            window.location.href = "/index.html";
          } else {
            // no successful
            console.error("Error deleting account.");
            alert("Error in deleting account. Please try again.");
          }
        })
        .catch((error) => {
          // catch the errors
          console.error("Error deleting account:", error);
          alert("Error in deleting account. Please try again.");
        });
    };

    // fetch to get champ id
    fetchMethod(
      currentUrl + "/api/champions/token",
      callback,
      "GET",
      null,
      localStorage.getItem("token")
    );
  }
}

// for get pf name
document.addEventListener("DOMContentLoaded", function () {
  if (document.getElementById("name") == undefined) {
    return;
  }

  const callback = (responseStatus, responseData) => {
    console.log("responseStatus:", responseStatus);
    console.log("responseData:", responseData);
    const name = document.getElementById("name");

    name.value = responseData[0].name;
  };

  fetchMethod(
    currentUrl + "/api/champions/token",
    callback,
    "GET",
    null,
    localStorage.getItem("token")
  );
});

// for pf email
document.addEventListener("DOMContentLoaded", function () {
  if (document.getElementById("email") == undefined) {
    return;
  }

  const callback = (responseStatus, responseData) => {
    console.log("responseStatus:", responseStatus);
    console.log("responseData:", responseData);
    const email = document.getElementById("email");

    email.value = responseData[0].email;
  };

  fetchMethod(
    currentUrl + "/api/champions/token",
    callback,
    "GET",
    null,
    localStorage.getItem("token")
  );
});

// for get pfp
document.addEventListener("DOMContentLoaded", function () {
  const pfp = document.getElementById("pfpShow");

  if (!pfp) {
    return;
  }

  const callback = (responseStatus, responseData) => {
    console.log("responseStatus:", responseStatus);
    console.log("responseData:", responseData);

    pfp.src = responseData[0].profile_picture;
  };

  fetchMethod(
    currentUrl + "/api/champions/token",
    callback,
    "GET",
    null,
    localStorage.getItem("token")
  );
});

// for pfp select
const cardLinks = document.querySelectorAll(".card-link");

let selectedImageLink = ""; // to store the link of pfp

cardLinks.forEach((cardLink) => {
  cardLink.addEventListener("click", function () {
    // if card is already selected unselect it and reset the selectedImageLink
    if (this.classList.contains("selected-card")) {
      this.classList.remove("selected-card");
      selectedImageLink = "";
    } else {
      // unselect all other cards
      cardLinks.forEach((otherCardLink) => {
        if (otherCardLink !== this) {
          otherCardLink.classList.remove("selected-card");
        }
      });

      // toggle selected state for the clicked card
      this.classList.add("selected-card");

      // get image link from the data attribute
      selectedImageLink = this.dataset.imgSrc;
      console.log("Selected Image Link:", selectedImageLink);
    }
  });
});

// Add click event listener to the "Select" button
const selectButton = document.getElementById("selectButton");

selectButton.addEventListener("click", function () {
  if (selectedImageLink) {
    // show the img to be sent
    console.log("Image link to be sent to the database:", selectedImageLink);

    const tokens = localStorage.getItem("token")?.split(".");
    const champion_id = tokens ? JSON.parse(atob(tokens[1])).userId : null;

    if (champion_id) {
      const data = {
        champion_id: champion_id,
        profile_picture: selectedImageLink,
      };

      const callback = (responseStatus, responseData) => {
        console.log("Response Status:", responseStatus);
        console.log("Response Data:", responseData);

        if (responseStatus === 200) {
          console.log("Profile picture updated successfully");
          // reload page
          window.location.reload();
        } else {
          console.error("Error updating profile picture");
          window.location.reload();
        }
      };

      fetchMethod(
        currentUrl + `/api/champions/changePfp`,
        callback,
        "PUT",
        data,
        localStorage.getItem("token")
      );
    }
  } else {
    // no image is selected
    // reload page
    window.location.reload();
  }

  // reset selectedImageLink for the next selection
  selectedImageLink = "";
});
