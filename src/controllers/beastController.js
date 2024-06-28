// ##############################################################
// REQUIRE MODULES
// ##############################################################
const model = require("../models/beastModel");

// read all beast
module.exports.veiwAllBeast = (req, res, next) => {
  const callback = (error, results, fields) => {
    if (error) {
      console.error("Error readAllBeast:", error);
      res.status(500).json(error);
    } else res.status(200).json(results);
  };

  model.readAllBeast(callback);
};
