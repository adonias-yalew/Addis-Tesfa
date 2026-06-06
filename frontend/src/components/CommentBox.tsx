import { useState } from 'react';
import { Send, EyeOff, Eye } from 'lucide-react';
import Button from './Button';

interface CommentBoxProps {
  onSubmit: (content: string, isAnonymous: boolean) => Promise<void>;
  isLoading?: boolean;
  placeholder?: string;
}

const CommentBox = ({
  onSubmit,
  isLoading = false,
  placeholder = 'Share your thoughts or offer support...',
}: CommentBoxProps) => {
  const [content, setContent] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    await onSubmit(content.trim(), isAnonymous);
    setContent('');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-[var(--warm-white)] rounded-2xl p-4 shadow-card"
    >
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={placeholder}
        rows={3}
        className="w-full px-4 py-3 bg-[var(--background)] border border-[var(--beige)] rounded-xl text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none mb-3"
      />
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setIsAnonymous(!isAnonymous)}
          className="flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
        >
          {isAnonymous ? (
            <EyeOff className="w-4 h-4 text-primary" />
          ) : (
            <Eye className="w-4 h-4" />
          )}
          <span>{isAnonymous ? 'Posting anonymously' : 'Post anonymously'}</span>
        </button>
        <Button
          type="submit"
          size="sm"
          isLoading={isLoading}
          disabled={!content.trim()}
          rightIcon={<Send className="w-4 h-4" />}
        >
          Reply
        </Button>
      </div>
    </form>
  );
};

export default CommentBox;
