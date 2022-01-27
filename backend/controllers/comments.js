// import des models
const models = require("../db/models");

// fonctions de vérification des champs des requêtes
const checkTextValidity = (text) => {
  // on bloque si des champs requis sont manquants
  if (!text) {
    throw "Certains champs ne sont pas remplis.";
  }

  // on supprime les espaces au début et à la fin de la chaîne
  text = text.trim();

  // on bloque aussi si les champs renseignés sont trop courts
  if (text.length <= 3) {
    throw "Le contenu est trop court.";
  }
};

// fonction accès aux posts
exports.getComments = (req, res, next) => {
  models.Comment.findAll({
    order: [["createdAt", "ASC"]],
    where: { MessageId: req.body.messageId },
    include: [
      {
        model: models.User,
        attributes: ["first_name", "last_name"],
      },
    ],
  })
    .then((comments) => {
      if (comments) {
        return res.status(200).json(comments);
      } else {
        return res.status(404).json({ error: "Aucun commentaire trouvé." });
      }
    })
    .catch(() => {
      return res.status(500).json({ error: "La demande est incorrecte." });
    });
};

// fonction envoi d'un nouveau post
exports.sendComment = (req, res, next) => {
  // constantes
  const userId = res.locals.userId;

  models.Message.findOne({
    where: { id: req.body.messageId },
  })
    .then(() => {
      checkTextValidity(req.body.content);

      models.Comment.create({
        UserId: userId,
        MessageId: req.body.messageId,
        content: req.body.content,
        likes: 0,
      })
        .then(() => {
          return res.status(201).json({ message: "Commentaire enregistré !" });
        })
        .catch((err) => {
          return res.status(500).json({ error: "Erreur d'enregistrement du commentaire." });
        });
    })
    .catch((err) => {
      return res.status(500).json({ error: err });
    });
};

// fonction modification d'un post
exports.updateComment = (req, res, next) => {
  // constantes
  const userId = res.locals.userId;
  const isAdmin = res.locals.isAdmin;

  models.Comment.findOne({
    where: { id: req.params.commentId },
  })
    .then((commentFound) => {
      if (!isAdmin && commentFound.UserId != userId) {
        return res.status(403).json({ error: "Utilisateur non autorisé" });
      }

      checkTextValidity(req.body.content);

      commentFound
        .update({
          content: req.body.content,
        })
        .then(() => {
          return res.status(201).json({ message: "Commentaire modifié !" });
        })
        .catch(() => {
          return res.status(500).json({ error: "Echec de la mise à jour du commentaire" });
        });
    })
    .catch((err) => {
      if (err) {
        return res.status(500).json({ error: err });
      }
      return res.status(500).json({ error: "L'accès au commentaire a échoué." });
    });
};

// fonction suppression d'un post
exports.deleteComment = (req, res, next) => {
  // constantes
  const userId = res.locals.userId;
  const isAdmin = res.locals.isAdmin;

  models.Comment.findOne({
    where: { id: req.params.commentId },
  })
    .then((commentFound) => {
      if (!isAdmin && commentFound.UserId != userId) {
        return res.status(403).json({ error: "Utilisateur non autorisé" });
      }
      commentFound
        .destroy({ where: { id: req.params.commentId } })
        .then(() => {
          return res.status(201).json({ message: "Commentaire supprimé !" });
        })
        .catch(() => {
          res.status(500).json({ error: "Echec de la suppression du commentaire" });
        });
    })
    .catch(() => {
      return res.status(500).json({ error: "L'accès au commentaire a échoué." });
    });
};
