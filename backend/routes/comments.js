// import express et router
const express = require("express");
const router = express.Router();

// on récupère le middleware d'authentification
const auth = require("../middleware/auth");

// on récupère les fonctions dans les controllers > users
const commentCtrl = require("../controllers/comments");

// on crée les routes -- A REVOIR
router.get("/", auth, commentCtrl.getComments);
router.post("/", auth, commentCtrl.sendComment);
router.put("/:commentId", auth, commentCtrl.updateComment);
router.delete("/:commentId", auth, commentCtrl.deleteComment);

module.exports = router;
