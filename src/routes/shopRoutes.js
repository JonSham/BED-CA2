// ##############################################################
// REQUIRE MODULES
// ##############################################################
const express = require("express");
const controller = require("../controllers/shopController");

// ##############################################################
// CREATE ROUTER
// ##############################################################
const router = express.Router();
// ##############################################################
// DEFINE ROUTES
// ##############################################################
router.get("/view/weapons", controller.veiwAllWeapons);
router.get("/view/armors", controller.veiwAllArmors);
// ##############################################################
// EXPORT ROUTER
// ##############################################################
module.exports = router;
