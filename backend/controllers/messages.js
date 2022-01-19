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
      res.status(500).json({ error: "la demande est incorrecte." });
    });
};

// fonction envoi d'un nouveau post
exports.sendMessage = (req, res, next) => {
  // on bloque si des champs requis sont manquants
  if (!req.body.title || !req.body.content) {
    res.status(400).json({ error: "Certains champs ne sont pas remplis." });
  }

  // on bloque aussi si les champs renseignés sont trop courts
  if (req.body.title <= 3 || req.body.content <= 3) {
    return res.status(400).json({ error: "Le contenu est trop court." });
  }

  // si c'est ok, on crée le message
  models.User.findOne({
    where: { id: req.body.userId },
  })
    .then(function (userFound) {
      if (userFound) {
        const newMessage = models.Message.create({
          UserId: req.body.userId,
          title: req.body.title,
          content: req.body.content,
          attachment: null,
          likes: 0,
        }) // revoir pour intégrer l'ajout d'une image

          .then((newMessage) => {
            res.status(201).json({ message: "Message enregistré !" });
          })
          .catch((err) => {
            return res.status(500).json({ error: "Erreur d'enregistrement du message." });
          });
      } else {
        res.status(404).json({ error: "Utilisateur non trouvé." });
      }
    })
    .catch(function (err) {
      return res.status(500).json({ error: err });
    });
};

// fonction modification d'un post
exports.updateMessage = (req, res, next) => {
  // on bloque si des champs requis sont manquants
  if (!req.body.title || !req.body.content) {
    res.status(400).json({ error: "Certains champs ne sont pas remplis." });
  }

  // on bloque aussi si les champs renseignés sont trop courts
  if (req.body.title <= 3 || req.body.content <= 3) {
    return res.status(400).json({ error: "Le contenu est trop court." });
  }

  // si c'est ok, on modifie le message
  models.Message.findOne({
    where: { id: req.params.messageId },
  })
    .then(function (messageFound) {
      if (messageFound.UserId != req.body.userId) {
        // modifier le if pour prendre en compte les droits admin
        res.status(403).json({ error: "utilisateur non autorisé" });
        return;
      }
      if (messageFound) {
        messageFound
          .update({
            title: req.body.title ? req.body.title : messageFound.title,
            content: req.body.content ? req.body.content : messageFound.content,
            attachment: req.body.attachment ? req.body.attachment : messageFound.attachment,
          })
          .then(function (messageFound) {
            return res.status(201).json({ message: "Message modifié !" });
          })
          .catch(function (err) {
            res.status(500).json({ error: "échec de la mise à jour du message" });
          });
      } else {
        res.status(404).json({ error: "Message non trouvé." });
      }
    })
    .catch(function (err) {
      return res.status(500).json({ error: err });
    });
};

// fonction suppression d'un post
exports.deleteMessage = (req, res, next) => {
  models.Message.findOne({
    attributes: ["id", "UserId"],
    where: { id: req.params.messageId },
  })
    .then(function (messageFound) {
      if (messageFound.UserId != req.body.userId) {
        // modifier le if pour prendre en compte les droits admin
        res.status(403).json({ error: "utilisateur non autorisé" });
        return;
      }
      if (messageFound) {
        messageFound
          .destroy({ where: { id: req.params.messageId } })
          .then(function () {
            return res.status(201).json({ message: "message supprimé !" });
          })
          .catch(function (err) {
            res.status(500).json({ error: "échec de la suppression du message" });
          });
      } else {
        return res.status(404).json({ error: "message non trouvé" });
      }
    })
    .catch(function () {
      res.status(500).json({ error: "échec de l'accès au message" });
    });
};
