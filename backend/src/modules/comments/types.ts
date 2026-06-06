export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  content: string;
  isAnonymous: boolean;
  parentId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCommentInput {
  postId: string;
  content: string;
  isAnonymous?: boolean;
  parentId?: string;
}

export interface UpdateCommentInput {
  content?: string;
}
