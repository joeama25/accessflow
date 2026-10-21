import { AlertTriangle, Bell, Timer, Volume2 } from "lucide-react";

export function SpeakerButton({ label, onSpeak, big = false }) {
  return (
    <button
      type="button"
      aria-label={`Read aloud: ${label}`}
      onClick={onSpeak}
      className={`inline-flex flex-none items-center justify-center rounded-full border border-border bg-background text-foreground active:bg-accent ${
        big ? "h-12 w-12" : "h-9 w-9"
      }`}
    >
      <Volume2 className={big ? "h-6 w-6" : "h-4 w-4"} />
    </button>
  );
}

export function Waveform({ bars = 7, className = "" }) {
  return (
    <div className={`flex items-center gap-1.5 ${className}`} aria-hidden="true">
      {Array.from({ length: bars }).map((_, i) => (
        <span
          key={i}
          className="af-wave"
          style={{ height: `${10 + (i % 4) * 7}px`, animationDelay: `${i * 0.12}s` }}
        />
      ))}
    </div>
  );
}

export function FlashBanner({ message }) {
  return (
    <div role="status" className="af-flash mb-2 flex items-center gap-2.5 rounded-xl px-4 py-3 text-sm font-extrabold uppercase tracking-wide">
      <Bell className="h-5 w-5 flex-none" />
      <span>{message}</span>
    </div>
  );
}

export function SessionTimer({ seconds, label }) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return (
    <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted px-3 py-1.5 text-xs font-bold text-muted-foreground">
      <Timer className="h-3.5 w-3.5" />
      {label} {m}:{String(s).padStart(2, "0")}
    </div>
  );
}

const CONFETTI_COLORS = ["#F59E0B", "#3B82F6", "#10B981", "#EC4899"];

export function Confetti({ count = 28 }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          className="af-confetti"
          style={{
            left: `${(i * 37 + 4) % 96}%`,
            backgroundColor: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
            animationDelay: `${(i % 10) * 0.18}s`,
            animationDuration: `${1.8 + (i % 5) * 0.3}s`,
          }}
        />
      ))}
    </div>
  );
}

export function ErrorModal({ title, message, retryLabel, onClose }) {
  return (
    <div className="af-fade absolute inset-0 z-50 flex items-center justify-center bg-black/60 p-6">
      <div role="alertdialog" aria-label={title} className="af-card w-full rounded-3xl border border-border bg-background p-6 text-center shadow-xl">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive text-white">
          <AlertTriangle className="h-6 w-6" />
        </div>
        <h3 className="mt-3 text-lg font-extrabold text-foreground">{title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{message}</p>
        <Waveform bars={9} className="mx-auto mt-3 justify-center text-foreground" />
        <div className="mt-4 flex gap-2">
          <button type="button" onClick={onClose} className="flex-1 rounded-xl bg-muted py-3 font-bold text-foreground active:bg-accent">Dismiss</button>
          <button type="button" onClick={onClose} className="flex-1 rounded-xl bg-primary py-3 font-extrabold text-primary-foreground active:opacity-90">{retryLabel}</button>
        </div>
      </div>
    </div>
  );
}