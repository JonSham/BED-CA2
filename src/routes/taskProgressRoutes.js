// ##############################################################
// REQUIRE MODULES
// ##############################################################
const express = require("express");
const controller = require("../controllers/taskProgressController");
const jwtMiddleware = require("../middlewares/jwtMiddleware");

// ##############################################################
// CREATE ROUTER
// ##############################################################
const router = express.Router();
// ##############################################################
// DEFINE ROUTES
// ##############################################################
router.post(
  "/add",
  jwtMiddleware.verifyToken,
  controller.createNewTaskProgress
);
router.get("/view/:progress_id", controller.viewTaskProgressById);
router.get("/view", controller.viewAllProgress);
router.put("/edit", jwtMiddleware.verifyToken, controller.changeTaskProgress);
router.delete(
  "/delete/:progress_id",
  jwtMiddleware.verifyToken,
  controller.removeTaskProgress
);
// ##############################################################
// EXPORT ROUTER
// ##############################################################
module.exports = router;
