import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Clock,
  RefreshCw,
  CheckCircle,
  MessageCircle,
  ShoppingBag,
  Trash2,
  Star,
  ChevronLeft,
  Share2,
} from "lucide-react";
import PageLayout from "../components/layout/PageLayout";
import Reviews from "../components/review/Reviews";
import {
  StarRating,
  Badge,
  Button,
  Divider,
  Skeleton,
  Eyebrow,
} from "../components/ui";
import { gigAPI, orderAPI, conversationAPI, reviewAPI } from "../api/services";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const CAT_COLORS = {
  design: "purple",
  "web-dev": "blue",
  writing: "green",
  video: "red",
  photo: "yellow",
  consulting: "default",
};

export default function GigDetail() {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [gig, setGig] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ordering, setOrdering] = useState(false);
  const [messaging, setMessaging] = useState(false);
  const [selectedImg, setSelectedImg] = useState(0);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [gigRes, revRes] = await Promise.all([
        gigAPI.getSingleGig(id),
        reviewAPI.getReviews(id),
      ]);
      setGig(gigRes.data.data || gigRes.data);
      setReviews(revRes.data.data || revRes.data || []);
    } catch {
      toast.error("Could not load gig.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, [id]);

  const handleOrder = async () => {
    if (!currentUser) return navigate("/login");
    setOrdering(true);
    try {
      await orderAPI.createPaymentIntent(id);
      toast.success("🎉 Order placed successfully!");
      navigate("/orders");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setOrdering(false);
    }
  };

  const handleMessage = async () => {
    if (!currentUser) return navigate("/login");
    setMessaging(true);
    try {
      const { data } = await conversationAPI.createConversation({
        to: gig.userId,
      });
      const conv = data.data || data;
      navigate(`/messages/${conv.id}`);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setMessaging(false);
    }
  };

  if (loading)
    return (
      <PageLayout>
        <div className="page-container py-10">
          <div className="grid lg:grid-cols-12 gap-10">
            <div className="lg:col-span-8 space-y-4">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="w-full aspect-video rounded-2xl" />
            </div>
            <div className="lg:col-span-4">
              <Skeleton className="h-72 rounded-2xl" />
            </div>
          </div>
        </div>
      </PageLayout>
    );

  if (!gig)
    return (
      <PageLayout>
        <div className="page-container py-24 text-center">
          <p className="text-2xl font-display font-700 text-ink mb-2">
            Gig not found
          </p>
          <Button variant="outline" onClick={() => navigate("/gigs")}>
            Back to Browse
          </Button>
        </div>
      </PageLayout>
    );

  const images = gig.images?.length ? gig.images : [gig.cover].filter(Boolean);
  const avgRating = reviews.length
    ? (reviews.reduce((a, r) => a + r.star, 0) / reviews.length).toFixed(1)
    : null;
  const isOwner = currentUser?.isSeller && currentUser?._id === gig.userId;

  return (
    <PageLayout>
      <div className="page-container py-8">
        <button
          onClick={() => navigate("/gigs")}
          className="flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink transition-colors mb-6 group"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to Browse
        </button>

        <div className="grid lg:grid-cols-12 gap-10 xl:gap-14">
          {/* ── Left ── */}
          <div className="lg:col-span-8">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {/* Tags */}
              <div className="flex items-start gap-3 flex-wrap mb-2">
                {gig.cat && (
                  <Badge color={CAT_COLORS[gig.cat] || "default"}>
                    {gig.cat}
                  </Badge>
                )}
                {gig.sales > 50 && <Badge color="red">🔥 Popular</Badge>}
              </div>
              <h1 className="text-2xl lg:text-3xl font-display font-700 text-ink mb-4 leading-snug">
                {gig.title}
              </h1>

              {/* Seller row */}
              <div className="flex items-center gap-4 flex-wrap mb-6">
                <div className="flex items-center gap-2.5">
                  {gig.userImg ? (
                    <img
                      src={gig.userImg}
                      alt={gig.username}
                      className="w-9 h-9 rounded-full object-cover ring-2 ring-border"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-pastel-pink to-pastel-purple flex items-center justify-center text-sm font-700 text-ink">
                      {(gig.username || "F")[0].toUpperCase()}
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-sans font-600 text-ink">
                      {gig.username || "Freelancer"}
                    </p>
                    <p className="text-xs text-ink-faint">Freelancer</p>
                  </div>
                </div>
                {avgRating && (
                  <div className="flex items-center gap-1.5 bg-yellow-50 border border-yellow-100 px-3 py-1.5 rounded-pill">
                    <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-700 text-ink">
                      {avgRating}
                    </span>
                    <span className="text-xs text-ink-faint">
                      ({reviews.length} reviews)
                    </span>
                  </div>
                )}
                {gig.sales > 0 && (
                  <span className="text-xs text-ink-muted bg-surface-2 px-3 py-1.5 rounded-pill border border-border">
                    {gig.sales} orders completed
                  </span>
                )}
                <button
                  onClick={() => {
                    navigator.clipboard?.writeText(window.location.href);
                    toast.success("Link copied!");
                  }}
                  className="ml-auto btn-ghost text-sm gap-1.5 hidden sm:flex"
                >
                  <Share2 className="w-3.5 h-3.5" /> Share
                </button>
              </div>

              {/* Gallery */}
              {images.length > 0 && (
                <div className="mb-8">
                  <div className="w-full aspect-video bg-surface-2 rounded-2xl overflow-hidden border border-border">
                    <img
                      src={images[selectedImg]}
                      alt={gig.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {images.length > 1 && (
                    <div className="flex gap-2 mt-3">
                      {images.map((img, i) => (
                        <button
                          key={i}
                          onClick={() => setSelectedImg(i)}
                          className={`w-16 h-12 rounded-xl overflow-hidden border-2 transition-all ${selectedImg === i ? "border-ink scale-105" : "border-border opacity-60"}`}
                        >
                          <img
                            src={img}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Description */}
              <div className="mb-10">
                <h2 className="text-lg font-display font-700 text-ink mb-4">
                  About this service
                </h2>
                <p className="text-sm text-ink-muted leading-relaxed whitespace-pre-line">
                  {gig.desc}
                </p>
              </div>

              <Divider className="mb-10" />

              {/* Seller profile block */}
              <div className="bg-surface rounded-2xl border border-border p-6 mb-10">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    {gig.userImg ? (
                      <img
                        src={gig.userImg}
                        alt={gig.username}
                        className="w-14 h-14 rounded-2xl object-cover"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pastel-pink to-pastel-purple flex items-center justify-center text-xl font-700 text-ink">
                        {(gig.username || "F")[0].toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-sans font-700 text-ink mb-1">
                      {gig.username || "Freelancer"}
                    </p>
                    {avgRating && (
                      <div className="flex items-center gap-1 mb-3">
                        <StarRating value={parseFloat(avgRating)} size="sm" />
                        <span className="text-xs text-ink-muted">
                          {avgRating} avg
                        </span>
                      </div>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleMessage}
                      loading={messaging}
                      className="gap-1.5"
                    >
                      <MessageCircle className="w-3.5 h-3.5" /> Contact Seller
                    </Button>
                  </div>
                </div>
              </div>

              <Divider className="mb-10" />
              <Reviews gigId={id} reviews={reviews} onReviewAdded={fetchAll} />
            </motion.div>
          </div>

          {/* ── Right: Price card ── */}
          <div className="lg:col-span-4">
            <div className="sticky top-24">
              <motion.div
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-surface rounded-3xl border-2 border-border shadow-card overflow-hidden"
              >
                <div className="bg-gradient-to-br from-pastel-purple/40 to-pastel-blue/40 p-6 border-b border-border">
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-xs text-ink-muted mb-1">Starting at</p>
                      <span className="text-4xl font-display font-700 text-ink">
                        ${gig.price}
                      </span>
                    </div>
                    {gig.deliveryTime && (
                      <div className="flex items-center gap-1.5 bg-surface/80 px-3 py-1.5 rounded-pill">
                        <Clock className="w-3.5 h-3.5 text-ink-muted" />
                        <span className="text-sm font-600 text-ink">
                          {gig.deliveryTime}d
                        </span>
                      </div>
                    )}
                  </div>
                  {gig.shortDesc && (
                    <p className="text-sm text-ink-muted mt-3 leading-relaxed line-clamp-2">
                      {gig.shortDesc}
                    </p>
                  )}
                </div>

                <div className="p-6">
                  {gig.features?.length > 0 && (
                    <ul className="space-y-2.5 mb-6">
                      {gig.features.map((f, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-ink-muted">{f}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {gig.revisionNumber && (
                    <div className="flex items-center gap-2 text-sm text-ink-muted mb-6 bg-surface-2 rounded-xl px-3 py-2">
                      <RefreshCw className="w-3.5 h-3.5 text-scarr-red" />
                      <span>
                        {gig.revisionNumber} revision
                        {gig.revisionNumber !== 1 ? "s" : ""} included
                      </span>
                    </div>
                  )}

                  {!isOwner && (
                    <>
                      <Button
                        variant="red"
                        size="lg"
                        onClick={handleOrder}
                        loading={ordering}
                        className="w-full gap-2 mb-3"
                      >
                        <ShoppingBag className="w-4 h-4" /> Order Now
                      </Button>
                      <button
                        onClick={handleMessage}
                        className="w-full text-sm text-ink-muted hover:text-ink transition-colors py-2 font-500"
                      >
                        💬 Have a question? Ask the seller
                      </button>
                    </>
                  )}
                </div>
              </motion.div>

              {/* Delete gig — owner only */}
              {isOwner && (
                <button
                  onClick={async () => {
                    if (!window.confirm("Delete this gig?")) return;
                    try {
                      await gigAPI.deleteGig(id);
                      toast.success("Gig deleted.");
                      navigate("/gigs");
                    } catch (err) {
                      toast.error(err.message);
                    }
                  }}
                  className="w-full mt-4 flex items-center justify-center gap-2 text-sm text-red-400 hover:text-red-600 transition-colors py-2"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete this gig
                </button>
              )}

              {/* Trust badges */}
              <div className="mt-5 grid grid-cols-3 gap-2">
                {[
                  ["🔒", "Secure\npayment"],
                  ["⭐", "Quality\nguaranteed"],
                  ["⚡", "Fast\ndelivery"],
                ].map(([e, l]) => (
                  <div
                    key={l}
                    className="text-center p-3 bg-surface rounded-2xl border border-border"
                  >
                    <div className="text-lg mb-1">{e}</div>
                    <p className="text-[10px] text-ink-faint whitespace-pre-line leading-tight">
                      {l}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
