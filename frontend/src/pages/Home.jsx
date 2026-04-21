import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, Shield, Clock, TrendingUp, Star, Users } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import GigMarquee from '../components/gig/GigMarquee';
import GigCard from '../components/gig/GigCard';
import { GigCardSkeleton, Eyebrow } from '../components/ui';
import { gigAPI } from '../api/services';

const FALLBACK_GIGS = [
  { _id:'f1', title:'Premium Brand Identity Design',       cat:'design',     price:499, deliveryTime:7,  starNumber:127, totalStars:630, sales:127, cover:'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80', username:'anouk_design' },
  { _id:'f2', title:'Full-Stack React & Node.js App',      cat:'web-dev',    price:999, deliveryTime:14, starNumber:89,  totalStars:445, sales:89,  cover:'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80', username:'kai_builds'   },
  { _id:'f3', title:'High-Converting Landing Page Copy',   cat:'writing',    price:299, deliveryTime:5,  starNumber:214, totalStars:1070,sales:214, cover:'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&q=80', username:'lena_writes'  },
  { _id:'f4', title:'Cinematic Brand Video Production',    cat:'video',      price:799, deliveryTime:10, starNumber:58,  totalStars:290, sales:58,  cover:'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&q=80', username:'omar_motion'  },
  { _id:'f5', title:'E-Commerce Product Photography',      cat:'photo',      price:399, deliveryTime:7,  starNumber:71,  totalStars:340, sales:71,  cover:'https://images.unsplash.com/photo-1493863641943-9b68992a8d07?w=800&q=80', username:'sofia_lens'   },
  { _id:'f6', title:'Go-To-Market Strategy for SaaS',      cat:'consulting', price:499, deliveryTime:7,  starNumber:44,  totalStars:210, sales:44,  cover:'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80', username:'javier_growth'},
];

const CATEGORIES = [
  { name:'Design',      cat:'design',     emoji:'🎨', color:'from-pastel-purple to-pastel-pink'  },
  { name:'Development', cat:'web-dev',    emoji:'💻', color:'from-pastel-blue to-pastel-green'   },
  { name:'Writing',     cat:'writing',    emoji:'✍️', color:'from-pastel-green to-pastel-yellow' },
  { name:'Video',       cat:'video',      emoji:'🎬', color:'from-pastel-coral to-pastel-pink'   },
  { name:'Photography', cat:'photo',      emoji:'📸', color:'from-pastel-yellow to-pastel-orange'},
  { name:'Consulting',  cat:'consulting', emoji:'📊', color:'from-pastel-blue to-pastel-purple'  },
];

const STATS = [
  { icon:Users,      value:'12K+', label:'Active Freelancers', color:'text-scarr-red'  },
  { icon:Star,       value:'4.9',  label:'Average Rating',     color:'text-yellow-500' },
  { icon:TrendingUp, value:'98%',  label:'Satisfaction Rate',  color:'text-green-500'  },
  { icon:Clock,      value:'24h',  label:'Avg. Response Time', color:'text-blue-500'   },
];

const stagger = {
  container: { hidden:{}, show:{ transition:{ staggerChildren:0.08 } } },
  item:      { hidden:{ opacity:0, y:18 }, show:{ opacity:1, y:0, transition:{ duration:0.45 } } },
};

export default function Home() {
  const [gigs, setGigs]       = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    gigAPI.getGigs({ limit: 18 })
      .then(({ data }) => {
        const fetched = data.data || data || [];
        setGigs(fetched.length >= 4 ? fetched : FALLBACK_GIGS);
      })
      .catch(() => setGigs(FALLBACK_GIGS))
      .finally(() => setLoading(false));
  }, []);

  const marqueeGigs = gigs.length ? gigs : FALLBACK_GIGS;
  const topGigs     = marqueeGigs.slice(0, 6);

  return (
    <PageLayout>
      {/* ── HERO ──────────────────────────────────────────────── */}
      <section className="relative min-h-[88vh] flex items-center overflow-hidden bg-canvas">
        <div className="absolute inset-0 opacity-[0.035]" style={{
          backgroundImage: 'linear-gradient(#111 1px, transparent 1px), linear-gradient(90deg, #111 1px, transparent 1px)',
          backgroundSize:  '60px 60px',
        }} />
        <div className="absolute top-20 right-10 w-72 h-72 rounded-full bg-pastel-pink/50 blur-[80px] pointer-events-none" />
        <div className="absolute bottom-20 left-10 w-64 h-64 rounded-full bg-pastel-blue/50 blur-[80px] pointer-events-none" />
        <div className="absolute top-40 left-1/2 w-48 h-48 rounded-full bg-pastel-yellow/40 blur-[60px] pointer-events-none" />

        <div className="page-container w-full relative z-10 py-16">
          <div className="max-w-3xl">
            <motion.div initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6 }}>
              <motion.div initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }} transition={{ delay:0.1 }}
                className="inline-flex items-center gap-2 bg-scarr-red-light text-scarr-red text-xs font-sans font-700 px-4 py-2 rounded-pill mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-scarr-red animate-pulse" />
                Now live — The future of freelancing
              </motion.div>

              <h1 className="font-display font-700 text-5xl lg:text-7xl text-ink leading-[1.06] tracking-tight mb-5">
                Hire talent that{' '}
                <span className="relative inline-block">
                  <span className="text-scarr-red">actually</span>
                  <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 200 8" fill="none">
                    <path d="M2 6 Q50 2 100 5 Q150 8 198 4" stroke="#FF2D2D" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.5"/>
                  </svg>
                </span>{' '}
                delivers.
              </h1>

              <p className="text-lg text-ink-muted font-sans font-400 max-w-xl leading-relaxed mb-8">
                SCARR connects fast-moving teams with elite freelancers who get it done — beautifully, on time, every time.
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <Link to="/gigs"     className="btn-red text-base px-8 py-4">Explore Talent <ArrowRight className="w-4 h-4" /></Link>
                <Link to="/register" className="btn-outline text-base px-8 py-4">Join as a Seller</Link>
              </div>

              <div className="mt-8 flex items-center gap-3">
                <div className="flex -space-x-2">
                  {['1','2','3','4','5'].map((n) => (
                    <img key={n} src={`https://i.pravatar.cc/40?img=${n}`} alt=""
                      className="w-8 h-8 rounded-full border-2 border-canvas object-cover" />
                  ))}
                </div>
                <p className="text-sm text-ink-muted">
                  <strong className="text-ink font-700">2,400+</strong> projects completed this month
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── MARQUEE ROW 1 ─────────────────────────────────────── */}
      <section className="py-4 bg-canvas border-y border-border overflow-hidden">
        <GigMarquee gigs={marqueeGigs} />
      </section>

      {/* ── STATS ─────────────────────────────────────────────── */}
      <section className="py-16 bg-surface border-b border-border">
        <div className="page-container">
          <motion.div variants={stagger.container} initial="hidden" whileInView="show" viewport={{ once:true }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {STATS.map(({ icon:Icon, value, label, color }) => (
              <motion.div key={label} variants={stagger.item}
                className="text-center p-6 rounded-2xl border border-border hover:border-border-strong transition-colors">
                <Icon className={`w-6 h-6 ${color} mx-auto mb-3`} />
                <p className="text-3xl font-display font-700 text-ink">{value}</p>
                <p className="text-sm text-ink-muted mt-1">{label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CATEGORIES ────────────────────────────────────────── */}
      <section className="py-20">
        <div className="page-container">
          <div className="flex items-end justify-between mb-10">
            <div>
              <Eyebrow>Explore by category</Eyebrow>
              <h2 className="text-3xl font-display font-700 text-ink">Find your perfect match</h2>
            </div>
            <Link to="/gigs" className="btn-ghost hidden sm:flex items-center gap-1 text-sm">
              All categories <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <motion.div variants={stagger.container} initial="hidden" whileInView="show" viewport={{ once:true }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {CATEGORIES.map(({ name, cat, emoji, color }) => (
              <motion.div key={cat} variants={stagger.item}>
                <Link to={`/gigs?cat=${cat}`}
                  className="flex flex-col items-center gap-3 p-5 rounded-2xl border border-border bg-surface
                    hover:border-border-strong hover:-translate-y-1 hover:shadow-card transition-all duration-250 group">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-250`}>
                    {emoji}
                  </div>
                  <span className="text-sm font-sans font-600 text-ink">{name}</span>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── MARQUEE ROW 2 (reverse) ───────────────────────────── */}
      <section className="py-6 bg-surface-2 border-y border-border overflow-hidden">
        <GigMarquee gigs={[...marqueeGigs].reverse()} reverse eyebrow="Top Rated" title="Trending right now" />
      </section>

      {/* ── FEATURED GIGS ─────────────────────────────────────── */}
      <section className="py-20">
        <div className="page-container">
          <div className="flex items-end justify-between mb-10">
            <div>
              <Eyebrow>Handpicked</Eyebrow>
              <h2 className="text-3xl font-display font-700 text-ink">Featured gigs</h2>
            </div>
            <Link to="/gigs" className="btn-outline text-sm hidden sm:flex items-center gap-1">
              Browse all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {loading
              ? Array.from({ length:6 }).map((_,i) => <GigCardSkeleton key={i} />)
              : topGigs.map((gig) => <GigCard key={gig._id} gig={gig} />)
            }
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────────── */}
      <section className="py-20 bg-surface border-t border-border">
        <div className="page-container">
          <div className="text-center mb-12">
            <Eyebrow>Simple process</Eyebrow>
            <h2 className="text-3xl font-display font-700 text-ink">How SCARR works</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { step:'01', icon:Zap,       title:'Find talent', desc:'Browse thousands of gigs across every category. Filter by budget, delivery time, and rating.', color:'from-pastel-yellow to-pastel-orange' },
              { step:'02', icon:Shield,    title:'Hire securely', desc:'Pay safely with our escrow system. Funds are only released when you approve the work.',    color:'from-pastel-blue to-pastel-green'  },
              { step:'03', icon:TrendingUp,title:'Grow faster',   desc:'Get professional results that move the needle. 98% of clients come back for more.',        color:'from-pastel-pink to-pastel-purple' },
            ].map(({ step, icon:Icon, title, desc, color }, i) => (
              <motion.div key={step} initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }}
                viewport={{ once:true }} transition={{ delay:i*0.12 }}
                className="relative p-6 rounded-3xl border-2 border-border hover:border-border-strong transition-all duration-250 bg-canvas group">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center mb-4 group-hover:scale-105 transition-transform`}>
                  <Icon className="w-5 h-5 text-ink" />
                </div>
                <span className="absolute top-5 right-5 text-xs font-mono text-ink-faint">{step}</span>
                <h3 className="text-base font-sans font-700 text-ink mb-2">{title}</h3>
                <p className="text-sm text-ink-muted leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────── */}
      <section className="py-24">
        <div className="page-container">
          <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
            className="relative rounded-4xl bg-ink overflow-hidden p-10 lg:p-16 text-center noise-overlay">
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-scarr-red/10 blur-[60px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-pastel-blue/10 blur-[60px] pointer-events-none" />
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 bg-white/10 text-white text-xs font-700 px-4 py-2 rounded-pill mb-6 backdrop-blur-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-scarr-red animate-pulse" />
                Join 12,000+ freelancers
              </div>
              <h2 className="text-3xl lg:text-5xl font-display font-700 text-white mb-4 leading-tight">
                Ready to do the best<br />work of your life?
              </h2>
              <p className="text-white/60 text-base mb-8 max-w-md mx-auto">
                Whether you're hiring or getting hired — SCARR is where the best work happens.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Link to="/register" className="bg-scarr-red text-white px-8 py-3.5 rounded-pill text-sm font-700 hover:-translate-y-0.5 hover:shadow-btn-red transition-all duration-200">
                  Get started free
                </Link>
                <Link to="/gigs" className="bg-white/10 text-white px-8 py-3.5 rounded-pill text-sm font-700 hover:bg-white/20 transition-all duration-200">
                  Browse gigs
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </PageLayout>
  );
}
