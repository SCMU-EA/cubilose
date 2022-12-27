import { CommentWithChildren } from "./comment";
import { User } from "./user";
export interface Dynamic {
  id: string;
  content: string;
  user: User;
  comments: CommentWithChildren[];
  ups: number;
  createTime: Date;
}
