document.addEventListener("DOMContentLoaded", function () {
  const signupForm = document.getElementById("signupForm");
  const warningCard = document.getElementById("warningCard");
  const warningText = document.getElementById("warningText");

  signupForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    // Perform signup logic
    if (password === confirmPassword) {
      // Passwords match, proceed with signup
      console.log("Signup successful");
      console.log("Name:", name);
      console.log("Email:", email);
      // console.log("Password:", password);
      warningCard.classList.add("d-none");

      const callback = (responseStatus, responseData) => {
        console.log("responseStatus:", responseStatus);
        console.log("responseData:", responseData);
        if (responseStatus == 200) {
          // Check if signup was successful
          if (responseData.token) {
            // Store the token in local storage
            localStorage.setItem("token", responseData.token);
            // Redirect or perform further actions for logged-in user
            window.location.href = "/index.html";
          }
        } else {
          warningCard.classList.remove("d-none");
          warningText.innerText = responseData.message;
        }
      };

      const data = {
        name: name,
        email: email,
        password: password,
      };

      // Perform signup request
      fetchMethod(
        currentUrl + "/api/champions/register",
        callback,
        "POST",
        data
      );

      // Reset the form fields
      signupForm.reset();
    } else {
      // Passwords do not match, handle error
      warningCard.classList.remove("d-none");
      warningText.innerText = "Passwords do not match";
    }
  });
});
