// ##############################################################
// REQUIRE MODULES
// ##############################################################
const express = require("express");
const controller = require("../controllers/championController");
const jwtMiddleware = require("../middlewares/jwtMiddleware");
const bcryptMiddleware = require("../middlewares/bcryptMiddleware");
const exampleController = require("../controllers/exampleController");

// ##############################################################
// CREATE ROUTER
// ##############################################################
const router = express.Router();
// ##############################################################
// DEFINE ROUTES
// ##############################################################

// create new acc
router.post(
  "/register",
  controller.checkDupChampion,
  controller.checkDupEmail,
  bcryptMiddleware.hashPassword,
  controller.createNewChampion,
  jwtMiddleware.generateToken,
  jwtMiddleware.sendToken
);

// update champ name
router.put(
  "/updateChampionName/:champion_id",
  jwtMiddleware.verifyToken,
  controller.checkDupChampionPut,
  controller.changeChampName
);

// update champ email
router.put(
  "/updateChampionEmail/:champion_id",
  jwtMiddleware.verifyToken,
  controller.checkDupEmailPut,
  controller.changeChampEmail
);

// equip items
router.put(
  "/equip/:champion_id/:item_id",
  jwtMiddleware.verifyToken,
  controller.checkItemExist,
  controller.equipItem
);

// unequip items
router.put("/unequip/:champion_id/:choice", controller.unequipItem);

// view all champions
router.get("/", controller.veiwAllChampion);

// veiw champion by token
router.get("/token", jwtMiddleware.verifyToken, controller.readChampionByToken);

// read champbyid
router.get("/view/:champion_id", controller.readChampById);

// delete champ
router.delete(
  "/delete/:champion_id",
  jwtMiddleware.verifyToken,
  controller.removeChampion
);

// see if token is valid
router.get(
  "/jwt/verify",
  jwtMiddleware.verifyToken,
  exampleController.showTokenVerified
);

// log into acc
router.post(
  "/login",
  controller.login,
  bcryptMiddleware.comparePassword,
  jwtMiddleware.generateToken,
  jwtMiddleware.sendToken
);

// change pfp
router.put("/changePfp", jwtMiddleware.verifyToken, controller.changePfp);

// ##############################################################
// EXPORT ROUTER
// ##############################################################
module.exports = router;
