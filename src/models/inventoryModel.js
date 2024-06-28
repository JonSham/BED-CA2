// ##############################################################
// REQUIRE MODULES
// ##############################################################
const pool = require("../services/db");

// check if champion is at required level for item
module.exports.checkLevelChampion = (data, callback) => {
  const qs = `
      SELECT level FROM champion WHERE champion_id = ?;
    `;
  const VALUES = [data.champion_id];
  pool.query(qs, VALUES, callback);
};

// check level requirement for the item
module.exports.checkLevelShop = (data, championLevel, callback) => {
  const qs = `
      SELECT level_requirement FROM shop WHERE item_id = ?;
    `;
  const VALUES = [data.item_id];
  pool.query(qs, VALUES, callback);
};

// check if champion has enough gold for item
module.exports.checkGoldChampion = (data, callback) => {
  const qs = `
      SELECT gold FROM champion WHERE champion_id = ?;
    `;
  const VALUES = [data.champion_id];
  pool.query(qs, VALUES, callback);
};

// check gold requirement for the item
module.exports.checkGoldShop = (data, championGold, callback) => {
  const qs = `
      SELECT price FROM shop WHERE item_id = ?;
    `;
  const VALUES = [data.item_id];
  pool.query(qs, VALUES, callback);
};

// add the item from shop into inventory
module.exports.takeItemShop = (data, callback) => {
  const qs = `
      SELECT item_id, name, type, description, rarity, item_damage, item_protection, price 
      FROM shop 
      WHERE item_id = ?;
    `;
  const VALUES = [data.item_id];
  pool.query(qs, VALUES, callback);
};

// add the item into the champion's inventory
module.exports.addItemToInventory = (data, item, callback) => {
  const qs = `
      INSERT INTO inventory (champion_id, item_id, name, type, description, rarity, item_damage, item_protection)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?);
    `;
  const VALUES = [
    data.champion_id,
    item.item_id,
    item.name,
    item.type,
    item.description,
    item.rarity,
    item.item_damage,
    item.item_protection,
  ];
  pool.query(qs, VALUES, callback);
};

// update shop to delete item sold
module.exports.deleteItem = (data, callback) => {
  const qs = `
      DELETE FROM shop WHERE item_id = ?;
    `;
  const VALUES = [data.item_id];
  pool.query(qs, VALUES, callback);
};

// deduct gold from the champion
module.exports.deductGold = (data, itemPrice, callback) => {
  const qs = `
      UPDATE champion SET gold = gold - ? WHERE champion_id = ?;
    `;
  const VALUES = [itemPrice, data.champion_id];
  pool.query(qs, VALUES, callback);
};

// show inventory for champion
module.exports.getAllItem = (data, callback) => {
  const qs = `
  SELECT * FROM inventory where champion_id = ?
  `;

  const VALUES = [data.champion_id];

  pool.query(qs, VALUES, callback);
};

// get weapons
module.exports.getAllWeapons = (data, callback) => {
  const qs =
    "SELECT * FROM inventory WHERE champion_id = ? AND type = 'Weapon';";
  const VALUES = [data.champion_id];

  pool.query(qs, VALUES, callback);
};

// get armor
module.exports.getAllArmors = (data, callback) => {
  const qs =
    "SELECT * FROM inventory WHERE champion_id = ? AND type = 'Armor';";
  const VALUES = [data.champion_id];

  pool.query(qs, VALUES, callback);
};

// get stats
module.exports.getAllStats = (data, callback) => {
  const qs =
    "SELECT damage, health, level, gold FROM champion WHERE champion_id = ?;";
  const VALUES = [data.champion_id];

  pool.query(qs, VALUES, callback);
};
