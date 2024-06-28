const callback = (responseStatus, responseData) => {
  console.log("responseStatus:", responseStatus);
  console.log("responseData:", responseData);

  const progressList = document.getElementById("progressList");
  responseData.forEach((progress) => {
    const displayItem = document.createElement("div");

    // to display no notes
    if (progress.notes === null) {
      progress.notes = "No notes to display.";
    }

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

    progress.completion_date = formatDate(progress.completion_date);

    displayItem.innerHTML = `
        <div
          href="#"
          class="box list-group-item list-group-item-action d-flex gap-4 py-3"
          aria-current="true"
        >
          <img
            src=""
            alt="Profile Picture"
            width="50"
            height="50"
            class="pfpShow rounded-circle flex-shrink-0"
          />
          <div class="d-flex gap-2 w-100 justify-content-between">
            <div class="content">
              <div>
                <h3 class="mb-0"><b>${progress.name}</b></h3>
                <h5 class="start mb-0">Completed '${progress.title}'</h5>
                <div class="taskID">
                  <small class="opacity-75">Progress ID: ${progress.progress_id}</small>
                  <hr class="line" />
                </div>
                <h6 class="notes opacity-75">Notes: ${progress.notes}</h6>
                <div class="edit btn-group">
                  <button
                    type="button"
                    class="btn btn-sm btn-outline-secondary editButton"
                  >
                    Edit
                  </button>
                  <!-- Like button -->
                  <div class="likebttn d-none">
                    <div class="heart likeButton"></div>
                  </div>
                </div>
              </div>
            </div>
            <small class="opacity-50 text-nowrap">${progress.completion_date}</small>
          </div>
        </div>
      `;

    progressList.appendChild(displayItem);

    // Call the function to handle the edit and like buttons
    pfpShow(displayItem, progress.champion_id);
    handleEditButton(displayItem);
    handleLikeButton(displayItem);
    handleEditButtonOwner(
      displayItem,
      progress.champion_id,
      progress.progress_id
    );
  });

  // to show pfp
  function pfpShow(displayItem, champID) {
    const pfp = displayItem.querySelector(".pfpShow");
    const champion_id = champID;

    //action next
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
  }

  // to ensure that champs not logged in cannot edit or like
  function handleEditButton(displayItem) {
    const token = localStorage.getItem("token");
    const editButton = displayItem.querySelector(".editButton");
    if (token) {
      editButton.removeAttribute("disabled");
    } else {
      editButton.setAttribute("disabled", "true");
    }
  }

  function handleLikeButton(displayItem) {
    const token = localStorage.getItem("token");
    const likeButtonContainer = displayItem.querySelector(".likebttn");
    if (token) {
      likeButtonContainer.classList.remove("d-none");
    } else {
      likeButtonContainer.classList.add("d-none");
    }
  }

  // to format date to "yyyy-MM-dd"
  function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function handleEditButtonOwner(displayItem, progressOwnerId, progressId) {
    const tokens = localStorage.getItem("token")?.split(".");
    const championId = tokens ? JSON.parse(atob(tokens[1])).userId : null;
    const editButton = displayItem.querySelector(".editButton");

    editButton.addEventListener("click", () => {
      if (championId && championId === progressOwnerId) {
        // fetch task progress data using fetchMethod
        const editProgressId = progressId;

        fetchMethod(
          currentUrl + `/api/taskprogress/view/${editProgressId}`,
          (responseStatus, data) => {
            if (responseStatus === 200) {
              // fill in modla with fetched data
              document.getElementById("EditTaskDone").value = data[0].task_id;
              document.getElementById("editNotes").value = data[0].notes;
              forDaSave(data[0].progress_id);
              forDaDelete(data[0].progress_id);

              // reformat and set the completion date
              const formattedDate = formatDate(data[0].completion_date);

              // check if the date valid before setting the value

              document.getElementById("editCompletion_date").value =
                formattedDate;

              // show the modal
              const editModal = new bootstrap.Modal(
                document.getElementById("editForm")
              );
              editModal.show();
            } else {
              console.error(
                "Error fetching task progress data:",
                responseStatus
              );
            }
          }
        );
      } else {
        // if it doesn't belong show a warning
        const notOwnerWarning = new bootstrap.Modal(
          document.getElementById("notOwnerWarning")
        );
        notOwnerWarning.show();
      }
    });
  }

  // jq like bttn
  $(".likeButton").on("click", function () {
    $(this).toggleClass("is-active");
  });
};

fetchMethod(currentUrl + `/api/taskprogress/view`, callback);

// for logged user veri
document.addEventListener("DOMContentLoaded", function () {
  const addTask = document.getElementById("addTask");
  const addTaskText = document.getElementById("addTaskText");

  // Check if token exists in local storage
  const token = localStorage.getItem("token");

  if (!token) {
    // Token does not exist, redirect to login page
    addTask.addEventListener("click", function () {
      console.log("Access Denied. Redirecting to login page...");
      window.location.href = currentUrl + "/login.html";
    });
  } else {
    // Token exists, allow access
    addTask.addEventListener("click", function () {
      console.log("Access Granted");
    });
  }
});

document.addEventListener("DOMContentLoaded", function () {
  // Function to fetch task titles and populate the dropdown
  function fetchTaskTitles() {
    fetch("http://localhost:3000/api/tasks")
      .then((response) => response.json())
      .then((data) => {
        const taskDropdown = document.getElementById("taskDone");
        const EditTaskDropdown = document.getElementById("EditTaskDone");

        // clear existing options
        taskDropdown.innerHTML = "";
        EditTaskDropdown.innerHTML = "";

        // add new options
        data.forEach((task) => {
          const option = document.createElement("option");
          option.value = task.task_id; // Assuming each task has a unique identifier
          option.text = task.title;
          taskDropdown.appendChild(option);
        });

        // add new options
        data.forEach((task) => {
          const option = document.createElement("option");
          option.value = task.task_id; // Assuming each task has a unique identifier
          option.text = task.title;
          EditTaskDropdown.appendChild(option);
        });
      })
      .catch((error) => console.error("Error fetching task titles:", error));
  }

  // populate the dropdown
  fetchTaskTitles();
});

// to post fetch add progress
document
  .getElementById("addProgress")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent default form submission

    // fetch data from form fields
    const task_id = document.getElementById("taskDone").value;
    let notes = document.getElementById("notes").value;
    const completion_date = document.getElementById("completion_date").value;
    const tokens = localStorage.getItem("token")?.split(".");
    const champion_id = tokens ? JSON.parse(atob(tokens[1])).userId : null;
    const warningCard2 = document.getElementById("warningCard");
    const warningText2 = document.getElementById("warningText");

    if (!notes || notes.trim() === "") {
      notes = "No notes to display.";
    }

    const data = {
      task_id,
      notes,
      completion_date,
      champion_id,
    };

    const callback = (responseStatus, responseData) => {
      console.log("Save changes responseStatus:", responseStatus);
      console.log("Save changes responseData:", responseData);

      if (responseStatus == 201) {
        console.log("Progress created successfully");
        warningCard2.classList.add("d-none");
        // reload page
        window.location.reload();
      } else {
        warningCard2.classList.remove("d-none");
        warningText2.innerText = responseData.message;
      }
    };

    fetchMethod(
      currentUrl + `/api/taskprogress/add`,
      callback,
      "POST",
      data,
      localStorage.getItem("token")
    );
  });

// save bttn
function forDaSave(theOneId) {
  const saveButton = document.getElementById("saveEdit");
  saveButton.addEventListener("click", () => {
    // save function code
    const task_id = document.getElementById("EditTaskDone").value;
    let notes = document.getElementById("editNotes").value;
    const completion_date = document.getElementById(
      "editCompletion_date"
    ).value;
    const warningCard2 = document.getElementById("warningCard2");
    const warningText2 = document.getElementById("warningText2");
    const progress_id = theOneId;

    if (!notes || notes.trim() === "") {
      notes = "No notes to display.";
    }

    const data = {
      task_id: task_id,
      notes: notes,
      completion_date: completion_date,
      progress_id: progress_id, // use the stored progress_id
    };

    const callback = (responseStatus, responseData) => {
      console.log("Save changes responseStatus:", responseStatus);
      console.log("Save changes responseData:", responseData);

      if (responseStatus == 200) {
        console.log("Task updated successfully");
        console.log("Task ID: ", task_id);
        console.log("Notes: ", notes);
        console.log("Completion Date: :", completion_date);
        warningCard2.classList.add("d-none");
        // reload page
        window.location.reload();
      } else {
        warningCard2.classList.remove("d-none");
        warningText2.innerText = responseData.message;
      }
    };

    fetchMethod(
      currentUrl + `/api/taskprogress/edit`,
      callback,
      "PUT",
      data,
      localStorage.getItem("token")
    );
  });
}

// for del button
function forDaDelete(theChosenId) {
  const deleteEditButton = document.getElementById("deleteEdit");
  deleteEditButton.addEventListener("click", function () {
    const progress_id = theChosenId;

    // confirmation
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this progress?"
    );

    if (isConfirmed) {
      const callback = (responseStatus, responseData) => {
        console.log("Delete task responseStatus:", responseStatus);
        console.log("Delete task responseData:", responseData);

        if (responseStatus == 204) {
          console.log("Task deleted successfully");
          warningCard2.classList.add("d-none");
          // reload page
          window.location.reload();
        } else {
          warningCard2.classList.remove("d-none");
          warningText2.innerText = responseData.message;
        }
      };

      fetchMethod(
        currentUrl + `/api/taskprogress/delete/${progress_id}`,
        callback,
        "DELETE",
        null,
        localStorage.getItem("token")
      );
    }
  });
}
