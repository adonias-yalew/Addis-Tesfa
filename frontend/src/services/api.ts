import axios from 'axios';
import type { AxiosInstance, AxiosError } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor - add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle errors
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  register: (email: string, password: string, isAnonymous?: boolean) =>
    api.post('/auth/register', { email, password, isAnonymous }),
  getMe: () => api.get('/auth/me'),
};

// Posts API
export const postsApi = {
  getAll: () => api.get('/posts'),
  getById: (id: string) => api.get(`/posts/${id}`),
  create: (data: { title: string; content: string; isAnonymous?: boolean; tags?: string[] }) =>
    api.post('/posts', data),
  update: (id: string, data: unknown) => api.put(`/posts/${id}`, data),
  delete: (id: string) => api.delete(`/posts/${id}`),
  like: (id: string) => api.post(`/posts/${id}/like`),
  unlike: (id: string) => api.delete(`/posts/${id}/like`),
  getSaved: () => api.get('/posts/saved'),
  save: (id: string) => api.post(`/posts/${id}/save`),
  unsave: (id: string) => api.delete(`/posts/${id}/save`),
  getUnanswered: () => api.get('/posts/unanswered'),
};

// Comments API
export const commentsApi = {
  getByPost: (postId: string) => api.get(`/comments/post/${postId}`),
  create: (data: { postId: string; content: string; isAnonymous?: boolean; parentId?: string }) =>
    api.post('/comments', data),
  update: (id: string, data: { content: string }) => api.put(`/comments/${id}`, data),
  delete: (id: string) => api.delete(`/comments/${id}`),
};

// Professionals API
export const professionalsApi = {
  getAll: () => api.get('/professionals'),
  getById: (id: string) => api.get(`/professionals/${id}`),
  apply: (data: {
    licenseNumber: string;
    specialization: string;
    credentials: string;
    yearsOfExperience: number;
    bio?: string;
  }) => api.post('/professionals/apply', data),
  getPendingVerifications: () => api.get('/professionals/verifications/pending'),
  verify: (id: string, approved: boolean) => api.put(`/professionals/${id}/verify`, { approved }),
  getStats: () => api.get('/professionals/stats'),
};

// Blogs API
export const blogsApi = {
  getAll: () => api.get('/blogs'),
  getById: (id: string) => api.get(`/blogs/${id}`),
  create: (data: {
    title: string;
    content: string;
    excerpt?: string;
    coverImage?: string;
    tags?: string[];
    published?: boolean;
  }) => api.post('/blogs', data),
  update: (id: string, data: unknown) => api.put(`/blogs/${id}`, data),
  delete: (id: string) => api.delete(`/blogs/${id}`),
};

// Reports API
export const reportsApi = {
  create: (data: {
    targetType: 'POST' | 'COMMENT' | 'USER';
    targetId: string;
    reason: string;
    description?: string;
  }) => api.post('/reports', data),
};

// Admin API
export const adminApi = {
  getStats: () => api.get('/admin/stats'),
  getPendingReports: () => api.get('/reports/pending'),
  reviewReport: (id: string, data: { status: string; actionTaken?: string }) =>
    api.put(`/reports/${id}/review`, data),
  moderatePost: (postId: string, data: { status: string; reason?: string }) =>
    api.put(`/admin/posts/${postId}/moderate`, data),
  updateUserRole: (userId: string, role: string) =>
    api.put(`/admin/users/${userId}/role`, { role }),
};

export default api;
