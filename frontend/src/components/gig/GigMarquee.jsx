import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import { Eyebrow } from '../ui';

function MarqueeCard({ gig }) {
  const avg = gig.starNumber > 0 ? (gig.totalStars / gig.starNumber).toFixed(1) : null;
  return (
    <Link to={`/gig/${gig._id}`}
      className="flex-shrink-0 w-56 mx-3 bg-surface rounded-2xl border border-border overflow-hidden hover:border-border-strong hover:-translate-y-1 hover:shadow-card transition-all duration-250 group">
      <div className="w-full h-32 overflow-hidden bg-surface-2">
        {gig.cover
          ? <img src={gig.cover} alt={gig.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          : <div className="w-full h-full flex items-center justify-center text-3xl">🎨</div>
        }
      </div>
      <div className="p-3">
        <p className="text-xs font-sans font-600 text-ink line-clamp-1 mb-1">{gig.title}</p>
        <div className="flex items-center justify-between">
          {avg
            ? <span className="flex items-center gap-0.5 text-[10px] text-ink-muted">
                <Star className="w-2.5 h-2.5 fill-yellow-400 text-yellow-400" />{avg}
              </span>
            : <span />
          }
          <span className="text-xs font-700 text-ink">${gig.price}</span>
        </div>
      </div>
    </Link>
  );
}

export default function GigMarquee({ gigs = [], reverse = false, eyebrow, title }) {
  if (!gigs.length) return null;
  // Duplicate for seamless looping
  const doubled = [...gigs, ...gigs];

  return (
    <div className="py-4">
      {(eyebrow || title) && (
        <div className="page-container mb-6">
          {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
          {title   && <h2 className="text-2xl font-display font-700 text-ink">{title}</h2>}
        </div>
      )}
      <div className="marquee-outer">
        <div className={`marquee-track ${reverse ? 'reverse' : 'forward'}`}>
          {doubled.map((gig, i) => (
            <MarqueeCard key={`${gig._id}-${i}`} gig={gig} />
          ))}
        </div>
      </div>
    </div>
  );
}
