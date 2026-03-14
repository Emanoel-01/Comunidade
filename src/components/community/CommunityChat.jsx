import React, { useState, useEffect, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { Send, MessageCircle, ArrowLeft, Search } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

function ChatWindow({ conversation, currentUser, currentProfile, onBack }) {
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState('');
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);

  const otherIdx = conversation.participant_ids.findIndex(id => id !== currentUser.id);
  const otherName = conversation.participant_names?.[otherIdx] || 'Membro';
  const otherAvatar = conversation.participant_avatars?.[otherIdx];

  useEffect(() => {
    loadMessages();
    // Marcar como lido
    const unread = (conversation.unread_by || []).filter(id => id !== currentUser.id);
    if (unread.length !== (conversation.unread_by || []).length) {
      base44.entities.ChatConversation.update(conversation.id, { unread_by: unread });
    }
    const unsub = base44.entities.ChatMessage.subscribe(event => {
      if (event.data?.conversation_id === conversation.id) {
        if (event.type === 'create') setMessages(prev => [...prev, event.data]);
      }
    });
    return unsub;
  }, [conversation.id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadMessages = async () => {
    const data = await base44.entities.ChatMessage.filter({ conversation_id: conversation.id }, 'created_date', 50);
    setMessages(data);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMsg.trim()) return;
    setSending(true);
    const otherId = conversation.participant_ids.find(id => id !== currentUser.id);
    await base44.entities.ChatMessage.create({
      conversation_id: conversation.id,
      sender_id: currentUser.id,
      sender_name: currentUser.full_name,
      sender_avatar: currentProfile?.avatar_url || '',
      content: newMsg.trim()
    });
    await base44.entities.ChatConversation.update(conversation.id, {
      last_message: newMsg.trim(),
      last_message_at: new Date().toISOString(),
      unread_by: [...(conversation.unread_by || []).filter(id => id !== currentUser.id), otherId]
    });
    setNewMsg('');
    setSending(false);
  };

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100 bg-slate-50">
        <button onClick={onBack} className="text-slate-500 hover:text-indigo-600 transition-colors"><ArrowLeft size={20} /></button>
        {otherAvatar ? (
          <img src={otherAvatar} className="w-9 h-9 rounded-full object-cover" alt="" />
        ) : (
          <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">{otherName.charAt(0)}</div>
        )}
        <div>
          <p className="font-bold text-slate-900 text-sm">{otherName}</p>
          <p className="text-xs text-emerald-500 font-medium">Online</p>
        </div>
      </div>

      {/* Mensagens */}
      <div className="flex-grow overflow-y-auto px-5 py-4 space-y-3">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 text-center">
            <MessageCircle size={36} className="mb-3 opacity-30" />
            <p className="text-sm font-medium">Inicie a conversa!</p>
          </div>
        )}
        {messages.map(msg => {
          const isMe = msg.sender_id === currentUser.id;
          return (
            <div key={msg.id} className={`flex items-end gap-2 ${isMe ? 'justify-end' : 'justify-start'}`}>
              {!isMe && (
                msg.sender_avatar
                  ? <img src={msg.sender_avatar} className="w-7 h-7 rounded-full object-cover shrink-0" alt="" />
                  : <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-xs shrink-0">{msg.sender_name?.charAt(0)}</div>
              )}
              <div className={`max-w-[72%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm ${isMe ? 'bg-indigo-600 text-white rounded-br-sm' : 'bg-slate-100 text-slate-800 rounded-bl-sm'}`}>
                <p>{msg.content}</p>
                <p className={`text-[10px] mt-1 ${isMe ? 'text-indigo-200' : 'text-slate-400'}`}>
                  {msg.created_date ? format(new Date(msg.created_date), "HH:mm", { locale: ptBR }) : ''}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t border-slate-100 bg-white">
        <form onSubmit={handleSend} className="flex items-center gap-2">
          <input
            type="text"
            value={newMsg}
            onChange={e => setNewMsg(e.target.value)}
            placeholder="Digite uma mensagem..."
            className="flex-grow border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <button
            type="submit"
            disabled={!newMsg.trim() || sending}
            className="w-10 h-10 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl flex items-center justify-center disabled:opacity-40 transition-colors"
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}

export default function CommunityChat({ user, profile }) {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeConv, setActiveConv] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadConversations();
    const unsub = base44.entities.ChatConversation.subscribe(event => {
      if (event.type === 'update' && event.data?.participant_ids?.includes(user.id)) {
        setConversations(prev => prev.map(c => c.id === event.id ? event.data : c));
      }
    });
    return unsub;
  }, []);

  const loadConversations = async () => {
    setLoading(true);
    const all = await base44.entities.ChatConversation.list('-last_message_at', 50);
    const mine = all.filter(c => (c.participant_ids || []).includes(user.id));
    setConversations(mine);
    setLoading(false);
  };

  const filtered = conversations.filter(c => {
    const otherIdx = c.participant_ids.findIndex(id => id !== user.id);
    const name = c.participant_names?.[otherIdx] || '';
    return name.toLowerCase().includes(search.toLowerCase());
  });

  if (activeConv) {
    return (
      <ChatWindow
        conversation={activeConv}
        currentUser={user}
        currentProfile={profile}
        onBack={() => { setActiveConv(null); loadConversations(); }}
      />
    );
  }

  return (
    <div className="animate-in fade-in space-y-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
        <h2 className="text-xl font-bold text-slate-900 mb-1">Mensagens</h2>
        <p className="text-sm text-slate-500">Suas conversas diretas com membros da comunidade.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar conversa..."
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
        </div>

        {loading ? (
          <div className="space-y-3 p-4">
            {[1, 2, 3].map(i => <div key={i} className="h-16 bg-slate-100 rounded-xl animate-pulse" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-slate-400">
            <MessageCircle size={36} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm font-medium text-slate-600">Nenhuma conversa ainda.</p>
            <p className="text-xs mt-1">Visite o perfil de um membro para iniciar.</p>
          </div>
        ) : (
          <div>
            {filtered.map(conv => {
              const otherIdx = conv.participant_ids.findIndex(id => id !== user.id);
              const otherName = conv.participant_names?.[otherIdx] || 'Membro';
              const otherAvatar = conv.participant_avatars?.[otherIdx];
              const hasUnread = (conv.unread_by || []).includes(user.id);
              return (
                <button
                  key={conv.id}
                  onClick={() => setActiveConv(conv)}
                  className="w-full flex items-center gap-3 px-5 py-4 hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0 text-left"
                >
                  <div className="relative">
                    {otherAvatar ? (
                      <img src={otherAvatar} className="w-11 h-11 rounded-full object-cover" alt="" />
                    ) : (
                      <div className="w-11 h-11 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">{otherName.charAt(0)}</div>
                    )}
                    {hasUnread && <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-indigo-600 rounded-full border-2 border-white"></span>}
                  </div>
                  <div className="flex-grow overflow-hidden">
                    <p className={`text-sm font-bold ${hasUnread ? 'text-indigo-700' : 'text-slate-900'}`}>{otherName}</p>
                    <p className="text-xs text-slate-500 truncate">{conv.last_message || 'Iniciar conversa'}</p>
                  </div>
                  {conv.last_message_at && (
                    <p className="text-[10px] text-slate-400 shrink-0">
                      {format(new Date(conv.last_message_at), "dd/MM", { locale: ptBR })}
                    </p>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}