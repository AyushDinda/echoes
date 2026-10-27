import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { History, Trash2, ArrowUpRight, BookOpen, ShieldCheck, Terminal } from 'lucide-react';
import { api } from '../services/api';
import { SessionListItem, Session } from '../types';

export const HistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<SessionListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [confirmDeleteAll, setConfirmDeleteAll] = useState(false);
  const activeSessionId = localStorage.getItem('echoes_active_session_id');

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const data = await api.listSessions();
      setSessions(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to retrieve session chronicles.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const handleOpenSession = (id: string) => {
    localStorage.setItem('echoes_active_session_id', id);
    navigate('/');
  };

  const handleInspectTranscript = async (id: string) => {
    try {
      const detailed = await api.getSession(id);
      setSelectedSession(detailed);
    } catch (err: any) {
      setError(err.message || 'Failed to load session transcript details.');
    }
  };

  const handleDeleteSession = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await api.deleteSession(id);
      setSessions((prev) => prev.filter((s) => s.id !== id));
      if (selectedSession?.id === id) setSelectedSession(null);
      if (activeSessionId === id) localStorage.removeItem('echoes_active_session_id');
    } catch (err: any) {
      setError(err.message || 'Failed to delete session.');
    }
  };

  const handleClearAllHistory = async () => {
    try {
      await api.clearAllHistory();
      setSessions([]);
      setSelectedSession(null);
      setConfirmDeleteAll(false);
      localStorage.removeItem('echoes_active_session_id');
    } catch (err: any) {
      setError(err.message || 'Failed to purge session history.');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-ghost-panelBorder pb-4">
        <div>
          <h1 className="text-lg font-bold text-ghost-green tracking-wide flex items-center gap-2">
            <History className="w-5 h-5" />
            <span>SESSION CHRONICLES & LOCAL STORAGE</span>
          </h1>
          <p className="text-xs text-ghost-muted mt-1 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-ghost-green" />
            <span>Stored entirely in local SQLite. Commands and commentary are never uploaded to cloud servers.</span>
          </p>
        </div>

        {sessions.length > 0 && (
          <div>
            {!confirmDeleteAll ? (
              <button
                onClick={() => setConfirmDeleteAll(true)}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded bg-ghost-crimsonDim/20 hover:bg-ghost-crimsonDim/40 text-ghost-crimson border border-ghost-crimson/40 text-xs font-mono transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Purge All History</span>
              </button>
            ) : (
              <div className="flex items-center space-x-2">
                <span className="text-xs text-ghost-crimson font-bold">Purge everything?</span>
                <button
                  onClick={handleClearAllHistory}
                  className="px-2.5 py-1 rounded bg-ghost-crimson text-white text-xs font-bold font-mono hover:opacity-90"
                >
                  Yes, Purge
                </button>
                <button
                  onClick={() => setConfirmDeleteAll(false)}
                  className="px-2 py-1 rounded bg-ghost-panel border border-ghost-panelBorder text-ghost-muted text-xs hover:text-ghost-text"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {error && (
        <div className="p-3 bg-ghost-crimsonDim/20 border border-ghost-crimson/50 rounded text-xs text-ghost-crimson flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="underline text-[11px]">Dismiss</button>
        </div>
      )}

      {/* Main Grid: Session List + Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Session List Column */}
        <div className="lg:col-span-7 space-y-3">
          {loading ? (
            <div className="p-8 text-center text-xs text-ghost-muted bg-ghost-panel border border-ghost-panelBorder rounded-lg">
              Scanning local database...
            </div>
          ) : sessions.length === 0 ? (
            <div className="p-10 text-center bg-ghost-panel border border-dashed border-ghost-panelBorder rounded-lg space-y-3">
              <Terminal className="w-8 h-8 text-ghost-muted mx-auto" />
              <div className="text-sm font-semibold text-ghost-text">No History Recorded</div>
              <p className="text-xs text-ghost-muted max-w-sm mx-auto">
                Invocations submitted in the Haunted Terminal will be recorded locally here.
              </p>
            </div>
          ) : (
            sessions.map((sess) => {
              const isActive = sess.id === activeSessionId;
              const isInspected = sess.id === selectedSession?.id;
              const dateStr = new Date(sess.updated_at).toLocaleDateString([], {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              });

              return (
                <div
                  key={sess.id}
                  onClick={() => handleInspectTranscript(sess.id)}
                  className={`p-4 rounded-lg border transition-all cursor-pointer group ${
                    isInspected
                      ? 'bg-ghost-panelBorder/70 border-ghost-green shadow-phosphor'
                      : 'bg-ghost-panel border-ghost-panelBorder hover:border-ghost-greenDim'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-sm text-ghost-text group-hover:text-ghost-green transition-colors">
                          {sess.title}
                        </span>
                        {isActive && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-ghost-greenDim/30 border border-ghost-green/40 text-ghost-green font-mono">
                            CURRENT
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-3 text-xs text-ghost-muted">
                        <span>{dateStr}</span>
                        <span>•</span>
                        <span>{sess.command_count} commands</span>
                        <span>•</span>
                        <span className="uppercase text-[10px] px-1.5 py-0.2 rounded bg-ghost-bg text-ghost-amber">
                          {sess.atmosphere}
                        </span>
                      </div>
                      {sess.has_story && (
                        <div className="flex items-center space-x-1.5 text-xs text-ghost-amber/90 mt-1">
                          <BookOpen className="w-3 h-3 text-ghost-amber" />
                          <span className="italic">{sess.latest_story_title || 'Ghost Story Recorded'}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center space-x-1.5">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenSession(sess.id);
                        }}
                        title="Resume this session in the Haunted Terminal"
                        className="p-1.5 rounded bg-ghost-bg hover:bg-ghost-greenDim/30 text-ghost-muted hover:text-ghost-green border border-ghost-panelBorder text-xs transition-colors"
                      >
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => handleDeleteSession(sess.id, e)}
                        title="Delete this session"
                        className="p-1.5 rounded bg-ghost-bg hover:bg-ghost-crimsonDim/30 text-ghost-muted hover:text-ghost-crimson border border-ghost-panelBorder text-xs transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Selected Session Inspector Column */}
        <div className="lg:col-span-5">
          {selectedSession ? (
            <div className="bg-ghost-panel border border-ghost-panelBorder rounded-lg p-5 space-y-4 shadow-xl sticky top-20 max-h-[calc(100vh-7rem)] overflow-y-auto">
              <div className="border-b border-ghost-panelBorder pb-3 flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-bold text-ghost-greenGlow">{selectedSession.title}</h3>
                  <p className="text-[11px] text-ghost-muted">
                    Session ID: <span className="font-mono">{selectedSession.id.slice(0, 8)}...</span>
                  </p>
                </div>
                <button
                  onClick={() => handleOpenSession(selectedSession.id)}
                  className="flex items-center space-x-1 px-2.5 py-1 rounded bg-ghost-greenDim/30 text-ghost-green border border-ghost-green/40 text-xs font-mono hover:bg-ghost-greenDim/50 transition-colors"
                >
                  <span>Open in Terminal</span>
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              </div>

              {/* Transcript Preview */}
              <div className="space-y-3">
                <div className="text-xs uppercase tracking-wider text-ghost-muted font-bold">
                  Recorded Invocations ({selectedSession.entries.length})
                </div>
                {selectedSession.entries.length === 0 ? (
                  <p className="text-xs text-ghost-muted italic">Transcript is empty.</p>
                ) : (
                  <div className="space-y-3 text-xs">
                    {selectedSession.entries.map((entry) => (
                      <div key={entry.id} className="p-2.5 rounded bg-ghost-bg border border-ghost-panelBorder space-y-1">
                        <div className="font-mono text-ghost-green font-semibold">
                          $ {entry.command_text}
                        </div>
                        <div className="text-ghost-text/90 italic font-sans pl-2 border-l border-ghost-greenDim">
                          "{entry.commentary}"
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Story if present */}
              {selectedSession.stories && selectedSession.stories.length > 0 && (
                <div className="space-y-2 pt-3 border-t border-ghost-panelBorder">
                  <div className="text-xs uppercase tracking-wider text-ghost-amber font-bold flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Chronicle Story</span>
                  </div>
                  <div className="p-3 rounded bg-ghost-bg border border-ghost-panelBorder space-y-1.5">
                    <div className="text-xs font-bold text-ghost-amber">
                      {selectedSession.stories[0].title}
                    </div>
                    <div className="text-[11px] text-ghost-muted line-clamp-4 font-sans">
                      {selectedSession.stories[0].narrative}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-ghost-panel/40 border border-dashed border-ghost-panelBorder rounded-lg p-8 text-center text-xs text-ghost-muted">
              Select a session from the list to inspect its transcript and stories.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
