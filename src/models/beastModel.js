// ##############################################################
// REQUIRE MODULES
// ##############################################################
const pool = require("../services/db");

// read all beast
module.exports.readAllBeast = (callback) => {
  const SQLSTATMENT = `
      SELECT * FROM beast;
      `;

  pool.query(SQLSTATMENT, callback);
};
