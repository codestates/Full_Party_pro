import { Users, UsersAttributes } from "../../models/users";
import { Parties, PartiesAttributes } from "../../models/parties";
import { UserParty, UserPartyAttributes } from "../../models/userParty";
import { WaitingQueue, WaitingQueueAttributes } from "../../models/waitingQueue";
import { Notification, NotificationAttributes } from '../../models/notification';
import { Favorite, FavoriteAttributes } from "../../models/favorite";
import { Tag, TagAttributes } from "../../models/tag";
import { Comment, CommentAttributes } from "../../models/comment";
import { SubComment, SubCommentAttributes } from "../../models/subComment";

interface localParty extends Parties {
  favorite?: boolean;
  members?: object[];
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
  return await Users.create({ ...userInfo, exp: 10 });
};

export const checkFavorite = async (userId: number, partyId: number) => {
  const favorite = await Favorite.findOne({
    where: { userId, partyId },
    attributes: [ "id" ]
  });
  return favorite;
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

export const getMembers = async (partyId: number) => {
  const memberIdArr: UserParty[] = await UserParty.findAll({
    where: { partyId },
    attributes: [ "userId" ],
    raw: true
  });
  const members: any[] = [];
  for (let i = 0; i < memberIdArr.length; i++) {
    const member = await Users.findOne({
      where: { id: memberIdArr[i].userId },
      attributes: [ "id", "profileImage" ]
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

export const getLocalParty = async (userId: number,region: string) => {
  const partyList: localParty[] = await Parties.findAll({
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

export const createNewParty = async (userId: number, partyInfo: PartiesAttributes) => {
  const newParty = await Parties.create({ ...partyInfo, partyState: 0, leaderId: userId });
  return { partyId: newParty.id, location: newParty.location };
};