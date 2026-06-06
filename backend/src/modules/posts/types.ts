import { PostStatus } from '../../types/index.js';

export interface Post {
  id: string;
  authorId: string;
  title: string;
  content: string;
  isAnonymous: boolean;
  status: PostStatus;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreatePostInput {
  title: string;
  content: string;
  isAnonymous?: boolean;
  tags?: string[];
}

export interface UpdatePostInput {
  title?: string;
  content?: string;
  status?: PostStatus;
  tags?: string[];
}
