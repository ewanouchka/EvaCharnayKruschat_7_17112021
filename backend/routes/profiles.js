// import express et router
const express = require("express");
const router = express.Router();

// on récupère le middleware d'authentification
const auth = require("../middleware/auth");

// on récupère les fonctions dans les controllers > users
const profileCtrl = require("../controllers/profiles");

// on crée les routes
router.post("/", auth, profileCtrl.getUserProfile); // à revoir
router.put("/", auth, profileCtrl.updateUserProfile); // à revoir
router.delete("/", auth, profileCtrl.deleteUserProfile); // à revoir

module.exports = router;
