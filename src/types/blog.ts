export interface Blog {
  id: string;
  title?: string;
  content?: string;
  firstPicture?: string;
  tags?: Tag[];
  type?: Type;
  description?: string;
  published?: boolean;
  createTime?: Date;
  views?: number;
  user: User;
}

export interface User {
  id: string;
  email: string;
  username: string;
}
export interface BlogForm {
  title: string;
  content: string;
  firstPicture: string;
  tags: Tag[];
  type: string;
  description: string;
  published: boolean;
}

export interface DraftBlog {
  title: string;
  content: string;
  published: boolean;
}
export interface Tag {
  id: string;
  name: string;
}

interface Type {
  id: string;
  name: string;
}
