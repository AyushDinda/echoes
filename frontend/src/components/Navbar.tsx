import React from 'react';
import { NavLink } from 'react-router-dom';
import { Terminal, BookOpen, History, Info, Ghost } from 'lucide-react';
import { AiStatusBadge } from './AiStatusBadge';
import { AiStatus } from '../types';

interface Props {
  aiStatus: AiStatus | null;
  loadingStatus: boolean;
  onRefreshStatus: () => void;
}

export const Navbar: React.FC<Props> = ({ aiStatus, loadingStatus, onRefreshStatus }) => {
  const navItems = [
    { to: '/', label: 'Terminal', icon: <Terminal className="w-4 h-4" /> },
    { to: '/story', label: 'Ghost Story', icon: <BookOpen className="w-4 h-4" /> },
    { to: '/history', label: 'History', icon: <History className="w-4 h-4" /> },
    { to: '/about', label: 'About & Open AI', icon: <Info className="w-4 h-4" /> },
  ];

  return (
    <header className="border-b border-ghost-panelBorder bg-ghost-panel/90 backdrop-blur sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center space-x-3">
          <NavLink to="/" className="flex items-center space-x-2 group">
            <div className="w-8 h-8 rounded border border-ghost-green/40 bg-ghost-greenDim/20 flex items-center justify-center text-ghost-green group-hover:shadow-phosphor transition-all">
              <Ghost className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <span className="font-bold tracking-widest text-ghost-green text-glow text-lg group-hover:text-ghost-greenGlow transition-colors">
                ECHOES
              </span>
              <span className="hidden sm:inline-block ml-2 text-[10px] text-ghost-muted uppercase tracking-widest">
                Ghost in Your Terminal
              </span>
            </div>
          </NavLink>
        </div>

        {/* Navigation Links */}
        <nav className="flex items-center space-x-1 sm:space-x-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center space-x-1.5 px-3 py-1.5 rounded text-xs font-mono transition-all ${
                  isActive
                    ? 'bg-ghost-panelBorder text-ghost-green shadow-phosphor font-medium'
                    : 'text-ghost-muted hover:text-ghost-text hover:bg-ghost-panelBorder/50'
                }`
              }
            >
              {item.icon}
              <span className="hidden md:inline">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* AI Status Badge */}
        <div className="flex items-center space-x-2">
          <AiStatusBadge
            status={aiStatus}
            loading={loadingStatus}
            onRefresh={onRefreshStatus}
          />
        </div>
      </div>
    </header>
  );
};
