export interface Blog {
  id: string;
  title?: string;
  content?: string;
  firstPicture?: string;
  tags?: Tag[];
  type?: string;
  description?: string;
  published?: boolean;
  createTime?: Date;
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

export interface Tag {
  id: string;
  name: string;
}
