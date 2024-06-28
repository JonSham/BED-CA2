// ##############################################################
// REQUIRE MODULES
// ##############################################################
const model = require("../models/messageModel");

// create new message
module.exports.createNewMessage = (req, res, next) => {
  if (!req.body.date || !req.body.time || !req.body.message_text) {
    res.status(400).json({ message: "Missing required data" });
    return;
  }
  const { champion_id } = req.body;
  // check if champion_id exist before creating
  model.checkChampionExistence(champion_id, (error, valid) => {
    if (error) {
      res.status(500).json({ message: "Internal server error" });
      return;
    }

    if (!valid) {
      res.status(404).json({ message: "champion not found" });
      return;
    }

    const data = {
      champion_id: req.body.champion_id,
      name: req.body.name,
      profile_picture: req.body.profile_picture,
      date: req.body.date,
      time: req.body.time,
      message_text: req.body.message_text,
    };

    const callback = (error, results, fields) => {
      if (error) {
        res.status(500).json({ message: "Internal server error" });
      } else {
        res.status(201).json({
          message: "Message successfully sent!",
        });
      }
    };

    model.insertNewMessage(data, callback);
  });
};

// read all task
module.exports.viewAllMessages = (req, res, next) => {
  const callback = (error, results, fields) => {
    if (error) {
      console.error("Error readAllMessage:", error);
      res.status(500).json(error);
    } else res.status(200).json(results);
  };

  model.readAllMessages(callback);
};
