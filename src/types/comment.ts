import type { User } from "./user";
export type Comment = {
  id: string;
  content: string;
  blogId?: string;
  dynamicId?: string;
  parentId?: string;
  userId?: string;
  ups: number;
  createdAt: Date;
  upDatedAt?: Date;
  user?: User;
};

export type CommentWithChildren = Comment & {
  children: CommentWithChildren[];
};
