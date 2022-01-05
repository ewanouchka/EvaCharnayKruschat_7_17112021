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

    // si l'utilisateur n'est pas connecté ou s'il n'est pas le propriétaire du compte, du message ou du commentaire
    // revoir la condition pour inclure les droits admin

    if (!userId || (req.params.id && req.params.id != userId)) {
      res.status(403).json({ message: "utilisateur non autorisé" });
    } else {
      next();
      return userId;
    }
  } catch (error) {
    res.status(401).json({ error: "l'authentification a échoué" });
  }
};
