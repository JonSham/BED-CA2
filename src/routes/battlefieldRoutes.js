// ##############################################################
// REQUIRE MODULES
// ##############################################################
const express = require("express");
const controller = require("../controllers/battlefieldController");
const jwtMiddleware = require("../middlewares/jwtMiddleware");

// ##############################################################
// CREATE ROUTER
// ##############################################################
const router = express.Router();
// ##############################################################
// DEFINE ROUTES
// ##############################################################
router.post(
  "/createBattlefield/:champion_id/:beast_id",
  jwtMiddleware.verifyToken,
  controller.checkBeastStatus,
  controller.createBattlefield
);
router.put(
  "/startBattle/:battle_id",
  jwtMiddleware.verifyToken,
  controller.battle
);
// ##############################################################
// EXPORT ROUTER
// ##############################################################
module.exports = router;
