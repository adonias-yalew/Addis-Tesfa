import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Heart,
  Bookmark,
  Eye,
  MessageCircle,
  Share2,
  Flag,
  User,
} from 'lucide-react';
import Button from '../components/Button';
import Badge from '../components/Badge';
import CommentBox from '../components/CommentBox';
import ProfessionalReplyCard from '../components/ProfessionalReplyCard';
import { postsApi, commentsApi } from '../services/api';
import { useAuth } from '../hooks/useAuth.tsx';
import { useSavedPosts } from '../hooks/useSavedPosts';
import type { Post, Comment } from '../types';

const PostDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated } = useAuth();
  const { isSaved, toggleSave } = useSavedPosts();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      fetchPost();
      fetchComments();
    }
  }, [id]);

  const fetchPost = async () => {
    try {
      const response = await postsApi.getById(id!);
      setPost(response.data.data || response.data);
    } catch {
      setError('Failed to load this story. It may have been removed.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await commentsApi.getByPost(id!);
      setComments(response.data.data || response.data || []);
    } catch {
      // silent fail
    }
  };

  const handleComment = async (content: string, isAnonymous: boolean) => {
    if (!id) return;
    setIsSubmittingComment(true);
    try {
      await commentsApi.create({ postId: id, content, isAnonymous });
      await fetchComments();
    } catch {
      // silent fail
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

  const professionalComments = comments.filter(
    (c) => c.isProfessional || c.author?.role === 'PROFESSIONAL'
  );
  const regularComments = comments.filter(
    (c) => !c.isProfessional && c.author?.role !== 'PROFESSIONAL'
  );

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto animate-pulse space-y-4">
        <div className="h-6 bg-[var(--beige)] rounded w-40" />
        <div className="bg-[var(--warm-white)] rounded-2xl p-6 space-y-3">
          <div className="flex gap-3 items-center mb-6">
            <div className="w-12 h-12 rounded-full bg-[var(--beige)]" />
            <div className="space-y-2 flex-1">
              <div className="h-4 bg-[var(--beige)] rounded w-32" />
              <div className="h-3 bg-[var(--beige)] rounded w-20" />
            </div>
          </div>
          <div className="h-7 bg-[var(--beige)] rounded w-3/4" />
          <div className="h-4 bg-[var(--beige)] rounded" />
          <div className="h-4 bg-[var(--beige)] rounded w-5/6" />
          <div className="h-4 bg-[var(--beige)] rounded w-4/6" />
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="max-w-3xl mx-auto text-center py-20">
        <p className="text-[var(--text-muted)] mb-6 text-lg">{error || 'Story not found.'}</p>
        <Link to="/">
          <Button variant="secondary">Back to Community</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      {/* Back navigation */}
      <div className="flex items-center gap-2 mb-6">
        <Link
          to="/"
          className="flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Community
        </Link>
      </div>

      {/* Post Card */}
      <div className="bg-[var(--warm-white)] rounded-2xl p-6 shadow-card mb-6">
        {/* Author row */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--beige)] to-[var(--sage)] flex items-center justify-center flex-shrink-0">
            <User className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-[var(--text-primary)]">
              {post.isAnonymous ? 'Anonymous User' : post.author?.email?.split('@')[0] || 'Community Member'}
            </p>
            <p className="text-xs text-[var(--text-muted)]">{formatDate(post.createdAt)}</p>
          </div>
          {post.isAnonymous && <Badge variant="default">Anonymous</Badge>}
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-4 leading-tight">
          {post.title}
        </h1>

        {/* Content */}
        <p className="text-[var(--text-secondary)] leading-relaxed whitespace-pre-wrap text-sm">
          {post.content}
        </p>

        {/* Tags */}
        {post.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-5 pt-5 border-t border-[var(--beige)]">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="default" size="sm">
                #{tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-4 mt-5 pt-5 border-t border-[var(--beige)]">
          <button className="flex items-center gap-1.5 text-[var(--text-secondary)] hover:text-red-500 transition-colors">
            <Heart className="w-5 h-5" />
            <span className="text-sm">{post.likesCount || 0}</span>
          </button>
          <div className="flex items-center gap-1.5 text-[var(--text-muted)]">
            <MessageCircle className="w-5 h-5" />
            <span className="text-sm">{comments.length}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[var(--text-muted)]">
            <Eye className="w-5 h-5" />
            <span className="text-sm">{post.viewCount || 0}</span>
          </div>

          <div className="ml-auto flex items-center gap-1">
            <button
              onClick={() => toggleSave(post.id)}
              className={`p-2 rounded-lg transition-colors ${
                isSaved(post.id)
                  ? 'text-primary bg-primary/10'
                  : 'text-[var(--text-muted)] hover:text-primary hover:bg-primary/5'
              }`}
              title={isSaved(post.id) ? 'Unsave' : 'Save'}
            >
              <Bookmark className={`w-5 h-5 ${isSaved(post.id) ? 'fill-current' : ''}`} />
            </button>
            <button className="p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--beige-light)] transition-colors">
              <Share2 className="w-5 h-5" />
            </button>
            <button className="p-2 rounded-lg text-[var(--text-muted)] hover:text-red-500 hover:bg-red-50 transition-colors">
              <Flag className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Professional Responses */}
      {professionalComments.length > 0 && (
        <section className="mb-6">
          <h2 className="text-base font-semibold text-[var(--text-primary)] mb-3 flex items-center gap-2">
            <span className="w-2 h-2 bg-primary rounded-full inline-block" />
            Professional Responses ({professionalComments.length})
          </h2>
          <div className="space-y-3">
            {professionalComments.map((comment) => (
              <ProfessionalReplyCard key={comment.id} comment={comment} />
            ))}
          </div>
        </section>
      )}

      {/* Community Replies */}
      <section>
        <h2 className="text-base font-semibold text-[var(--text-primary)] mb-4">
          Community Responses ({regularComments.length})
        </h2>

        {isAuthenticated ? (
          <div className="mb-5">
            <CommentBox onSubmit={handleComment} isLoading={isSubmittingComment} />
          </div>
        ) : (
          <div className="mb-5 p-4 bg-[var(--beige-light)] rounded-xl text-center">
            <p className="text-sm text-[var(--text-secondary)] mb-3">
              Sign in to offer your support
            </p>
            <Link to="/login">
              <Button size="sm">Sign In</Button>
            </Link>
          </div>
        )}

        <div className="space-y-3">
          {regularComments.length > 0 ? (
            regularComments.map((comment) => (
              <div
                key={comment.id}
                className="bg-[var(--warm-white)] rounded-xl p-4 shadow-card"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--beige)] to-[var(--sage)] flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[var(--text-primary)]">
                      {comment.isAnonymous
                        ? 'Anonymous'
                        : comment.author?.email?.split('@')[0] || 'Community Member'}
                    </p>
                    <p className="text-xs text-[var(--text-muted)]">
                      {new Date(comment.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                  {comment.content}
                </p>
              </div>
            ))
          ) : (
            <div className="text-center py-12 bg-[var(--warm-white)] rounded-2xl">
              <MessageCircle className="w-12 h-12 text-[var(--beige)] mx-auto mb-3" />
              <p className="text-[var(--text-muted)] text-sm">
                Be the first to offer support
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default PostDetailsPage;
