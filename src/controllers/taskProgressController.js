// ##############################################################
// REQUIRE MODULES
// ##############################################################
const model = require("../models/taskProgressModel");

// create new task progress
module.exports.createNewTaskProgress = (req, res, next) => {
  const { champion_id, task_id, completion_date, notes } = req.body;

  if (!champion_id || !task_id || !completion_date) {
    res.status(400).json({ message: "Missing required data" });
    return;
  }

  // check if champion_id and task_id exist before creating
  model.checkChampionAndTaskExistence(champion_id, task_id, (error, valid) => {
    if (error) {
      res.status(500).json({ message: "Internal server error" });
      return;
    }

    if (!valid) {
      res.status(404).json({ message: "champion or task not found" });
      return;
    }

    // if champion_id and task_id exist, proceed with creating
    const data = {
      champion_id,
      task_id,
      completion_date,
      notes,
    };

    const callback = (error, results, fields) => {
      if (error) {
        res.status(500).json({ message: "Internal server error" });
      } else {
        res.status(201).json({
          progress_id: results.insertId,
          champion_id: data.champion_id,
          task_id: data.task_id,
          completion_date: data.completion_date,
          notes: data.notes,
        });
      }
    };

    model.insertNewTaskProgress(data, callback);
  });
};

// read task progress by id
module.exports.viewTaskProgressById = (req, res, next) => {
  const data = {
    progress_id: req.params.progress_id,
  };

  const callback = (error, results, fields) => {
    if (error) {
      console.error("Error viewTaskProgressById:", error);
      res.status(500).json({ message: "Internal server error." });
    } else {
      if (results.length === 0) {
        res.status(404).json({
          message: "Task progression not found",
        });
      } else res.status(200).json(results);
    }
  };

  model.readTaskProgressById(data, callback);
};

// update task progression
module.exports.changeTaskProgress = (req, res, next) => {
  if (!req.body.task_id || !req.body.completion_date || !req.body.progress_id) {
    res.status(400).json({ message: "Missing required data" });
    return;
  }

  const data = {
    notes: req.body.notes,
    progress_id: req.body.progress_id,
    task_id: req.body.task_id,
    completion_date: req.body.completion_date,
    title: req.body.title,
  };

  const callback = (error, results, fields) => {
    if (error) {
      console.error("Error updating task progress:", error);
      res.status(500).json({ message: "Internal server error" });
    } else {
      if (results.affectedRows === 0) {
        res.status(404).json({ message: "Progress not found" });
      } else {
        res.status(200).json({
          notes: data.notes,
          progress_id: data.progress_id,
          task_id: data.task_id,
          completion_date: data.completion_date,
          title: data.title,
        });
      }
    }
  };

  model.updateTaskProgress(data, callback);
};

// delete task progress
module.exports.removeTaskProgress = (req, res, next) => {
  const data = {
    progress_id: req.params.progress_id,
  };

  const callback = (error, results, fields) => {
    if (error) {
      console.error("Error deleteTaskProgressById:", error);
      res.status(500).json({ message: "Internal server error." });
    } else {
      if (results.affectedRows == 0) {
        res.status(404).json({
          message: "Task Progression not found",
        });
      } else res.status(204).send(); // 204 No Content
    }
  };

  model.deleteTaskProgress(data, callback);
};

// read all progress
module.exports.viewAllProgress = (req, res, next) => {
  const callback = (error, results, fields) => {
    if (error) {
      console.error("Error readAllProgress:", error);
      res.status(500).json(error);
    } else res.status(200).json(results);
  };
  model.readAllProgress(callback);
};
