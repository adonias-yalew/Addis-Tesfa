// Shared types between frontend and backend

export enum UserRole {
  USER = 'USER',
  PROFESSIONAL = 'PROFESSIONAL',
  ADMIN = 'ADMIN',
}

export enum ProfessionalStatus {
  PENDING = 'PENDING',
  VERIFIED = 'VERIFIED',
  REJECTED = 'REJECTED',
}

export enum PostStatus {
  PUBLISHED = 'PUBLISHED',
  HIDDEN = 'HIDDEN',
  UNDER_REVIEW = 'UNDER_REVIEW',
}

export enum ReportStatus {
  PENDING = 'PENDING',
  RESOLVED = 'RESOLVED',
  DISMISSED = 'DISMISSED',
}

export enum ReportReason {
  HARASSMENT = 'HARASSMENT',
  HATE_SPEECH = 'HATE_SPEECH',
  MISINFORMATION = 'MISINFORMATION',
  SPAM = 'SPAM',
  SELF_HARM = 'SELF_HARM',
  OTHER = 'OTHER',
}

export enum HelpfulnessBadge {
  NONE = 'NONE',
  BRONZE = 'BRONZE',
  SILVER = 'SILVER',
  GOLD = 'GOLD',
  PLATINUM = 'PLATINUM',
}

export interface User {
  id: string;
  email: string;
  role: UserRole;
  isAnonymous: boolean;
  displayName?: string;
  bio?: string;
  avatarUrl?: string;
  reputationScore: number;
  helpfulnessBadge: HelpfulnessBadge;
  createdAt: string;
  updatedAt: string;
}

export interface Post {
  id: string;
  authorId: string;
  title: string;
  content: string;
  isAnonymous: boolean;
  status: PostStatus;
  tags: string[];
  viewCount: number;
  likesCount: number;
  commentsCount: number;
  professionalResponsesCount: number;
  moderationReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  content: string;
  isAnonymous: boolean;
  parentId?: string;
  likesCount: number;
  isHelpful: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Professional {
  id: string;
  userId: string;
  licenseNumber: string;
  specialization: string;
  credentials: string;
  status: ProfessionalStatus;
  bio?: string;
  yearsOfExperience: number;
  verificationDocuments: string[];
  rejectionReason?: string;
  verifiedAt?: string;
  verifiedBy?: string;
  createdAt: string;
  updatedAt: string;
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
  likesCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
