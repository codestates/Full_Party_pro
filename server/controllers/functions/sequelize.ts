
import Users from "../../models/users";
import Parties from "../../models/parties";
import UserParty from "../../models/userParty";
import WaitingQueue from "../../models/waitingQueue";
import Notification from '../../models/notification';
import Favorite from "../../models/favorite";
import Tag from "../../models/tag";
import Comment from "../../models/comment";
import SubComment from "../../models/subComment";

export const findUser = async (email: string, password: string):Promise<Users | null> => {
  return await Users.findOne({
    where: { email, password },
    attributes: [ "id", "image", "userName", "region" ]
  });
};

