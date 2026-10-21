import { ArrowUpRight, Clock, Plus, Settings2, Volume2, Landmark, LogOut } from "lucide-react";
import { COPY, DEMO_BALANCE, formatNaira } from "../lib/accessflow";
import { speak } from "../hooks/use-speech";
import { CONTACTS, RECENT_AMOUNTS, USER } from "../data";

export function HomeScreen({ afOn, activeProfiles, lang, preferences, onSend, onSettings, onLogout }) {
  const isLang = afOn && activeProfiles.includes("lang");
  const isVI = afOn && activeProfiles.includes("vi");
  const isMotor = afOn && activeProfiles.includes("motor");

  const t = isLang ? (COPY[lang] || COPY.en) : COPY.en;

  return (
    <div className="af-screen-enter flex min-h-0 flex-1 flex-col overflow-y-auto px-6 pb-8 [&::-webkit-scrollbar]:hidden">
      
      {/* Clean Bank Header with Log Out Button */}
      <header className="flex items-center justify-between pt-2 pb-4">
        <div className="flex items-center gap-2">
          <div className="bg-primary text-primary-foreground p-1.5 rounded-lg">
            <Landmark size={20} />
          </div>
          <span className="font-extrabold text-lg text-foreground tracking-tight">Northstar</span>
        </div>
        
        <div className="flex items-center gap-3">
          {/* LOG OUT BUTTON IN THE MENU BAR */}
          <button 
            aria-label="Log out of account" 
            onClick={onLogout} 
            className="p-2 rounded-full border border-border bg-background text-destructive hover:bg-destructive/10 active:bg-destructive/20 transition-colors"
          >
            <LogOut size={20} />
          </button>
          
          <img src={USER.avatar} alt="Profile" className="h-11 w-11 rounded-full border border-border object-cover" />
        </div>
      </header>

      <div className="mb-4">
        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">{t.greeting}</p>
        <h1 className={`font-extrabold text-foreground ${isMotor && preferences.largeTargets ? "text-3xl" : "text-2xl"}`}>Amaka O.</h1>
      </div>

      <div className="rounded-3xl bg-primary p-6 text-primary-foreground shadow-lg">
        <div className="flex items-start justify-between mb-4">
          <p className={`text-xs opacity-80 uppercase tracking-wider ${isVI && preferences.largeText ? "font-bold opacity-100" : ""}`}>{t.balance}</p>
          {isVI && preferences.tts && (
            <button aria-label="Read balance aloud" onClick={() => speak(`Your available balance is ${DEMO_BALANCE} naira`, "en-NG")} className="rounded-full bg-black/20 p-2 active:bg-black/30">
              <Volume2 className="h-5 w-5" />
            </button>
          )}
        </div>
        <p className={`font-extrabold tracking-tight mb-6 ${isVI && preferences.largeText ? "text-5xl" : "text-4xl"}`}>
          {formatNaira(DEMO_BALANCE)}
        </p>
        <div className="flex items-center gap-2 text-xs font-bold opacity-80 border-t border-white/20 pt-4">
          <span>•••• 4021</span><span>·</span><span>Savings</span>
        </div>
      </div>

      <div className="flex justify-between items-center mt-6 mb-3">
        <h2 className="text-sm font-extrabold text-foreground">Quick actions</h2>
        <button className="text-xs font-bold text-primary">Manage</button>
      </div>
      
      <div className="grid grid-cols-4 gap-3">
        <ActionTile aria-label="Send Money" icon={<ArrowUpRight className="h-6 w-6" />} label={t.sendMoney} onClick={onSend} big={isMotor && preferences.largeTargets} />
        <ActionTile aria-label="Deposit" icon={<Plus className="h-6 w-6" />} label={t.topUp} big={isMotor && preferences.largeTargets} />
        <ActionTile aria-label="History" icon={<Clock className="h-6 w-6" />} label={t.history} big={isMotor && preferences.largeTargets} />
        <ActionTile aria-label="Settings" icon={<Settings2 className="h-6 w-6" />} label={t.settings} onClick={onSettings} big={isMotor && preferences.largeTargets} />
      </div>

      <div className="flex justify-between items-center mt-8 mb-3">
        <h2 className="text-sm font-extrabold text-foreground">Recent activity</h2>
        <button className="text-xs font-bold text-primary">See all</button>
      </div>
      
      <ul className="flex flex-col divide-y divide-border bg-background rounded-3xl border border-border px-4">
        {CONTACTS.map((c) => (
          <li key={c.id} className="flex items-center gap-3 py-4">
            <img src={c.avatar} alt={c.name} className="h-10 w-10 rounded-full object-cover" />
            <div className="min-w-0 flex-1">
              <p className="truncate font-bold text-foreground text-sm">{c.name}</p>
              <p className="text-[10px] text-muted-foreground">{c.bank}</p>
            </div>
            <span className="text-sm font-extrabold text-foreground">{formatNaira(RECENT_AMOUNTS[c.id] ?? 0)}</span>
          </li>
        ))}
      </ul>

    </div>
  );
}

function ActionTile({ icon, label, onClick, big = false }) {
  return (
    <button type="button" onClick={onClick} className={`flex flex-col items-center gap-2 text-center ${big ? "py-4" : ""}`}>
      <span className={`flex items-center justify-center rounded-2xl bg-muted text-foreground active:bg-accent transition-all ${big ? "h-16 w-16" : "h-14 w-14"}`}>
        {icon}
      </span>
      <span className="text-[10px] font-bold text-muted-foreground leading-tight">{label}</span>
    </button>
  );
}