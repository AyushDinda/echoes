import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export const ScanlineOverlay: React.FC = () => {
  const [enabled, setEnabled] = useState(true);

  return (
    <>
      {enabled && (
        <div
          aria-hidden="true"
          className="fixed inset-0 pointer-events-none z-50 scanline-effect opacity-60 crt-vignette"
        />
      )}
      <button
        onClick={() => setEnabled(!enabled)}
        title={enabled ? "Disable CRT Scanlines" : "Enable CRT Scanlines"}
        aria-label={enabled ? "Disable CRT Scanlines" : "Enable CRT Scanlines"}
        className="fixed bottom-3 right-3 z-40 bg-ghost-panel/80 hover:bg-ghost-panel text-ghost-muted hover:text-ghost-green border border-ghost-panelBorder px-2 py-1 rounded text-xs flex items-center gap-1.5 backdrop-blur transition-colors"
      >
        {enabled ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
        <span className="hidden md:inline font-mono">{enabled ? "CRT: ON" : "CRT: OFF"}</span>
      </button>
    </>
  );
};
