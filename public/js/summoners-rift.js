function toggleSidePanel() {
  const sidePanel = document.getElementById("sidePanel");
  const backpack = document.getElementById("backpack");

  // toggle the d-none class
  sidePanel.classList.toggle("d-none");
  backpack.classList.add("d-none");
}

function toggleBackpack() {
  const backpack = document.getElementById("backpack");
  const sidePanel = document.getElementById("sidePanel");

  // toggle the d-none class
  backpack.classList.toggle("d-none");
  sidePanel.classList.add("d-none");
}

function openInventory() {
  const inventory = document.getElementById("inventory");
  const sidePanel = document.getElementById("sidePanel");
  const backpack = document.getElementById("backpack");
  const bestiary = document.getElementById("bestiary");

  // remove the d-none class for inventory
  inventory.classList.remove("d-none");

  // hidden
  sidePanel.classList.add("d-none");
  backpack.classList.add("d-none");
  bestiary.classList.add("d-none");
}

function closeInventory() {
  const inventory = document.getElementById("inventory");

  // add the d-none class for inventory
  inventory.classList.add("d-none");
}

function openBestiary() {
  const inventory = document.getElementById("inventory");
  const sidePanel = document.getElementById("sidePanel");
  const backpack = document.getElementById("backpack");
  const bestiary = document.getElementById("bestiary");

  // add the d-none class for bestiary
  bestiary.classList.remove("d-none");

  // hidden
  sidePanel.classList.add("d-none");
  backpack.classList.add("d-none");
  inventory.classList.add("d-none");
}

function closeBestiary() {
  const bestiary = document.getElementById("bestiary");

  // remove the d-none class for bestiary
  bestiary.classList.add("d-none");
}

// get weapons
document.addEventListener("DOMContentLoaded", function () {
  const tokens = localStorage.getItem("token")?.split(".");
  const champion_id = tokens ? JSON.parse(atob(tokens[1])).userId : null;

  const data = {
    champion_id: champion_id,
  };

  const callback = (responseStatus, responseData) => {
    console.log("responseStatus:", responseStatus);
    console.log("responseData:", responseData);

    const weaponList = document.getElementById("weaponList");
    responseData.forEach((weapon) => {
      const displayItem = document.createElement("div");

      // text color based on rarity
      let textColor = "";
      if (weapon.rarity === "A") {
        textColor = "#a800ff";
      } else if (weapon.rarity === "B") {
        textColor = "#0041ff";
      } else {
        textColor = "#00ff33";
      }

      displayItem.innerHTML = `
      <div class="col">
        <div class="card shadow-sm" style="color: ${textColor};">
          <div class="card-body">
            <div class="d-flex align-items-center">
              <h3 class="mb-0 me-2">${weapon.name}</h3>
              <h6 class="mb-0" style="margin-top: 9px">
                &nbsp;Rarity: ${weapon.rarity}
              </h6>
            </div>
            <p class="card-text" style="margin-top: 18px">
              <hr/>
            </p>
            <h5 style="margin-top: 20px; margin-bottom: 15px">Damage: ${weapon.item_damage}</h5>

            <div class="d-flex justify-content-between align-items-center">
              <div class="btn-group">
                <button
                  type="button"
                  class="btn btn-sm btn-outline-secondary"
                  id="equip"
                  data-item-id="${weapon.item_id}"
                >
                  Equip
                </button>
              </div>
              <small class="text-body-secondary">Inventory ID: ${weapon.inventory_id}</small>
            </div>
          </div>
        </div>
      </div>
      `;
      weaponList.appendChild(displayItem);
    });
  };

  fetchMethod(
    currentUrl + `/api/inventory/view/weapons/${champion_id}`,
    callback
  );
});

// get armor
document.addEventListener("DOMContentLoaded", function () {
  const tokens = localStorage.getItem("token")?.split(".");
  const champion_id = tokens ? JSON.parse(atob(tokens[1])).userId : null;

  const data = {
    champion_id: champion_id,
  };

  const callback = (responseStatus, responseData) => {
    console.log("responseStatus:", responseStatus);
    console.log("responseData:", responseData);

    const armorList = document.getElementById("armorList");
    responseData.forEach((armor) => {
      const displayItem = document.createElement("div");

      // text color based on rarity
      let textColor = "";
      if (armor.rarity === "A") {
        textColor = "#a800ff";
      } else if (armor.rarity === "B") {
        textColor = "#0041ff";
      } else {
        textColor = "#00ff33";
      }

      displayItem.innerHTML = `
      <div class="col">
        <div class="card shadow-sm" style="color: ${textColor};">
          <div class="card-body">
            <div class="d-flex align-items-center">
              <h3 class="mb-0 me-2">${armor.name}</h3>
              <h6 class="mb-0" style="margin-top: 9px">
                &nbsp;Rarity: ${armor.rarity}
              </h6>
            </div>
            <p class="card-text" style="margin-top: 18px">
              <hr/>
            </p>
            <h5 style="margin-top: 20px; margin-bottom: 15px">Protection: ${armor.item_protection}</h5>

            <div class="d-flex justify-content-between align-items-center">
              <div class="btn-group">
                <button
                  type="button"
                  class="btn btn-sm btn-outline-secondary"
                  id="equip"
                  data-item-id="${armor.item_id}"
                >
                  Equip
                </button>
              </div>
              <small class="text-body-secondary">Inventory ID: ${armor.inventory_id}</small>
            </div>
          </div>
        </div>
      </div>
      `;
      armorList.appendChild(displayItem);
    });
  };

  fetchMethod(
    currentUrl + `/api/inventory/view/armors/${champion_id}`,
    callback
  );
});

// get stats
document.addEventListener("DOMContentLoaded", function () {
  const tokens = localStorage.getItem("token")?.split(".");
  const championId = tokens ? JSON.parse(atob(tokens[1])).userId : null;

  const callback = (responseStatus, responseData) => {
    console.log("responseStatus:", responseStatus);
    console.log("responseData:", responseData);

    const statsList = document.getElementById("statsList");
    const displayItem = document.createElement("div");

    if (responseData.length > 0) {
      // first element directly
      const stats = responseData[0];

      displayItem.innerHTML = `
      <li>
      <div href="#" class="nav-link link-body-emphasis">
        <img
          src="./images/money.png"
          alt="Gold"
          height="28"
          width="28"
          style="margin-top: -3px"
        />
        &nbsp;Gold: ${stats.gold}
      </div>
    </li>
    <li>
      <div href="#" class="nav-link link-body-emphasis">
        <img
          src="./images/level-up.png"
          alt="Level"
          height="28"
          width="28"
          style="margin-top: -3px"
        />
        &nbsp;Level: ${stats.level}
      </div>
    </li>
    <li>
      <div href="#" class="nav-link link-body-emphasis">
        <img
          src="./images/skull.png"
          alt="Damage"
          height="28"
          width="28"
          style="margin-top: -3px"
        />
        &nbsp;Damage: ${stats.damage}
      </div>
    </li>
    <li>
      <div href="#" class="nav-link link-body-emphasis">
        <img
          src="./images/health.png"
          alt="Health"
          height="25"
          width="25"
          style="margin-top: -3px"
        />
        &nbsp; Health: ${stats.health}
      </div>
    </li>
          `;
    } else {
      displayItem.innerHTML = "No stats available.";
    }

    statsList.appendChild(displayItem);
  };

  fetchMethod(currentUrl + `/api/inventory/view/stats/${championId}`, callback);
});

// equip weapons
const weaponList = document.getElementById("weaponList");
weaponList.addEventListener("click", function (event) {
  const equipButton = event.target.closest("#equip");
  const tokens = localStorage.getItem("token")?.split(".");
  const champion_id = tokens ? JSON.parse(atob(tokens[1])).userId : null;
  if (equipButton) {
    const itemId = equipButton.dataset.itemId;

    // request to equip the weapon
    const equipCallback = (responseStatus, responseData) => {
      if (responseStatus === 200) {
        console.log("Weapon equipped successfully:", responseData);
        // reload page
        window.location.reload();
      } else {
        console.error("Error equipping weapon:", responseData);
        alert("Failed to equip weapon");
      }
    };

    fetchMethod(
      currentUrl + `/api/champions/equip/${champion_id}/${itemId}`,
      equipCallback,
      "PUT",
      null,
      localStorage.getItem("token")
    );
  }
});

// equip armor
const armorList = document.getElementById("armorList");
armorList.addEventListener("click", function (event) {
  const equipButton = event.target.closest("#equip");
  const tokens = localStorage.getItem("token")?.split(".");
  const champion_id = tokens ? JSON.parse(atob(tokens[1])).userId : null;
  if (equipButton) {
    const itemId = equipButton.dataset.itemId;

    // request to equip the armor
    const equipCallback = (responseStatus, responseData) => {
      if (responseStatus === 200) {
        console.log("Armor equipped successfully:", responseData);
        // reload page
        window.location.reload();
      } else {
        console.error("Error equipping armor:", responseData);
        alert("Failed to equip armor");
      }
    };

    fetchMethod(
      currentUrl + `/api/champions/equip/${champion_id}/${itemId}`,
      equipCallback,
      "PUT",
      null,
      localStorage.getItem("token")
    );
  }
});
