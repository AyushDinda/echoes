import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { SimulatedBanner } from './components/SimulatedBanner';
import { ScanlineOverlay } from './components/ScanlineOverlay';
import { TerminalPage } from './pages/TerminalPage';
import { GhostStoryPage } from './pages/GhostStoryPage';
import { HistoryPage } from './pages/HistoryPage';
import { AboutPage } from './pages/AboutPage';
import { api } from './services/api';
import { AiStatus } from './types';

export const App: React.FC = () => {
  const [aiStatus, setAiStatus] = useState<AiStatus | null>(null);
  const [loadingStatus, setLoadingStatus] = useState<boolean>(true);

  const fetchStatus = useCallback(async () => {
    try {
      setLoadingStatus(true);
      const s = await api.getAiStatus();
      setAiStatus(s);
    } catch {
      setAiStatus({
        connected: false,
        model: 'unknown',
        mock_mode: false,
        message: 'The local ghost is unavailable. Start Ollama and verify that your configured model is installed.',
        available_models: [],
      });
    } finally {
      setLoadingStatus(false);
    }
  }, []);

  useEffect(() => {
    fetchStatus();
    // Poll AI status periodically
    const interval = setInterval(fetchStatus, 20000);
    return () => clearInterval(interval);
  }, [fetchStatus]);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-ghost-bg text-ghost-text flex flex-col font-mono relative selection:bg-ghost-greenDim selection:text-white">
        <SimulatedBanner />
        <Navbar
          aiStatus={aiStatus}
          loadingStatus={loadingStatus}
          onRefreshStatus={fetchStatus}
        />

        <main className="flex-1 flex flex-col">
          <Routes>
            <Route path="/" element={<TerminalPage />} />
            <Route path="/story" element={<GhostStoryPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <ScanlineOverlay />
      </div>
    </BrowserRouter>
  );
};

export default App;
