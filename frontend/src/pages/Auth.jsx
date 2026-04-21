import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button, Input } from '../components/ui';
import PageLayout from '../components/layout/PageLayout';

const PANEL_STATS = [['12K+', 'Freelancers'], ['98%', 'Satisfaction'], ['2.4K', 'Projects/mo'], ['4.9', 'Avg Rating']];

// ── Login ─────────────────────────────────────────────────────────────────────
export function Login() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';
  const [form, setForm] = useState({ username: '', password: '' });
  const [showPw, setShowPw] = useState(false);

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  const handleSubmit = async (e) => {
    e.preventDefault();
    const r = await login(form);
    if (r.success) navigate(from, { replace: true });
  };

  return (
    <PageLayout noFooter>
      <div className="min-h-[calc(100vh-64px)] flex">
        {/* Left panel - Branding */}
        <div className="hidden lg:flex lg:w-1/2 bg-ink items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)', backgroundSize: '40px 40px' }} />
          <div className="absolute top-20 right-20 w-40 h-40 rounded-full bg-scarr-red/20 blur-[50px]" />
          <div className="relative z-10 text-center px-12">
            <div className="flex items-center justify-center gap-2 mb-6">
              <span className="text-4xl font-display font-bold text-white">SCARR</span>
              <span className="w-2 h-2 rounded-full bg-scarr-red animate-pulse" />
            </div>
            <p className="text-white/50 text-base leading-relaxed max-w-xs">
              The platform where elite talent and ambitious clients meet.
            </p>
            <div className="mt-10 grid grid-cols-2 gap-4">
              {PANEL_STATS.map(([v, l]) => (
                <div key={l} className="bg-white/5 rounded-2xl p-4 text-center border border-white/5">
                  <p className="text-2xl font-display font-bold text-white">{v}</p>
                  <p className="text-xs text-white/40 mt-1 uppercase tracking-widest">{l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right panel - Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
            <div className="mb-8">
              <h1 className="text-3xl font-display font-bold text-ink mb-2">Welcome back</h1>
              <p className="text-ink-muted text-sm">Sign in to your SCARR account</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input 
                label="Username" 
                name="username" 
                placeholder="your_username" 
                value={form.username} 
                onChange={handleChange} 
                required 
                autoComplete="username" // FIX: Added for console warning
              />
              <div className="flex flex-col gap-1.5">
                <label className="scarr-label">Password</label>
                <div className="relative">
                  <input 
                    name="password" 
                    type={showPw ? 'text' : 'password'} 
                    placeholder="••••••••"
                    value={form.password} 
                    onChange={handleChange} 
                    required 
                    autoComplete="current-password" // FIX: Added for console warning
                    className="scarr-input pr-10" 
                  />
                  <button type="button" onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-faint hover:text-ink transition-colors">
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <Button type="submit" variant="red" size="lg" loading={loading} className="w-full mt-2">Sign In</Button>
            </form>
            <p className="mt-6 text-sm text-center text-ink-muted">
              No account? <Link to="/register" className="text-scarr-red font-semibold hover:underline">Create one free</Link>
            </p>
          </motion.div>
        </div>
      </div>
    </PageLayout>
  );
}

// ── Register ──────────────────────────────────────────────────────────────────
export function Register() {
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: '', email: '', password: '', country: '', isSeller: false, desc: '',
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const r = await register(form);
    if (r.success) navigate('/login');
  };

  return (
    <PageLayout noFooter>
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-6 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <div className="mb-8 text-center">
            <div className="inline-flex items-center gap-2 bg-scarr-red-light text-scarr-red text-xs font-bold px-4 py-2 rounded-pill mb-4">
              <Sparkles className="w-3.5 h-3.5" /> Join 12,000+ freelancers
            </div>
            <h1 className="text-3xl font-display font-bold text-ink mb-2">Create your account</h1>
            <p className="text-ink-muted text-sm">Free forever. No credit card required.</p>
          </div>

          <div className="bg-surface rounded-3xl border border-border shadow-card p-7">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input 
                  label="Username *" 
                  name="username" 
                  placeholder="coolhandle" 
                  value={form.username} 
                  onChange={handleChange} 
                  required 
                  autoComplete="username" 
                />
                <Input label="Country *" name="country" placeholder="United States" value={form.country} onChange={handleChange} required />
              </div>
              <Input label="Email *" name="email" type="email" placeholder="you@email.com" value={form.email} onChange={handleChange} required autoComplete="email" />
              <Input 
                label="Password *" 
                name="password" 
                type="password" 
                placeholder="At least 8 chars" 
                value={form.password} 
                autoComplete="new-password" // FIX: new-password for registration
                onChange={handleChange} 
                required 
              />

              <label className="flex items-start gap-3 cursor-pointer group p-3 rounded-xl border border-border hover:border-ink hover:bg-surface-2 transition-all">
                <div className={`relative mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all flex-shrink-0 ${form.isSeller ? 'bg-scarr-red border-scarr-red' : 'border-border'}`}>
                  {form.isSeller && (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                  <input type="checkbox" name="isSeller" checked={form.isSeller} onChange={handleChange} className="sr-only" />
                </div>
                <div>
                  <p className="text-sm font-sans font-semibold text-ink">I want to sell on SCARR</p>
                  <p className="text-xs text-ink-muted mt-0.5">Post gigs and get hired for projects</p>
                </div>
              </label>

              <AnimatePresence>
                {form.isSeller && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }} 
                    animate={{ opacity: 1, height: 'auto' }} 
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="flex flex-col gap-1.5 pt-2">
                      <label className="scarr-label">Short Bio</label>
                      <textarea name="desc" rows={3} placeholder="What do you do?"
                        value={form.desc} onChange={handleChange} className="scarr-input resize-none" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <Button type="submit" variant="red" size="lg" loading={loading} className="w-full">
                Create Account
              </Button>
            </form>
          </div>
        </motion.div>
      </div>
    </PageLayout>
  );
}