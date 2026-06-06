export interface User {
  id: string;
  email: string;
  role: 'USER' | 'PROFESSIONAL' | 'ADMIN';
  isAnonymous: boolean;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  isAnonymous: boolean;
  tags: string[];
  likesCount: number;
  commentsCount: number;
  viewCount: number;
  professionalResponsesCount: number;
  createdAt: string;
  userId?: string;
  status?: 'PUBLISHED' | 'HIDDEN' | 'UNDER_REVIEW';
  author?: {
    email: string;
    role: 'USER' | 'PROFESSIONAL' | 'ADMIN';
  };
}

export interface Comment {
  id: string;
  content: string;
  isAnonymous: boolean;
  isProfessional?: boolean;
  createdAt: string;
  postId: string;
  parentId?: string;
  userId?: string;
  author?: {
    email: string;
    role: 'USER' | 'PROFESSIONAL' | 'ADMIN';
  };
}

export interface Blog {
  id: string;
  authorId: string;
  title: string;
  content: string;
  excerpt?: string;
  coverImage?: string;
  tags: string[];
  published: boolean;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
  author?: {
    email: string;
    role: string;
  };
}

export interface Report {
  id: string;
  reporterId: string;
  targetType: 'POST' | 'COMMENT' | 'USER';
  targetId: string;
  reason: string;
  description?: string;
  status: 'PENDING' | 'RESOLVED' | 'DISMISSED';
  reviewedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminStats {
  totalUsers: number;
  totalPosts: number;
  totalComments: number;
  totalBlogs: number;
  pendingReports: number;
  professionals?: number;
}

export interface Professional {
  id: string;
  userId: string;
  licenseNumber: string;
  specialization: string;
  credentials: string;
  status: 'PENDING' | 'VERIFIED' | 'REJECTED';
  bio?: string;
  yearsOfExperience: number;
  verificationDocuments: string[];
  createdAt: string;
  updatedAt: string;
  user?: {
    email: string;
  };
}
