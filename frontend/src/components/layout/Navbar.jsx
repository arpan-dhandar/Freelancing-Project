import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sparkles, MessageSquare, ShoppingBag, User, LogOut, Plus, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const { currentUser, logout } = useAuth();
  const [scrolled, setScrolled]     = useState(false);
  const [menuOpen, setMenuOpen]     = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const location = useLocation();
  const navigate  = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); setProfileOpen(false); }, [location.pathname]);

  const handleLogout = async () => { await logout(); navigate('/'); };

  const NAV_LINKS = [
    { to: '/gigs', label: 'Browse' },
    ...(currentUser ? [
      { to: '/orders',   label: 'Orders'   },
      { to: '/messages', label: 'Messages' },
    ] : []),
    ...(currentUser?.isSeller ? [{ to: '/add-gig', label: '+ Post a Gig' }] : []),
  ];

  return (
    <motion.header
      initial={{ y: -8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.4 }}
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled ? 'bg-canvas/90 backdrop-blur-md border-b border-border shadow-card' : 'bg-transparent'
      }`}
    >
      <div className="page-container">
        <div className="flex items-center justify-between h-16">

          {/* Brand */}
          <Link to="/" className="group flex items-center gap-1.5">
            <span className="text-2xl font-display font-700 text-ink tracking-tight group-hover:text-scarr-red transition-colors duration-200">
              SCARR
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-scarr-red animate-pulse" />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map(({ to, label }) => (
              <Link key={to} to={to}
                className={`btn-ghost text-sm px-4 py-2 ${location.pathname === to ? 'text-ink bg-surface-2' : ''}`}>
                {label}
              </Link>
            ))}
          </nav>

          {/* Desktop auth */}
          <div className="hidden lg:flex items-center gap-3">
            {currentUser ? (
              <div className="relative">
                <button onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-pill hover:bg-surface-2 transition-colors group">
                  {currentUser.img
                    ? <img src={currentUser.img} alt={currentUser.username} className="w-7 h-7 rounded-full object-cover ring-2 ring-border" />
                    : <div className="w-7 h-7 rounded-full bg-gradient-to-br from-pastel-pink to-pastel-purple flex items-center justify-center text-xs font-700 text-ink">
                        {currentUser.username?.[0]?.toUpperCase()}
                      </div>
                  }
                  <span className="text-sm font-sans font-500 text-ink">{currentUser.username}</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-ink-muted transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.96 }} transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-52 bg-surface rounded-2xl border border-border shadow-card-hover overflow-hidden py-1.5"
                    >
                      {[
                        { to: `/profile/${currentUser._id}`, icon: User,         label: 'My Profile' },
                        { to: '/orders',                      icon: ShoppingBag,  label: 'Orders'     },
                        { to: '/messages',                    icon: MessageSquare,label: 'Messages'   },
                        ...(currentUser.isSeller ? [{ to: '/add-gig', icon: Plus, label: 'Post a Gig' }] : []),
                      ].map(({ to, icon: Icon, label }) => (
                        <Link key={to} to={to}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-ink-muted hover:text-ink hover:bg-surface-2 transition-colors">
                          <Icon className="w-4 h-4" />{label}
                        </Link>
                      ))}
                      <div className="h-px bg-border mx-3 my-1" />
                      <button onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors">
                        <LogOut className="w-4 h-4" />Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login"    className="btn-ghost text-sm">Sign In</Link>
                <Link to="/register" className="btn-red text-sm px-5 py-2.5">
                  <Sparkles className="w-3.5 h-3.5" /> Join Free
                </Link>
              </div>
            )}
          </div>

          {/* Mobile toggle */}
          <motion.button whileTap={{ scale: 0.9 }}
            className="lg:hidden p-2 rounded-xl hover:bg-surface-2 text-ink"
            onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </motion.button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.25 }}
            className="lg:hidden bg-surface border-t border-border overflow-hidden"
          >
            <div className="page-container py-5 flex flex-col gap-1">
              {NAV_LINKS.map(({ to, label }) => (
                <Link key={to} to={to}
                  className="px-4 py-2.5 text-sm font-sans text-ink-muted hover:text-ink hover:bg-surface-2 rounded-xl transition-colors">
                  {label}
                </Link>
              ))}
              {currentUser ? (
                <>
                  <Link to={`/profile/${currentUser._id}`}
                    className="px-4 py-2.5 text-sm font-sans text-ink-muted hover:text-ink hover:bg-surface-2 rounded-xl transition-colors">
                    My Profile
                  </Link>
                  <button onClick={handleLogout}
                    className="text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 rounded-xl transition-colors">
                    Sign Out
                  </button>
                </>
              ) : (
                <div className="flex gap-2 pt-2">
                  <Link to="/login"    className="btn-outline flex-1 text-sm justify-center">Sign In</Link>
                  <Link to="/register" className="btn-red    flex-1 text-sm justify-center">Join Free</Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
