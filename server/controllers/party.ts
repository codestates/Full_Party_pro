import { Request, Response } from "express";
import { InternalServerError, SuccessfulResponse, FailedResponse } from "./functions/response";
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
    const { partyId, userId } = req.params;
    const partyInfo = await getPartyInformation(Number(partyId), Number(userId));
    const comments = await compileComments(Number(partyId));
    return SuccessfulResponse(res, { message: "Party Information Loaded", partyInfo, comments });
  }
  catch (error) {
    return InternalServerError(res, error);
  }
};

export const modifyPartyInfo = async (req: Request, res: Response) => {
  try {
    const { partyId, partyInfo } = req.body;
    const updated = await updatePartyInformation(partyId, partyInfo);
    const editedPartyInfo = await getPartyInformation(partyId);
    if (updated) return SuccessfulResponse(res, {
      message: "Successfully Edited",
      partyInfo: {
        partyId: editedPartyInfo.id,
        location: editedPartyInfo.location
      }
    });
    return FailedResponse(res, 400, "Bad Request");
  }
  catch (error) {
    InternalServerError(res, error);
  }
}
  
export const enqueue = async (req: Request, res: Response) => {
  try {
    const { userId, partyId, message } = req.body;
    console.log(req.body)
    const created = await createWaitingQueue(userId, partyId, message);
    if (created) return SuccessfulResponse(res, { message: "Enqueued Successfully" });
    return FailedResponse(res, 400, "Bad Request");
  }
  catch (error) {
    return InternalServerError(res, error);
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
    if (deleted) return SuccessfulResponse(res, { message: "Dequeued Successfully" });
    return FailedResponse(res, 400, "Bad Request");
  }
  catch (error) {
    return InternalServerError(res, error);
  }
};

export const approveMember = async (req: Request, res: Response) => {
  try {
    const { userId, partyId } = req.body;
    const created = await createUserParty(userId, partyId);
    console.log(userId)
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
    if (created && deleted) return SuccessfulResponse(res, { message: "Accepted Successfully" });
    return FailedResponse(res, 400, "Bad Request");
  }
  catch (error) {
    return InternalServerError(res, error);
  }
};

export const dismissParty = async (req: Request, res: Response) => {
  try {
    const { partyId } = req.params;
    const deleted = await deleteParty(Number(partyId));
    if (deleted) return SuccessfulResponse(res, { message: "Successfully Broke Up" });
    return FailedResponse(res, 400, "Bad Request");
  }
  catch (error) {
    return InternalServerError(res, error);
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
    if (deleted) return SuccessfulResponse(res, { message: "Quit Successfully" });
    return FailedResponse(res, 400, "Bad Request");
  }
  catch (error) {
    return InternalServerError(res, error);
  }
};

export const fullParty = async (req: Request, res: Response) => {
  try {
    const { partyId } = req.body;
    const updated = await updatePartyState(partyId, 1);
    if (updated) return SuccessfulResponse(res, { message: "FULL PARTY!" });
    return FailedResponse(res, 400, "Bad Request");
  }
  catch (error) {
    return InternalServerError(res, error);
  }
};

export const reParty = async (req: Request, res: Response) => {
  try {
    const { partyId } = req.body;
    const updated = await updatePartyState(partyId, 0);
    if (updated) return SuccessfulResponse(res, { message: "Recruiting Again" });
    return FailedResponse(res, 400, "Bad Request");
  }
  catch (error) {
    return InternalServerError(res, error);
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
    if (comment) return SuccessfulResponse(res, { message: "Successfully Posted" });
    return FailedResponse(res, 400, "Bad Request");
  }
  catch (error) {
    return InternalServerError(res, error);
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
    if (subComment) return SuccessfulResponse(res, { message: "Successfully Posted" });
    return FailedResponse(res, 400, "Bad Request");
  }
  catch (error) {
    return InternalServerError(res, error);
  }
};

export const deleteComment = async (req: Request, res: Response) => {
  try {
    const { commentId } = req.params;
    const deleted = await removeComment(Number(commentId));
    if (deleted) return SuccessfulResponse(res, { message: "Successfully Deleted" });
    return FailedResponse(res, 400, "Bad Request");
  }
  catch (error) {
    return InternalServerError(res, error);
  }
};

export const deleteSubComment = async (req: Request, res: Response) => {
  try {
    const { subCommentId } = req.params;
    const deleted = await removeSubComment(Number(subCommentId));
    if (deleted) return SuccessfulResponse(res, { message: "Successfully Deleted" });
    return FailedResponse(res, 400, "Bad Request");
  }
  catch (error) {
    return InternalServerError(res, error);
  }
};

export const modifyMessage = async (req: Request, res: Response) => {
  try {
    const { userId, partyId, message } = req.body;
    const updated = await updateUserParty(userId, partyId, false, message);
    if (updated) return SuccessfulResponse(res, { message: "Message Edited" });
    return FailedResponse(res, 400, "Bad Request");
  }
  catch (error) {
    return InternalServerError(res, error);
  }
};

export const completeParty = async (req: Request, res: Response) => {
  try {
    const { partyId } = req.body;
    const updated = await updatePartyState(partyId, 2);
    if (updated) return SuccessfulResponse(res, { message: "Quest Clear!" });
    return FailedResponse(res, 400, "Bad Request");
  }
  catch (error) {
    return InternalServerError(res, error);
  }
};

export const reviewMembers = async (req: Request, res: Response) => {
  try {
    const { partyId, userId, exp } = req.body;
    const updatedUserParty = await updateUserParty(userId, partyId, true);
    const updatedExp = await updateExpAtOnce(exp);
    if (updatedUserParty && updatedExp) return SuccessfulResponse(res, { message: "Review Updated Successfully" });
    return FailedResponse(res, 400, "Bad Request");
  }
  catch (error) {
    return InternalServerError(res, error);
  }
};
