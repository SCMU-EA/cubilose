import { Comment } from "./comment";
import { User } from "./user";
export type Dynamic = {
  id: string;
  content: string;
  comments?: Comment[];
  ups: number;
  user: User;
  createTime: Date;
};
