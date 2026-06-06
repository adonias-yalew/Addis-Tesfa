import { useState, useEffect } from "react";
import { BookOpen, Calendar, Plus, ArrowRight, Search } from "lucide-react";
import Button from "../components/Button";
import Badge from "../components/Badge";
import { blogsApi } from "../services/api";
import { useIsProfessional } from "../hooks/useAuth.tsx";
import { Link } from "react-router-dom";

interface Blog {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  coverImage?: string;
  tags?: string[];
  published?: boolean;
  createdAt: string;
}

const BlogsPage = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const isProfessional = useIsProfessional();

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await blogsApi.getAll();
      setBlogs(response.data.data || response.data || []);
    } catch {
      // silent fail
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });

  const filtered = blogs.filter(
    (b) =>
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.excerpt?.toLowerCase().includes(search.toLowerCase()) ||
      b.tags?.some((t) => t.toLowerCase().includes(search.toLowerCase())),
  );

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-1">
            Blogs & Resources
          </h1>
          <p className="text-[var(--text-secondary)]">
            Expert insights and resources for mental wellness
          </p>
        </div>
        {isProfessional && (
          <Button leftIcon={<Plus className="w-4 h-4" />}>Write Article</Button>
        )}
      </div>

      {/* Search */}
      <div className="relative mb-8 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
        <input
          type="text"
          placeholder="Search articles, topics, or tags..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-[var(--warm-white)] border border-[var(--beige)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
        />
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-[var(--warm-white)] rounded-2xl overflow-hidden animate-pulse"
            >
              <div className="h-44 bg-[var(--beige)]" />
              <div className="p-5 space-y-3">
                <div className="h-4 bg-[var(--beige)] rounded w-3/4" />
                <div className="h-3 bg-[var(--beige)] rounded w-full" />
                <div className="h-3 bg-[var(--beige)] rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-6">
          {filtered.map((blog) => (
            <article
              key={blog.id}
              className="bg-[var(--warm-white)] rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 group"
            >
              {/* Cover */}
              <div className="h-44 bg-gradient-to-br from-[var(--beige-light)] via-primary/5 to-primary/15 flex items-center justify-center relative overflow-hidden">
                <BookOpen className="w-16 h-16 text-primary/25" />
              </div>

              <div className="p-5">
                {blog.tags && blog.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {blog.tags.slice(0, 2).map((tag) => (
                      <Badge key={tag} variant="default" size="sm">
                        #{tag}
                      </Badge>
                    ))}
                    {blog.tags.length > 2 && (
                      <Badge variant="default" size="sm">
                        +{blog.tags.length - 2}
                      </Badge>
                    )}
                  </div>
                )}
                <h3 className="font-semibold text-[var(--text-primary)] mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                  {blog.title}
                </h3>
                <p className="text-sm text-[var(--text-secondary)] line-clamp-2 mb-4">
                  {blog.excerpt || blog.content.slice(0, 100) + "..."}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
                    <Calendar className="w-4 h-4" />
                    {formatDate(blog.createdAt)}
                  </div>
                  <Link
                    to={`/blog/${blog.id}`}
                    className="flex items-center gap-1 text-sm text-primary hover:underline"
                  >
                    Read more
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <BookOpen className="w-12 h-12 text-[var(--text-muted)] mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
            {search ? "No articles match your search" : "No articles yet"}
          </h3>
          <p className="text-[var(--text-secondary)]">
            {search
              ? "Try adjusting your search terms"
              : "Check back soon for expert insights"}
          </p>
        </div>
      )}
    </div>
  );
};

export default BlogsPage;
