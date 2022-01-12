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
  members?: object[]
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
    attributes
  });
  return user;
};

export const createUser = async (userInfo: UsersAttributes) => {
  const user = await findUser({ email: userInfo.email });
  if (user) return false;
  return await Users.create({ ...userInfo, exp: 25, level: 1 });
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
    attributes: [ "id", "name", "image", "startDate", "endDate", "location" ]
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
      attributes: [ "id", "name", "image", "startDate", "endDate", "location" ]
    });
  }
  return party;
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

export const checkIsRead = async (userId: number) => {
  const notifications = await getNotification(userId);
  for (let i = 0; i < notifications.length; i++) {
    if (!notifications[i].isRead) return true;
  }
  return false;
};

export const getNotification = async (userId: number) => {
  const notifications = await Notification.findAll({
    where: { userId },
    attributes: { exclude: [ "userId", "updatedAt" ] },
    raw: true
  });
  return notifications;
};

export const getLocalParty = async (userId: number, region: string) => {
  const partyList: LocalParty[] = await Parties.findAll({
    where: { region, partyState: 0 },
    attributes: { exclude: [ "partyState", "isOnline", "privateLink", "region", "createdAt", "updatedAt" ] },
    raw: true
  });
  const localParties: any[] = [];
  for (let i = 0; i < partyList.length; i++) {
    const partyId = partyList[i].id;
    const members = await getMembers(partyId);
    if (await checkFavorite(userId, partyId)) localParties[i] = { ...partyList[i], favorite: true, members };
    else localParties[i] = { ...partyList[i], favorite: false, members };
  }
  return localParties;
};

export const createTag = async (tag: Tag[], partyId: number) => {
  for (let i = 0; i < tag.length; i++) {
    await Tag.create({ name: String(tag[i]), partyId });
  }
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
  if (partyInfo.tag) await createTag(partyInfo.tag, newParty.id);
  return { partyId: newParty.id, location: newParty.location };
};

export const getMessageAndJoinDate = async (userId: number, partyId: number) => {
  const messageAndJoinDate = await UserParty.findOne({
    where: { userId, partyId },
    attributes: [ "message", "createdAt" ],
    raw: true
  });
  return messageAndJoinDate;
};

export const getPartyInformation = async (partyId: number) => {
  const party: PartyInfo | null = await Parties.findOne({
    where: { id: partyId },
    attributes: { exclude: [ "createdAt", "updatedAt" ] },
    raw: true
  });
  const favoriteCount = await countFavorite(partyId);
  const tag = await getTag(partyId);
  const members = await getMembers(partyId, [ "id", "userName", "profileImage", "exp" ]);
  for (let i = 0; i < members.length; i++) {
    const infoFromUserParty = await getMessageAndJoinDate(members[i].id, partyId);
    members[i].message = infoFromUserParty?.message;
    members[i].joinDate = infoFromUserParty?.createdAt;
  }
  const partyInfo = { ...party, favorite: favoriteCount, tag, members };
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

export const createNotification = async (content: string, userId: number, partyId: number, userName: string = "") => {
  await Notification.create({ userId, partyId, content, isRead: false, userName });
};

export const getLeaderId = async (partyId: number) => {
  const leaderId = await Parties.findOne({
    where: { id: partyId },
    attributes: [ "leaderId" ],
    raw: true
  });
  return leaderId?.leaderId;
};

export const createUserParty = async (userId: number, partyId: number, message: string) => {
  const newUserParty = await WaitingQueue.create({ userId, partyId, message });
  const leaderId = await getLeaderId(partyId);
  const user = await findUser({ id: userId }, [ 'userName' ]);
  if (leaderId) await createNotification("apply", leaderId, partyId, user?.userName);
  return newUserParty;
};

// export const deleteParty = async (partyId: number) => {
  
//   await Parties.destroy({
//     where: { id: partyId }
//   });
// };