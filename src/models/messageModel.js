// ##############################################################
// REQUIRE MODULES
// ##############################################################
const pool = require("../services/db");

// new message
// create new task
module.exports.insertNewMessage = (data, callback) => {
  const qs = `
      INSERT INTO Message (champion_id, name, profile_picture, date, time, message_text)
      SELECT ?, name, profile_picture, ?, ?, ?
      FROM Champion
      WHERE champion_id = ?;
    `;

  const values = [
    data.champion_id,
    data.date,
    data.time,
    data.message_text,
    data.champion_id,
  ];

  pool.query(qs, values, callback);
};

// check if user_id exists
module.exports.checkChampionExistence = (champion_id, callback) => {
  const qs = "SELECT COUNT(*) AS count FROM champion WHERE champion_id = ?";
  const VALUES = [champion_id];

  pool.query(qs, VALUES, (error, results, fields) => {
    if (error) {
      callback(error);
    } else {
      const championExists = results.length > 0 && results[0].count > 0;
      callback(null, championExists);
    }
  });
};

// read all messages
module.exports.readAllMessages = (callback) => {
  const SQLSTATMENT = `
  SELECT date, time, message_text, champion.champion_id, champion.name FROM message
        left join champion on champion.champion_id = message.champion_id;
        `;

  pool.query(SQLSTATMENT, callback);
};
