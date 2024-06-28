// ##############################################################
// REQUIRE MODULES
// ##############################################################
const pool = require("../services/db");

// create new task progress
module.exports.insertNewTaskProgress = (data, callback) => {
  const qs = `
    INSERT INTO taskprogress (champion_id, task_id, completion_date, notes, name, title)
    VALUES (?, ?, ?, ?, 
      (SELECT name FROM champion WHERE champion_id = ?),
      (SELECT title FROM task WHERE task_id = ?)
    )`;

  const VALUES = [
    data.champion_id,
    data.task_id,
    data.completion_date,
    data.notes,
    data.champion_id,
    data.task_id,
  ];

  pool.query(qs, VALUES, callback);
};

// check if user_id and task_id exists
module.exports.checkChampionAndTaskExistence = (
  champion_id,
  task_id,
  callback
) => {
  const qs =
    "SELECT COUNT(*) AS count FROM champion WHERE champion_id = ?; SELECT COUNT(*) AS count FROM Task WHERE task_id = ?";
  const VALUES = [champion_id, task_id];

  pool.query(qs, VALUES, (error, results, fields) => {
    if (error) {
      callback(error);
    } else {
      const championExists = results[0][0].count > 0;
      const taskExists = results[1][0].count > 0;
      callback(null, championExists && taskExists);
    }
  });
};

// read task progress by id
module.exports.readTaskProgressById = (data, callback) => {
  const qs = `SELECT * FROM taskprogress WHERE progress_id = ?`;

  const VALUES = [data.progress_id];

  pool.query(qs, VALUES, callback);
};

// update task progression
module.exports.updateTaskProgress = (data, callback) => {
  const qs = `
    UPDATE taskprogress
    SET task_id = ?, notes = ?, completion_date = ?, title = (SELECT title FROM task WHERE task_id = ?)
    WHERE progress_id = ?
  `;

  const VALUES = [
    data.task_id,
    data.notes,
    data.completion_date,
    data.task_id,
    data.progress_id,
  ];

  pool.query(qs, VALUES, callback);
};

// untouched details
module.exports.updateDetails = (data, callback) => {
  const qs = `SELECT chanmpion_id, task_id, completion_date FROM taskprogress WHERE progress_id = ?`;

  const VALUES = [data.progress_id];

  pool.query(qs, VALUES, (error, results, fields) => {
    if (error) {
      callback(error);
    } else if (results.length === 0) {
      callback({ message: "Details not found" });
    } else {
      callback(null, results[0]);
    }
  });
};

// delete task progress
module.exports.deleteTaskProgress = (data, callback) => {
  const qs = `
  DELETE FROM taskprogress where progress_id = ?;`;

  const VALUES = [data.progress_id];

  pool.query(qs, VALUES, callback);
};

// read all progress
module.exports.readAllProgress = (callback) => {
  const SQLSTATMENT = `
      SELECT * FROM taskprogress;
      `;

  pool.query(SQLSTATMENT, callback);
};
