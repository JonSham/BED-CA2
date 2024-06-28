// ##############################################################
// REQUIRE MODULES
// ##############################################################
const pool = require("../services/db");

// read all items in shop
module.exports.readAllShop = (callback) => {
  const qs = `
      SELECT * FROM shop;
      `;

  pool.query(qs, callback);
};

// read all weapons in shop
module.exports.readAllWeapons = (callback) => {
  const qs = `
      SELECT * FROM shop where type = 'weapon';
      `;

  pool.query(qs, callback);
};

// read all weapons in shop
module.exports.readAllArmors = (callback) => {
  const qs = `
      SELECT * FROM shop where type = 'armor';
      `;

  pool.query(qs, callback);
};
