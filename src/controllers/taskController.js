// ##############################################################
// REQUIRE MODULES
// ##############################################################
const model = require("../models/taskModel");

// create new task
module.exports.createNewTask = (req, res, next) => {
  if (!req.body.title || !req.body.description || !req.body.points) {
    res.status(400).json({ message: "Missing required data" });
    return;
  }

  if (isNaN(req.body.points)) {
    res.status(400).json({ message: "Points must be a number" });
    return;
  }

  const data = {
    title: req.body.title,
    description: req.body.description,
    points: req.body.points,
  };

  const callback = (error, results, fields) => {
    if (error) {
      res.status(500).json({ message: "Internal server error" });
    } else {
      res.status(201).json({
        task_id: results.insertId,
        title: data.title,
        description: data.description,
        points: data.points,
      });
    }
  };

  model.insertNewTask(data, callback);
};

// read all task
module.exports.veiwAllTask = (req, res, next) => {
  const callback = (error, results, fields) => {
    if (error) {
      console.error("Error readAllTask:", error);
      res.status(500).json(error);
    } else res.status(200).json(results);
  };

  model.readAllTask(callback);
};

// read task by id
module.exports.viewTaskById = (req, res, next) => {
  const data = {
    task_id: req.params.task_id,
  };

  const callback = (error, results, fields) => {
    if (error) {
      console.error("Error viewTaskById:", error);
      res.status(500).json({ message: "Internal server error." });
    } else {
      if (results.length === 0) {
        res.status(404).json({
          message: "Task not found",
        });
      } else res.status(200).json(results);
    }
  };

  model.readTaskById(data, callback);
};

// update task
module.exports.changeTask = (req, res, next) => {
  if (!req.body.title || !req.body.description || !req.body.points) {
    res.status(400).json({ message: "Missing required data" });
    return;
  }
  const data = {
    title: req.body.title,
    description: req.body.description,
    points: req.body.points,
    task_id: req.params.task_id,
  };

  const callback = (error, results, fields) => {
    if (error) {
      res.status(500).json({ message: "Internal server error" });
    }
    if (results.affectedRows == 0) {
      // results.affectedRows means nothing is changed
      res.status(404).json({
        message: "Task not found",
      });
    } else {
      res.status(200).json({
        task_id: data.task_id,
        title: data.title,
        description: data.description,
        points: data.points,
      });
    }
  };

  model.updateTask(data, callback);
};

// delete task
module.exports.removeTask = (req, res, next) => {
  const data = {
    task_id: req.params.task_id,
  };

  const callback = (error, results, fields) => {
    if (error) {
      console.error("Error deleteTaskById:", error);
      res.status(500).json({ message: "Internal server error." });
    } else {
      if (results[0].affectedRows == 0) {
        res.status(404).json({
          message: "Task not found",
        });
      } else res.status(204).send(); // 204 No Content
    }
  };

  model.deleteTask(data, callback);
};
