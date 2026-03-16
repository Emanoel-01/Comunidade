import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Bell, CheckCheck, MessageCircle, ThumbsUp, Briefcase, Calendar, Download, ShieldCheck, Star } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const icons = {
  comment: <MessageCircle size={16} className="text-blue-500" />,
  like: <ThumbsUp size={16} className="text-indigo-500" />,
  job: <Briefcase size={16} className="text-emerald-500" />,
  material: <Download size={16} className="text-amber-500" />,
  event: <Calendar size={16} className="text-purple-500" />,
  admin: <ShieldCheck size={16} className="text-red-500" />,
  mention: <MessageCircle size={16} className="text-rose-500" />,
  gamification: <Star size={16} className="text-yellow-500" />,
};

export default function CommunityNotifications({ user }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    setLoading(true);
    const data = await base44.entities.Notification.filter({ user_id: user.id }, '-created_date', 30);
    setNotifications(data);
    setLoading(false);
  };

  const markAllRead = async () => {
    const unread = notifications.filter(n => !n.read);
    await Promise.all(unread.map(n => base44.entities.Notification.update(n.id, { read: true })));
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const markRead = async (notif) => {
    if (notif.read) return;
    await base44.entities.Notification.update(notif.id, { read: true });
    setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, read: true } : n));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="animate-in fade-in space-y-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Bell size={20} className="text-indigo-500" />
            Notificações
            {unreadCount > 0 && <span className="bg-indigo-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">{unreadCount}</span>}
          </h2>
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead} className="flex items-center gap-2 text-sm font-bold text-indigo-600 hover:underline">
            <CheckCheck size={16} /> Marcar todas como lidas
          </button>
        )}
      </div>

      {loading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="bg-white rounded-xl border border-slate-200 h-16 animate-pulse"></div>)}</div>
      ) : notifications.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400">
          <Bell size={40} className="mx-auto mb-3 opacity-30" />
          <p className="font-bold text-slate-600">Nenhuma notificação ainda.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map(notif => (
            <div
              key={notif.id}
              onClick={() => markRead(notif)}
              className={`flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-colors ${notif.read ? 'bg-white border-slate-200' : 'bg-indigo-50 border-indigo-200 hover:bg-indigo-100'}`}
            >
              <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${notif.read ? 'bg-slate-100' : 'bg-white shadow-sm'}`}>
                {icons[notif.type] || <Bell size={16} className="text-slate-400" />}
              </div>
              <div className="flex-grow overflow-hidden">
                <p className={`text-sm font-bold ${notif.read ? 'text-slate-700' : 'text-slate-900'}`}>{notif.title}</p>
                <p className="text-xs text-slate-500 mt-0.5">{notif.message}</p>
              </div>
              <div className="shrink-0 flex flex-col items-end gap-1">
                <p className="text-[10px] text-slate-400">{notif.created_date ? format(new Date(notif.created_date), "dd/MM HH:mm", { locale: ptBR }) : ''}</p>
                {!notif.read && <div className="w-2 h-2 rounded-full bg-indigo-500"></div>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}