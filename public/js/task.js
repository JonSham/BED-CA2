document.addEventListener("DOMContentLoaded", function () {
  const taskList = document.getElementById("taskList");

  const callback = (responseStatus, responseData) => {
    console.log("responseStatus:", responseStatus);
    console.log("responseData:", responseData);

    responseData.forEach((task) => {
      const displayItem = createTaskDisplayItem(task);
      taskList.appendChild(displayItem);
    });
  };

  fetchMethod(currentUrl + "/api/tasks", callback);

  function createTaskDisplayItem(task) {
    const displayItem = document.createElement("div");
    displayItem.innerHTML = `
      <div class="col">
        <div class="card h-100 shadow-sm">
          <div class="card-body d-flex flex-column">
            <h3 class="card-title">${task.title}</h3>
            <p class="card-text flex-grow-1">${task.description}</p>
            <h5 class="points">Points: ${task.points}</h5>
            <div class="d-flex justify-content-between align-items-center mt-auto">
              <div class="edit btn-group">
                <button type="button" class="btn btn-sm btn-outline-secondary edit-button"
                        data-bs-toggle="modal" data-bs-target="#editForm" data-task-id="${task.task_id}">
                  Edit
                </button>
              </div>
              <small class="text-body-secondary" id="name">Task ID: ${task.task_id}</small>
            </div>
          </div>
        </div>
      </div>
    `;

    const editButton = displayItem.querySelector(".edit-button");
    handleEditButton(editButton);

    return displayItem;
  }

  // to ensure that champs not logged in cannot edit
  function handleEditButton(editButton) {
    const token = localStorage.getItem("token");
    if (token) {
      editButton.removeAttribute("disabled");
    } else {
      editButton.setAttribute("disabled", "true");
    }

    editButton.addEventListener("click", function () {
      const taskId = editButton.getAttribute("data-task-id");
      document.getElementById("editForm").setAttribute("data-task-id", taskId);
      fetchTaskDataForEditForm(taskId);
    });
  }

  // to get data
  function fetchTaskDataForEditForm(taskId) {
    fetchTitleForEditForm(taskId);
    fetchDescriptionForEditForm(taskId);
    fetchPointsForEditForm(taskId);
  }

  // for title
  function fetchTitleForEditForm(taskId) {
    fetchDataForEditForm(taskId, "title", "editTitle");
  }

  // for des
  function fetchDescriptionForEditForm(taskId) {
    fetchDataForEditForm(taskId, "description", "editDescription");
  }

  // for points
  function fetchPointsForEditForm(taskId) {
    fetchDataForEditForm(taskId, "points", "editPoints");
  }

  // to fill in with correct data
  function fetchDataForEditForm(taskId, dataKey, inputId) {
    const inputElement = document.getElementById(inputId);
    if (inputElement === null) {
      return;
    }

    const callback = (responseStatus, responseData) => {
      console.log(`Fetching ${dataKey} for task ID ${taskId}`);
      console.log("responseStatus:", responseStatus);
      console.log("responseData:", responseData);

      if (responseData && responseData.length > 0) {
        inputElement.value = responseData[0][dataKey];
      }
    };

    fetchMethod(
      currentUrl + `/api/tasks/id/${taskId}`,
      callback,
      "GET",
      null,
      localStorage.getItem("token")
    );
  }

  // for save button
  const saveEditButton = document.getElementById("saveEdit");
  saveEditButton.addEventListener("click", function () {
    saveEdit();
  });

  // for del button
  const deleteEditButton = document.getElementById("deleteEdit");
  deleteEditButton.addEventListener("click", function () {
    deleteEdit();
  });

  // save function
  function saveEdit() {
    const taskId = document
      .getElementById("editForm")
      .getAttribute("data-task-id");
    const title = document.getElementById("editTitle").value;
    const description = document.getElementById("editDescription").value;
    const points = document.getElementById("editPoints").value;
    const warningCard2 = document.getElementById("warningCard2");
    const warningText2 = document.getElementById("warningText2");

    const data = {
      title: title,
      description: description,
      points: points,
    };

    const callback = (responseStatus, responseData) => {
      console.log("Save changes responseStatus:", responseStatus);
      console.log("Save changes responseData:", responseData);

      if (responseStatus == 200) {
        console.log("Task updated successfully");
        console.log("Title:", title);
        console.log("Description:", description);
        console.log("Points:", points);
        warningCard2.classList.add("d-none");
        // reload page
        window.location.reload();
      } else {
        warningCard2.classList.remove("d-none");
        warningText2.innerText = responseData.message;
      }
    };

    fetchMethod(
      currentUrl + `/api/tasks/edit/${taskId}`,
      callback,
      "PUT",
      data,
      localStorage.getItem("token")
    );
  }

  // delete function
  function deleteEdit() {
    const taskId = document
      .getElementById("editForm")
      .getAttribute("data-task-id");

    // confirmation
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this task?"
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
        currentUrl + `/api/tasks/delete/${taskId}`,
        callback,
        "DELETE",
        null,
        localStorage.getItem("token")
      );
    }
  }
});

// for create and edit tasks only those who loged in can
document.addEventListener("DOMContentLoaded", function () {
  const addTaskButton = document.getElementById("addTask");

  // Check if token exists in local storage
  const token = localStorage.getItem("token");
  if (!token) {
    // Token does not exist, button leads user to log in page
    addTaskButton.addEventListener("click", function () {
      console.log("Access Denied. Redirecting to login page...");
      window.location.href = currentUrl + "/login.html";
    });
  } else {
    // Token exists, allow access
    addTaskButton.addEventListener("click", function () {
      console.log("Access Granted");
    });
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const addTaskForm = document.getElementById("addTaskForm");
  const warningCard = document.getElementById("warningCard");
  const warningText = document.getElementById("warningText");

  addTaskForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const points = document.getElementById("points").value;

    const callback = (responseStatus, responseData) => {
      console.log("responseStatus:", responseStatus);
      console.log("responseData:", responseData);
      if (responseStatus == 201) {
        console.log("Task added successfully");
        console.log("Title:", title);
        console.log("Description:", description);
        console.log("Points:", points);
        warningCard.classList.add("d-none");
        // reload page
        window.location.reload();
      } else {
        warningCard.classList.remove("d-none");
        warningText.innerText = responseData.message;
      }
    };

    const data = {
      title: title,
      description: description,
      points: points,
    };

    // Perform add task request
    fetchMethod(
      currentUrl + "/api/tasks/add",
      callback,
      "POST",
      data,
      localStorage.getItem("token")
    );

    // Reset the form fields
    addTaskForm.reset();
  });
});

// close buttn resets warning box

function myFunction() {
  warningCard.classList.add("d-none");
}
