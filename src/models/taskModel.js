// ##############################################################
// REQUIRE MODULES
// ##############################################################
const pool = require("../services/db");

// create new task
module.exports.insertNewTask = (data, callback) => {
  const qs = `INSERT INTO task (title, description, points)
    VALUES (?, ?, ?)`;

  const VALUES = [data.title, data.description, data.points];

  pool.query(qs, VALUES, callback);
};

// read all task
module.exports.readAllTask = (callback) => {
  const SQLSTATMENT = `
      SELECT * FROM task;
      `;

  pool.query(SQLSTATMENT, callback);
};

// read task by id
module.exports.readTaskById = (data, callback) => {
  const qs = `SELECT * FROM task WHERE task_id = ?`;

  const VALUES = [data.task_id];

  pool.query(qs, VALUES, callback);
};

// update task
module.exports.updateTask = (data, callback) => {
  const qs = `UPDATE task set title = ?, description = ?, points = ? where task_id = ?`;

  const VALUES = [data.title, data.description, data.points, data.task_id];

  pool.query(qs, VALUES, callback);
};

// delete task
module.exports.deleteTask = (data, callback) => {
  const qs = `
  DELETE FROM task where task_id = ?;
  DELETE FROM taskprogress where task_id = ?;`;

  const VALUES = [data.task_id, data.task_id];

  pool.query(qs, VALUES, callback);
};
