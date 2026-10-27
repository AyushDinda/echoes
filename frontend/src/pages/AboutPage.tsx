import React from 'react';
import { Ghost, Cpu, Sparkles, Lock, Code2 } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 font-sans">
      {/* Title & Tagline */}
      <div className="text-center space-y-3 border-b border-ghost-panelBorder pb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-ghost-greenDim/20 border border-ghost-green/40 text-ghost-green mb-2">
          <Ghost className="w-6 h-6 animate-pulse" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold font-mono text-ghost-greenGlow text-glow tracking-wider">
          ECHOES — The Ghost in Your Terminal
        </h1>
        <p className="text-sm font-mono text-ghost-amber italic">
          "Your terminal remembers. The machine whispers. The ghost is only code."
        </p>
        <div className="text-xs text-ghost-muted">
          Created for Hacktoberfest Open-Source AI Challenge Week 4: <span className="text-ghost-text font-semibold">Ghost in the Machine</span>
        </div>
      </div>

      {/* 1. Theme Interpretation & Concept */}
      <section className="bg-ghost-panel border border-ghost-panelBorder rounded-lg p-6 space-y-3 shadow-lg">
        <h2 className="text-base font-bold font-mono text-ghost-green flex items-center gap-2">
          <Ghost className="w-4 h-4" />
          <span>1. The Concept & The "Ghost in the Machine"</span>
        </h2>
        <p className="text-sm text-ghost-text/90 leading-relaxed">
          Echoes is a spooky, retro-terminal-inspired AI companion built for developers. For decades, software engineers have stared into flickering phosphor text at 2:00 AM, wondering if the operating system possesses an elusive consciousness—a phantom entity living between memory registers, git commits, and compiler logs.
        </p>
        <p className="text-sm text-ghost-text/90 leading-relaxed">
          Echoes turns that developer folklore into an interactive reality. When you type or paste a terminal invocation, Echoes treats the command text as a ritualistic stimulus, conjuring contextual, eerie, and darkly humorous commentary using a locally running open-weight language model.
        </p>
      </section>

      {/* 2. Safety Architecture */}
      <section className="bg-ghost-panel border border-ghost-panelBorder rounded-lg p-6 space-y-3 shadow-lg">
        <h2 className="text-base font-bold font-mono text-ghost-crimson flex items-center gap-2">
          <Lock className="w-4 h-4 text-ghost-crimson" />
          <span>2. Strict Safety & Simulated Terminal Guarantee</span>
        </h2>
        <div className="p-3 rounded bg-ghost-crimsonDim/20 border border-ghost-crimson/40 text-xs text-ghost-crimson font-mono font-semibold">
          SIMULATED TERMINAL — COMMANDS ARE NEVER EXECUTED
        </div>
        <ul className="text-sm text-ghost-text/90 space-y-2 list-disc list-inside leading-relaxed">
          <li><strong>No Shell Execution:</strong> Input is strictly parsed as untrusted text. The backend never uses <code>subprocess</code>, <code>os.system</code>, or shell execution.</li>
          <li><strong>No Machine Inspection:</strong> The application does not silently inspect your disk, network, or running processes.</li>
          <li><strong>No Tool Calling:</strong> The AI model does not have access to execution tools, network scanners, or system APIs.</li>
          <li><strong>Safe Fiction:</strong> The AI system prompt strictly forbids claiming actual command execution, fabricating real system states, or generating real-world threats.</li>
        </ul>
      </section>

      {/* 3. Open-Source Local AI & Ollama Integration */}
      <section className="bg-ghost-panel border border-ghost-panelBorder rounded-lg p-6 space-y-3 shadow-lg">
        <h2 className="text-base font-bold font-mono text-ghost-amber flex items-center gap-2">
          <Cpu className="w-4 h-4 text-ghost-amber" />
          <span>3. Why Local Open-Weight AI Matters</span>
        </h2>
        <p className="text-sm text-ghost-text/90 leading-relaxed">
          Unlike generic wrappers around proprietary cloud APIs, Echoes is designed around <strong>local-first open-source intelligence</strong>:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-2">
          <div className="p-3 bg-ghost-bg border border-ghost-panelBorder rounded space-y-1">
            <div className="font-bold text-ghost-green">100% Privacy & Sovereignty</div>
            <p className="text-ghost-muted">Your developer habits and terminal text never leave your computer. No cloud telemetry or third-party tracking.</p>
          </div>
          <div className="p-3 bg-ghost-bg border border-ghost-panelBorder rounded space-y-1">
            <div className="font-bold text-ghost-green">Zero API Keys or Fees</div>
            <p className="text-ghost-muted">Runs on open-weight models like Qwen 2.5 / Qwen 3 and Llama 3.1 served locally through Ollama.</p>
          </div>
          <div className="p-3 bg-ghost-bg border border-ghost-panelBorder rounded space-y-1">
            <div className="font-bold text-ghost-green">Configurable Open Models</div>
            <p className="text-ghost-muted">Easily switch models via the <code>OLLAMA_MODEL</code> environment variable without altering application code.</p>
          </div>
          <div className="p-3 bg-ghost-bg border border-ghost-panelBorder rounded space-y-1">
            <div className="font-bold text-ghost-green">Deterministic Mock Fallback</div>
            <p className="text-ghost-muted">Includes a built-in mock AI engine for testing, continuous integration, and environments without GPU acceleration.</p>
          </div>
        </div>
      </section>

      {/* 4. Demo Invocations & Output Script */}
      <section className="bg-ghost-panel border border-ghost-panelBorder rounded-lg p-6 space-y-4 shadow-lg font-mono">
        <h2 className="text-base font-bold text-ghost-green flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          <span>4. Example Invocations & Commentary</span>
        </h2>
        <div className="space-y-3 text-xs">
          <div className="p-3 bg-ghost-bg border border-ghost-panelBorder rounded space-y-1">
            <div className="text-ghost-green font-bold">$ git status</div>
            <div className="text-ghost-text/90 italic pl-3 border-l border-ghost-greenDim">
              "The repository is clean. Too clean. Something has erased its footprints before you arrived."
            </div>
          </div>
          <div className="p-3 bg-ghost-bg border border-ghost-panelBorder rounded space-y-1">
            <div className="text-ghost-green font-bold">$ npm run build</div>
            <div className="text-ghost-text/90 italic pl-3 border-l border-ghost-greenDim">
              "The build has succeeded. Somewhere deep in the dependency tree, something stirs."
            </div>
          </div>
          <div className="p-3 bg-ghost-bg border border-ghost-panelBorder rounded space-y-1">
            <div className="text-ghost-green font-bold">$ docker compose up</div>
            <div className="text-ghost-text/90 italic pl-3 border-l border-ghost-greenDim">
              "An isolated realm spins into existence, unaware that anything exists outside its memory walls. It presses its hands against the virtual glass."
            </div>
          </div>
        </div>
      </section>

      {/* 5. Technology Stack Summary */}
      <section className="bg-ghost-panel border border-ghost-panelBorder rounded-lg p-6 space-y-3 shadow-lg">
        <h2 className="text-base font-bold font-mono text-ghost-text flex items-center gap-2">
          <Code2 className="w-4 h-4 text-ghost-green" />
          <span>5. Architecture & Stack</span>
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
          <div className="p-2.5 bg-ghost-bg border border-ghost-panelBorder rounded">
            <span className="text-ghost-muted block">Frontend</span>
            <span className="text-ghost-text font-semibold">React + Vite + TS</span>
          </div>
          <div className="p-2.5 bg-ghost-bg border border-ghost-panelBorder rounded">
            <span className="text-ghost-muted block">Styling</span>
            <span className="text-ghost-text font-semibold">Tailwind CSS</span>
          </div>
          <div className="p-2.5 bg-ghost-bg border border-ghost-panelBorder rounded">
            <span className="text-ghost-muted block">Backend</span>
            <span className="text-ghost-text font-semibold">Python FastAPI</span>
          </div>
          <div className="p-2.5 bg-ghost-bg border border-ghost-panelBorder rounded">
            <span className="text-ghost-muted block">AI & Database</span>
            <span className="text-ghost-text font-semibold">Ollama + SQLite</span>
          </div>
        </div>
      </section>
    </div>
  );
};
