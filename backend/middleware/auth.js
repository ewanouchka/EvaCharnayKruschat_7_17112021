// import des modules pour sécurisation des données
const jwt = require("jsonwebtoken");

// import variables environnementales
const dotEnv = require("dotenv");
dotEnv.config();
const dbSecretToken = process.env.TOKEN_SECRET;

// fonction authentification : on vérifie la connexion utilisateur
module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, dbSecretToken);
    const userId = decodedToken.userId;
    const isAdmin = decodedToken.isAdmin;

    // si l'utilisateur n'est pas connecté ou s'il n'est pas le propriétaire du compte, du message ou du commentaire
    // revoir la condition pour inclure les droits admin

    if (
      !userId || // utilisateur non connecté ou token non correctement décodé
      (req.params.id && req.params.id != userId) || // défaut de concordance du paramètre id pour les profils utilisateurs avec l'utilisateur connecté
      (req.body.userId && req.body.userId != userId) || // défaut de concordance du posteur de la requête avec l'utilisateur connecté
      (req.body.messageOwner && req.body.messageOwner != userId) // défaut de concordance entre le créateur du message et l'utilisateur connecté
    ) {
      res.status(403).json({ message: "utilisateur non autorisé" });
    } else {
      next();
      return userId, isAdmin;
    }
  } catch (error) {
    res.status(401).json({ error: "l'authentification a échoué" });
  }
};
