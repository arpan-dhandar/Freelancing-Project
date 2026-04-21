import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Star, Package, ExternalLink } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import GigCard from '../components/gig/GigCard';
import { Skeleton, Eyebrow, GigCardSkeleton, Badge } from '../components/ui';
import { userAPI, gigAPI } from '../api/services';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { id }          = useParams();
  const { currentUser } = useAuth();
  const [user, setUser]       = useState(null);
  const [gigs, setGigs]       = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      userAPI.getUser(id),
      gigAPI.getGigs({ userId: id }),
    ])
      .then(([userRes, gigRes]) => {
        setUser(userRes.data.data || userRes.data);
        setGigs(gigRes.data.data || gigRes.data || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const isOwnProfile = currentUser?._id === id;
  const totalSales   = gigs.reduce((a, g) => a + (g.sales || 0), 0);
  const avgRating    = gigs.length
    ? (gigs.reduce((a, g) => a + (g.starNumber > 0 ? g.totalStars/g.starNumber : 0), 0) / gigs.length).toFixed(1)
    : null;

  return (
    <PageLayout>
      <div className="page-container py-10">
        {loading ? (
          <div className="space-y-6">
            <div className="flex items-center gap-5">
              <Skeleton className="w-24 h-24 rounded-2xl" />
              <div className="space-y-2 flex-1"><Skeleton className="h-7 w-48" /><Skeleton className="h-4 w-64" /></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1,2,3].map((i) => <GigCardSkeleton key={i} />)}
            </div>
          </div>
        ) : !user ? (
          <div className="py-24 text-center">
            <p className="text-xl font-display font-700 text-ink">User not found</p>
          </div>
        ) : (
          <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }}>
            {/* Profile hero */}
            <div className="bg-surface rounded-3xl border border-border p-8 mb-8">
              <div className="flex flex-col sm:flex-row items-start gap-6">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  {user.img
                    ? <img src={user.img} alt={user.username} className="w-24 h-24 rounded-2xl object-cover ring-4 ring-border" />
                    : <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-pastel-pink to-pastel-purple flex items-center justify-center text-4xl font-700 text-ink">
                        {user.username?.[0]?.toUpperCase()}
                      </div>
                  }
                </div>

                {/* Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between flex-wrap gap-3">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h1 className="text-2xl font-display font-700 text-ink">{user.username}</h1>
                        {user.isSeller && <Badge color="purple">⚡ Seller</Badge>}
                      </div>
                      {user.country && (
                        <div className="flex items-center gap-1.5 text-sm text-ink-muted mb-3">
                          <MapPin className="w-3.5 h-3.5" />{user.country}
                        </div>
                      )}
                    </div>
                    {isOwnProfile && (
                      <Link to={`/add-gig`} className="btn-red text-sm px-5 py-2.5">
                        + Post a Gig
                      </Link>
                    )}
                  </div>

                  {user.desc && (
                    <p className="text-sm text-ink-muted leading-relaxed max-w-2xl mb-4">{user.desc}</p>
                  )}

                  {/* Stats */}
                  {user.isSeller && (
                    <div className="flex flex-wrap gap-4">
                      <div className="flex items-center gap-2 bg-surface-2 px-4 py-2 rounded-xl border border-border">
                        <Package className="w-4 h-4 text-ink-faint" />
                        <span className="text-sm font-600 text-ink">{gigs.length} gigs</span>
                      </div>
                      <div className="flex items-center gap-2 bg-surface-2 px-4 py-2 rounded-xl border border-border">
                        <ExternalLink className="w-4 h-4 text-ink-faint" />
                        <span className="text-sm font-600 text-ink">{totalSales} sales</span>
                      </div>
                      {avgRating && (
                        <div className="flex items-center gap-2 bg-yellow-50 px-4 py-2 rounded-xl border border-yellow-100">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-600 text-ink">{avgRating} avg rating</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Gigs grid */}
            {user.isSeller && (
              <section>
                <div className="flex items-center justify-between mb-6">
                  <Eyebrow>Portfolio</Eyebrow>
                  <h2 className="text-xl font-display font-700 text-ink">
                    {isOwnProfile ? 'Your Gigs' : `${user.username}'s Gigs`}
                  </h2>
                </div>

                {gigs.length === 0 ? (
                  <div className="py-16 text-center bg-surface rounded-2xl border border-border">
                    <div className="text-4xl mb-3">🎨</div>
                    <p className="text-sm font-600 text-ink mb-1">No gigs yet</p>
                    {isOwnProfile && (
                      <Link to="/add-gig" className="btn-red text-sm mt-3 inline-flex">Post your first gig</Link>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {gigs.map((gig) => <GigCard key={gig._id} gig={gig} />)}
                  </div>
                )}
              </section>
            )}
          </motion.div>
        )}
      </div>
    </PageLayout>
  );
}
