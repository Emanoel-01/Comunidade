import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { X, Users, UserPlus } from 'lucide-react';

export default function FollowersModal({ title, userIds, onClose, onViewProfile }) {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!userIds || userIds.length === 0) { setLoading(false); return; }
      const allProfiles = await base44.entities.UserProfile.list();

      const matched = userIds.map(id => {
        const p = allProfiles.find(pr => pr.user_id === id);
        return {
          user_id: id,
          display_name: p?.display_name || p?.role_label || 'Membro',
          avatar_url: p?.avatar_url || '',
          role_label: p?.role_label || '',
        };
      }).filter(Boolean);
      setProfiles(matched);
      setLoading(false);
    };
    load();
  }, [userIds]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm max-h-[70vh] flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h3 className="font-extrabold text-slate-900 flex items-center gap-2 text-base">
            <Users size={16} className="text-indigo-500" /> {title}
          </h3>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-100 rounded-full transition-colors">
            <X size={18} className="text-slate-500" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-3">
          {loading ? (
            <div className="space-y-3 p-2">
              {[1,2,3].map(i => <div key={i} className="h-14 bg-slate-100 rounded-xl animate-pulse" />)}
            </div>
          ) : profiles.length === 0 ? (
            <div className="text-center py-10 text-slate-400">
              <UserPlus size={28} className="mx-auto mb-2 opacity-30" />
              <p className="text-sm">Nenhum membro ainda.</p>
            </div>
          ) : (
            profiles.map(p => (
              <button
                key={p.user_id}
                onClick={() => { onViewProfile(p.user_id); onClose(); }}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors text-left"
              >
                <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm shrink-0 overflow-hidden">
                  {p.avatar_url
                    ? <img src={p.avatar_url} className="w-full h-full object-cover" alt="" />
                    : p.display_name?.charAt(0)?.toUpperCase()
                  }
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-slate-900 text-sm truncate">{p.display_name}</p>
                  {p.role_label && <p className="text-xs text-slate-400 truncate">{p.role_label}</p>}
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}