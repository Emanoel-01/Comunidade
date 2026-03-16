import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Star, X } from 'lucide-react';

export default function GamificationToast({ user }) {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    if (!user) return;

    // Inscreve em novas notificações de gamificação em tempo real
    const unsub = base44.entities.Notification.subscribe((event) => {
      if (
        event.type === 'create' &&
        event.data?.user_id === user.id &&
        event.data?.type === 'gamification'
      ) {
        const notif = event.data;
        const id = event.id || Date.now().toString();
        setToasts(prev => [...prev, { id, ...notif }]);

        // Auto-remove após 5s
        setTimeout(() => {
          setToasts(prev => prev.filter(t => t.id !== id));
        }, 5000);
      }
    });

    return unsub;
  }, [user]);

  const dismiss = (id) => setToasts(prev => prev.filter(t => t.id !== id));

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-4 z-50 flex flex-col gap-2 max-w-xs w-full pointer-events-none">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className="pointer-events-auto bg-indigo-700 text-white rounded-2xl shadow-xl px-4 py-3 flex items-start gap-3 animate-in slide-in-from-bottom-4 fade-in duration-300"
        >
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center shrink-0 text-base">
            <Star size={16} className="text-yellow-300" />
          </div>
          <div className="flex-grow min-w-0">
            <p className="font-bold text-sm leading-tight">{toast.title}</p>
            <p className="text-indigo-200 text-xs mt-0.5 leading-snug line-clamp-2">{toast.message}</p>
          </div>
          <button
            onClick={() => dismiss(toast.id)}
            className="shrink-0 text-indigo-200 hover:text-white transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}