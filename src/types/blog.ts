export interface Blog {
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
}

export interface User {
  avatar: string;
  id: string;
  email: string;
  description?: string;
  username: string;
}
export interface BlogForm {
  title: string;
  content: string;
  firstPicture?: string;
  tags: Tag[];
  typeId: string;
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
