// ##############################################################
// REQUIRE MODULES
// ##############################################################
const express = require("express");
const controller = require("../controllers/inventoryController");
const jwtMiddleware = require("../middlewares/jwtMiddleware");

// ##############################################################
// CREATE ROUTER
// ##############################################################
const router = express.Router();
// ##############################################################
// DEFINE ROUTES
// ##############################################################
router.post(
  "/buy/:champion_id/:item_id",
  jwtMiddleware.verifyToken,
  controller.checkLevel,
  controller.checkGold,
  controller.addItem
);
router.get("/:champion_id", controller.getAllItem);
router.get("/view/weapons/:champion_id", controller.weapons);
router.get("/view/armors/:champion_id", controller.armors);
router.get("/view/stats/:champion_id", controller.stats);
// ##############################################################
// EXPORT ROUTER
// ##############################################################
module.exports = router;
