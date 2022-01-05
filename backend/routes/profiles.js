// import express et router
const express = require("express");
const router = express.Router();

// on récupère le middleware d'authentification
const auth = require("../middleware/auth");

// on récupère les fonctions dans les controllers > users
const profileCtrl = require("../controllers/profiles");

// on crée les routes
router.get("/:id", auth, profileCtrl.getUserProfile);
router.put("/:id", auth, profileCtrl.updateUserProfile);
router.delete("/:id", auth, profileCtrl.deleteUserProfile);

module.exports = router;
