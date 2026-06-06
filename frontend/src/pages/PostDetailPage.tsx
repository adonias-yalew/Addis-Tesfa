import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Heart, 
  MessageCircle, 
  Bookmark, 
  Eye, 
  User, 
  Send,
  MoreVertical,
  Flag
} from 'lucide-react';
import Button from '../components/Button';
import Badge from '../components/Badge';
import { postsApi, commentsApi } from '../services/api';
import { useAuth } from '../hooks/useAuth.tsx';

interface Comment {
  id: string;
  content: string;
  isAnonymous: boolean;
  userId: string;
  createdAt: string;
  helpfulnessScore: number;
}

interface Post {
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
}

const PostDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    fetchPostAndComments();
  }, [id]);

  const fetchPostAndComments = async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      const [postRes, commentsRes] = await Promise.all([
        postsApi.getById(id),
        commentsApi.getByPost(id),
      ]);
      setPost(postRes.data.data);
      setComments(commentsRes.data.data || []);
    } catch (error) {
      console.error('Failed to fetch post:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !id || !isAuthenticated) return;

    setIsSubmitting(true);
    try {
      await commentsApi.create({ postId: id, content: newComment });
      setNewComment('');
      fetchPostAndComments();
    } catch (error) {
      console.error('Failed to add comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLike = async () => {
    if (!id || !isAuthenticated) return;
    try {
      await postsApi.like(id);
      setIsLiked(!isLiked);
      setPost(prev => prev ? { ...prev, likesCount: prev.likesCount + (isLiked ? -1 : 1) } : null);
    } catch (error) {
      console.error('Failed to like post:', error);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-[var(--beige)] rounded w-3/4" />
          <div className="h-4 bg-[var(--beige)] rounded w-1/4" />
          <div className="h-32 bg-[var(--beige)] rounded" />
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto text-center py-16">
        <p className="text-[var(--text-muted)] mb-4">Post not found.</p>
        <Link to="/">
          <Button>Back to Home</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] mb-6 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Back
      </button>

      {/* Post Card */}
      <div className="bg-[var(--warm-white)] rounded-2xl p-6 shadow-card mb-6">
        {/* Author Info */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--beige)] to-[var(--sage)] flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-medium text-[var(--text-primary)]">
                {post.isAnonymous ? 'Anonymous User' : 'Community Member'}
              </p>
              <p className="text-xs text-[var(--text-muted)]">{formatDate(post.createdAt)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {post.isAnonymous && (
              <Badge variant="default" size="sm">Anonymous</Badge>
            )}
            <button className="p-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] rounded-lg hover:bg-[var(--beige-light)] transition-all">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-4">{post.title}</h1>
        <p className="text-[var(--text-secondary)] leading-relaxed whitespace-pre-wrap mb-6">
          {post.content}
        </p>

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="default" size="sm">#{tag}</Badge>
            ))}
          </div>
        )}

        {/* Professional Response Indicator */}
        {post.professionalResponsesCount > 0 && (
          <div className="mb-6 p-4 bg-primary/5 rounded-xl border border-primary/20">
            <p className="text-sm text-primary font-medium flex items-center gap-2">
              <span className="w-2 h-2 bg-primary rounded-full" />
              {post.professionalResponsesCount} Professional Response{post.professionalResponsesCount > 1 ? 's' : ''}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-4 pt-4 border-t border-[var(--beige)]">
          <button
            onClick={handleLike}
            className={`flex items-center gap-1.5 transition-colors ${
              isLiked ? 'text-red-500' : 'text-[var(--text-secondary)] hover:text-red-500'
            }`}
          >
            <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
            <span className="text-sm">{post.likesCount}</span>
          </button>

          <div className="flex items-center gap-1.5 text-[var(--text-secondary)]">
            <MessageCircle className="w-5 h-5" />
            <span className="text-sm">{post.commentsCount}</span>
          </div>

          <div className="flex items-center gap-1.5 text-[var(--text-muted)]">
            <Eye className="w-5 h-5" />
            <span className="text-sm">{post.viewCount}</span>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <button className="p-2 text-[var(--text-muted)] hover:text-red-500 rounded-lg hover:bg-red-50 transition-all">
              <Flag className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsSaved(!isSaved)}
              className={`p-2 rounded-lg transition-all ${
                isSaved ? 'text-primary bg-primary/10' : 'text-[var(--text-muted)] hover:text-primary hover:bg-primary/5'
              }`}
            >
              <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <div className="bg-[var(--warm-white)] rounded-2xl p-6 shadow-card">
        <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-6">
          Comments ({comments.length})
        </h2>

        {/* Comment Form */}
        {isAuthenticated ? (
          <form onSubmit={handleSubmitComment} className="mb-8">
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-sage flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <textarea
                  placeholder="Share your supportive thoughts..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="w-full px-4 py-3 bg-[var(--background)] border border-[var(--beige)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                  rows={3}
                />
                <div className="flex justify-end mt-2">
                  <Button type="submit" isLoading={isSubmitting} size="sm">
                    <Send className="w-4 h-4 mr-2" />
                    Post Comment
                  </Button>
                </div>
              </div>
            </div>
          </form>
        ) : (
          <div className="mb-8 p-4 bg-[var(--beige-light)] rounded-xl text-center">
            <p className="text-[var(--text-secondary)] mb-2">Sign in to leave a comment</p>
            <Link to="/login">
              <Button size="sm">Sign In</Button>
            </Link>
          </div>
        )}

        {/* Comments List */}
        <div className="space-y-4">
          {comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment.id} className="flex gap-3 p-4 bg-[var(--background)] rounded-xl">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--beige)] to-[var(--sage)] flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-medium text-[var(--text-primary)]">
                      {comment.isAnonymous ? 'Anonymous' : 'Community Member'}
                    </p>
                    <p className="text-xs text-[var(--text-muted)]">{formatDate(comment.createdAt)}</p>
                  </div>
                  <p className="text-[var(--text-secondary)] text-sm">{comment.content}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-[var(--text-muted)] py-8">
              No comments yet. Be the first to share your thoughts!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostDetailPage;
