import { ArrowLeft, ChevronRight, Shield, CreditCard, Bell, HelpCircle, Smartphone, Info, Sliders, LogOut } from "lucide-react";
import { getT } from "../lib/translations";

export function BankSettingsScreen({ settings, onNavigateSetupProfile, onBack, onLogout, largeTouchTargets }) {
  const t = getT(settings.savedProfile.languageBarrier.useLocalDialect ? settings.savedProfile.languageBarrier.selectedDialect : 'en');

  const itemClass = `w-full flex items-center justify-between transition-colors ${largeTouchTargets ? "p-5" : "p-3.5"}`;
  const iconClass = `rounded-xl flex items-center justify-center ${largeTouchTargets ? "w-12 h-12" : "w-8 h-8"}`;
  const titleClass = `font-bold ${largeTouchTargets ? "text-sm" : "text-xs"}`;
  const descClass = `mt-0.5 ${largeTouchTargets ? "text-xs" : "text-[10px]"}`;

  return (
    <div className="flex flex-col h-full overflow-y-auto p-5 space-y-5 select-none bg-white text-slate-900">
       <div className="flex items-center gap-3 pt-1">
        <button onClick={onBack} className={`flex flex-none items-center justify-center rounded-full border border-slate-200 hover:bg-slate-50 transition-colors ${largeTouchTargets ? "w-12 h-12" : "w-10 h-10"}`}>
          <ArrowLeft className={largeTouchTargets ? "w-6 h-6" : "w-5 h-5"} />
        </button>
        <div>
          <h1 className={`font-black tracking-tight ${largeTouchTargets ? "text-2xl" : "text-xl"}`}>{t.settings}</h1>
          <p className={`text-slate-400 ${largeTouchTargets ? "text-sm" : "text-[11px]"}`}>{t.setupProfileDesc}</p>
        </div>
      </div>

      <section className="space-y-2.5">
        <span className="text-[11px] font-bold text-slate-400 tracking-wider uppercase">{t.accessibilityEngine}</span>
        
        <button onClick={onNavigateSetupProfile} className={`w-full rounded-3xl border border-emerald-600/30 bg-[#f3f8f5] hover:bg-[#e4ede7] text-left flex items-center justify-between transition-all group shadow-sm active:scale-99 ${largeTouchTargets ? "p-5" : "p-4"}`}>
          <div className="flex items-center gap-3">
            <div className={`rounded-2xl bg-[#123628] text-white flex items-center justify-center shadow-sm ${largeTouchTargets ? "w-14 h-14" : "w-10 h-10"}`}>
              <Sliders className={largeTouchTargets ? "w-7 h-7" : "w-5 h-5"} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className={`font-bold text-slate-900 group-hover:text-[#123628] ${largeTouchTargets ? "text-base" : "text-xs"}`}>{t.setupProfileButton}</h3>
                {settings.accessFlowActive ? (
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-200 text-emerald-900 uppercase tracking-wider">Active</span>
                ) : (
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-200 text-slate-600 uppercase tracking-wider">Off</span>
                )}
              </div>
              <p className={`text-slate-500 mt-1 ${largeTouchTargets ? "text-sm" : "text-[10px]"}`}>{t.setupProfileDesc}</p>
            </div>
          </div>
          <ChevronRight className={`text-slate-400 group-hover:text-[#123628] ${largeTouchTargets ? "w-7 h-7" : "w-5 h-5"}`} />
        </button>
      </section>

      <section className="space-y-2.5 pb-6">
        <span className="text-[11px] font-bold text-slate-400 tracking-wider uppercase">{t.generalSettings}</span>
        <div className="rounded-3xl border border-slate-200/90 bg-white shadow-sm divide-y divide-slate-100 overflow-hidden">
           
           <div className={itemClass}>
            <div className="flex items-center gap-3">
              <div className={`bg-slate-100 text-slate-700 ${iconClass}`}><Shield className={largeTouchTargets ? "w-6 h-6" : "w-4 h-4"} /></div>
              <div>
                <h4 className={`text-slate-900 ${titleClass}`}>{t.securityBiometrics}</h4>
                <p className={`text-slate-400 ${descClass}`}>{t.securityBiometricsDesc}</p>
              </div>
            </div>
            <ChevronRight className={largeTouchTargets ? "w-6 h-6 text-slate-400" : "w-4 h-4 text-slate-400"} />
          </div>
          
          <div className={itemClass}>
            <div className="flex items-center gap-3">
              <div className={`bg-slate-100 text-slate-700 ${iconClass}`}><CreditCard className={largeTouchTargets ? "w-6 h-6" : "w-4 h-4"} /></div>
              <div>
                <h4 className={`text-slate-900 ${titleClass}`}>{t.cardsLimits}</h4>
                <p className={`text-slate-400 ${descClass}`}>{t.cardsLimitsDesc}</p>
              </div>
            </div>
            <ChevronRight className={largeTouchTargets ? "w-6 h-6 text-slate-400" : "w-4 h-4 text-slate-400"} />
          </div>
          
          <div className={itemClass}>
            <div className="flex items-center gap-3">
              <div className={`bg-slate-100 text-slate-700 ${iconClass}`}><Bell className={largeTouchTargets ? "w-6 h-6" : "w-4 h-4"} /></div>
              <div>
                <h4 className={`text-slate-900 ${titleClass}`}>{t.notificationsAlerts}</h4>
                <p className={`text-slate-400 ${descClass}`}>{t.notificationsAlertsDesc}</p>
              </div>
            </div>
            <ChevronRight className={largeTouchTargets ? "w-6 h-6 text-slate-400" : "w-4 h-4 text-slate-400"} />
          </div>
          
          <div className={itemClass}>
            <div className="flex items-center gap-3">
              <div className={`bg-slate-100 text-slate-700 ${iconClass}`}><Smartphone className={largeTouchTargets ? "w-6 h-6" : "w-4 h-4"} /></div>
              <div>
                <h4 className={`text-slate-900 ${titleClass}`}>{t.manageDevices}</h4>
                <p className={`text-slate-400 ${descClass}`}>{t.manageDevicesDesc}</p>
              </div>
            </div>
            <ChevronRight className={largeTouchTargets ? "w-6 h-6 text-slate-400" : "w-4 h-4 text-slate-400"} />
          </div>
          
          <div className={itemClass}>
            <div className="flex items-center gap-3">
              <div className={`bg-slate-100 text-slate-700 ${iconClass}`}><HelpCircle className={largeTouchTargets ? "w-6 h-6" : "w-4 h-4"} /></div>
              <div>
                <h4 className={`text-slate-900 ${titleClass}`}>{t.helpSupport}</h4>
                <p className={`text-slate-400 ${descClass}`}>{t.helpSupportDesc}</p>
              </div>
            </div>
            <ChevronRight className={largeTouchTargets ? "w-6 h-6 text-slate-400" : "w-4 h-4 text-slate-400"} />
          </div>
          
          <div className={itemClass}>
            <div className="flex items-center gap-3">
              <div className={`bg-slate-100 text-slate-700 ${iconClass}`}><Info className={largeTouchTargets ? "w-6 h-6" : "w-4 h-4"} /></div>
              <div>
                <h4 className={`text-slate-900 ${titleClass}`}>{t.aboutAstra}</h4>
                <p className={`text-slate-400 ${descClass}`}>{t.aboutAstraDesc}</p>
              </div>
            </div>
            <span className={`font-mono text-slate-400 ${largeTouchTargets ? "text-xs" : "text-[10px]"}`}>{t.verified}</span>
          </div>

          <button onClick={onLogout} className={`w-full flex items-center justify-between hover:bg-red-50 transition-colors text-left group ${largeTouchTargets ? "p-5" : "p-3.5"}`}>
            <div className="flex items-center gap-3">
              <div className={`bg-red-100 text-red-600 ${iconClass}`}><LogOut className={largeTouchTargets ? "w-6 h-6" : "w-4 h-4"} /></div>
              <div>
                <h4 className={`text-red-600 ${titleClass}`}>{t.logOut}</h4>
                <p className={`text-red-400 ${descClass}`}>{t.logOutDesc}</p>
              </div>
            </div>
            <ChevronRight className={`text-red-400 group-hover:text-red-600 ${largeTouchTargets ? "w-6 h-6" : "w-4 h-4"}`} />
          </button>
        </div>
      </section>
    </div>
  );
}