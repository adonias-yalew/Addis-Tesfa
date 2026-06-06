import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { postsApi } from '../services/api';
import { useAuth } from '../hooks/useAuth.tsx';
import PostCard from '../components/PostCard';
import Button from '../components/Button';

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

const MyPostsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMyPosts();
  }, []);

  const fetchMyPosts = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await postsApi.getAll();
      const allPosts = response.data.data || [];
      
      // Filter posts by current user (in real app, use a proper API endpoint)
      // For now, showing all posts as mock - replace with user-specific endpoint
      const myPosts = allPosts; // TODO: Filter by user ID when API supports it
      
      setPosts(myPosts);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch your posts');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    
    try {
      await postsApi.delete(postId);
      setPosts(posts.filter(p => p.id !== postId));
    } catch (err: any) {
      alert('Failed to delete post');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-slate-900">My Posts</h1>
          <p className="text-sm text-slate-600">
            Manage and view all your shared stories
          </p>
        </div>
        <Link to="/create-post">
          <Button leftIcon={<Plus className="w-4 h-4" />}>
            New Post
          </Button>
        </Link>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
          {error}
        </div>
      )}

      {/* Posts List */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-5 animate-pulse border border-slate-100">
              <div className="h-4 bg-slate-200 rounded w-3/4 mb-4" />
              <div className="h-3 bg-slate-200 rounded w-1/2 mb-2" />
              <div className="h-3 bg-slate-200 rounded w-full" />
            </div>
          ))}
        </div>
      ) : posts.length > 0 ? (
        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post.id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <PostCard
                post={post}
                onLike={() => console.log('Like post:', post.id)}
                onSave={() => console.log('Save post:', post.id)}
              />
              <div className="mt-4 pt-4 border-t border-slate-100 flex gap-2">
                <Link to={`/posts/${post.id}`} className="flex-1">
                  <Button variant="secondary" size="sm" className="w-full">
                    View
                  </Button>
                </Link>
                <Button 
                  variant="danger" 
                  size="sm"
                  onClick={() => handleDelete(post.id)}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-100">
          <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No posts yet</h3>
          <p className="text-slate-500 mb-6 max-w-sm mx-auto">
            You haven't shared any stories yet. Start your journey by creating your first post!
          </p>
          <Link to="/create-post">
            <Button leftIcon={<Plus className="w-4 h-4" />}>
              Create Your First Post
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default MyPostsPage;
