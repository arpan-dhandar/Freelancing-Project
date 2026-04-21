import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageSquare, ExternalLink, ShoppingBag, CheckCircle, Clock } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import { Skeleton, Button, Eyebrow, EmptyState } from '../components/ui';
import { orderAPI, conversationAPI } from '../api/services';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Orders() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderAPI.getOrders()
      .then(({ data }) => setOrders(data.data || data || []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  const handleContact = async (order) => {
    const otherId = currentUser?.isSeller ? order.buyerId : order.sellerId;
    if (!otherId) return toast.error('Cannot find user to contact.');
    try {
      const { data } = await conversationAPI.createConversation({ to: otherId });
      navigate(`/messages/${(data.data || data).id}`);
    } catch { toast.error('Could not start conversation.'); }
  };

  const completed = orders.filter((o) => o.isCompleted).length;
  const pending   = orders.filter((o) => !o.isCompleted).length;

  return (
    <PageLayout>
      <div className="page-container py-10">
        <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }}>
          <Eyebrow>{currentUser?.isSeller ? 'Seller' : 'Buyer'} Dashboard</Eyebrow>
          <h1 className="text-3xl font-display font-700 text-ink mb-8">My Orders</h1>

          {!loading && (
            <div className="grid grid-cols-3 gap-4 mb-8 max-w-sm">
              {[
                { label:'Total',       value:orders.length, icon:ShoppingBag,  color:'text-ink'        },
                { label:'Completed',   value:completed,     icon:CheckCircle,  color:'text-green-500'  },
                { label:'In Progress', value:pending,       icon:Clock,        color:'text-yellow-500' },
              ].map(({ label, value, icon:Icon, color }) => (
                <div key={label} className="bg-surface rounded-2xl border border-border p-4 text-center">
                  <Icon className={`w-5 h-5 ${color} mx-auto mb-1.5`} />
                  <p className="text-xl font-display font-700 text-ink">{value}</p>
                  <p className="text-xs text-ink-muted">{label}</p>
                </div>
              ))}
            </div>
          )}

          {loading ? (
            <div className="space-y-3">
              {Array.from({ length:4 }).map((_,i) => (
                <div key={i} className="flex items-center gap-4 p-4 bg-surface rounded-2xl border border-border">
                  <Skeleton className="w-14 h-14 rounded-xl flex-shrink-0" />
                  <div className="flex-1 space-y-2"><Skeleton className="h-3.5 w-1/2" /><Skeleton className="h-3 w-1/4" /></div>
                  <Skeleton className="h-8 w-20 rounded-pill" />
                </div>
              ))}
            </div>
          ) : orders.length === 0 ? (
            <EmptyState icon="📭" title="No orders yet" desc="Browse gigs and place your first order!"
              action={<Link to="/gigs"><Button variant="red" size="md">Browse Gigs</Button></Link>} />
          ) : (
            <div className="space-y-3">
              {orders.map((order, i) => (
                <motion.div key={order._id} initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.05 }}
                  className="flex items-center gap-4 p-4 bg-surface rounded-2xl border border-border hover:border-border-strong hover:shadow-card transition-all duration-200">
                  <div className="flex-shrink-0 w-14 h-14 rounded-xl overflow-hidden bg-surface-2">
                    {order.img
                      ? <img src={order.img} alt="" className="w-full h-full object-cover" />
                      : <div className="w-full h-full bg-gradient-to-br from-pastel-blue to-pastel-purple flex items-center justify-center"><span className="text-xl">💼</span></div>
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-sans font-600 text-ink truncate mb-1">{order.title || 'Untitled Gig'}</p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`inline-flex items-center gap-1 text-xs font-600 px-2.5 py-0.5 rounded-pill ${order.isCompleted ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600'}`}>
                        {order.isCompleted ? <><CheckCircle className="w-3 h-3" />Completed</> : <><Clock className="w-3 h-3" />In Progress</>}
                      </span>
                      <span className="text-sm font-700 text-ink">${order.price}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button onClick={() => handleContact(order)} className="btn-ghost text-xs gap-1.5 hidden sm:flex">
                      <MessageSquare className="w-3.5 h-3.5" />Contact
                    </button>
                    {order.gigId && (
                      <Link to={`/gig/${order.gigId}`} className="btn-ghost text-xs gap-1.5 hidden sm:flex">
                        <ExternalLink className="w-3.5 h-3.5" />View Gig
                      </Link>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </PageLayout>
  );
}
