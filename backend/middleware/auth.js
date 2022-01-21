// import des modules pour sécurisation des données
const jwt = require("jsonwebtoken");

// import des models
const models = require("../db/models");

// import variables environnementales
const dotEnv = require("dotenv");
dotEnv.config();
const dbSecretToken = process.env.TOKEN_SECRET;

// fonction authentification : on vérifie la connexion utilisateur

// voir pour vérifier si l'utilisateur est existant en base
module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, dbSecretToken);
    const userId = decodedToken.userId;
    const isAdmin = decodedToken.isAdmin;

    if (
      !userId // utilisateur non connecté ou token non correctement décodé
    ) {
      return res.status(403).json({ message: "Utilisateur non authorisé." });
    }

    // on vérifie que le userId décodé est bien présent en base de données
    models.User.findOne({
      attributes: ["id"],
      where: { id: userId },
    })
      .then(() => {
        res.locals.userId = userId;
        res.locals.isAdmin = isAdmin;
        next();
      })
      .catch(() => {
        return res.status(404).json({ error: "Cet utilisateur n'existe pas." });
      });
  } catch (e) {
    return res.status(401).json({ error: "L'authentification a échoué." });
  }
};
