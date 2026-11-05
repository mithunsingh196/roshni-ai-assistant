import React, { useState } from 'react';
import { User, Sparkles, X } from 'lucide-react';
import { ShikhaAvatar } from './ShikhaAvatar';

interface UserNameModalProps {
  isOpen: boolean;
  onSave: (name: string) => void;
  onClose: () => void;
  initialName?: string;
  isFirstTime?: boolean;
}

export const UserNameModal: React.FC<UserNameModalProps> = ({
  isOpen,
  onSave,
  onClose,
  initialName = '',
  isFirstTime = false,
}) => {
  const [name, setName] = useState(initialName);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSave(name.trim());
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-xs rounded-3xl bg-zinc-900 border border-zinc-800 shadow-2xl p-5 text-zinc-100">
        <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <ShikhaAvatar size="sm" />
            <span className="font-bold text-xs text-amber-300">Shikha ji ki Pehchaan</span>
          </div>
          {!isFirstTime && (
            <button
              onClick={onClose}
              className="p-1 rounded-full text-zinc-400 hover:text-zinc-200 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="text-center my-4">
          <div className="inline-block p-3 rounded-full bg-amber-500/10 border border-amber-500/30 mb-2">
            <Sparkles className="w-6 h-6 text-amber-400" />
          </div>
          <h3 className="font-bold text-base text-zinc-100">
            {isFirstTime ? 'Namaste ji!' : 'Apna Naam Badlein'}
          </h3>
          <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
            {isFirstTime
              ? 'Main aapko kis naam se pukaaroon? Apna shubh naam bataiye.'
              : 'Shikha ji aapko is naam se samman ke sath pukaarengi.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="relative">
            <User className="absolute left-3 top-3 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Jaise: Rahul, Priya, Amit..."
              className="w-full bg-zinc-950 border border-zinc-700 focus:border-amber-500 rounded-xl pl-9 pr-3 py-2 text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-amber-500 font-medium"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            {isFirstTime && (
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-zinc-300 transition-colors cursor-pointer"
              >
                Baad me
              </button>
            )}
            <button
              type="submit"
              disabled={!name.trim()}
              className="flex-1 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 disabled:opacity-40 hover:from-amber-400 hover:to-orange-400 text-zinc-950 font-bold text-xs transition-all shadow-md shadow-amber-500/20 cursor-pointer"
            >
              Theek Hai (Save)
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
