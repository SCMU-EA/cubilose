import { User } from "../types/user";
export type Blog = {
  id: string;
  title: string;
  content?: string;
  firstPicture?: string;
  tags: Tag[];
  type: Type;
  description: string;
  published?: boolean;
  createTime: Date;
  views: number;
  ups: number;
  downs: number;
  user: User;
  isDown?: boolean;
  isUp?: boolean;
};

export type BlogForm = {
  title: string;
  content: string;
  firstPicture?: string;
  tags: Tag[];
  typeId: string;
  description: string;
  published: boolean;
};

export type DraftBlog = {
  title: string;
  content: string;
  published: boolean;
};
export type Tag = {
  id: string;
  name: string;
};

type Type = {
  id: string;
  name: string;
};
