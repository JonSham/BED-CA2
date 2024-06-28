// ##############################################################
// REQUIRE MODULES
// ##############################################################
const express = require("express");
const controller = require("../controllers/messageController");
const jwtMiddleware = require("../middlewares/jwtMiddleware");

// ##############################################################
// CREATE ROUTER
// ##############################################################
const router = express.Router();
// ##############################################################
// DEFINE ROUTES
// ##############################################################
router.post("/add", jwtMiddleware.verifyToken, controller.createNewMessage);
router.get("/view", controller.viewAllMessages);
// ##############################################################
// EXPORT ROUTER
// ##############################################################
module.exports = router;
