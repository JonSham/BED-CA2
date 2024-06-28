document.addEventListener("DOMContentLoaded", function () {
  const callback = (responseStatus, responseData) => {
    console.log("responseStatus:", responseStatus);
    console.log("responseData:", responseData);

    const messageList = document.getElementById("messageList");
    responseData.forEach((message, index, array) => {
      const displayItem = document.createElement("div");
      if (index == array.length - 1) {
        displayItem.id = "lastMessage";
      }

      if (!message.champion_id) {
        message.name = "Deleted Champion";
      }
      displayItem.innerHTML = `
          <div class="text-body d-flex ms-2">
            <div class="profile-picture-container">
              <img
                src=""
                alt="Profile Picture"
                class="profile-picture pfpShow" 
                id="pfpShow"
                height="62"
                width="62"
                style="border-radius: 50%; margin-top: -4px;"
              />
            </div>
            <div class="text-message ms-3">
              <div class="d-flex align-items-center">
                <h5 class="texter-name">${message.name}</h5>
                <small class="text-secondary ms-2">  ${formatDate(
                  message.date
                )} at ${formatTime(message.time)}</small>
              </div>
    
              <div
                class="border rounded-2 bg-body-tertiary"
                href="#"
                style="height: fit-content; width: fit-content"
              >
                <p
                  style="
                    max-width: 605px;
                    margin-left: 7px;
                    margin-right: 7px;
                    margin-top: 7px;
                    margin-bottom: 7px;
                    word-wrap: break-word;
                    text-align: left;
                  "
                >${message.message_text}</p>
              </div>
            </div>
          </div>
        `;
      messageList.appendChild(displayItem);

      // pfpShow function

      pfpShow(displayItem, message.champion_id);
    });

    // scroll to bottom after adding mess
    document.getElementById("lastMessage").scrollIntoView();

    // to show profile picture
    function pfpShow(displayItem, champID) {
      const pfp = displayItem.querySelector(".pfpShow");
      const champion_id = champID;

      if (!pfp) {
        return;
      }

      if (champion_id == null) {
        pfp.src = "../images/deleted.jpg";
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
    }

    // to format date
    function formatDate(inputDate) {
      const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];

      const [year, month, day] = inputDate.split("/");

      // create a date using the input date
      const formattedDate = new Date(`${month} ${day}, ${year}`);

      // get the day month year
      const formattedDay = formattedDate.getDate();
      const formattedMonth = months[formattedDate.getMonth()];
      const formattedYear = formattedDate.getFullYear();

      // put tgt the formatted date string
      const result = `${formattedDay} ${formattedMonth} ${formattedYear}`;

      return result;
    }

    // to format time
    function formatTime(inputTime) {
      const [hours, minutes, seconds] = inputTime.split(":");
      const formattedHours = parseInt(hours);
      const formattedMinutes = parseInt(minutes);

      let result = formattedHours + ":";

      if (formattedMinutes < 10) {
        result += "0";
      }

      result += formattedMinutes;

      return result;
    }
  };

  fetchMethod(currentUrl + "/api/message/view", callback);
});

// to get current date
function getCurrentDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString().padStart(2, "0");
  const day = today.getDate().toString().padStart(2, "0");
  return `${year}/${month}/${day}`;
}

// to get current time
function getCurrentTime() {
  const today = new Date();
  const hours = today.getHours().toString().padStart(2, "0");
  const minutes = today.getMinutes().toString().padStart(2, "0");
  const seconds = today.getSeconds().toString().padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
}

document.addEventListener("DOMContentLoaded", function () {
  const sendButton = document.getElementById("sendButton");
  const messageInput = document.getElementById("messageInput");
  const tokens = localStorage.getItem("token")?.split(".");
  const champion_id = tokens ? JSON.parse(atob(tokens[1])).userId : null;

  sendButton.addEventListener("click", function () {
    const messageText = messageInput.value.trim();
    const date = getCurrentDate();
    const time = getCurrentTime();

    if (messageText !== "") {
      const data = {
        message_text: messageText,
        champion_id: champion_id,
        date: date,
        time: time,
      };

      const callback = (responseStatus, responseData) => {
        if (responseStatus === 201) {
          console.log("Message sent successfully:", responseData);

          // reload page
          window.location.reload();
        } else {
          console.error("Error sending message:", responseData);
          // send an err mess
          alert("Error sending message! Please try again.");
        }
      };

      // Assuming your fetchMethod signature is (url, callback, method, data, token)
      fetchMethod(
        currentUrl + "/api/message/add",
        callback,
        "POST",
        data,
        localStorage.getItem("token")
      );
    } else {
      // empty input wont send anything
      console.log("Input is empty.");
    }
  });
});
