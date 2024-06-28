// ##############################################################
// REQUIRE MODULES
// ##############################################################
const model = require("../models/inventoryModel");

// check if champion req is enough to purchase weapon
module.exports.checkLevel = (req, res, next) => {
  const data = {
    champion_id: req.params.champion_id,
    item_id: req.params.item_id,
  };

  const callbackChampion = (errorChampion, resultsChampion, fieldsChampion) => {
    if (errorChampion) {
      res.status(500).json({ message: "Internal server error" });
    } else if (resultsChampion.length === 0) {
      res.status(404).json({
        message: "Champion not found",
      });
    } else {
      const level = resultsChampion[0].level;

      // check level_requirement for the item
      model.checkLevelShop(
        data,
        level,
        (errorShop, resultsShop, fieldsShop) => {
          if (errorShop) {
            res.status(500).json({ message: "Internal server error" });
          } else if (resultsShop.length === 0) {
            res.status(404).json({
              message: "Item not found in shop",
            });
          } else {
            const levelRequirement = resultsShop[0].level_requirement;

            // check if champion level meet level_req to purchase the item
            if (level < levelRequirement) {
              res.status(400).json({
                message: "Level requirement not met to purchase the item",
              });
            } else {
              next();
            }
          }
        }
      );
    }
  };

  model.checkLevelChampion(data, callbackChampion);
};

// chack if champion has enough gold for item
module.exports.checkGold = (req, res, next) => {
  const data = {
    champion_id: req.params.champion_id,
    item_id: req.params.item_id,
  };

  const callbackChampion = (errorChampion, resultsChampion, fieldsChampion) => {
    if (errorChampion) {
      res.status(500).json({ message: "Internal server error" });
    } else if (resultsChampion.length === 0) {
      res.status(404).json({
        message: "Champion not found",
      });
    } else {
      const gold = resultsChampion[0].gold;

      // check gold requirement for the item
      model.checkGoldShop(data, gold, (errorShop, resultsShop, fieldsShop) => {
        if (errorShop) {
          res.status(500).json({ message: "Internal server error" });
        } else if (resultsShop.length === 0) {
          res.status(404).json({
            message: "Item not found in the shop",
          });
        } else {
          const itemPrice = resultsShop[0].price;

          // check if champion has enough gold to purchase the item
          if (gold < itemPrice) {
            res.status(400).json({
              message: "Not enough gold to purchase the item",
            });
          } else {
            next();
          }
        }
      });
    }
  };

  model.checkGoldChampion(data, callbackChampion);
};

// adds item then deletes item from shop and deducts gold from champ
module.exports.addItem = (req, res, next) => {
  const data = {
    champion_id: req.params.champion_id,
    item_id: req.params.item_id,
  };

  const callbackChampion = (errorChampion, resultsChampion, fieldsChampion) => {
    if (errorChampion) {
      res.status(500).json({ message: "Internal server error" });
    } else if (resultsChampion.length === 0) {
      res.status(404).json({
        message: "Champion not found",
      });
    } else {
      const championGold = resultsChampion[0].gold;

      // get the item from the shop
      model.takeItemShop(data, (errorShop, resultsShop, fieldsShop) => {
        if (errorShop) {
          res.status(500).json({ message: "Internal server error" });
        } else if (resultsShop.length === 0) {
          res.status(404).json({
            message: "Item not found in the shop",
          });
        } else {
          const item = resultsShop[0];
          const itemPrice = item.price;
          const itemName = item.name;

          // double check again if champion has enough gold to purchase the item (Second measure against invalid purchase)
          if (championGold < itemPrice) {
            res.status(400).json({
              message: "Not enough gold to purchase the item",
            });
          } else {
            // adds the item into champions inventory
            model.addItemToInventory(data, item, (errorAdd) => {
              if (errorAdd) {
                res.status(500).json({ message: "Internal server error" });
              } else {
                // then proceeds to delete the item from the shop
                model.deleteItem(data, (errorDelete) => {
                  if (errorDelete) {
                    res.status(500).json({ message: "Internal server error" });
                  } else {
                    // lastly payment is done so deducts gold from the champion
                    model.deductGold(data, itemPrice, (errorDeduct) => {
                      if (errorDeduct) {
                        res
                          .status(500)
                          .json({ message: "Internal server error" });
                      } else {
                        // if all goes well res
                        res.status(200).json({
                          message: `Gold deducted: ${itemPrice}, ${itemName} added to inventory`,
                        });
                      }
                    });
                  }
                });
              }
            });
          }
        }
      });
    }
  };

  // to get model to check gold from before
  model.checkGoldChampion(data, callbackChampion);
};

// get champions inventory
module.exports.getAllItem = (req, res, next) => {
  const data = {
    champion_id: req.params.champion_id,
  };

  const callback = (error, results, fields) => {
    if (error) {
      console.error("Error getAllItem:", error);
      res.status(500).json({ message: "Internal server error." });
    } else {
      if (results.length == 0) {
        res.status(404).json({
          message: "Champion not found",
        });
      } else res.status(200).json(results);
    }
  };

  model.getAllItem(data, callback);
};

// show inventory weapons for champion
module.exports.weapons = (req, res, next) => {
  if (!req.params.champion_id) {
    return res.status(400).json({ message: "Missing required data" });
  }

  const data = {
    champion_id: req.params.champion_id,
  };

  const callback = (error, results) => {
    if (error) {
      console.error("Error getting weapons:", error);
      return res.status(500).json({ message: "Internal server error." });
    }

    if (results.length === 0) {
      return res.status(404).json({
        message: "No weapons found",
      });
    }

    return res.status(200).json(results);
  };

  model.getAllWeapons(data, callback);
};

// show inventory armors for champion
module.exports.armors = (req, res, next) => {
  if (!req.params.champion_id) {
    return res.status(400).json({ message: "Missing required data" });
  }

  const data = {
    champion_id: req.params.champion_id,
  };

  const callback = (error, results) => {
    if (error) {
      console.error("Error getting armors:", error);
      return res.status(500).json({ message: "Internal server error." });
    }

    if (results.length === 0) {
      return res.status(404).json({
        message: "No aromors found",
      });
    }

    return res.status(200).json(results);
  };

  model.getAllArmors(data, callback);
};

// show inventory armors for champion
module.exports.stats = (req, res, next) => {
  if (!req.params.champion_id) {
    return res.status(400).json({ message: "Missing required data" });
  }

  const data = {
    champion_id: req.params.champion_id,
  };

  const callback = (error, results) => {
    if (error) {
      console.error("Error getting stats:", error);
      return res.status(500).json({ message: "Internal server error." });
    }

    if (results.length === 0) {
      return res.status(404).json({
        message: "No stats found",
      });
    }

    return res.status(200).json(results);
  };

  model.getAllStats(data, callback);
};
