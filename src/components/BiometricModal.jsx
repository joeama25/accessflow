import { useEffect, useState } from 'react';
import { ScanFace, Fingerprint, CheckCircle2 } from 'lucide-react';
import { playSuccessChime } from '../utils/audio';

export function BiometricModal({ isOpen, type = 'face', title = 'Face ID', subtitle = 'Looking for Face...', onSuccess, onCancel }) {
  const [status, setStatus] = useState('scanning');

  useEffect(() => {
    if (isOpen) {
      setStatus('scanning');
      const timer = setTimeout(() => {
        setStatus('verified');
        playSuccessChime();
        setTimeout(onSuccess, 900);
      }, 1600);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onSuccess]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-xs rounded-3xl bg-white p-6 shadow-2xl flex flex-col items-center text-center space-y-4">
        <div className="w-20 h-20 rounded-2xl bg-emerald-50 border-2 border-emerald-500/30 flex items-center justify-center relative">
          {status === 'scanning' ? (
            <>
              {type === 'face' ? <ScanFace className="w-10 h-10 text-emerald-900 animate-pulse" /> : <Fingerprint className="w-10 h-10 text-emerald-900 animate-pulse" />}
              <span className="absolute inset-0 rounded-2xl border-2 border-emerald-500 animate-ping opacity-30" />
            </>
          ) : (
            <CheckCircle2 className="w-12 h-12 text-emerald-600 animate-in zoom-in-50" />
          )}
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900">{status === 'verified' ? 'Verified!' : title}</h3>
          <p className="text-xs text-slate-500 mt-0.5">{status === 'verified' ? 'Authentication Successful' : subtitle}</p>
        </div>
        {status === 'scanning' && (
          <button onClick={onCancel} className="text-xs text-slate-400 hover:text-slate-700 font-medium pt-2">Cancel</button>
        )}
      </div>
    </div>
  );
}