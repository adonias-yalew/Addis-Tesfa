import { useState, useEffect } from 'react';
import {
  Plus,
  Heart,
  MessageCircle,
  User,
  Shield,
  ArrowRight,
  Sparkles,
  Stethoscope,
  HelpCircle,
  ChevronRight,
  FileText,
  Users,
  Bell,
  Clock,
  BookOpen,
  Eye,
  TrendingUp
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.tsx';
import { postsApi } from '../services/api';
import Button from '../components/Button';
import Badge from '../components/Badge';

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

interface QuickCardProps {
  icon: typeof Heart;
  label: string;
  value: string | number;
  color: 'emerald' | 'blue' | 'amber' | 'rose';
}

const QuickCard = ({ icon: Icon, label, value, color }: QuickCardProps) => {
  const colorMap = {
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    blue: 'bg-blue-50 text-blue-700 border-blue-100',
    amber: 'bg-amber-50 text-amber-700 border-amber-100',
    rose: 'bg-rose-50 text-rose-700 border-rose-100',
  };
  
  return (
    <div className={`rounded-xl border ${colorMap[color]} p-4`}>
      <div className="flex items-center justify-between mb-2">
        <Icon className="h-5 w-5" />
      </div>
      <p className="text-2xl font-semibold text-slate-950">{value}</p>
      <p className="text-sm font-medium text-slate-600 mt-1">{label}</p>
    </div>
  );
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
};

const DashboardPage = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalPosts: 0,
    totalLikes: 0,
    totalComments: 0,
    communityReach: 0,
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const response = await postsApi.getAll();
      const allPosts = response.data.data || [];
      setPosts(allPosts.slice(0, 10));

      setStats({
        totalPosts: allPosts.length,
        totalLikes: allPosts.reduce((acc: number, post: Post) => acc + post.likesCount, 0),
        totalComments: allPosts.reduce((acc: number, post: Post) => acc + post.commentsCount, 0),
        communityReach: allPosts.reduce((acc: number, post: Post) => acc + post.viewCount, 0),
      });
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const displayName = user?.email ? user.email.split('@')[0] : 'Adoni';
  const trendingPosts = [...posts]
    .sort((a, b) => (b.likesCount + b.commentsCount + b.viewCount) - (a.likesCount + a.commentsCount + a.viewCount))
    .slice(0, 3);
  
  const recentPosts = posts.slice(0, 3);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (date: string) => {
    const now = new Date();
    const then = new Date(date);
    const diffMs = now.getTime() - then.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return formatDate(date);
  };

  return (
    <div className="mx-auto max-w-7xl pb-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950">Good morning, {displayName || 'Adoni'}</h1>
          <p className="mt-1 text-sm text-slate-600">Welcome back to Addis Tesfa</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-slate-950"
            title="Notifications"
          >
            <Bell className="h-5 w-5" />
          </button>
          <Link to="/create-post">
            <Button leftIcon={<Plus className="h-4 w-4" />}>New Post</Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-8 xl:grid-cols-[1fr_320px]">
        {/* Main Content */}
        <div className="space-y-6">
          {/* Quick Overview Cards */}
          <div className="grid gap-4 sm:grid-cols-2">
            <QuickCard icon={FileText} label="Community Posts" value={stats.totalPosts} color="emerald" />
            <QuickCard icon={Heart} label="My Posts" value={recentPosts.length} color="blue" />
            <QuickCard icon={Stethoscope} label="Professionals" value="12" color="amber" />
            <QuickCard icon={Sparkles} label="AI Chats" value="5" color="rose" />
          </div>

          {/* Recent Community Activity */}
          <section className="rounded-xl border border-slate-200 bg-white p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-950">Latest from Community</h2>
                <p className="text-sm text-slate-600">Recent discussions and posts</p>
              </div>
              <Link to="/community" className="flex items-center gap-1 text-sm font-semibold text-emerald-700 hover:text-emerald-800">
                View all
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            
            <div className="space-y-4">
              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse h-20 rounded-lg bg-slate-100" />
                  ))}
                </div>
              ) : recentPosts.length > 0 ? (
                recentPosts.map((post) => (
                  <Link key={post.id} to={`/post/${post.id}`} className="flex gap-4 rounded-lg border border-slate-100 p-4 transition hover:border-emerald-200 hover:bg-emerald-50/30">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {post.isAnonymous && <Badge size="sm" variant="default">Anonymous</Badge>}
                        {post.professionalResponsesCount > 0 && <Badge size="sm" variant="success">Responded</Badge>}
                        <span className="text-xs text-slate-500">{formatTime(post.createdAt)}</span>
                      </div>
                      <h3 className="line-clamp-1 font-semibold text-slate-950 mb-1">{post.title}</h3>
                      <p className="line-clamp-1 text-sm text-slate-600">{post.content}</p>
                    </div>
                    <div className="flex gap-2 text-slate-500 text-sm">
                      <div className="flex items-center gap-1">
                        <Heart className="h-4 w-4" />
                        <span>{post.likesCount}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="h-4 w-4" />
                        <span>{post.commentsCount}</span>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="text-center py-8">
                  <MessageCircle className="mx-auto mb-3 h-12 w-12 text-slate-300" />
                  <p className="text-slate-500">No posts yet. Be the first to share.</p>
                </div>
              )}
            </div>
          </section>

          {/* Trending Discussions */}
          <section className="rounded-xl border border-slate-200 bg-white p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-950">Trending Right Now</h2>
                <p className="text-sm text-slate-600">Most popular discussions</p>
              </div>
              <TrendingUp className="h-5 w-5 text-slate-400" />
            </div>
            
            <div className="space-y-3">
              {trendingPosts.length > 0 ? (
                trendingPosts.map((post, index) => (
                  <Link key={post.id} to={`/post/${post.id}`} className="flex items-center gap-3 rounded-lg border border-slate-100 p-3 transition hover:border-emerald-200 hover:bg-emerald-50/30">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-sm font-semibold text-emerald-700">
                      #{index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="line-clamp-1 text-sm font-semibold text-slate-950">{post.title}</p>
                      <p className="text-xs text-slate-500">{post.likesCount} likes · {post.commentsCount} replies</p>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="text-center text-slate-500 py-4">No trending posts yet</p>
              )}
            </div>
          </section>

          {/* Latest Blogs & Resources */}
          <section className="rounded-xl border border-slate-200 bg-white p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-950">Latest Articles</h2>
                <p className="text-sm text-slate-600">Learning resources and guides</p>
              </div>
              <Link to="/blogs" className="flex items-center gap-1 text-sm font-semibold text-emerald-700 hover:text-emerald-800">
                View all
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            
            <div className="space-y-3">
              {[
                { title: 'Getting Started with Career Planning', excerpt: 'Learn the fundamentals of building a strong career foundation', readTime: '5 min' },
                { title: 'Interview Preparation Guide', excerpt: 'Master the art of interviews with our comprehensive guide', readTime: '8 min' },
                { title: 'Professional Development Tips', excerpt: 'Discover practical ways to grow professionally', readTime: '6 min' },
              ].map((blog, i) => (
                <Link key={i} to="/blogs" className="flex gap-3 rounded-lg border border-slate-100 p-3 transition hover:border-emerald-200 hover:bg-emerald-50/30">
                  <BookOpen className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="line-clamp-1 text-sm font-semibold text-slate-950">{blog.title}</p>
                    <p className="line-clamp-1 text-xs text-slate-600 mt-1">{blog.excerpt}</p>
                    <p className="text-xs text-slate-500 mt-1">{blog.readTime} read</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>

        {/* Right Sidebar */}
        <aside className="space-y-6">
          {/* AI Copilot Quick Access */}
          <Link to="/copilot" className="block rounded-xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50 p-6 transition hover:border-emerald-300 hover:from-emerald-100 hover:to-teal-100">
            <div className="flex items-center gap-3 mb-3">
              <Sparkles className="h-5 w-5 text-emerald-600" />
              <h3 className="font-semibold text-slate-950">AI Copilot</h3>
            </div>
            <p className="text-sm text-slate-600 mb-4">Get career guidance and professional support</p>
            <Button size="sm" className="w-full">Start Chatting</Button>
          </Link>

          {/* Suggested Professionals */}
          <section className="rounded-xl border border-slate-200 bg-white p-6">
            <div className="mb-4">
              <h3 className="font-semibold text-slate-950">Connect with Experts</h3>
              <p className="text-xs text-slate-600 mt-1">Recommended professionals</p>
            </div>
            
            <div className="space-y-3">
              {[
                { name: 'Dr. Sarah', spec: 'Career Coach' },
                { name: 'John Smith', spec: 'Tech Mentor' },
                { name: 'Emma Wilson', spec: 'HR Specialist' },
              ].map((prof, i) => (
                <Link key={i} to="/professionals" className="flex items-center justify-between gap-2 rounded-lg border border-slate-100 p-3 transition hover:border-emerald-200 hover:bg-emerald-50/30">
                  <div className="min-w-0">
                    <p className="line-clamp-1 text-sm font-semibold text-slate-950">{prof.name}</p>
                    <p className="text-xs text-slate-600">{prof.spec}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-400 flex-shrink-0" />
                </Link>
              ))}
            </div>
            <Link to="/professionals" className="mt-4 flex h-9 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-700 transition hover:bg-slate-100">
              Browse all
            </Link>
          </section>

          {/* Recent Notifications */}
          <section className="rounded-xl border border-slate-200 bg-white p-6">
            <div className="mb-4">
              <h3 className="font-semibold text-slate-950">Notifications</h3>
              <p className="text-xs text-slate-600 mt-1">Recent activity</p>
            </div>
            
            <div className="space-y-3">
              {[
                { title: 'New reply to your post', time: '2 hours ago' },
                { title: 'Someone followed you', time: '1 day ago' },
                { title: 'Community discussion trending', time: '2 days ago' },
              ].map((notif, i) => (
                <div key={i} className="flex gap-2 rounded-lg border border-slate-100 p-3">
                  <Clock className="h-4 w-4 text-slate-400 mt-0.5 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="line-clamp-1 text-sm font-semibold text-slate-950">{notif.title}</p>
                    <p className="text-xs text-slate-600">{notif.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
};

export default DashboardPage;
