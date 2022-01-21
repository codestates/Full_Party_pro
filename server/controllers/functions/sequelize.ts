import { Op } from "sequelize";
import { Users, UsersAttributes } from "../../models/users";
import { Parties, PartiesAttributes } from "../../models/parties";
import { UserParty, UserPartyAttributes } from "../../models/userParty";
import { WaitingQueue, WaitingQueueAttributes } from "../../models/waitingQueue";
import { Notification, NotificationAttributes } from '../../models/notification';
import { Favorite, FavoriteAttributes } from "../../models/favorite";
import { Tag, TagAttributes } from "../../models/tag";
import { Comment, CommentAttributes } from "../../models/comment";
import { SubComment, SubCommentAttributes } from "../../models/subComment";

interface LocalParty extends Parties {
  favorite?: boolean;
  members?: object[];
};

interface PartyInfo extends Parties {
  favorite?: number;
  tag?: Tag[];
  members?: object[];
};

interface Comments extends Comment {
  userName?: string;
  profileImage?: string;
};

interface SubComments extends SubComment {
  userName?: string;
  profileImage?: string;
};

export const findUser = async (prop: object, attributes: string[] = [ "id" ]) => {
  const user = await Users.findOne({
    where: { ...prop },
    attributes,
    raw: true
  });
  return user;
};

export const createUser = async (userInfo: UsersAttributes) => {
  const user = await findUser({ email: userInfo.email });
  if (user) return false;
  return await Users.create({ ...userInfo, exp: 25, level: 1 });
};

export const updateUser = async (userId: number, userInfo: any) => {
  const updated = await Users.update(userInfo, {
    where: { id: userId }
  });
  return updated;
};

export const deleteUser = async (userId: number) => {
  const deleted = await Users.destroy({
    where: { id: userId }
  });
  return deleted;
};

export const checkFavorite = async (userId: number, partyId: number) => {
  const favorite = await Favorite.findOne({
    where: { userId, partyId },
    attributes: [ "id" ]
  });
  return favorite;
};

export const countFavorite = async (partyId: number) => {
  const favorite = await Favorite.findAll({
    where: { partyId },
    raw: true
  });
  return favorite.length;
};

export const invertFavorite = async (userId: number, partyId: number) => {
  const favorite = await checkFavorite(userId, partyId);
  if (favorite === null) {
    await Favorite.create({ userId, partyId });
    return true;
  }
  else {
    await Favorite.destroy({
      where: { userId, partyId }
    });
    return false;
  }
};

export const getLeadingParty = async (userId: number) => {
  const leadingParty = await Parties.findAll({
    where: { leaderId: userId },
    attributes: [ "id", "name", "image", "startDate", "endDate", "location", "isOnline", "location" ]
  });
  return leadingParty;
};

export const getParticipatingParty = async (userId: number) => {
  const partyIdArr: UserParty[] = await UserParty.findAll({
    where: { userId },
    attributes: [ "partyId" ]
  });
  const party: any[] = [];
  for (let i = 0; i < partyIdArr.length; i++) {
    party[i] = await Parties.findOne({
      where: { id: partyIdArr[i].partyId },
      attributes: [ "id", "name", "image", "startDate", "endDate", "location", "isOnline", "location" ],
      raw: true
    });
  }
  return party;
};

export const findParticipatingParty = async (userId: number) => {
  const partyIds = await UserParty.findAll({
    where: { userId },
    attributes: [ "partyId" ],
    raw: true
  });
  const partyIdArr = partyIds.map(item => item.partyId);
  const participatingParty = await Parties.findAll({
    where: { 
      id: partyIdArr, 
      partyState: [ 0, 1 ], 
      leaderId: {
        [Op.not]: userId
      }
    },
    attributes: [ "id", "name", "image", "startDate", "endDate", "location" ],
    raw: true
  });
  return participatingParty;
};

export const getMembers = async (partyId: number, attributes: string[] = [ "id", "profileImage" ]) => {
  const memberIdArr: UserParty[] = await UserParty.findAll({
    where: { partyId },
    attributes: [ "userId" ],
    raw: true
  });
  const members: any[] = [];
  for (let i = 0; i < memberIdArr.length; i++) {
    const member = await Users.findOne({
      where: { id: memberIdArr[i].userId },
      attributes,
      raw: true
    });
    members.push(member);
  }
  return members;
};

export const getNotification = async (userId: number) => {
  const notifications = await Notification.findAll({
    where: { userId },
    attributes: { exclude: [ "updatedAt" ] },
    raw: true
  });
  await Notification.update({ isRead: true }, {
    where: { userId }
  });
  return notifications;
};

export const checkIsRead = async (userId: number) => {
  const notifications = await getNotification(userId);
  for (let i = 0; i < notifications.length; i++) {
    if (!notifications[i].isRead) return true;
  }
  return false;
};

export const AddrToRegion = (address: string) => {
  const splited = address.split(" ");
  let region = "";
  splited.map((item: string, i: number) => i < 2 ? region += item : item);
  return region;
};

export const getLocalParty = async (userId: number, region: string) => {
  const partyList: LocalParty[] = await Parties.findAll({
    where: { region, partyState: 0 },
    attributes: { exclude: [ "partyState", "privateLink", "createdAt", "updatedAt" ] },
    raw: true
  });
  const localParties: any[] = [];
  for (let i = 0; i < partyList.length; i++) {
    const partyId = partyList[i].id;
    const members = await getMembers(partyId);
    const tag = await getTag(partyId);
    if (await checkFavorite(userId, partyId)) localParties[i] = { ...partyList[i], favorite: true, members, tag };
    else localParties[i] = { ...partyList[i], favorite: false, members, tag };
  }
  return localParties;
};

export const createTag = async (tag: Tag[], partyId: number) => {
  for (let i = 0; i < tag.length; i++) {
    await Tag.create({ name: String(tag[i]), partyId });
  }
};

export const findTag = async (partyId: number) => {
  const tagsArr = await Tag.findAll({
    where: { partyId },
    attributes: [ "name" ],
    raw: true
  });
  const tag = tagsArr.map(item => item.name);
  return tag;
};

export const deleteTag = async (partyId: number) => {
  await Tag.destroy({
    where: { partyId }
  });
};

export const getTag = async (partyId: number) => {
  const tagArr = await Tag.findAll({
    where: { partyId },
    attributes: [ "name" ],
    raw: true
  });
  const tag = tagArr.map(item => item.name);
  return tag;
};

export const createNewParty = async (userId: number, partyInfo: PartyInfo) => {
  const newParty = await Parties.create({ ...partyInfo, partyState: 0, leaderId: userId });
  const withoutTag = { ...partyInfo };
  delete withoutTag.tag;
  const party: any = await Parties.findOne({
    where: { ...withoutTag },
    attributes: [ "id" ],
    raw: true
  })
  await UserParty.create({ userId, partyId: Number(party?.id), message: "", isReviewed: false });
  if (partyInfo.tag) await createTag(partyInfo.tag, newParty.id);
  return { partyId: newParty.id, location: newParty.location };
};

export const updatePartyInformation = async (partyId: number, partyInfo: PartyInfo) => {
  const updated = await Parties.update({ ...partyInfo, id: partyId }, {
    where: { id: partyId }
  });
  await deleteTag(partyId);
  if (partyInfo.tag) await createTag(partyInfo.tag, partyId);
  return updated;
};

export const getMessageAndJoinDate = async (userId: number, partyId: number) => {
  const messageAndJoinDate = await UserParty.findOne({
    where: { userId, partyId },
    attributes: [ "message", "createdAt" ],
    raw: true
  });
  return messageAndJoinDate;
};

export const getPartyInformation = async (partyId: number, userId?: number | undefined) => {
  const party: PartyInfo | null = await Parties.findOne({
    where: { id: partyId },
    attributes: { exclude: [ "createdAt", "updatedAt" ] },
    raw: true
  });
  const favoriteCount = await countFavorite(partyId);
  const tag = await getTag(partyId);
  const members = await getMembers(partyId, [ "id", "userName", "profileImage", "level" ]);
  for (let i = 0; i < members.length; i++) {
    const infoFromUserParty = await getMessageAndJoinDate(members[i].id, partyId);
    members[i].message = infoFromUserParty?.message;
    members[i].joinDate = infoFromUserParty?.createdAt;
  }
  const waitingUsers = await WaitingQueue.findAll({
    where: { partyId },
    attributes: [ "userId", "message" ],
    raw: true
  });
  const userIdArr = waitingUsers.map((item: { userId: number }) => item.userId);
  let waitingQueue: any[] = await Users.findAll({
    where: { id: userIdArr },
    attributes: [ "id", "userName", "profileImage", "level" ],
    raw: true
  });
  waitingUsers.map((item: any, i: number) => waitingQueue[i] = { ...waitingQueue[i], message: item.message });
  if (userId) {
    let isFavorite: boolean;
    await checkFavorite(userId, partyId) ? isFavorite = true : isFavorite = false;
    const checkReviewed = await UserParty.findOne({
      where: { userId, partyId },
      attributes: [ "isReviewed" ],
      raw: true
    });
    const isReviewed = checkReviewed?.isReviewed ? true : false;
    const partyInfo = { ...party, favorite: favoriteCount, tag, members, waitingQueue, isReviewed, isFavorite };
    return partyInfo;
  }
  const partyInfo = { ...party, favorite: favoriteCount, tag, members, waitingQueue, isReviewed: false, isFavorite: false };
    return partyInfo;
};

export const getSubComment = async (commentId: number) => {
  const subComments: SubComments[] = await SubComment.findAll({
    where: { commentId },
    attributes: { exclude: [ "commentId", "updatedAt" ] },
    raw: true
  });
  for (let i = 0; i < subComments.length; i++) {
    const userInfo = await Users.findOne({
      where: { id: subComments[i].userId },
      attributes: [ "userName", "profileImage" ],
      raw: true
    });
    subComments[i].userName = userInfo?.userName;
    subComments[i].profileImage = userInfo?.profileImage;
  }
  return subComments;
};

export const getComment = async (partyId: number) => {
  const comments: Comments[] = await Comment.findAll({
    where: { partyId },
    attributes: { exclude: [ "partyId", "updatedAt" ] },
    raw: true
  });
  for (let i = 0; i < comments.length; i++) {
    const userInfo = await Users.findOne({
      where: { id: comments[i].userId },
      attributes: [ "userName", "profileImage" ],
      raw: true
    });
    comments[i].userName = userInfo?.userName;
    comments[i].profileImage = userInfo?.profileImage;
  }
  return comments;
};

export const compileComments = async (partyId: number) => {
  const completedComment = [];
  const comments = await getComment(partyId);
  for (let i = 0; i < comments.length; i++) {
    const subComments = await getSubComment(comments[i].id);
    completedComment[i] = { comment: { ...comments[i] }, subComments };
  }
  return completedComment;
};

export const createNotification = async (notificationInfo: NotificationAttributes) => {
  const temp = await Notification.create(notificationInfo);
  return true;
};

export const createWaitingQueue = async (userId: number, partyId: number, message: string) => {
  const newWaitingQueue = await WaitingQueue.create({ userId, partyId, message });
  const party = await getPartyInformation(partyId);
  const user = await findUser({ id: userId }, [ "userName" ]);
  const notificationInfo: NotificationAttributes = {
    content: "apply",
    userId: Number(party.leaderId),
    partyId,
    userName: String(user?.userName),
    partyName: String(party.name),
    isRead: false
  };
  await createNotification(notificationInfo);
  return newWaitingQueue;
};

export const deleteWaitingQueue = async (userId: number, partyId: number) => {
  const destroyed = await WaitingQueue.destroy({
    where: { userId, partyId }
  });
  return destroyed;
};

export const getMessage = async (userId: number, partyId: number) => {
  const waitingQueue = await WaitingQueue.findOne({
    where: { userId, partyId },
    attributes: [ "message" ],
    raw: true
  });
  return waitingQueue?.message;
};

export const createUserParty = async (userId: number, partyId: number) => {
  const message = await getMessage(userId, partyId);
  if (message) return await UserParty.create({ userId, partyId, message, isReviewed: false })
  return null;
};

export const getRelatedUsers = async (partyId: number) => {
  const waitingQueue = await WaitingQueue.findAll({
    where: { partyId },
    attributes: [ "userId" ],
    raw: true
  });
  const userParty = await UserParty.findAll({
    where: { partyId },
    attributes: [ "userId" ],
    raw: true
  });
  return [ ...waitingQueue, ...userParty ];
};

export const createNotificationsAtOnce = async (content: string, receivers: { userId: number }[],
  partyId: number, userName: string = "", partyName: string = "") => {
  for (let i = 0; i < receivers.length; i++) {
    const notificationInfo: NotificationAttributes = {
      content,
      userId: receivers[i].userId,
      partyId,
      userName,
      partyName,
      isRead: false
    };
    await createNotification(notificationInfo);
  }
};

export const deleteParty = async (partyId: number) => {
  const party = await Parties.findOne({
    where: { id: partyId },
    attributes: [ "name" ],
    raw: true
  });
  const relatedUsers = await getRelatedUsers(partyId);
  await createNotificationsAtOnce("dismiss", relatedUsers, partyId, "", party?.name);
  const deleted = await Parties.destroy({
    where: { id: partyId }
  });
  return deleted;
};

export const deleteUserParty = async (userId: number, partyId: number) => {
  const deleted = await UserParty.destroy({
    where: { userId, partyId }
  });
  return deleted;
};

export const updatePartyState = async (partyId: number, partyState: number) => {
  const updated = await Parties.update({ partyState }, {
    where: { id: partyId }
  });
  let notificationContent;
  switch (partyState) {
    case 0: notificationContent = "reparty"; break;
    case 1: notificationContent = "fullparty"; break;
    case 2: notificationContent = "complete"; break;
  }
  const party = await getPartyInformation(partyId);
  const relatedUsers = await getRelatedUsers(partyId);
  await createNotificationsAtOnce(String(notificationContent), relatedUsers, partyId, "", party?.name);
  return updated;
};

export const makeComment = async (userId: number, partyId: number, content: string) => {
  const created = await Comment.create({ userId, partyId, content });
  return created;
};

export const removeComment = async (commentId: number) => {
  const commentDeleted = await Comment.destroy({
    where: { id: commentId }
  });
  const subCommentDeleted = await SubComment.destroy({
    where: { commentId }
  });
  return commentDeleted || subCommentDeleted;
};

export const makeSubComment = async (userId: number, commentId: number, content: string) => {
  const created = await SubComment.create({ userId, commentId, content });
  return created;
};

export const removeSubComment = async (subCommentId: number) => {
  const subCommentDeleted = await SubComment.destroy({
    where: { id: subCommentId }
  });
  return subCommentDeleted;
};

export const findPartyId = async (partyInfo: any) => {
  delete partyInfo.tag
  const latlng = JSON.stringify(partyInfo.latlng)
  const partyIdObj = await Parties.findOne({
    where: { ...partyInfo, latlng},
    attributes: [ "id" ],
    raw: true
  });
  return partyIdObj?.id;
};

export const getPartyId = async (commentId: number) => {
  const party = await Comment.findOne({
    where: { id: commentId },
    attributes: [ "partyId" ],
    raw: true
  });
  return party?.partyId;
};

export const updateUserParty = async (userId: number, partyId: number, isReviewed: boolean,
  message: string = "6a@#$fdaf@#gdsf$%af&*(;vj;*(sdlkfjkag46d5f") => {
  let updated: [number, UserParty[]];
  if (message === "6a@#$fdaf@#gdsf$%af&*(;vj;*(sdlkfjkag46d5f") {
    updated = await UserParty.update({ isReviewed }, {
      where: { userId, partyId }
    });
  }
  else {
    updated = await UserParty.update({ message, isReviewed }, {
      where: { userId, partyId }
    });
  }
  return updated;
};

export const updateLevel = async (userId: number, exp: number) => {
  let levelRange:number[] = [ 0, 20, 40, 60, 80, 100, 120, 140, 160, 180, 200 ];
  for (let i = 0; i < levelRange.length; i++) {
    if (exp - levelRange[i] < 20) {
      await Users.update({ level: i }, {
        where: { id: userId }
      });
      const notificationInfo: NotificationAttributes = {
        content: "levelup",
        userId,
        isRead: false,
        level: i
      };
      createNotification(notificationInfo);
      break;
    }
  }
};

export const updateExp = async (userId: number, exp: number) => {
  const presentExp = await Users.findOne({
    where: { id: userId },
    attributes: [ "exp" ],
    raw: true
  });
  let updated: [number, Users[]] | boolean;
  let newExp: number;
  if (presentExp) {
    newExp = presentExp.exp + exp;
    updated = await Users.update({ exp: newExp }, {
      where: { id: userId }
    });
    await updateLevel(userId, newExp);
  }
  else updated = false;
  return updated;
};

export const updateExpAtOnce = async (exp: { userId: number, exp: number }[]) => {
  for (let i = 0; i < exp.length; i++) {
    let updated = await updateExp(exp[i].userId, exp[i].exp);
    if (!updated) return null;
  }
  return true;
};

export const searchPartiesByTagName = async (tagName: string, region: string, userId: number) => {
  const tagResult = await Tag.findAll({
    where: {
      name: {
        [Op.like]: `%${tagName}%`
      }
    },
    attributes: [ "partyId" ],
    raw: true
  });
  const partyIdArr = tagResult.map(item => item.partyId);
  const partyList = await Parties.findAll({
    where: { id: partyIdArr, partyState: 0, region },
    attributes: { exclude: [ "partyState", "isOnline", "privateLink", "createdAt", "updatedAt" ] },
    raw: true
  });
  let searchResult = [];
  for (let i = 0; i < partyList.length; i++) {
    const partyId = partyList[i].id;
    const members = await getMembers(partyId);
    const tag = await getTag(partyId);
    if (await checkFavorite(userId, partyId)) searchResult[i] = { ...partyList[i], favorite: true, members, tag };
    else searchResult[i] = { ...partyList[i], favorite: false, members, tag };
  }
  return searchResult;
};

export const searchPartiesByKeyword = async (keyword: string, region: string, userId: number) => {
  const tagResult = await searchPartiesByTagName(keyword, region, userId);
  const tagResultPartyIdArr = tagResult.map(item => item.id);
  const partyList = await Parties.findAll({
    where: {
      name: {
        [Op.like]: `%${keyword}%`
      },
      id: {
        [Op.notIn]: tagResultPartyIdArr
      },
      partyState: 0,
      region
    },
    attributes: { exclude: [ "partyState", "isOnline", "privateLink", "createdAt", "updatedAt" ] },
    raw: true
  });
  let keywordResult = [];
  for (let i = 0; i < partyList.length; i++) {
    const partyId = partyList[i].id;
    const members = await getMembers(partyId);
    const tag = await getTag(partyId);
    if (await checkFavorite(userId, partyId)) keywordResult[i] = { ...partyList[i], favorite: true, members, tag };
    else keywordResult[i] = { ...partyList[i], favorite: false, members, tag };
  }
  return [ ...keywordResult, ...tagResult ];
};

export const findLeadingParty = async (userId: number) => {
  const leadingParty = await Parties.findAll({
    where: { leaderId: userId, partyState: [ 0, 1 ] },
    attributes: [ "id", "name", "image", "startDate", "endDate", "location" ],
    raw: true
  });
  return leadingParty;
};

export const findCompletedParty = async (userId: number) => {
  const userParty = await UserParty.findAll({
    where: { userId },
    attributes: [ "partyId" ],
    raw: true
  });
  let partyIdArr = userParty.map(item => item.partyId);
  const completedParty = await Parties.findAll({
    where: { [Op.or]: [ { leaderId: userId }, { id: partyIdArr } ], partyState: 2 },
    attributes: [ "id", "name", "image", "startDate", "endDate", "location" ],
    raw: true
  });
  return completedParty;
};

export const findFavoriteParties = async (userId: number) => {
    const favoritePartyIdArr = await Favorite.findAll({
    where: { userId },
    attributes: [ "partyId" ],
    raw: true
  });
  const partyIdArr = favoritePartyIdArr.map((item: { partyId: number }) => item.partyId);
  const partyList = await Parties.findAll({
    where: { id: partyIdArr },
    attributes: { exclude: [ "partyState", "isOnline", "privateLink", "createdAt", "updatedAt" ] },
    raw: true
  });
  const favoriteParties: any[] = [];
  for (let i = 0; i < partyList.length; i++) {
    const partyId = partyList[i].id;
    const members = await getMembers(partyId);
    const tag = await getTag(partyId);
    if (await checkFavorite(userId, partyId)) favoriteParties[i] = { ...partyList[i], favorite: true, members, tag };
    else favoriteParties[i] = { ...partyList[i], favorite: false, members, tag };
  }
  return favoriteParties;
};