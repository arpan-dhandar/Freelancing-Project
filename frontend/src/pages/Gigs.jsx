import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import GigCard from '../components/gig/GigCard';
import { GigCardSkeleton, Eyebrow } from '../components/ui';
import { gigAPI } from '../api/services';

const CATS = [
  { label:'All',         value:''           },
  { label:'Design',      value:'design'     },
  { label:'Development', value:'web-dev'    },
  { label:'Writing',     value:'writing'    },
  { label:'Video',       value:'video'      },
  { label:'Photography', value:'photo'      },
  { label:'Consulting',  value:'consulting' },
];

const SORTS = [
  { label:'Newest',    value:'createdAt' },
  { label:'Best Rated',value:'totalStars'},
  { label:'Most Sales',value:'sales'     },
];

export default function Gigs() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [gigs, setGigs]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState(searchParams.get('search') || '');

  const cat  = searchParams.get('cat')  || '';
  const sort = searchParams.get('sort') || 'createdAt';
  const min  = searchParams.get('min')  || '';
  const max  = searchParams.get('max')  || '';

  const setParam = (key, val) => {
    const p = new URLSearchParams(searchParams);
    val ? p.set(key, val) : p.delete(key);
    setSearchParams(p);
  };

  useEffect(() => {
    setLoading(true);
    gigAPI.getGigs({ cat, sort, min, max, search, limit: 60 })
      .then(({ data }) => setGigs(data.data || data || []))
      .catch(() => setGigs([]))
      .finally(() => setLoading(false));
  }, [cat, sort, min, max, search]);

  const handleSearch = (e) => {
    e.preventDefault();
    setParam('search', search);
  };

  return (
    <PageLayout>
      <div className="page-container py-10">
        {/* Header */}
        <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} className="mb-8">
          <Eyebrow>Marketplace</Eyebrow>
          <h1 className="text-3xl font-display font-700 text-ink">
            {cat ? `${CATS.find(c=>c.value===cat)?.label || cat} Gigs` : 'Browse All Gigs'}
          </h1>
          {!loading && <p className="text-sm text-ink-muted mt-1">{gigs.length} gigs available</p>}
        </motion.div>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex gap-2 mb-6 max-w-xl">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-faint" />
            <input
              value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search gigs…"
              className="scarr-input pl-10"
            />
          </div>
          <button type="submit" className="btn-red px-5">Search</button>
          {search && (
            <button type="button" onClick={() => { setSearch(''); setParam('search',''); }}
              className="btn-ghost px-3"><X className="w-4 h-4" /></button>
          )}
        </form>

        {/* Filters row */}
        <div className="flex flex-wrap gap-3 mb-8 items-center">
          {/* Category pills */}
          <div className="flex flex-wrap gap-2">
            {CATS.map(({ label, value }) => (
              <button key={value} onClick={() => setParam('cat', value)}
                className={`text-xs font-600 px-4 py-2 rounded-pill border transition-all duration-200 ${
                  cat === value
                    ? 'bg-ink text-white border-ink'
                    : 'bg-surface text-ink-muted border-border hover:border-border-strong'
                }`}>
                {label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <SlidersHorizontal className="w-3.5 h-3.5 text-ink-faint" />

            {/* Price range */}
            <input type="number" placeholder="Min $" value={min} onChange={(e) => setParam('min', e.target.value)}
              className="w-20 scarr-input text-xs py-2 px-3" />
            <span className="text-ink-faint text-xs">–</span>
            <input type="number" placeholder="Max $" value={max} onChange={(e) => setParam('max', e.target.value)}
              className="w-20 scarr-input text-xs py-2 px-3" />

            {/* Sort */}
            <select value={sort} onChange={(e) => setParam('sort', e.target.value)}
              className="scarr-input text-xs py-2 px-3 w-auto">
              {SORTS.map(({ label, value }) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 12 }).map((_,i) => <GigCardSkeleton key={i} />)}
          </div>
        ) : gigs.length === 0 ? (
          <div className="py-24 text-center">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-lg font-display font-700 text-ink mb-2">No gigs found</p>
            <p className="text-sm text-ink-muted">Try adjusting your filters or search term</p>
          </div>
        ) : (
          <motion.div
            initial="hidden" animate="show"
            variants={{ hidden:{}, show:{ transition:{ staggerChildren:0.04 } } }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
          >
            {gigs.map((gig) => (
              <motion.div key={gig._id} variants={{ hidden:{opacity:0,y:12}, show:{opacity:1,y:0} }}>
                <GigCard gig={gig} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </PageLayout>
  );
}
