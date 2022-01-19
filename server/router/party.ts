import express from "express";
const router = express.Router();
import {
  getPartyInfo, dismissParty, createSubComment, createComment, deleteComment, deleteSubComment, enqueue, 
  dequeue, modifyMessage, approveMember, quitParty, fullParty, completeParty, reviewMembers, reParty, modifyPartyInfo
} from "../controllers/party";

router.get("/:partyId/:userId", getPartyInfo);
router.patch("/edit/:partyId", modifyPartyInfo);
router.delete("/:partyId", dismissParty);
router.post("/:commentId/subComment", createSubComment);
router.post("/:partyId/comment", createComment);
router.delete("/comment/:commentId", deleteComment);
router.delete("/subComment/:subCommentId", deleteSubComment);
router.post("/enqueued", enqueue);
router.patch("/message", modifyMessage);
router.post("/approval", approveMember);
router.delete("/dequeued/:partyId/:action/:userId", dequeue);
router.delete("/quit/:partyId/:action/:userId", quitParty);
router.patch("/fullParty", fullParty);
router.patch("/reparty", reParty);
router.patch("/completed", completeParty);
router.patch("/review", reviewMembers);

export = router;