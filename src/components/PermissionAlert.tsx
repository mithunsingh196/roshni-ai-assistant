import React from 'react';
import { MicOff, AlertCircle, X, ShieldAlert, RotateCw } from 'lucide-react';

interface PermissionAlertProps {
  onDismiss: () => void;
  onRetry: () => void;
  message?: string;
}

export const PermissionAlert: React.FC<PermissionAlertProps> = ({
  onDismiss,
  onRetry,
  message,
}) => {
  return (
    <div className="mx-4 my-2 p-3.5 rounded-2xl bg-gradient-to-r from-red-950/70 via-zinc-900 to-amber-950/50 border border-amber-500/40 shadow-lg text-zinc-200">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 shrink-0 mt-0.5">
          <MicOff className="w-5 h-5 text-amber-400" />
        </div>

        <div className="flex-1 text-xs leading-relaxed">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-amber-300 text-sm flex items-center gap-1.5">
              <span>Microphone Permission Chahiye</span>
            </h4>
            <button
              onClick={onDismiss}
              className="text-zinc-400 hover:text-zinc-200 p-1"
              aria-label="Dismiss alert"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="mt-1 text-zinc-300">
            {message ||
              'Aapke browser ne microphone permission roki hui hai. Shikha ji se baat karne ke liye kripya microphone allow karein.'}
          </p>

          <div className="mt-2.5 p-2 rounded-lg bg-zinc-950/70 border border-zinc-800 text-[11px] text-zinc-400 space-y-1">
            <p className="font-semibold text-zinc-300">Kaise chalu karein:</p>
            <p>1. Address bar me upar 🔒 lock ya settings icon par tap karein.</p>
            <p>2. "Microphone" ko <strong>Allow</strong> par set karein.</p>
            <p>3. Fir neeche 'Dobara Koshish Karein' par tap karein.</p>
          </div>

          <div className="mt-3 flex items-center gap-2">
            <button
              onClick={onRetry}
              className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm shadow-amber-500/30"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>Dobara Koshish Karein</span>
            </button>
            <button
              onClick={onDismiss}
              className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium transition-colors"
            >
              Text Mode Use Karein
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
