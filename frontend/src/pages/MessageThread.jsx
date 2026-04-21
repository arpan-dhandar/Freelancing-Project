import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Send } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import MessageBubble from '../components/message/MessageBubble';
import { Skeleton } from '../components/ui';
import { messageAPI, conversationAPI } from '../api/services';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function MessageThread() {
  const { id }          = useParams();
  const { currentUser } = useAuth();
  const navigate        = useNavigate();
  const bottomRef       = useRef(null);

  const [messages, setMessages] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [text, setText]         = useState('');
  const [sending, setSending]   = useState(false);

  const fetchMessages = async () => {
    try {
      const [msgRes] = await Promise.all([
        messageAPI.getMessages(id),
        conversationAPI.updateConversation(id),
      ]);
      setMessages(msgRes.data.data || msgRes.data || []);
    } catch { toast.error('Could not load messages.'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchMessages(); }, [id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setSending(true);
    try {
      const { data } = await messageAPI.createMessage({ conversationId: id, desc: text });
      setMessages((prev) => [...prev, data.data || data]);
      setText('');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <PageLayout noFooter>
      <div className="flex flex-col h-[calc(100vh-64px)]">
        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-4 bg-surface border-b border-border">
          <button onClick={() => navigate('/messages')}
            className="p-1.5 rounded-xl hover:bg-surface-2 text-ink-muted hover:text-ink transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pastel-blue to-pastel-purple flex items-center justify-center text-xs font-700 text-ink">
            M
          </div>
          <div>
            <p className="text-sm font-sans font-600 text-ink">Conversation</p>
            <p className="text-xs text-ink-faint">#{id.slice(-8)}</p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-5 py-6 space-y-3 bg-canvas">
          {loading ? (
            <div className="space-y-3">
              {[1,2,3].map((i) => (
                <div key={i} className={`flex ${i%2===0 ? 'justify-end' : 'justify-start'}`}>
                  <Skeleton className={`h-10 w-48 rounded-2xl`} />
                </div>
              ))}
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="text-4xl mb-3">👋</div>
              <p className="text-sm font-sans font-600 text-ink mb-1">Start the conversation</p>
              <p className="text-xs text-ink-faint">Say hello and describe what you need</p>
            </div>
          ) : (
            messages.map((msg) => (
              <motion.div key={msg._id} initial={{ opacity:0, y:6 }} animate={{ opacity:1, y:0 }}>
                <MessageBubble message={msg} isOwn={msg.userId === currentUser?._id} />
              </motion.div>
            ))
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSend}
          className="flex items-center gap-3 px-5 py-4 bg-surface border-t border-border">
          <input
            value={text} onChange={(e) => setText(e.target.value)}
            placeholder="Type a message…"
            className="scarr-input flex-1"
            disabled={sending}
          />
          <button type="submit" disabled={sending || !text.trim()}
            className="btn-red px-4 py-3 disabled:opacity-40 disabled:cursor-not-allowed">
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </PageLayout>
  );
}
