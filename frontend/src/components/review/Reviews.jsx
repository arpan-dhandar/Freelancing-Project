import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Trash2 } from 'lucide-react';
import { StarRating, Button, Eyebrow } from '../ui';
import { reviewAPI } from '../../api/services';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

// ── ReviewCard ────────────────────────────────────────────────────────────────
function ReviewCard({ review, onDelete, canDelete }) {
  const initials = (review.username || review.userId || 'U')[0].toUpperCase();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      className="bg-surface rounded-2xl border border-border p-5"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          {review.userImg
            ? <img src={review.userImg} alt={review.username} className="w-9 h-9 rounded-full object-cover" />
            : <div className="w-9 h-9 rounded-full bg-gradient-to-br from-pastel-blue to-pastel-purple flex items-center justify-center text-sm font-700 text-ink flex-shrink-0">
                {initials}
              </div>
          }
          <div>
            <p className="text-sm font-sans font-600 text-ink">{review.username || 'Anonymous'}</p>
            <StarRating value={review.star} size="sm" />
          </div>
        </div>
        {canDelete && (
          <button onClick={() => onDelete(review._id)}
            className="p-1.5 rounded-lg text-ink-faint hover:text-red-500 hover:bg-red-50 transition-colors">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
      <p className="text-sm text-ink-muted leading-relaxed mt-3">{review.desc}</p>
      {review.createdAt && (
        <p className="text-[11px] text-ink-faint mt-3">
          {new Date(review.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </p>
      )}
    </motion.div>
  );
}

// ── ReviewForm ────────────────────────────────────────────────────────────────
function ReviewForm({ gigId, onSuccess }) {
  const [star, setStar] = useState(5);
  const [desc, setDesc] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!desc.trim()) return toast.error('Please write something before submitting.');
    setLoading(true);
    try {
      await reviewAPI.createReview({ gigId, star, desc });
      toast.success('Review posted!');
      setDesc('');
      setStar(5);
      onSuccess?.();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-surface-2 rounded-2xl border border-border p-5 space-y-4">
      <p className="text-sm font-sans font-600 text-ink">Leave a review</p>

      <div>
        <p className="scarr-label mb-2">Your rating</p>
        <div className="flex gap-1">
          {[1,2,3,4,5].map((s) => (
            <button key={s} type="button" onClick={() => setStar(s)}
              className="transition-transform hover:scale-110">
              <Star className={`w-6 h-6 transition-colors ${s <= star ? 'fill-yellow-400 text-yellow-400' : 'text-border'}`} />
            </button>
          ))}
        </div>
      </div>

      <textarea
        value={desc} onChange={(e) => setDesc(e.target.value)}
        rows={3} placeholder="Share your experience working with this freelancer…"
        className="scarr-input resize-none"
        required
      />

      <Button type="submit" variant="red" size="md" loading={loading}>
        Submit Review
      </Button>
    </form>
  );
}

// ── Reviews (main export) ─────────────────────────────────────────────────────
export default function Reviews({ gigId, reviews = [], onReviewAdded }) {
  const { currentUser } = useAuth();

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this review?')) return;
    try {
      await reviewAPI.deleteReview(id);
      toast.success('Review removed.');
      onReviewAdded?.();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const avgRating = reviews.length
    ? (reviews.reduce((a, r) => a + r.star, 0) / reviews.length).toFixed(1)
    : null;

  return (
    <section>
      <div className="flex items-center gap-4 mb-6">
        <Eyebrow>Reviews</Eyebrow>
        {avgRating && (
          <div className="flex items-center gap-2 bg-yellow-50 border border-yellow-100 px-3 py-1.5 rounded-pill">
            <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-700 text-ink">{avgRating}</span>
            <span className="text-xs text-ink-faint">({reviews.length})</span>
          </div>
        )}
      </div>

      <div className="space-y-3 mb-8">
        {reviews.length === 0 && (
          <p className="text-sm text-ink-muted py-6 text-center bg-surface-2 rounded-2xl border border-border">
            No reviews yet — be the first!
          </p>
        )}
        {reviews.map((r) => (
          <ReviewCard
            key={r._id} review={r}
            canDelete={currentUser?._id === r.userId}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {/* Only buyers who are logged in can leave a review */}
      {currentUser && !currentUser.isSeller && (
        <ReviewForm gigId={gigId} onSuccess={onReviewAdded} />
      )}
    </section>
  );
}
