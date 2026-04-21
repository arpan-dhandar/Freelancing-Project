export default function MessageBubble({ message, isOwn }) {
  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[72%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
        isOwn
          ? 'bg-ink text-white rounded-br-sm'
          : 'bg-surface border border-border text-ink rounded-bl-sm'
      }`}>
        <p>{message.desc}</p>
        {message.createdAt && (
          <p className={`text-[10px] mt-1 ${isOwn ? 'text-white/50' : 'text-ink-faint'}`}>
            {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        )}
      </div>
    </div>
  );
}
