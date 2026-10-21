import { BatteryFull, Signal, Wifi } from "lucide-react";

export function PhoneFrame({ children, dataAttrs }) {
  return (
    <div className="phone-shell">
      {/* Spread the dataAttrs here so data-theme is applied */}
      <div className="phone-screen" {...dataAttrs}>
        <div className="phone-island" aria-hidden="true" />
        <div className="relative z-30 flex items-center justify-between px-8 pt-4 pb-1 text-foreground">
          <span className="text-[13px] font-bold tracking-wide">9:41</span>
          <div className="flex items-center gap-1.5" aria-hidden="true">
            <Signal className="h-4 w-4" strokeWidth={2.5} />
            <Wifi className="h-4 w-4" strokeWidth={2.5} />
            <BatteryFull className="h-5 w-5" strokeWidth={2} />
          </div>
        </div>
        <div className="relative flex min-h-0 flex-1 flex-col">{children}</div>
      </div>
    </div>
  );
}