// ##############################################################
// REQUIRE MODULES
// ##############################################################
const express = require("express");
const controller = require("../controllers/taskController");
const jwtMiddleware = require("../middlewares/jwtMiddleware");

// ##############################################################
// CREATE ROUTER
// ##############################################################
const router = express.Router();
// ##############################################################
// DEFINE ROUTES
// ##############################################################
router.post("/add", jwtMiddleware.verifyToken, controller.createNewTask);
router.get("/", controller.veiwAllTask);
router.get("/id/:task_id", controller.viewTaskById);
router.put("/edit/:task_id", jwtMiddleware.verifyToken, controller.changeTask);
router.delete(
  "/delete/:task_id",
  jwtMiddleware.verifyToken,
  controller.removeTask
);
// ##############################################################
// EXPORT ROUTER
// ##############################################################
module.exports = router;
