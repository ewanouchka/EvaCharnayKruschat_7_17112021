// import express et router
const express = require("express");
const router = express.Router();

// on récupère le middleware d'authentification
const auth = require("../middleware/auth");

// on récupère les fonctions dans les controllers > users
const userCtrl = require("../controllers/users");

// on crée les routes
router.post("/signup", userCtrl.signup);
router.post("/login", userCtrl.login);
router.get("/account", auth, userCtrl.getUserProfile); // à revoir
router.put("/account", auth, userCtrl.updateUserProfile); // à revoir
router.delete("/account", auth, userCtrl.deleteUserProfile); // à revoir

module.exports = router;
