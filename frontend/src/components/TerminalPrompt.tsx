import React, { useState } from 'react';
import { CornerDownLeft, Sparkles } from 'lucide-react';

interface Props {
  onSubmit: (command: string) => void;
  loading: boolean;
  disabled?: boolean;
}

const SUGGESTIONS = [
  'git status',
  'npm run build',
  'docker compose up',
  'git commit -m "fix"',
  'python main.py',
  'kill -9 1'
];

export const TerminalPrompt: React.FC<Props> = ({ onSubmit, loading, disabled }) => {
  const [command, setCommand] = useState('');
  const maxLength = 500;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = command.trim();
    if (!trimmed || loading || disabled || trimmed.length > maxLength) return;
    onSubmit(trimmed);
    setCommand('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      handleSubmit(e);
    }
  };

  return (
    <div className="border-t border-ghost-panelBorder bg-ghost-panel/80 p-3 sm:p-4 space-y-2.5">
      {/* Quick Invocations */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        <span className="text-[11px] text-ghost-muted select-none flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-ghost-amber" />
          <span>Quick Invocations:</span>
        </span>
        {SUGGESTIONS.map((sug) => (
          <button
            key={sug}
            type="button"
            disabled={loading || disabled}
            onClick={() => setCommand(sug)}
            className="px-2 py-0.5 rounded bg-ghost-panelBorder/60 hover:bg-ghost-panelBorder text-ghost-text hover:text-ghost-green text-[11px] font-mono border border-ghost-panelBorder transition-colors whitespace-nowrap"
          >
            {sug}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <div className="relative flex-1 flex items-center bg-ghost-bg/90 border border-ghost-panelBorder focus-within:border-ghost-green rounded px-3 py-2 shadow-inner transition-colors">
          <span className="text-ghost-green font-bold text-sm select-none mr-2">$</span>
          <input
            type="text"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading || disabled}
            maxLength={maxLength}
            placeholder="Type or paste a shell command (e.g. git status, npm run build)..."
            className="w-full bg-transparent text-ghost-greenGlow placeholder:text-ghost-muted/70 text-sm font-mono focus:outline-none"
            autoFocus
          />
          <div className="text-[10px] text-ghost-muted select-none ml-2 whitespace-nowrap">
            {command.length}/{maxLength}
          </div>
        </div>

        <button
          type="submit"
          disabled={!command.trim() || loading || disabled || command.length > maxLength}
          className="flex items-center justify-center space-x-1.5 px-4 py-2 bg-ghost-greenDim/30 hover:bg-ghost-greenDim/60 text-ghost-green hover:text-ghost-greenGlow border border-ghost-green/50 rounded font-mono text-sm transition-all shadow-phosphor disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
        >
          {loading ? (
            <span className="w-4 h-4 border-2 border-ghost-green border-t-transparent rounded-full animate-spin"></span>
          ) : (
            <>
              <span className="hidden sm:inline font-semibold">Transmit</span>
              <CornerDownLeft className="w-4 h-4" />
            </>
          )}
        </button>
      </form>
    </div>
  );
};
