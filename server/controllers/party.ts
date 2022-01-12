import { Request, Response } from "express";
import { internalServerError } from "./functions/utility";
import { generateAccessToken, verifyAccessToken, setCookie, clearCookie } from "./functions/token";
import { 
  getPartyInformation, compileComments, createWaitingQueue, deleteWaitingQueue, createNotification, 
  createUserParty, deleteParty, deleteUserParty, findUser, updatePartyState, makeComment, makeSubComment,
  getPartyId, removeComment, removeSubComment, updateUserParty, createNotificationsAtOnce, getMembers,
  updatePartyInformation, updateExpAtOnce,
} from "./functions/sequelize";
import { NotificationAttributes } from "../models/notification";

export const getPartyInfo = async (req: Request, res: Response) => {
  try {
    const { partyId } = req.params;
    const partyInfo = await getPartyInformation(Number(partyId));
    const comments = await compileComments(Number(partyId));
    return res.status(200).json({ message: "Party Information Loaded", partyInfo, comments });
  }
  catch (error) {
    internalServerError(res, error);
  }
};

// API: 바디에 파티 아이디 넣고 유저 아이디 뺴기
export const modifyPartyInfo = async (req: Request, res: Response) => {
  try {
    const { partyId, partyInfo } = req.body;
    const updated = await updatePartyInformation(partyId, partyInfo);
    const editedPartyInfo = await getPartyInformation(partyId);
    if (updated) return res.status(200).json({
      message: "Successfully Edited",
      partyInfo: {
        partyId: editedPartyInfo.id,
        location: editedPartyInfo.location
      }
    });
    return res.status(400).json({ message: "Bad Request" });
  }
  catch (error) {
    internalServerError(res, error);
  }
};

export const enqueue = async (req: Request, res: Response) => {
  try {
    const { userId, partyId, message } = req.body;
    const created = await createWaitingQueue(userId, partyId, message);
    if (created) return res.status(200).json({ message: "Enqueued Successfully" });
    return res.status(400).json({ message: "Bad Request" });
  }
  catch (error) {
    internalServerError(res, error);
  }
};

export const dequeue = async (req: Request, res: Response) => {
  try {
    const { userId, partyId, action } = req.params;
    const deleted = await deleteWaitingQueue(Number(userId), Number(partyId));
    if (action === "deny") {
      const notificationInfo: NotificationAttributes = {
        content: "deny", 
        userId: Number(userId), 
        partyId: Number(partyId),
        isRead: false
      };
      await createNotification(notificationInfo);
    }
    if (deleted) return res.status(200).json({ message: "Dequeued Successfully" });
    return res.status(400).json({ message: "Bad Request" });
  }
  catch (error) {
    internalServerError(res, error);
  }
};

export const approveMember = async (req: Request, res: Response) => {
  try {
    const { userId, partyId } = req.body;
    const created = await createUserParty(userId, partyId);
    const deleted = await deleteWaitingQueue(userId, partyId);
    const party = await getPartyInformation(partyId);
    const notificationInfo: NotificationAttributes = {
      content: "accept", 
      userId, 
      partyId, 
      partyName: party.name,
      isRead: false
    };
    await createNotification(notificationInfo);
    if (created && deleted) return res.status(200).json({ message: "Accepted Successfully" });
    return res.status(400).json({ message: "Bad Request" });
  }
  catch (error) {
    internalServerError(res, error);
  }
};

export const dismissParty = async (req: Request, res: Response) => {
  try {
    const { partyId } = req.params;
    const deleted = await deleteParty(Number(partyId));
    if (deleted) return res.status(200).json({ message: "Successfully Broke Up" });
    return res.status(400).json({ message: "Bad Request" });
  }
  catch (error) {
    internalServerError(res, error);
  }
};

export const quitParty = async (req: Request, res: Response) => {
  try {
    const { userId, partyId, action } = req.params;
    const deleted = await deleteUserParty(Number(userId), Number(partyId));
    const user = await findUser({ id: userId }, [ "userName" ]);
    const party = await getPartyInformation(Number(partyId));
    if (action === "quit") {
      const notificationInfo: NotificationAttributes = {
        content: "quit", 
        userId: Number(party.leaderId), 
        partyId: Number(partyId), 
        userName: user?.userName,
        partyName: party.name,
        isRead: false
      };
      await createNotification(notificationInfo);
    }
    else if (action === "expel") {
      const notificationInfo: NotificationAttributes = {
        content: "expel", 
        userId: Number(userId), 
        partyId: Number(partyId),
        partyName: party.name,
        isRead: false
      };
      await createNotification(notificationInfo);
    }
    if (deleted) return res.status(200).json({ message: "Quit Successfully" });
    return res.status(400).json({ message: "Bad Request" });
  }
  catch (error) {
    internalServerError(res, error);
  }
};

export const fullParty = async (req: Request, res: Response) => {
  try {
    const { partyId } = req.body;
    const updated = await updatePartyState(partyId, 1);
    if (updated) return res.status(200).json({ message: "FULL PARTY!" });
    return res.status(400).json({ message: "Bad Request" });
  }
  catch (error) {
    internalServerError(res, error);
  }
};

export const reParty = async (req: Request, res: Response) => {
  try {
    const { partyId } = req.body;
    const updated = await updatePartyState(partyId, 0);
    if (updated) return res.status(200).json({ message: "reparty..." });
    return res.status(400).json({ message: "Bad Request" });
  }
  catch (error) {
    internalServerError(res, error);
  }
};

export const createComment = async (req: Request, res: Response) => {
  try {
    const { userId, partyId, content } = req.body;
    const comment = await makeComment(userId, partyId, content);
    const user = await findUser({ id: userId }, [ "userName" ]);
    const party = await getPartyInformation(partyId);
    const notificationInfo: NotificationAttributes = {
      content: "question", 
      userId: Number(party.leaderId), 
      partyId, 
      userName: user?.userName,
      partyName: party.name, 
      commentId: comment.id,
      isRead: false,
    };
    await createNotification(notificationInfo);
    if (comment) return res.status(200).json({ message: "Successfully Posted" });
    return res.status(400).json({ message: "Bad Request" });
  }
  catch (error) {
    internalServerError(res, error);
  }
};

export const createSubComment = async (req: Request, res: Response) => {
  try {
    const { userId, commentId, content } = req.body;
    const subComment = await makeSubComment(userId, commentId, content);
    const user = await findUser({ id: userId }, [ "userName" ]);
    const partyId = await getPartyId(commentId);
    const party = await getPartyInformation(Number(partyId));
    console.log("123123123", party);
    if (userId === Number(party.leaderId)) {
      const notificationInfo: NotificationAttributes = {
        content: "answer", 
        userId, 
        partyId: Number(partyId), 
        partyName: party.name, 
        commentId,
        isRead: false
      };
      await createNotification(notificationInfo);
    }
    else {
      const notificationInfo: NotificationAttributes = {
        content: "reply", 
        userId: Number(party.leaderId), 
        partyId: Number(partyId), 
        userName: user?.userName, 
        partyName: party.name, 
        commentId,
        isRead: false
      };
      await createNotification(notificationInfo);
    }
    if (subComment) return res.status(200).json({ message: "Successfully Posted" });
    return res.status(400).json({ message: "Bad Request" });
  }
  catch (error) {
    internalServerError(res, error);
  }
};

export const deleteComment = async (req: Request, res: Response) => {
  try {
    const { commentId } = req.params;
    const deleted = await removeComment(Number(commentId));
    if (deleted) return res.status(200).json({ message: "Successfully Deleted" });
    return res.status(400).json({ message: "Bad Request" });
  }
  catch (error) {
    internalServerError(res, error);
  }
};

export const deleteSubComment = async (req: Request, res: Response) => {
  try {
    const { subCommentId } = req.params;
    const deleted = await removeSubComment(Number(subCommentId));
    if (deleted) return res.status(200).json({ message: "Successfully Deleted" });
    return res.status(400).json({ message: "Bad Request" });
  }
  catch (error) {
    internalServerError(res, error);
  }
};

export const modifyMessage = async (req: Request, res: Response) => {
  try {
    const { userId, partyId, message } = req.body;
    const updated = await updateUserParty(userId, partyId, false, message);
    if (updated) return res.status(200).json({ message: "Message Edited" });
    return res.status(400).json({ message: "Bad Request" });
  }
  catch (error) {
    internalServerError(res, error);
  }
};

export const completeParty = async (req: Request, res: Response) => {
  try {
    const { partyId } = req.body;
    const updated = await updatePartyState(partyId, 2);
    const party = await getPartyInformation(partyId);
    const members = await getMembers(partyId, [ "id" ]);
    const memberIdArr = members.map((item): { userId: number } => ({ userId: item.id }));
    await createNotificationsAtOnce("complete", memberIdArr, partyId, "", party.name);
    if (updated) return res.status(200).json({ message: "Quest Clear!" });
    return res.status(400).json({ message: "Bad Request" });
  }
  catch (error) {
    internalServerError(res, error);
  }
};

export const reviewMembers = async (req: Request, res: Response) => {
  try {
    const { partyId, userId, exp } = req.body;
    const updatedUserParty = await updateUserParty(userId, partyId, true);
    const updatedExp = await updateExpAtOnce(exp);
    if (updatedUserParty && updatedExp) return res.status(200).json({ message: "Review Updated Successfully" });
    return res.status(400).json({ message: "Bad Request" });
  }
  catch (error) {
    internalServerError(res, error);
  }
};
