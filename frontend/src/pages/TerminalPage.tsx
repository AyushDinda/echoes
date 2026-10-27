import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Trash2, PlusCircle } from 'lucide-react';
import { TerminalTranscript } from '../components/TerminalTranscript';
import { TerminalPrompt } from '../components/TerminalPrompt';
import { AtmospherePicker } from '../components/AtmospherePicker';
import { api } from '../services/api';
import { Session, AtmosphereType } from '../types';

export const TerminalPage: React.FC = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [atmosphere, setAtmosphere] = useState<AtmosphereType>('creepy');
  const [loadingSession, setLoadingSession] = useState(true);
  const [loadingComment, setLoadingComment] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize or restore session
  useEffect(() => {
    const init = async () => {
      setLoadingSession(true);
      const savedId = localStorage.getItem('echoes_active_session_id');
      if (savedId) {
        try {
          const loaded = await api.getSession(savedId);
          setSession(loaded);
          setAtmosphere(loaded.atmosphere);
          setLoadingSession(false);
          return;
        } catch {
          localStorage.removeItem('echoes_active_session_id');
        }
      }

      // Create new session if no saved one or failed to load
      try {
        const newSession = await api.createSession('Midnight Terminal Session', 'creepy');
        setSession(newSession);
        setAtmosphere(newSession.atmosphere);
        localStorage.setItem('echoes_active_session_id', newSession.id);
      } catch (err: any) {
        setError(err.message || 'Failed to initialize session.');
      } finally {
        setLoadingSession(false);
      }
    };

    init();
  }, []);

  const handleCreateNewSession = async () => {
    try {
      setLoadingSession(true);
      const newSession = await api.createSession(`Session @ ${new Date().toLocaleTimeString()}`, atmosphere);
      setSession(newSession);
      localStorage.setItem('echoes_active_session_id', newSession.id);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Could not create new session.');
    } finally {
      setLoadingSession(false);
    }
  };

  const handleClearTranscript = async () => {
    if (!session) return;
    try {
      await api.clearSessionHistory(session.id);
      setSession({
        ...session,
        entries: [],
        stories: []
      });
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to clear transcript.');
    }
  };

  const handleSubmitCommand = async (command: string) => {
    if (!session) return;
    setLoadingComment(true);
    setError(null);

    try {
      const resp = await api.submitCommand(session.id, command, atmosphere);
      setSession((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          entries: [
            ...prev.entries,
            {
              id: resp.entry_id,
              session_id: resp.session_id,
              command_text: resp.command,
              commentary: resp.commentary,
              atmosphere: resp.atmosphere,
              is_mock: resp.is_mock,
              created_at: resp.created_at
            }
          ]
        };
      });
    } catch (err: any) {
      setError(err.message || 'Communication with the ghost was disrupted.');
    } finally {
      setLoadingComment(false);
    }
  };

  const handleAtmosphereChange = (newAtm: AtmosphereType) => {
    setAtmosphere(newAtm);
  };

  const handleNavigateToStory = () => {
    if (session) {
      navigate(`/story?session=${session.id}`);
    } else {
      navigate('/story');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-4 sm:py-6 flex flex-col h-[calc(100vh-5rem)]">
      {/* Session Header Toolbar */}
      <div className="bg-ghost-panel border border-ghost-panelBorder rounded-t-lg p-3 sm:p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center space-x-3">
          <div className="flex space-x-1.5">
            <span className="w-3 h-3 rounded-full bg-ghost-crimson/80 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-ghost-amber/80 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-ghost-green/80 inline-block"></span>
          </div>
          <div>
            <h1 className="text-sm font-bold text-ghost-green tracking-wider flex items-center gap-2">
              <span>{session ? session.title : 'Summoning Terminal...'}</span>
              {session && (
                <span className="text-[11px] px-2 py-0.5 rounded bg-ghost-panelBorder text-ghost-muted font-normal">
                  {session.entries.length} commands recorded
                </span>
              )}
            </h1>
          </div>
        </div>

        {/* Atmosphere Picker & Actions */}
        <div className="flex flex-wrap items-center gap-3">
          <AtmospherePicker
            value={atmosphere}
            onChange={handleAtmosphereChange}
            disabled={loadingComment || loadingSession}
          />

          <div className="flex items-center space-x-1.5 border-l border-ghost-panelBorder pl-3">
            <button
              onClick={handleNavigateToStory}
              title="Generate a horror story based on this session"
              className="flex items-center space-x-1.5 px-2.5 py-1 rounded bg-ghost-amberDim/20 hover:bg-ghost-amberDim/40 text-ghost-amber border border-ghost-amber/40 text-xs font-mono transition-colors"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Ghost Story</span>
            </button>

            <button
              onClick={handleClearTranscript}
              title="Clear transcript entries for this session"
              className="p-1.5 rounded hover:bg-ghost-panelBorder text-ghost-muted hover:text-ghost-crimson transition-colors text-xs"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleCreateNewSession}
              title="Start a fresh terminal session"
              className="flex items-center space-x-1 px-2.5 py-1 rounded bg-ghost-panelBorder hover:bg-ghost-panelBorder/80 text-ghost-text text-xs font-mono transition-colors"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">New</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Terminal Frame */}
      <div className="flex-1 flex flex-col bg-ghost-bg border-x border-b border-ghost-panelBorder rounded-b-lg overflow-hidden relative shadow-2xl">
        <TerminalTranscript
          entries={session?.entries || []}
          loadingComment={loadingComment}
          error={error}
          onClearError={() => setError(null)}
        />

        <TerminalPrompt
          onSubmit={handleSubmitCommand}
          loading={loadingComment}
          disabled={loadingSession || !session}
        />
      </div>
    </div>
  );
};
