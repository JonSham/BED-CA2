// ##############################################################
// REQUIRE MODULES
// ##############################################################
const model = require("../models/shopModel");

// read all items in shop
module.exports.veiwAllShop = (req, res, next) => {
  const callback = (error, results, fields) => {
    if (error) {
      console.error("Error readAllShop:", error);
      res.status(500).json(error);
    } else res.status(200).json(results);
  };

  model.readAllShop(callback);
};

// read all weapons in shop
module.exports.veiwAllWeapons = (req, res, next) => {
  const callback = (error, results, fields) => {
    if (error) {
      console.error("Error readAllWeapon:", error);
      res.status(500).json(error);
    } else res.status(200).json(results);
  };

  model.readAllWeapons(callback);
};

// read all aarmors in shop
module.exports.veiwAllArmors = (req, res, next) => {
  const callback = (error, results, fields) => {
    if (error) {
      console.error("Error readAllArmor:", error);
      res.status(500).json(error);
    } else res.status(200).json(results);
  };

  model.readAllArmors(callback);
};
