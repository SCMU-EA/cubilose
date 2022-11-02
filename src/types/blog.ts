export interface Blog {
  id: string;
  title?: string;
  content?: string;
  firstPicture?: string;
  tags?: string[];
  type?: string;
  description?: string;
  published?: boolean;
  createTime?: Date;
} | undefined

export interface BlogForm {
  title: string;
  content: string;
  firstPicture: string;
  tags: string[];
  type: string;
  description: string;
  published: boolean;
}
