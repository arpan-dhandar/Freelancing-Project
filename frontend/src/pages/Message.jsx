import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageSquare } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import { Skeleton, Eyebrow, EmptyState } from '../components/ui';
import { conversationAPI } from '../api/services';
import { useAuth } from '../context/AuthContext';
import { formatDistanceToNow } from '../utils/date';

export default function Messages() {
  const { currentUser }       = useAuth();
  const [convs, setConvs]     = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    conversationAPI.getConversations()
      .then(({ data }) => setConvs(data.data || data || []))
      .catch(() => setConvs([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <PageLayout>
      <div className="page-container py-10 max-w-3xl">
        <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }}>
          <Eyebrow>Inbox</Eyebrow>
          <h1 className="text-3xl font-display font-700 text-ink mb-8">Messages</h1>

          {loading ? (
            <div className="space-y-3">
              {Array.from({ length:5 }).map((_,i) => (
                <div key={i} className="flex items-center gap-4 p-4 bg-surface rounded-2xl border border-border">
                  <Skeleton className="w-10 h-10 rounded-full flex-shrink-0" />
                  <div className="flex-1 space-y-2"><Skeleton className="h-3.5 w-1/3" /><Skeleton className="h-3 w-2/3" /></div>
                </div>
              ))}
            </div>
          ) : convs.length === 0 ? (
            <EmptyState icon="💬" title="No conversations yet"
              desc="Order a gig or contact a seller to start messaging." />
          ) : (
            <div className="space-y-2">
              {convs.map((conv, i) => {
                const unread = currentUser?.isSeller ? !conv.readBySeller : !conv.readByBuyer;
                return (
                  <motion.div key={conv.id} initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.04 }}>
                    <Link to={`/messages/${conv.id}`}
                      className={`flex items-center gap-4 p-4 rounded-2xl border transition-all duration-200 hover:shadow-card ${
                        unread ? 'bg-scarr-red-light border-scarr-red/20' : 'bg-surface border-border hover:border-border-strong'
                      }`}>
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pastel-blue to-pastel-purple flex items-center justify-center text-sm font-700 text-ink flex-shrink-0">
                        <MessageSquare className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-0.5">
                          <p className={`text-sm font-sans truncate ${unread ? 'font-700 text-ink' : 'font-600 text-ink-muted'}`}>
                            {currentUser?.isSeller ? `Buyer: ${conv.buyerId?.slice(-6)}` : `Seller: ${conv.sellerId?.slice(-6)}`}
                          </p>
                          {conv.updatedAt && (
                            <span className="text-[11px] text-ink-faint flex-shrink-0 ml-2">
                              {formatDistanceToNow(conv.updatedAt)}
                            </span>
                          )}
                        </div>
                        <p className={`text-xs truncate ${unread ? 'text-ink' : 'text-ink-faint'}`}>
                          {conv.lastMessage || 'No messages yet'}
                        </p>
                      </div>
                      {unread && <span className="w-2.5 h-2.5 rounded-full bg-scarr-red flex-shrink-0" />}
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>
    </PageLayout>
  );
}
