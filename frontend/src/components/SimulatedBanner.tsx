import React from 'react';
import { ShieldAlert, Info } from 'lucide-react';

export const SimulatedBanner: React.FC = () => {
  return (
    <div className="bg-ghost-panelBorder/40 border-b border-ghost-panelBorder px-4 py-1.5 flex items-center justify-between text-xs text-ghost-muted">
      <div className="flex items-center space-x-2">
        <ShieldAlert className="w-3.5 h-3.5 text-ghost-amber" />
        <span className="font-semibold tracking-wider text-ghost-amber">
          SIMULATED TERMINAL — COMMANDS ARE NOT EXECUTED
        </span>
      </div>
      <div className="hidden sm:flex items-center space-x-1 text-ghost-text/70">
        <Info className="w-3 h-3 text-ghost-muted" />
        <span>Text is analyzed purely for atmospheric storytelling. No real shell or system commands run.</span>
      </div>
    </div>
  );
};
