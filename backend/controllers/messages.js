// import opérateur sequelize
const { Op } = require("sequelize");

// import des models
const models = require("../db/models");

// fonctions de vérification des champs des requêtes
const checkTextValidity = (text) => {
  // on supprime les espaces au début et à la fin de la chaîne
  text = text.trim();

  // on bloque si des champs requis sont manquants
  if (!text || text.length <= 3) {
    return text, false;
  } else {
    return text, true;
  }
};

const checkValidityPost = (title, content) => {
  if (!checkTextValidity(title) || !checkTextValidity(content)) {
    throw "La requête n'est pas valide.";
  } else return title, content;
};
const checkValidityEdit = (title, content) => {
  if (!checkTextValidity(title) && !checkTextValidity(content)) {
    throw "La requête n'est pas valide.";
  } else return title, content;
};

// fonction accès aux posts
exports.getMessages = (req, res, next) => {
  // constantes
  const isAdmin = res.locals.isAdmin;
  const userId = parseInt(req.params.userId);
  const offset = parseInt(req.query.offset);

  models.Message.findAll({
    where: { UserId: userId ? userId : { [Op.not]: null } },
    order: [["createdAt", "DESC"]],
    limit: Number.isFinite(userId) ? 3 : 10,
    offset: !isNaN(offset) ? offset : 0,
    include: [
      {
        model: models.User,
        attributes: ["first_name", "last_name"],
      },
    ],
  })
    .then((messages) => {
      if (messages) {
        // on retourne les messages, et l'info admin du User pour l'affichage des fonctionnalités put et delete dans le front
        return res.status(200).json({ messages: messages, isAdmin: isAdmin });
      } else {
        return res.status(404).json({ error: "Aucun message trouvé." });
      }
    })
    .catch(() => {
      return res.status(500).json({ error: "La demande est incorrecte." });
    });
};

exports.getOneMessage = (req, res, next) => {
  // constantes
  const isAdmin = res.locals.isAdmin;
  console.log(req.params.messageId);
  console.log(req.route.path);

  models.Message.findOne({
    where: { id: req.params.messageId },
    include: [
      {
        model: models.User,
        attributes: ["first_name", "last_name"],
      },
      {
        model: models.Comment,
        include: [
          {
            model: models.User,
            attributes: ["first_name", "last_name"],
          },
        ],
      },
    ],
  })
    .then((message) => {
      if (message) {
        // on retourne les messages, et l'info admin du User pour l'affichage des fonctionnalités put et delete dans le front
        return res.status(200).json({ message: message, isAdmin: isAdmin });
      } else {
        return res.status(404).json({ error: "Le message n'a pas été trouvé." });
      }
    })
    .catch(() => {
      return res.status(500).json({ error: "La demande est incorrecte." });
    });
};

// fonction envoi d'un nouveau post
exports.sendMessage = (req, res, next) => {
  // constantes
  const userId = res.locals.userId;

  models.User.findOne({
    where: { id: userId },
  })
    .then(() => {
      checkValidityPost(req.body.title, req.body.content);
      models.Message.create({
        UserId: userId,
        title: req.body.title,
        content: req.body.content,
        attachment: null,
        likes: 0,
      }) // revoir pour intégrer l'ajout d'une image
        .then(() => {
          return res.status(201).json({ message: "Message enregistré !" });
        })
        .catch((err) => {
          return res.status(500).json({ error: "Erreur d'enregistrement du message." });
        });
    })
    .catch((err) => {
      return res.status(500).json({ error: err });
    });
};

// fonction modification d'un post
exports.updateMessage = (req, res, next) => {
  // constantes
  const userId = res.locals.userId;
  const isAdmin = res.locals.isAdmin;

  models.Message.findOne({
    where: { id: req.params.messageId },
  })
    .then((messageFound) => {
      if (!isAdmin && messageFound.UserId != userId) {
        return res.status(403).json({ error: "Utilisateur non autorisé" });
      }

      checkValidityEdit(req.body.title, req.body.content);

      messageFound
        .update({
          title: req.body.title ? req.body.title : messageFound.title,
          content: req.body.content ? req.body.content : messageFound.content,
          attachment: req.body.attachment ? req.body.attachment : messageFound.attachment,
        })
        .then(() => {
          return res.status(201).json({ message: "Message modifié !" });
        })
        .catch(() => {
          return res.status(500).json({ error: "Echec de la mise à jour du message" });
        });
    })
    .catch((err) => {
      if (err) {
        return res.status(500).json({ error: err });
      }
      return res.status(500).json({ error: "L'accès au message a échoué." });
    });
};

// fonction suppression d'un post
// revoir la suppression des commentaires associés avant de supprimer un post
exports.deleteMessage = (req, res, next) => {
  // constantes
  const userId = res.locals.userId;
  const isAdmin = res.locals.isAdmin;

  models.Message.findOne({
    where: { id: req.params.messageId },
  })
    .then((messageFound) => {
      if (!isAdmin && messageFound.UserId != userId) {
        return res.status(403).json({ error: "Utilisateur non autorisé" });
      }
      messageFound
        .destroy({ where: { id: req.params.messageId } })
        .then(() => {
          return res.status(201).json({ message: "Message supprimé !" });
        })
        .catch(() => {
          res.status(500).json({ error: "Echec de la suppression du message" });
        });
    })
    .catch(() => {
      return res.status(500).json({ error: "L'accès au message a échoué." });
    });
};
