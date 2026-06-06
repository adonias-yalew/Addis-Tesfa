import { useState, useEffect } from 'react';
import { Plus, TrendingUp, Clock, Stethoscope } from 'lucide-react';
import { Link } from 'react-router-dom';
import PostCard from '../components/PostCard';
import Button from '../components/Button';
import Badge from '../components/Badge';
import { postsApi } from '../services/api';
import { useAuth } from '../hooks/useAuth.tsx';

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

type FilterType = 'latest' | 'trending' | 'professional';

const HomePage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filter, setFilter] = useState<FilterType>('latest');
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    fetchPosts();
  }, [filter]);

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const response = await postsApi.getAll();
      let fetchedPosts = response.data.data || [];
      
      // Apply client-side filtering
      if (filter === 'trending') {
        fetchedPosts = fetchedPosts.sort((a: Post, b: Post) => 
          (b.likesCount + b.commentsCount) - (a.likesCount + a.commentsCount)
        );
      } else if (filter === 'professional') {
        fetchedPosts = fetchedPosts.filter((p: Post) => p.professionalResponsesCount > 0);
      }
      
      setPosts(fetchedPosts);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filters: { key: FilterType; label: string; icon: typeof Clock }[] = [
    { key: 'latest', label: 'Latest', icon: Clock },
    { key: 'trending', label: 'Trending', icon: TrendingUp },
    { key: 'professional', label: 'With Professional Reply', icon: Stethoscope },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-1">
            Community Stories
          </h1>
          <p className="text-[var(--text-secondary)]">
            Share and discover stories from our supportive community
          </p>
        </div>
        
        {isAuthenticated && (
          <Link to="/create-post">
            <Button leftIcon={<Plus className="w-5 h-5" />}>
              Share Your Story
            </Button>
          </Link>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              filter === f.key
                ? 'bg-primary text-white shadow-soft'
                : 'bg-[var(--warm-white)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--beige)]'
            }`}
          >
            <f.icon className="w-4 h-4" />
            {f.label}
          </button>
        ))}
      </div>

      {/* Posts Feed */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-[var(--warm-white)] rounded-2xl p-5 animate-pulse">
              <div className="h-4 bg-[var(--beige)] rounded w-3/4 mb-4" />
              <div className="h-3 bg-[var(--beige)] rounded w-1/2 mb-2" />
              <div className="h-3 bg-[var(--beige)] rounded w-full mb-2" />
              <div className="h-3 bg-[var(--beige)] rounded w-2/3" />
            </div>
          ))}
        </div>
      ) : posts.length > 0 ? (
        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onLike={() => console.log('Like post:', post.id)}
              onSave={() => console.log('Save post:', post.id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-[var(--warm-white)] rounded-2xl">
          <p className="text-[var(--text-muted)] mb-4">No stories found.</p>
          {isAuthenticated && (
            <Link to="/create-post">
              <Button>Be the first to share</Button>
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default HomePage;
