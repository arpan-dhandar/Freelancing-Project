import { Link } from 'react-router-dom';
import { Star, Clock } from 'lucide-react';

const CAT_COLORS = {
  design:     'bg-pastel-purple text-purple-700',
  'web-dev':  'bg-pastel-blue   text-blue-700',
  writing:    'bg-pastel-green  text-green-700',
  video:      'bg-pastel-coral  text-red-700',
  photo:      'bg-pastel-yellow text-yellow-700',
  consulting: 'bg-pastel-orange text-orange-700',
};

export default function GigCard({ gig }) {
  const avgRating = gig.starNumber > 0
    ? (gig.totalStars / gig.starNumber).toFixed(1)
    : null;

  return (
    <Link to={`/gig/${gig._id}`} className="group block">
      <div className="bg-surface rounded-2xl border border-border overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card-hover">

        {/* Cover image */}
        <div className="relative w-full aspect-[4/3] overflow-hidden bg-surface-2">
          {gig.cover
            ? <img src={gig.cover} alt={gig.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
            : <div className="w-full h-full flex items-center justify-center text-4xl">🎨</div>
          }
          {/* Category pill */}
          {gig.cat && (
            <span className={`absolute top-3 left-3 text-[10px] font-700 uppercase tracking-wider px-2.5 py-1 rounded-pill ${CAT_COLORS[gig.cat] || 'bg-surface-2 text-ink-muted'}`}>
              {gig.cat}
            </span>
          )}
          {gig.sales > 50 && (
            <span className="absolute top-3 right-3 text-[10px] font-700 bg-scarr-red text-white px-2.5 py-1 rounded-pill">
              🔥 Popular
            </span>
          )}
        </div>

        {/* Body */}
        <div className="p-4">
          {/* Seller */}
          <div className="flex items-center gap-2 mb-2">
            {gig.userImg
              ? <img src={gig.userImg} alt={gig.username} className="w-5 h-5 rounded-full object-cover" />
              : <div className="w-5 h-5 rounded-full bg-gradient-to-br from-pastel-pink to-pastel-purple flex items-center justify-center text-[9px] font-700 text-ink flex-shrink-0">
                  {(gig.username || 'U')[0].toUpperCase()}
                </div>
            }
            <span className="text-xs text-ink-muted truncate">{gig.username || 'Freelancer'}</span>
          </div>

          {/* Title */}
          <h3 className="text-sm font-sans font-600 text-ink leading-snug line-clamp-2 mb-3">
            {gig.title}
          </h3>

          {/* Footer row */}
          <div className="flex items-center justify-between pt-2 border-t border-border">
            <div className="flex items-center gap-3 text-xs text-ink-faint">
              {avgRating && (
                <span className="flex items-center gap-1">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <span className="font-600 text-ink">{avgRating}</span>
                  <span>({gig.starNumber})</span>
                </span>
              )}
              {gig.deliveryTime && (
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />{gig.deliveryTime}d
                </span>
              )}
            </div>
            <div className="text-right">
              <p className="text-[10px] text-ink-faint">From</p>
              <p className="text-sm font-display font-700 text-ink">${gig.price}</p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
