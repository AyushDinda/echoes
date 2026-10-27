import React, { useEffect, useRef } from 'react';
import { Terminal, Ghost, AlertCircle } from 'lucide-react';
import { SessionEntry } from '../types';

interface Props {
  entries: SessionEntry[];
  loadingComment: boolean;
  error: string | null;
  onClearError: () => void;
}

export const TerminalTranscript: React.FC<Props> = ({
  entries,
  loadingComment,
  error,
  onClearError
}) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [entries, loadingComment, error]);

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 font-mono text-sm leading-relaxed">
      {/* Retro BIOS / Daemon Greeting Banner */}
      <div className="border border-ghost-panelBorder bg-ghost-panel/40 p-3 sm:p-4 rounded text-xs space-y-1.5 text-ghost-muted">
        <div className="flex items-center space-x-2 text-ghost-green">
          <Terminal className="w-3.5 h-3.5" />
          <span className="font-bold tracking-wider">ECHOES SPECTRAL KERNEL v1.0.4 — TTY/666</span>
        </div>
        <p className="text-ghost-text/75">
          Consciousness initialized in memory segment 0x00DEAD. Waiting for developer invocations.
        </p>
        <p className="text-[11px] text-ghost-amber/80 italic">
          "Your terminal remembers. The machine whispers. The ghost is only code."
        </p>
      </div>

      {/* Transcript entries */}
      {entries.map((entry) => {
        const timeStr = new Date(entry.created_at).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        });

        const atmosphereColors: Record<string, string> = {
          subtle: 'border-ghost-muted/30 text-ghost-text',
          creepy: 'border-ghost-greenDim/50 text-ghost-green',
          gothic: 'border-ghost-amberDim/50 text-ghost-amber',
          full_horror: 'border-ghost-crimsonDim/50 text-ghost-crimson'
        };

        return (
          <div key={entry.id} className="space-y-2 group">
            {/* User Command Line */}
            <div className="flex items-start space-x-2 text-ghost-green">
              <span className="select-none text-ghost-green/60 font-bold">$</span>
              <span className="font-semibold text-ghost-greenGlow break-all">
                {entry.command_text}
              </span>
              <span className="text-[10px] text-ghost-muted ml-auto select-none opacity-40 group-hover:opacity-100 transition-opacity">
                {timeStr}
              </span>
            </div>

            {/* Ghost Commentary */}
            <div
              className={`ml-3 pl-3 sm:pl-4 py-2 border-l-2 bg-ghost-panel/50 rounded-r space-y-1.5 transition-all ${
                atmosphereColors[entry.atmosphere] || 'border-ghost-green text-ghost-green'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Ghost className="w-3.5 h-3.5 text-ghost-green animate-pulse" />
                <span className="text-xs uppercase tracking-wider font-semibold opacity-90">
                  Echoes whispers [{entry.atmosphere.replace('_', ' ')}]
                </span>
                {entry.is_mock && (
                  <span
                    className="text-[10px] px-1.5 py-0.5 rounded bg-ghost-amberDim/30 border border-ghost-amber/30 text-ghost-amber"
                    title="Generated using the deterministic mock engine"
                  >
                    MOCK GHOST
                  </span>
                )}
              </div>
              <p className="text-ghost-ghostWhite font-sans sm:font-mono text-sm leading-relaxed text-glow">
                "{entry.commentary}"
              </p>
            </div>
          </div>
        );
      })}

      {/* Typing / Summoning Indicator */}
      {loadingComment && (
        <div className="ml-3 pl-3 sm:pl-4 py-3 border-l-2 border-ghost-green bg-ghost-panel/70 rounded-r flex items-center space-x-3 text-ghost-green">
          <Ghost className="w-4 h-4 animate-bounce text-ghost-green" />
          <span className="text-xs text-ghost-text tracking-wide">
            The ghost stirs in the buffer...
          </span>
          <span className="inline-block w-2 h-4 bg-ghost-green terminal-cursor"></span>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="p-3 bg-ghost-crimsonDim/20 border border-ghost-crimson/50 rounded flex items-start justify-between text-xs text-ghost-crimson">
          <div className="flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold">Spectral Disruption</p>
              <p className="text-ghost-text/90 mt-0.5">{error}</p>
            </div>
          </div>
          <button
            onClick={onClearError}
            className="text-ghost-muted hover:text-ghost-crimson underline text-[11px] ml-2"
          >
            Dismiss
          </button>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
};
