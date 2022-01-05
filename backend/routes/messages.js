// import express et router
const express = require("express");
const router = express.Router();

// on récupère le middleware d'authentification
const auth = require("../middleware/auth");

// on récupère les fonctions dans les controllers > users
const messageCtrl = require("../controllers/messages");

// on crée les routes -- A REVOIR
router.get("/", auth, messageCtrl.getMessages);
router.post("/", auth, messageCtrl.sendMessage);
router.put("/:id", auth, messageCtrl.updateMessage);
router.delete("/:id", auth, messageCtrl.deleteMessage);

module.exports = router;
