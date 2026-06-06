import { Award } from 'lucide-react';
import Badge from './Badge';
import type { Comment } from '../types';

interface ProfessionalReplyCardProps {
  comment: Comment;
}

const ProfessionalReplyCard = ({ comment }: ProfessionalReplyCardProps) => {
  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  return (
    <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5">
      {/* Header */}
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-sage flex items-center justify-center flex-shrink-0">
          <Award className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-semibold text-[var(--text-primary)]">
              {comment.author?.email?.split('@')[0] || 'Mental Health Professional'}
            </p>
            <Badge variant="primary" size="sm">
              Verified Professional
            </Badge>
          </div>
          <p className="text-xs text-[var(--text-muted)]">{formatDate(comment.createdAt)}</p>
        </div>
      </div>

      {/* Content */}
      <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{comment.content}</p>
    </div>
  );
};

export default ProfessionalReplyCard;
