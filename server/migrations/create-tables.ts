import { Users } from "../models/users";
import { Parties } from "../models/parties";
import { UserParty } from "../models/userParty";
import { WaitingQueue } from "../models/waitingQueue";
import { Notification } from '../models/notification';
import { Favorite } from "../models/favorite";
import { Tag } from "../models/tag";
import { Comment } from "../models/comment";
import { SubComment } from "../models/subComment";

const createUsers = async () => {
  await Users.sync({ force: true })
    .then(() => console.log("✅ users table created"))
    .catch((error) => console.log("Error occured: ", error));
};

const createParties = async () => {
  await Parties.sync({ force: true })
  .then(() => console.log("✅ parties table created"))
  .catch((error) => console.log("Error occured: ", error));
};

const createUserParty = async () => {
  await UserParty.sync({ force: true })
  .then(() => console.log("✅ userParty table created"))
  .catch((error) => console.log("Error occured: ", error));
};

const createWaitingQueue = async () => {
  await WaitingQueue.sync({ force: true })
  .then(() => console.log("✅ waitingQueue table created"))
  .catch((error) => console.log("Error occured: ", error));
};

const createNotification = async () => {
  await Notification.sync({ force: true })
  .then(() => console.log("✅ notification table created"))
  .catch((error) => console.log("Error occured: ", error));
};

const createFavorite = async () => {
  await Favorite.sync({ force: true })
  .then(() => console.log("✅ favorite table created"))
  .catch((error) => console.log("Error occured: ", error));
};

const createTag = async () => {
  await Tag.sync({ force: true })
  .then(() => console.log("✅ tag table created"))
  .catch((error) => console.log("Error occured: ", error));
};

const createComment = async () => {
  await Comment.sync({ force: true })
  .then(() => console.log("✅ comment table created"))
  .catch((error) => console.log("Error occured: ", error));
};

const createSubComment = async () => {
  await SubComment.sync({ force: true })
  .then(() => console.log("✅ subComment table created"))
  .catch((error) => console.log("Error occured: ", error));
};

const executeAll = async () => {
  await createUsers();
  await createParties();
  await createUserParty();
  await createWaitingQueue();
  await createNotification();
  await createFavorite();
  await createTag();
  await createComment();
  await createSubComment();
};

executeAll();