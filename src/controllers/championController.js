// ##############################################################
// REQUIRE MODULES
// ##############################################################
const model = require("../models/championModel");
const pool = require("../services/db");

// read champion by token
module.exports.readChampionByToken = (req, res, next) => {
  const data = {
    userid: res.locals.userId,
  };

  const callback = (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Internal server error" });
    } else {
      res.status(200).send(results);
    }
  };

  pool.query(
    "SELECT * FROM champion WHERE champion_id = ?;",
    [data.userid],
    callback
  );
};

// check for dup champ name
module.exports.checkDupChampion = (req, res, next) => {
  if (!req.body.name || !req.body.email || !req.body.password) {
    return res.status(400).json({ message: "Missing required data" });
  }

  const data = {
    name: req.body.name,
  };

  const callback = (error, results) => {
    if (error) {
      return res.status(500).json({ message: "Internal server error" });
    } else if (results.length !== 0) {
      return res.status(409).json({
        message: "Name is already associated with another champion.",
      });
    }

    next();
  };

  model.checkDuplicateChampion(data, callback);
};

// check for dup champ email
module.exports.checkDupEmail = (req, res, next) => {
  if (!req.body.name || !req.body.email || !req.body.password) {
    return res.status(400).json({ message: "Missing required data" });
  }

  const data = {
    email: req.body.email,
  };

  const callback = (error, results) => {
    if (error) {
      return res.status(500).json({ message: "Internal server error" });
    } else if (results.length !== 0) {
      return res.status(409).json({
        message: "Email is already associated with another champion.",
      });
    }

    next();
  };

  model.checkDuplicateEmail(data, callback);
};

// creates the new champ
module.exports.createNewChampion = (req, res, next) => {
  const data = {
    name: req.body.name,
    email: req.body.email,
    password: res.locals.hash,
  };

  const callback = (error, results) => {
    if (error) {
      return res.status(500).json({ message: "Internal server error" });
    } else {
      res.locals.signupmessage = "New champion added to guild!";
      res.locals.signupchampionId = results.insertId;
      res.locals.signupname = data.name;
      res.locals.signupemail = data.email;
      res.locals.userId = results.insertId;
      next();
    }
  };

  model.insertNewChampion(data, callback);
};

// check if item exists in inventory
module.exports.checkItemExist = (req, res, next) => {
  const data = {
    champion_id: req.params.champion_id,
    item_id: req.params.item_id,
  };

  const callbackChampion = (errorChampion, resultsChampion) => {
    if (errorChampion) {
      res.status(500).json({ message: "Internal server error" });
    } else if (resultsChampion.length === 0) {
      res.status(404).json({
        message: "Champion not found",
      });
    } else {
      // check inventory
      model.checkInventory(data, (errorInventory, resultsInventory) => {
        if (errorInventory) {
          res.status(500).json({ message: "Internal server error" });
        } else if (resultsInventory.length === 0) {
          res.status(404).json({
            message: "Item not found in inventory",
          });
        } else {
          console.log("Item exists in inventory!");
          next();
        }
      });
    }
  };

  model.checkChampion(data, callbackChampion);
};

// equip item
module.exports.equipItem = (req, res, next) => {
  const data = {
    champion_id: req.params.champion_id,
    item_id: req.params.item_id,
  };

  // check if the item is armor or weapon
  model.checkItemType(data, (error, results, fields) => {
    if (error) {
      res.status(500).json({ message: "Internal server error" });
    } else if (results.length === 0) {
      res.status(404).json({
        message: "Item not found",
      });
    } else {
      const itemType = results[0].type;
      const itemName = results[0].name;

      // reset champion base damage before equipping new weapon
      if (itemType === "weapon") {
        model.resetDamage(data, (errorReset) => {
          if (errorReset) {
            res.status(500).json({ message: "Internal server error" });
          } else {
            console.log("Base damage reset successfully!");
          }
        });
      }

      // reset champion base health before equipping new armor
      else if (itemType === "armor") {
        model.resetHealth(data, (errorReset) => {
          if (errorReset) {
            res.status(500).json({ message: "Internal server error" });
          } else {
            console.log("Base health reset successfully!");
          }
        });
      }

      // update champion health based on item_protection
      if (itemType === "armor") {
        model.equipArmor(data, (errorEquip) => {
          if (errorEquip) {
            res.status(500).json({ message: "Internal server error" });
          } else {
            console.log("Armor equipped successfully!");
            res
              .status(200)
              .json({ message: `${itemName} has been equipped successfully!` });
          }
        });
      } // update champion damage based on item_damage
      else if (itemType === "weapon") {
        model.equipWeapon(data, (errorEquip) => {
          if (errorEquip) {
            res.status(500).json({ message: "Internal server error" });
          } else {
            console.log("Weapon equipped successfully!");
            res
              .status(200)
              .json({ message: `${itemName} has been equipped successfully!` });
          }
        });
      } else {
        // bad request just incase bad item type gets added
        res.status(400).json({ message: "Invalid item type" });
      }
    }
  });
};

// Unequip item
module.exports.unequipItem = (req, res, next) => {
  const data = {
    champion_id: req.params.champion_id,
    choice: req.params.choice,
  };

  const callbackChampion = (errorChampion, resultsChampion) => {
    if (errorChampion) {
      res.status(500).json({ message: "Internal server error" });
    } else if (resultsChampion.length === 0) {
      res.status(404).json({
        message: "Champion not found",
      });
    } else {
      if (data.choice === "1") {
        // model to update champion, set armor_equipped to 'none', and health to 100 where champion_id = ?
        model.unequipArmor(data, (errorUnequip, resultsUnequip) => {
          if (errorUnequip) {
            res.status(500).json({ message: "Internal server error" });
          } else {
            res.status(200).json({ message: "Armor unequipped successfully!" });
          }
        });
      } else if (data.choice === "2") {
        // model to update champion, set weapon_equipped to 'none', and damage to 15 where champion_id = ?
        model.unequipWeapon(data, (errorUnequip, resultsUnequip) => {
          if (errorUnequip) {
            res.status(500).json({ message: "Internal server error" });
          } else {
            res
              .status(200)
              .json({ message: "Weapon unequipped successfully!" });
          }
        });
      } else {
        // invalid option
        res.status(400).json({
          message:
            "Please choose a valid option: 1 to unequip armor and 2 to unequip weapon",
        });
      }
    }
  };

  model.checkChampion(data, callbackChampion);
};

// read all champion
module.exports.veiwAllChampion = (req, res, next) => {
  const callback = (error, results, fields) => {
    if (error) {
      console.error("Error readAllChampion:", error);
      res.status(500).json(error);
    } else res.status(200).json(results);
  };

  model.readAllChampion(callback);
};

// delete champion
module.exports.removeChampion = (req, res, next) => {
  const data = {
    champion_id: req.params.champion_id,
  };

  const callback = (error, results, fields) => {
    if (error) {
      console.error("Error deleteChampionByChampion_Id:", error);
      res.status(500).json({ message: "Internal server error." });
    } else {
      if (results[0].affectedRows == 0) {
        res.status(404).json({
          message: "Champion not found",
        });
      } else res.status(204).send(); // 204 No Content
    }
  };

  model.deleteChampion(data, callback);
};

// for logging into acc
module.exports.login = (req, res, next) => {
  if (!req.body.email || !req.body.password) {
    res.status(400).json({ message: "Missing required data" });
    return;
  }

  const data = {
    email: req.body.email,
    password: req.body.password,
  };

  const callback = (error, results) => {
    if (error) {
      console.error("Error login:", error);
      res.status(500).json({ message: "Internal server error." });
    } else if (results.length == 0) {
      res.status(404).json({ message: "Account not found" });
    } else {
      res.locals.hash = results[0].password;
      res.locals.userId = results[0].champion_id;
      res.locals.loginmessage = "Login successful!";
      next();
    }
  };

  model.login(data, callback);
};

// update cham name
module.exports.changeChampName = (req, res, next) => {
  const data = {
    champion_id: req.params.champion_id,
    name: req.body.name,
  };

  // if no duplicate name proceed with update
  const callback = (error, results) => {
    if (error) {
      res.status(500).json({ message: "Internal server error" });
    } else if (results.affectedRows === 0) {
      res.status(404).json({
        message: "Champion not found",
      });
    } else {
      res.status(200).json({
        name: data.name,
      });
    }
  };

  model.updateChamp(data, callback);
};

// check for dup champ name (Put)
module.exports.checkDupChampionPut = (req, res, next) => {
  if (!req.body.name) {
    return res.status(400).json({ message: "Missing required data" });
  }

  const data = {
    name: req.body.name,
    champion_id: req.params.champion_id,
  };

  const callback = (error, results) => {
    if (error) {
      return res.status(500).json({ message: "Internal server error" });
    } else if (results.length !== 0) {
      return res.status(409).json({
        message: "Name is already associated with another champion.",
      });
    }

    next();
  };

  model.checkDuplicateChampionPut(data, callback);
};

// check for dup champ email (Put)
module.exports.checkDupEmailPut = (req, res, next) => {
  if (!req.body.email) {
    return res.status(400).json({ message: "Missing required data" });
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(req.body.email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }
  }

  const data = {
    email: req.body.email,
    champion_id: req.params.champion_id,
  };

  const callback = (error, results) => {
    if (error) {
      return res.status(500).json({ message: "Internal server error" });
    } else if (results.length !== 0) {
      return res.status(409).json({
        message: "Email is already associated with another champion.",
      });
    }

    next();
  };

  model.checkDuplicateEmailPut(data, callback);
};

// update cham email
module.exports.changeChampEmail = (req, res, next) => {
  const data = {
    champion_id: req.params.champion_id,
    email: req.body.email,
  };

  // if no duplicate email proceed with update
  const callback = (error, results) => {
    if (error) {
      res.status(500).json({ message: "Internal server error" });
    } else if (results.affectedRows === 0) {
      res.status(404).json({
        message: "Champion not found",
      });
    } else {
      res.status(200).json({
        email: data.email,
      });
    }
  };

  model.updateChampEmail(data, callback);
};

// read champion by id
module.exports.readChampById = (req, res, next) => {
  const data = {
    champion_id: req.params.champion_id,
  };

  const callback = (error, results, fields) => {
    if (error) {
      console.error("Error viewChampionById:", error);
      res.status(500).json({ message: "Internal server error." });
    } else {
      if (results.length === 0) {
        res.status(404).json({
          message: "Champion not found",
        });
      } else res.status(200).json(results);
    }
  };

  model.readChampById(data, callback);
};

// update cham pfp
module.exports.changePfp = (req, res, next) => {
  if (!req.body.champion_id || !req.body.profile_picture) {
    return res.status(400).json({ message: "Missing required data" });
  }

  const data = {
    champion_id: req.body.champion_id,
    profile_picture: req.body.profile_picture,
  };

  // if no duplicate name proceed with update
  const callback = (error, results) => {
    if (error) {
      res.status(500).json({ message: "Internal server error" });
    } else if (results.affectedRows === 0) {
      res.status(404).json({
        message: "Champion not found",
      });
    } else {
      res.status(200).json({
        message: "Profile picture updated successfully!",
      });
    }
  };

  model.updateChampPfp(data, callback);
};
