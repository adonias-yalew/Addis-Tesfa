interface SkeletonProps {
  className?: string;
  count?: number;
}

const Skeleton = ({ className = '', count = 1 }: SkeletonProps) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`skeleton ${className}`}
          style={{ animationDelay: `${i * 0.1}s` }}
        />
      ))}
    </>
  );
};

export const PostCardSkeleton = () => (
  <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-card">
    <div className="flex items-center gap-3 mb-4">
      <Skeleton className="w-10 h-10 rounded-full" />
      <div className="flex-1">
        <Skeleton className="w-32 h-4 mb-2" />
        <Skeleton className="w-20 h-3" />
      </div>
    </div>
    <Skeleton className="w-3/4 h-6 mb-3" />
    <Skeleton className="w-full h-4 mb-2" />
    <Skeleton className="w-2/3 h-4 mb-4" />
    <div className="flex gap-2">
      <Skeleton className="w-16 h-6 rounded-full" />
      <Skeleton className="w-16 h-6 rounded-full" />
    </div>
  </div>
);

export const BlogCardSkeleton = () => (
  <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-card">
    <Skeleton className="w-full h-44" />
    <div className="p-5 space-y-3">
      <Skeleton className="w-3/4 h-4" />
      <Skeleton className="w-full h-3" />
      <Skeleton className="w-2/3 h-3" />
    </div>
  </div>
);

export default Skeleton;
