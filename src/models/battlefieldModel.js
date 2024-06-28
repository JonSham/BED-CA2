// ##############################################################
// REQUIRE MODULES
// ##############################################################
const pool = require("../services/db");

// check if beast is Alive or Defeated
module.exports.checkBeastStatus = (data, callback) => {
  const qs = `
      SELECT status
      FROM Beast
      WHERE beast_id = ?;
    `;

  const values = [data.beast_Id];

  pool.query(qs, values, callback);
};
// if Alive carries on to create battlefield
module.exports.insertBattlefield = (data, callback) => {
  const qs = `
      INSERT INTO Battlefield (champion_id, beast_id, champion_name, beast_name, champion_damage, beast_damage, champion_health, beast_health, exp_drop, gold_drop)
      SELECT
        ? AS champion_id,
        ? AS beast_id,
        c.name AS champion_name,
        b.name AS beast_name,
        c.damage AS champion_damage,
        b.damage AS beast_damage,
        c.health AS champion_health,
        b.health AS beast_health,
        b.exp_drop,
        b.gold_drop
      FROM Champion c
      JOIN Beast b ON b.beast_id = ?
      WHERE c.champion_id = ?;
    `;

  const values = [
    data.champion_Id,
    data.beast_Id,
    data.beast_Id,
    data.champion_Id,
  ];

  pool.query(qs, values, callback);
};

// to get names for message
module.exports.retrieveNames = (championId, beastId, callback) => {
  const qs = `
      SELECT
        c.name AS champion_name,
        b.name AS beast_name
      FROM Champion c
      JOIN Beast b ON b.beast_id = ?
      WHERE c.champion_id = ?;
    `;

  const values = [beastId, championId];

  pool.query(qs, values, callback);
};

// for the battle
module.exports.battle = (data, callback) => {
  const qs = `SELECT * FROM battlefield WHERE battle_id = ?`;

  const VALUES = [data.battle_id];

  pool.query(qs, VALUES, callback);
};

// level gain from victory
module.exports.levelGain = (data, callback) => {
  const qs = `SELECT * FROM battlefield Where battle_id = ?`;

  const VALUES = [data.battle_id];

  pool.query(qs, VALUES, callback);
};

// update champion stats
module.exports.updateStats = (data, callback) => {
  const qs = `
  UPDATE Champion
  JOIN Battlefield ON Champion.champion_id = Battlefield.champion_id
  SET
    Champion.gold = Champion.gold + Battlefield.gold_drop,
    Champion.level = Champion.level + Battlefield.exp_drop
  WHERE Champion.champion_id = ? AND Battlefield.battle_id = ?;
  ;
    `;

  const VALUES = [data.champion_id, data.battle_id];

  pool.query(qs, VALUES, callback);
};

// change status to defeated
module.exports.changeStatus = (data, callback) => {
  const qs = `
    UPDATE Beast
    SET status = 'Defeated'
    WHERE beast_id = ?;
  `;

  const VALUES = [data.beast_id];

  pool.query(qs, VALUES, callback);
};

// delete row
module.exports.deleteRow = (data, callback) => {
  const qs = `
    DELETE FROM Battlefield
    WHERE battle_id = ?;
  `;

  const VALUES = [data.battle_id];
  pool.query(qs, VALUES, callback);
};
