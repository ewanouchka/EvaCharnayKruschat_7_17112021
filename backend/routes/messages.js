// import express et router
const express = require("express");
const router = express.Router();

// on récupère le middleware d'authentification
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");

// on récupère les fonctions dans les controllers > users
const messageCtrl = require("../controllers/messages");

// on crée les routes
router.get("/", auth, messageCtrl.getMessages);
router.get("/users/:userId", auth, messageCtrl.getMessages);
router.get("/:messageId", auth, messageCtrl.getOneMessage);
router.post("/", auth, multer, messageCtrl.sendMessage);
router.put("/:messageId", auth, multer, messageCtrl.updateMessage);
router.delete("/:messageId", auth, messageCtrl.deleteMessage);

module.exports = router;
