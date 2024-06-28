// get weapons shop
document.addEventListener("DOMContentLoaded", function () {
  const tokens = localStorage.getItem("token")?.split(".");
  const champion_id = tokens ? JSON.parse(atob(tokens[1])).userId : null;

  const data = {
    champion_id: champion_id,
  };

  const callback = (responseStatus, responseData) => {
    console.log("responseStatus:", responseStatus);
    console.log("responseData:", responseData);

    const weaponShop = document.getElementById("weaponShop");
    responseData.forEach((weapon) => {
      const displayItem = document.createElement("div");

      // text color based on rarity
      let rarityCol = "";
      if (weapon.rarity === "A") {
        rarityCol = "#a800ff";
      } else if (weapon.rarity === "B") {
        rarityCol = "#0041ff";
      } else {
        rarityCol = "#00ff33";
      }

      displayItem.innerHTML = `
      <div class="col">
      <div class="card shadow-sm" style="color: ${rarityCol};">
        <div class="card-body">
          <div class="d-flex align-items-center">
            <h3 class="mb-0 me-2">${weapon.name}</h3>
            <h6 class="mb-0" style="margin-top: 9px">
              &nbsp;Rarity: ${weapon.rarity}
            </h6>
          </div>
          <hr />
          <h5 style="margin-top: 20px; margin-bottom: 15px">
            Damage: ${weapon.item_damage}
          </h5>
          <h6 style="margin-top: 20px; margin-bottom: 15px">
            Cost: ${weapon.price}<br />Level Requirement: ${weapon.level_requirement}
          </h6>
          <div
            class="d-flex justify-content-between align-items-center"
          >
            <div class="btn-group">
              <button
                type="button"
                class="btn btn-sm btn-outline-secondary"
                id="buyWeapon"
                data-item-id="${weapon.item_id}"
              >
                Buy
              </button>
            </div>
            <small class="text-body-secondary">Item ID: 4</small>
          </div>
        </div>
      </div>
    </div>
        `;
      weaponShop.appendChild(displayItem);
    });
  };

  fetchMethod(currentUrl + `/api/shops/view/weapons`, callback);
});

// get armors shop
document.addEventListener("DOMContentLoaded", function () {
  const tokens = localStorage.getItem("token")?.split(".");
  const champion_id = tokens ? JSON.parse(atob(tokens[1])).userId : null;

  const data = {
    champion_id: champion_id,
  };

  const callback = (responseStatus, responseData) => {
    console.log("responseStatus:", responseStatus);
    console.log("responseData:", responseData);

    const armorShop = document.getElementById("armorShop");
    responseData.forEach((armor) => {
      const displayItem = document.createElement("div");

      // text color based on rarity
      let rarityCol = "";
      if (armor.rarity === "A") {
        rarityCol = "#a800ff";
      } else if (armor.rarity === "B") {
        rarityCol = "#0041ff";
      } else {
        rarityCol = "#00ff33";
      }

      displayItem.innerHTML = `
        <div class="col">
        <div class="card shadow-sm" style="color: ${rarityCol};">
          <div class="card-body">
            <div class="d-flex align-items-center">
              <h3 class="mb-0 me-2">${armor.name}</h3>
              <h6 class="mb-0" style="margin-top: 9px">
                &nbsp;Rarity: ${armor.rarity}
              </h6>
            </div>
            <hr />
            <h5 style="margin-top: 20px; margin-bottom: 15px">
              Protection: ${armor.item_protection}
            </h5>
            <h6 style="margin-top: 20px; margin-bottom: 15px">
              Cost: ${armor.price}<br />Level Requirement: ${armor.level_requirement}
            </h6>
            <div
              class="d-flex justify-content-between align-items-center"
            >
              <div class="btn-group">
                <button
                  type="button"
                  class="btn btn-sm btn-outline-secondary"
                  id="buyArmor"
                  data-item-id="${armor.item_id}"
                >
                  Buy
                </button>
              </div>
              <small class="text-body-secondary">Item ID: 4</small>
            </div>
          </div>
        </div>
      </div>
          `;
      armorShop.appendChild(displayItem);
    });
  };

  fetchMethod(currentUrl + `/api/shops/view/armors`, callback);
});

// Buy weapons
const weaponShop = document.getElementById("weaponShop");
weaponShop.addEventListener("click", function (event) {
  const buyButton = event.target.closest("#buyWeapon");
  const tokens = localStorage.getItem("token")?.split(".");
  const champion_id = tokens ? JSON.parse(atob(tokens[1])).userId : null;

  if (buyButton) {
    const itemId = buyButton.dataset.itemId;

    // Request to buy the weapon
    const buyCallback = (responseStatus, responseData) => {
      if (responseStatus === 200) {
        console.log("Weapon bought successfully:", responseData);
        // reload page
        window.location.reload();
      } else if (responseStatus === 400) {
        // if req to buy item not met
        const skillIssue = new bootstrap.Modal(
          document.getElementById("skillIssue")
        );
        skillIssue.show();
      } else {
        console.error("Error buying weapon:", responseData);
        alert("Failed to purchase weapon");
      }
    };

    fetchMethod(
      currentUrl + `/api/inventory/buy/${champion_id}/${itemId}`,
      buyCallback,
      "POST",
      null,
      localStorage.getItem("token")
    );
  }
});

// Buy armors
const armorShop = document.getElementById("armorShop");
armorShop.addEventListener("click", function (event) {
  const buyButton = event.target.closest("#buyArmor");
  const tokens = localStorage.getItem("token")?.split(".");
  const champion_id = tokens ? JSON.parse(atob(tokens[1])).userId : null;

  if (buyButton) {
    const itemId = buyButton.dataset.itemId;

    // Request to buy the armor
    const buyCallback = (responseStatus, responseData) => {
      if (responseStatus === 200) {
        console.log("Armor bought successfully:", responseData);
        // reload page
        window.location.reload();
      } else if (responseStatus === 400) {
        // if req to buy item not met
        const skillIssue = new bootstrap.Modal(
          document.getElementById("skillIssue")
        );
        skillIssue.show();
      } else {
        console.error("Error buying armor:", responseData);
        alert("Failed to purchase armor");
      }
    };

    fetchMethod(
      currentUrl + `/api/inventory/buy/${champion_id}/${itemId}`,
      buyCallback,
      "POST",
      null,
      localStorage.getItem("token")
    );
  }
});
