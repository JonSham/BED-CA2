// ##############################################################
// REQUIRE MODULES
// ##############################################################
const express = require("express");
const controller = require("../controllers/beastController");

// ##############################################################
// CREATE ROUTER
// ##############################################################
const router = express.Router();
// ##############################################################
// DEFINE ROUTES
// ##############################################################
router.get("/view", controller.veiwAllBeast);
// ##############################################################
// EXPORT ROUTER
// ##############################################################
module.exports = router;
