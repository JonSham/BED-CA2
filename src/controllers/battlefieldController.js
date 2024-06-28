// ##############################################################
// REQUIRE MODULES
// ##############################################################
const model = require("../models/battlefieldModel");

// Create a new battlefield
module.exports.checkBeastStatus = (req, res, next) => {
  const data = {
    champion_Id: req.params.champion_id,
    beast_Id: req.params.beast_id,
  };

  const callback = (error, results, fields) => {
    if (error) {
      console.error("Error createBattlefield:", error);
      res.status(500).json({ message: "Internal server error." });
    } else {
      if (results.length === 0) {
        res.status(404).json({
          message: "Champion or beast not found",
        });
      } else {
        const beastStatus = results[0].status;

        if (beastStatus === "Defeated") {
          return res.status(400).json({
            message: "The beast is already defeated.",
          });
        } else {
          next();
        }
      }
    }
  };

  model.checkBeastStatus(data, callback);
};

// create the bf
exports.createBattlefield = (req, res, next) => {
  const data = {
    champion_Id: req.params.champion_id,
    beast_Id: req.params.beast_id,
  };

  const insertCallback = (error, results, fields) => {
    if (error) {
      console.error("Error createBattlefield:", error);
      res.status(500).json({ message: "Internal server error." });
    } else {
      if (results.affectedRows == 0) {
        res.status(404).json({
          message: "Champion or beast not found",
        });
      } else {
        // implemwents the retrive name middleware
        model.retrieveNames(
          data.champion_Id,
          data.beast_Id,
          (namesError, namesResult) => {
            if (namesError) {
              console.error("Error retrieving names:", namesError);
              res.status(500).json({ message: "Internal server error." });
            } else {
              // create instance of names
              const championName = namesResult[0].champion_name;
              const beastName = namesResult[0].beast_name;

              res.status(200).json({
                message: `Successfully created battlefield between ${championName} and ${beastName}!`,
                battle_id: results.insertId,
              });
            }
          }
        );
      }
    }
  };

  model.insertBattlefield(data, insertCallback);
};

// to battle to beast
module.exports.battle = (req, res, next) => {
  const data = {
    battle_id: req.params.battle_id,
  };

  const callback = (error, results, fields) => {
    if (error) {
      console.error("Error battle:", error);
      res.status(500).json({ message: "Internal server error." });
    } else {
      if (results.length === 0) {
        res.status(404).json({
          message: "Battlefield not found",
        });
      } else {
        let round = 1;
        let championHealth = results[0].champion_health;
        let beastHealth = results[0].beast_health;
        let beastDamage = results[0].beast_damage;
        let championDamage = results[0].champion_damage;

        function performRound() {
          beastHealth -= championDamage;
          championHealth -= beastDamage;

          console.log(
            `Results of round ${round}, Champion Health: ${championHealth}, Beast Health: ${beastHealth}`
          );
          round += 1;
        }

        while (championHealth > 0 && beastHealth > 0) {
          performRound();
        }

        if (championHealth <= 0 && beastHealth <= 0) {
          console.log("It's a Draw!");
          res.status(203).json({ message: "Stalemate" }),
            model.deleteRow({
              battle_id: req.params.battle_id,
            });
        } else if (championHealth <= 0) {
          console.log("Beast Wins!");
          res.status(202).json({ message: "You Lost :(" }),
            model.deleteRow({
              battle_id: req.params.battle_id,
            });
        } else {
          console.log("Champion Wins!");
          model.levelGain(
            res.status(200).json({
              message: "You Won!",
              level_gained: results[0].exp_drop,
              gold_gained: results[0].gold_drop,
            }),
            model.updateStats({
              //update gold and level for champion
              champion_id: results[0].champion_id,
              battle_id: req.params.battle_id,
            }),
            model.changeStatus({
              // change the status of the beast
              beast_id: results[0].beast_id,
            }),
            model.deleteRow({
              battle_id: req.params.battle_id,
            })
          );
        }
      }
    }
  };

  model.battle(data, callback);
};
