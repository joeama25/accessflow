import React from 'react';
import { Landmark, Power, ArrowUpRight, Plus, Clock, SlidersHorizontal, Volume2 } from 'lucide-react';
import { getT } from '../lib/translations';
import { playAIVoice } from '../utils/aiVoice';

export const HomeScreen = ({
  account, transactions, language, highContrast = false, largeTouchTargets = false,
  afOn, preferences, onNavigateSendMoney, onNavigateSettings, onSwitchOff
}) => {
  const t = getT(language);
  const isVoiceActive = afOn && preferences?.tts;

  const formatCurrency = (val) => {
    const num = Number(val);
    if (isNaN(num)) return "0.00";
    return num.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <div className={`flex flex-col h-full overflow-y-auto p-5 space-y-5 select-none ${highContrast ? 'bg-black text-yellow-300' : 'bg-white text-slate-900'}`}>
      <header className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-2">
          <div className={`flex items-center justify-center shadow-sm ${largeTouchTargets ? 'w-12 h-12 rounded-2xl' : 'w-8 h-8 rounded-xl'} ${highContrast ? 'bg-black border-2 border-yellow-400 text-yellow-400' : 'bg-[#123628] text-white'}`}>
            <Landmark className={largeTouchTargets ? "w-6 h-6" : "w-4 h-4"} />
          </div>
          <span className={`font-black tracking-tight ${largeTouchTargets ? "text-2xl" : "text-xl"}`}>{t.appName}</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onSwitchOff}
            className={`rounded-full border flex items-center justify-center transition-colors ${largeTouchTargets ? "w-12 h-12" : "w-9 h-9"} ${highContrast ? 'border-yellow-400 text-yellow-400 hover:bg-neutral-900' : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}
          >
            <Power className={largeTouchTargets ? "w-6 h-6" : "w-4 h-4"} />
          </button>
          {account.avatar ? (
            <img src={account.avatar} alt={account.name} className={`rounded-full object-cover border-2 shadow-sm ${largeTouchTargets ? "w-12 h-12" : "w-9 h-9"} ${highContrast ? 'border-yellow-400' : 'border-emerald-500'}`} />
          ) : (
            <div className={`rounded-full font-bold flex items-center justify-center ${largeTouchTargets ? "w-12 h-12 text-sm" : "w-9 h-9 text-xs"} ${highContrast ? 'bg-yellow-400 text-black' : 'bg-emerald-700 text-white'}`}>AO</div>
          )}
        </div>
      </header>

      <div className="space-y-0.5 mt-2">
        <p className={`font-bold tracking-wider uppercase ${largeTouchTargets ? "text-sm" : "text-[11px]"} ${highContrast ? 'text-yellow-400' : 'text-slate-400'}`}>{t.goodMorning}</p>
        <h1 className={`font-black tracking-tight ${largeTouchTargets ? "text-3xl" : "text-2xl"}`}>{account.name}</h1>
      </div>

      <section className={`rounded-3xl transition-all shadow-md relative ${largeTouchTargets ? 'p-7' : 'p-6'} ${highContrast ? 'bg-black border-2 border-yellow-400 text-yellow-300' : 'bg-[#123628] text-white'}`}>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-3">
            <span className={`font-semibold tracking-wider uppercase ${largeTouchTargets ? "text-sm" : "text-[11px]"} ${highContrast ? 'text-yellow-400' : 'text-emerald-300'}`}>
              {t.availableBalance}
            </span>
            {isVoiceActive && (
              <button 
                onClick={() => playAIVoice(`${t.availableBalance}: ${formatCurrency(account.balance)} Naira.`, language)} 
                className={highContrast ? 'text-yellow-400 p-2' : 'text-emerald-300 p-2'}
              >
                <Volume2 className={largeTouchTargets ? "w-6 h-6" : "w-5 h-5"} />
              </button>
            )}
          </div>
          
          <h2 className={`font-black font-mono tracking-tight tabular-nums leading-tight mb-3 ${largeTouchTargets ? "text-4xl" : "text-3xl"}`}>
            ₦{formatCurrency(account.balance)}
          </h2>

          <div className={`font-medium flex items-center gap-2 ${largeTouchTargets ? "text-sm" : "text-xs"} ${highContrast ? 'text-yellow-200' : 'text-emerald-200/80'}`}>
            <span>•••• {account.account}</span>
            <span>·</span>
            <span>{t.savings}</span>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className={`font-bold ${largeTouchTargets ? "text-lg" : "text-sm"}`}>{t.quickActions}</h3>
          <button onClick={onNavigateSettings} className={`font-semibold ${largeTouchTargets ? "text-sm" : "text-xs"} ${highContrast ? 'text-yellow-400' : 'text-slate-400'}`}>{t.manage}</button>
        </div>
        <div className="grid grid-cols-4 gap-3 text-center">
          {[
            { icon: ArrowUpRight, label: t.sendMoney, onClick: onNavigateSendMoney },
            { icon: Plus, label: t.deposit, onClick: () => {} },
            { icon: Clock, label: t.history, onClick: () => {} },
            { icon: SlidersHorizontal, label: t.settings, onClick: onNavigateSettings }
          ].map((item, i) => (
            <button key={i} onClick={item.onClick} className={`flex flex-col items-center gap-2 group`}>
              <div className={`rounded-2xl flex items-center justify-center transition-all group-hover:scale-105 active:scale-95 shadow-sm ${largeTouchTargets ? 'w-16 h-16' : 'w-14 h-14'} ${highContrast ? 'bg-black border-2 border-yellow-400 text-yellow-400' : 'bg-[#f4f7f5] text-slate-800'}`}>
                <item.icon className={largeTouchTargets ? 'w-8 h-8' : 'w-6 h-6'} />
              </div>
              <span className={`font-bold leading-tight ${largeTouchTargets ? 'text-xs' : 'text-[11px]'} ${highContrast ? 'text-yellow-400' : 'text-slate-700'}`}>{item.label}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-3 pb-4">
        <div className="flex items-center justify-between">
          <h3 className={`font-bold ${largeTouchTargets ? "text-lg" : "text-sm"}`}>{t.recentActivity}</h3>
          <span className={`font-semibold ${largeTouchTargets ? "text-sm" : "text-xs"} ${highContrast ? 'text-yellow-400' : 'text-slate-400'}`}>{t.seeAll}</span>
        </div>
        <div className={`rounded-2xl border shadow-sm divide-y overflow-hidden ${highContrast ? 'bg-black border-yellow-400 divide-yellow-400/30' : 'bg-white border-slate-100 divide-slate-100'}`}>
          {transactions.map((tx) => (
            <div key={tx.id} className={`flex items-center justify-between transition-colors ${largeTouchTargets ? 'p-5' : 'p-3.5'} ${highContrast ? 'hover:bg-neutral-900' : 'hover:bg-slate-50'}`}>
              <div className="flex items-center gap-3">
                <div className={`rounded-full font-bold flex items-center justify-center overflow-hidden ${largeTouchTargets ? 'w-12 h-12 text-sm' : 'w-9 h-9 text-xs'} ${highContrast ? 'bg-black border border-yellow-400 text-yellow-400' : 'bg-slate-100 text-slate-800'}`}>
                  {tx.recipientOrSender.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h4 className={`font-bold ${largeTouchTargets ? 'text-sm' : 'text-xs'}`}>{tx.title}</h4>
                  <p className={`${largeTouchTargets ? 'text-xs' : 'text-[10px]'} ${highContrast ? 'text-yellow-200' : 'text-slate-400'}`}>{tx.bankName}</p>
                </div>
              </div>
              <div className="text-right">
                <span className={`font-black font-mono block ${largeTouchTargets ? 'text-sm' : 'text-xs'} ${highContrast ? 'text-yellow-400' : 'text-slate-900'}`}>
                  {tx.direction === 'IN' ? '+' : '-'}₦{formatCurrency(tx.amount)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};