const express = require("express");
const {
  createChat,
  findChat,
  findUserChats,
} = require("../Controllers/chatController");
const router = express.Router();

router.post("/", createChat);
router.post("/:userId", findUserChats);
router.post("/find/:firstId/:secondId", findChat);
module.exports = router;
