import React from 'react';
import { Cpu, AlertTriangle, CheckCircle2, RefreshCw } from 'lucide-react';
import { AiStatus } from '../types';

interface Props {
  status: AiStatus | null;
  loading: boolean;
  onRefresh: () => void;
}

export const AiStatusBadge: React.FC<Props> = ({ status, loading, onRefresh }) => {
  if (loading && !status) {
    return (
      <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded bg-ghost-panel border border-ghost-panelBorder text-xs text-ghost-muted">
        <RefreshCw className="w-3 h-3 animate-spin text-ghost-green" />
        <span>Summoning Ghost...</span>
      </div>
    );
  }

  if (!status || !status.connected) {
    return (
      <div
        className="flex items-center space-x-2 px-2.5 py-1 rounded bg-ghost-crimsonDim/20 border border-ghost-crimson/40 text-xs text-ghost-crimson cursor-pointer group"
        onClick={onRefresh}
        title={status?.message || "Ollama is unreachable. Click to retry."}
      >
        <span className="relative flex h-2 w-2">
          <span className="relative inline-flex rounded-full h-2 w-2 bg-ghost-crimson"></span>
        </span>
        <AlertTriangle className="w-3.5 h-3.5 text-ghost-crimson" />
        <span className="font-semibold">Local Ghost Offline</span>
        <RefreshCw className="w-3 h-3 text-ghost-crimson/60 group-hover:rotate-180 transition-transform" />
      </div>
    );
  }

  if (status.mock_mode) {
    return (
      <div
        className="flex items-center space-x-2 px-2.5 py-1 rounded bg-ghost-amberDim/20 border border-ghost-amber/40 text-xs text-ghost-amber"
        title="Running in deterministic mock mode. Ideal for testing and environments without Ollama."
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-ghost-amber opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-ghost-amber"></span>
        </span>
        <Cpu className="w-3.5 h-3.5 text-ghost-amber" />
        <span>Mock Ghost Active</span>
      </div>
    );
  }

  return (
    <div
      className="flex items-center space-x-2 px-2.5 py-1 rounded bg-ghost-greenDim/20 border border-ghost-green/40 text-xs text-ghost-green"
      title={`Connected to Ollama. Model: ${status.model}`}
    >
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-ghost-green opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-ghost-green"></span>
      </span>
      <CheckCircle2 className="w-3.5 h-3.5 text-ghost-green" />
      <span className="font-semibold">{status.model}</span>
    </div>
  );
};
