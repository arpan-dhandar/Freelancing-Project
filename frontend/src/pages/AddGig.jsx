import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, X } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import { Button, Input, Textarea, Eyebrow } from '../components/ui';
import { gigAPI } from '../api/services';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const CATS = ['design','web-dev','writing','video','photo','consulting'];

const INITIAL = {
  title:'', cat:'design', cover:'', desc:'', shortTitle:'', shortDesc:'',
  deliveryTime:'', revisionNumber:'', price:'', features:[],
};

export default function AddGig() {
  const { currentUser } = useAuth();
  const navigate        = useNavigate();
  const [form, setForm]       = useState(INITIAL);
  const [feat, setFeat]       = useState('');
  const [loading, setLoading] = useState(false);

  if (!currentUser?.isSeller) {
    return (
      <PageLayout>
        <div className="page-container py-24 text-center">
          <div className="text-5xl mb-4">🚫</div>
          <p className="text-xl font-display font-700 text-ink mb-2">Sellers only</p>
          <p className="text-sm text-ink-muted mb-6">You need a seller account to post gigs.</p>
          <Button variant="red" onClick={() => navigate('/register')}>Become a Seller</Button>
        </div>
      </PageLayout>
    );
  }

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const addFeature = () => {
    if (!feat.trim()) return;
    setForm((p) => ({ ...p, features: [...p.features, feat.trim()] }));
    setFeat('');
  };

  const removeFeature = (i) =>
    setForm((p) => ({ ...p, features: p.features.filter((_,idx) => idx !== i) }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.cover) return toast.error('Please add a cover image URL.');
    setLoading(true);
    try {
      const payload = {
        ...form,
        price:          Number(form.price),
        deliveryTime:   Number(form.deliveryTime),
        revisionNumber: Number(form.revisionNumber),
      };
      const { data } = await gigAPI.createGig(payload);
      const gig = data.data || data;
      toast.success('Gig published! 🎉');
      navigate(`/gig/${gig._id}`);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout>
      <div className="page-container py-10 max-w-2xl">
        <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }}>
          <Eyebrow>Seller Studio</Eyebrow>
          <h1 className="text-3xl font-display font-700 text-ink mb-8">Post a New Gig</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic info */}
            <div className="bg-surface rounded-2xl border border-border p-6 space-y-4">
              <h2 className="text-sm font-sans font-700 text-ink">Basic Info</h2>
              <Input label="Title *" name="title" placeholder="e.g. I will design a premium brand identity" value={form.title} onChange={handleChange} required />
              <Input label="Short Title *" name="shortTitle" placeholder="Short display name" value={form.shortTitle} onChange={handleChange} required />

              <div className="flex flex-col gap-1.5">
                <label className="scarr-label">Category *</label>
                <select name="cat" value={form.cat} onChange={handleChange} className="scarr-input">
                  {CATS.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-surface rounded-2xl border border-border p-6 space-y-4">
              <h2 className="text-sm font-sans font-700 text-ink">Pricing & Delivery</h2>
              <div className="grid grid-cols-3 gap-4">
                <Input label="Price ($) *"     name="price"          type="number" placeholder="299"  value={form.price}          onChange={handleChange} required />
                <Input label="Delivery (days)*" name="deliveryTime"   type="number" placeholder="7"    value={form.deliveryTime}   onChange={handleChange} required />
                <Input label="Revisions *"      name="revisionNumber" type="number" placeholder="3"    value={form.revisionNumber} onChange={handleChange} required />
              </div>
            </div>

            {/* Description */}
            <div className="bg-surface rounded-2xl border border-border p-6 space-y-4">
              <h2 className="text-sm font-sans font-700 text-ink">Description</h2>
              <Textarea label="Short Description *" name="shortDesc" rows={2}
                placeholder="One line summary of what you deliver"
                value={form.shortDesc} onChange={handleChange} />
              <Textarea label="Full Description *" name="desc" rows={6}
                placeholder="Describe your service in detail — experience, process, what's included…"
                value={form.desc} onChange={handleChange} />
            </div>

            {/* Cover image */}
            <div className="bg-surface rounded-2xl border border-border p-6 space-y-4">
              <h2 className="text-sm font-sans font-700 text-ink">Cover Image</h2>
              <Input label="Cover Image URL *" name="cover" placeholder="https://images.unsplash.com/…" value={form.cover} onChange={handleChange} required />
              {form.cover && (
                <img src={form.cover} alt="Cover preview"
                  className="w-full aspect-video object-cover rounded-xl border border-border" />
              )}
            </div>

            {/* Features */}
            <div className="bg-surface rounded-2xl border border-border p-6 space-y-4">
              <h2 className="text-sm font-sans font-700 text-ink">What's Included</h2>
              <div className="flex gap-2">
                <input value={feat} onChange={(e) => setFeat(e.target.value)}
                  onKeyDown={(e) => { if (e.key==='Enter') { e.preventDefault(); addFeature(); } }}
                  placeholder="e.g. Source files included"
                  className="scarr-input flex-1" />
                <Button type="button" variant="outline" size="md" onClick={addFeature}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              {form.features.length > 0 && (
                <ul className="space-y-2">
                  {form.features.map((f, i) => (
                    <li key={i} className="flex items-center justify-between bg-surface-2 px-3 py-2 rounded-xl text-sm text-ink">
                      <span>✓ {f}</span>
                      <button type="button" onClick={() => removeFeature(i)}
                        className="text-ink-faint hover:text-red-500 transition-colors">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <Button type="submit" variant="red" size="lg" loading={loading} className="w-full">
              Publish Gig
            </Button>
          </form>
        </motion.div>
      </div>
    </PageLayout>
  );
}
