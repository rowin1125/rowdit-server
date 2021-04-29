import DataLoader from "dataloader";
import { User } from "../entities/User";

export const createUserLoader = () =>
  new DataLoader<number, User>(async (creatorId) => {
    const users = await User.findByIds(creatorId as number[]);
    const userIdToUser: Record<number, User> = {};
    users.forEach((u) => {
      userIdToUser[u.id] = u;
    });
    return creatorId.map((userId) => userIdToUser[userId]);
  });
