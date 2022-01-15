// import des modules pour sécurisation des données
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// import des models
const models = require("../db/models");

// fonction accès aux posts
exports.getMessages = (req, res, next) => {
  const limit = parseInt(req.query.limit);
  const offset = parseInt(req.query.offset);
  const order = req.query.order;

  models.Message.findAll({
    order: [order != null ? order.split(":") : ["createdAt", "DESC"]],
    limit: !isNaN(limit) ? limit : 10,
    offset: !isNaN(offset) ? offset : 0,
    include: [
      {
        model: models.User,
        attributes: ["first_name", "last_name"],
      },
    ],
  })
    .then(function (messages) {
      if (messages) {
        res.status(200).json(messages);
      } else {
        res.status(404).json({ error: "aucun message trouvé." });
      }
    })
    .catch(function (err) {
      console.log(err);
      res.status(500).json({ error: "la demande est incorrecte." });
    });
};

// fonction envoi d'un nouveau post
exports.sendMessage = (req, res, next) => {};

// fonction modification d'un post
exports.updateMessage = (req, res, next) => {};

// fonction suppression d'un post
exports.deleteMessage = (req, res, next) => {};
