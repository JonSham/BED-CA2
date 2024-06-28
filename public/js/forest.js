// get beasts
document.addEventListener("DOMContentLoaded", function () {
  const tokens = localStorage.getItem("token")?.split(".");
  const champion_id = tokens ? JSON.parse(atob(tokens[1])).userId : null;

  const data = {
    champion_id: champion_id,
  };

  const callback = (responseStatus, responseData) => {
    console.log("responseStatus:", responseStatus);
    console.log("responseData:", responseData);

    const beastList = document.getElementById("beastList");
    responseData.forEach((beast) => {
      const displayItem = document.createElement("div");

      let beastStatusColor = "";
      if (beast.status === "Alive") {
        beastStatusColor = "#00d80c";
      } else {
        beastStatusColor = "#eb0004";
      }

      let beastDiffColor = "";
      if (beast.difficulty === "C") {
        beastDiffColor = "#609624";
      } else if (beast.difficulty === "B") {
        beastDiffColor = "#d4c232";
      } else if (beast.difficulty === "A") {
        beastDiffColor = "#e4781c";
      } else {
        beastDiffColor = "#ab3609";
      }

      displayItem.innerHTML = `
        <div class="col">
          <div class="card shadow-sm" style='color: ${beastDiffColor};'>
            <div class="card-body">
              <div class="d-flex align-items-center">
                <h3 class="mb-0 me-2">${beast.name}</h3>
                <h6 class="mb-0" style="margin-top: 9px">
                  &nbsp;Difficulty: ${beast.difficulty}
                </h6>
              </div>
              <hr />
              <div class="d-flex align-items-center">
                <h4>Beast Status:&nbsp&nbsp;
                  <h4 style='color:${beastStatusColor}'>${beast.status}</h4>
                </h4>
              </div>
              <div class="d-flex align-items-center">
                <h5 class="mb-0 me-2" style="margin-top: 10px; margin-bottom: 15px">
                  Beast Damage: ${beast.damage}
                </h5>
                <h5 class="mb-0 me-2" style="margin-top: 10px; margin-bottom: 15px">
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Beast Health: ${beast.health}
                </h5>
              </div>
              <hr />
              <h4>Beasts Drops</h4>
              <h6 style="margin-top: 20px; margin-bottom: 30px">
                Gold: ${beast.gold_drop}<br />Experience: ${beast.exp_drop}
              </h6>
              <div class="d-flex justify-content-between align-items-center">
                <div class="btn-group">
                  <button
                    type="button"
                    class="btn btn-sm btn-outline-secondary fight-button"
                    data-beast-id="${beast.beast_id}"
                  >
                    Fight
                  </button>
                </div>
                <small class="text-body-secondary">Beast ID: ${beast.beast_id}</small>
              </div>
            </div>
          </div>
        </div>
        `;
      beastList.appendChild(displayItem);
    });

    const fightButtons = document.querySelectorAll(".fight-button");
    fightButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const beastId = button.dataset.beastId;

        // post request to create the battlefield
        fetchMethod(
          currentUrl +
            `/api/battlefields/createBattlefield/${champion_id}/${beastId}`,
          (postResponseStatus, postResponseData) => {
            if (postResponseStatus === 200) {
              console.log(
                "Battlefield created successfully:",
                postResponseData
              );

              // when battlefield is created start the battle
              fetchMethod(
                currentUrl +
                  `/api/battlefields/startBattle/${postResponseData.battle_id}`,
                (putResponseStatus, putResponseData) => {
                  if (putResponseStatus === 200) {
                    console.log(
                      "Battle started successfully:",
                      putResponseData
                    );
                    // if win
                    const winn = new bootstrap.Modal(
                      document.getElementById("winn")
                    );
                    winn.show();
                  } else if (putResponseStatus === 202) {
                    // if lose
                    const losee = new bootstrap.Modal(
                      document.getElementById("losee")
                    );
                    losee.show();
                  } else if (putResponseStatus === 203) {
                    // if draw
                    const draww = new bootstrap.Modal(
                      document.getElementById("draww")
                    );
                    draww.show();
                  } else {
                    console.error("Error starting battle:", putResponseData);
                    alert("Failed to start the battle");
                  }
                },
                "PUT",
                null,
                localStorage.getItem("token")
              );
            } else {
              console.error("Error creating battlefield:", postResponseData);
              alert("Failed to create the battlefield");
            }
          },
          "POST",
          null,
          localStorage.getItem("token")
        );
      });
    });
  };

  fetchMethod(currentUrl + `/api/beasts/view`, callback);
});

// for win reset
var winModal = document.getElementById("winn");

winModal.addEventListener("hidden.bs.modal", function () {
  // reload the page after the modal is closed
  window.location.reload();
});

// for lose reset
var loseModal = document.getElementById("losee");

loseModal.addEventListener("hidden.bs.modal", function () {
  // reload the page after the modal is closed
  window.location.reload();
});

// for draw reset
var drawModal = document.getElementById("draww");

drawModal.addEventListener("hidden.bs.modal", function () {
  // reload the page after the modal is closed
  window.location.reload();
});
