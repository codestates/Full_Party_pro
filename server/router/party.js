const express = require("express");
const router = express.Router();
const {
  getPartyInfo, deleteParty, createSubcomment, createComment, deleteComment, deleteSubcomment,
  enqueue, dequeue, modifyMessage, approveMember, quitParty, fullParty, completeParty, reviewMembers
} = require("../controllers/party");

router.get("/:partyId", getPartyInfo);
router.delete("/:partyId", deleteParty);
router.post("/:commentId/subcomment", createSubcomment);
router.post("/:partyId/comment", createComment);
router.delete("/:partyId/comment", deleteComment);
router.delete("/subcomment/:subcommentId", deleteSubcomment);
router.post("/enqueued", enqueue);
router.patch("/message", modifyMessage);
router.post("/approval", approveMember);
router.delete("/dequeued/:partyId/:userId", dequeue);
router.delete("/quit/:partyId/:userId", quitParty);
router.patch("/fullParty", fullParty);
router.patch("/completed", completeParty);
router.patch("/review", reviewMembers);

module.exports = router;