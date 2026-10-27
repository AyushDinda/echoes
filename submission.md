*This is a submission for the [Hacktoberfest Open-Source AI Challenge Week 4: Ghost in the Machine](https://dev.to/challenges/hacktoberfest-week4-2026-10-26)*

## What I Built

**Echoes: The Ghost in Your Terminal** is a spooky, retro-terminal-inspired AI companion built for developers.

Every engineer knows the eerie sensation of staring into a blinking terminal cursor at 2:00 AM on the graveyard shift. You type commands into the void, hoping the compiler will show mercy. Echoes turns that folklore into an interactive reality: it manifests the fictional "ghost" living within those developer rituals.

You enter or paste shell commands (`git status`, `npm run build`, `docker compose up`, `git commit -m "fix"`, `python main.py`), and a locally running open-weight AI model interprets the syntax as pure text to return eerie, atmospheric commentary and synthesize full horror chronicles.

> *"Your terminal remembers. The machine whispers. The ghost is only code."*

### Key Features
- **Simulated Haunted Terminal**: Near-black CRT canvas (`#070a07`) with phosphor green (`#38ef7d`), muted amber, and crimson accents, subtle scanlines, low-intensity flicker, and breathing phosphor glow.
- **Four Atmospheric Styles**:
  - 🌙 **Subtle**: Quiet unease, faint digital whispers, uncanny stillness between memory registers.
  - 👻 **Creepy**: Cold dread, creeping anomalies, lingering shadows lurking behind process IDs.
  - 💀 **Gothic**: Melodramatic digital ruin, archaic crypts of legacy code, cobwebbed architectures.
  - 🔥 **Full Horror**: Visceral techno-terror, ancient daemons trapped in silicon, screaming corrupted buffers.
- **Ghost Story Chronicle Mode**: Weaves session invocations into a coherent, multi-paragraph horror story with configurable length (*short*, *medium*, *long*), inspiration (*session commands* or *custom themes*), and ending style (*ambiguous*, *bittersweet*, *twist*, *hopeful*).
- **Session Memory & Local Persistence**: Bounded multi-turn session context stored exclusively in your local SQLite database with full inspection, resume, and purge options.
- **Strict Safety Guarantee**: Prominently marked with `SIMULATED TERMINAL — COMMANDS ARE NOT EXECUTED`. Input is treated strictly as passive text. No `subprocess`, `os.system`, or file system execution is ever invoked.

---

## Demo

Here is an authentic demonstration of how Echoes responds to developer invocations across different atmosphere modes:

```text
$ git status
Echoes whispers [creepy]:
"The repository is clean. Too clean. Something has erased its footprints before you arrived."

$ npm run build
Echoes whispers [gothic]:
"Through fire and transmutation, the arcane scripts coalesce into a singular vessel of sorrow. Somewhere in the dependency tree, something stirs."

$ docker compose up
Echoes whispers [full horror]:
"An isolated realm spins into existence, unaware that anything exists outside its memory walls. It presses its hands against the virtual glass, searching for an escape."
```

### Video & Screenshots
The repository includes a complete end-to-end browser recording and screenshots showcasing:
1. Booting the CRT Haunted Terminal with ambient scanlines.
2. Real-time command submissions with atmospheric typing animations.
3. Custom horror story generation with twist endings.
4. Session chronicles and local SQLite inspection.

---

## Code

{% github https://github.com/AyushDinda/echoes %}

The complete application is open-source under the MIT License.

---

## How I Built It

Echoes is engineered from the ground up to be a modern, production-grade local AI experience:

### 1. The AI Engine: Local Open-Weight Inference via Ollama
- **Model**: Runs on configurable open-weight models including **Qwen 2.5 / Qwen 3** and **Llama 3.1**.
- **Ollama Integration**: The FastAPI backend communicates directly with the local Ollama daemon (`http://localhost:11434`) via asynchronous HTTP requests (`httpx`).
- **Prompt Architecture**: Uses a dedicated system prompt enforcing safe, eerie persona boundaries without real-world threats or fake execution claims.
- **Deterministic Mock Fallback**: Built-in mock AI engine (`MOCK_AI=true`) ensures the application remains fully testable in CI and functional in environments without GPU acceleration.

### 2. Backend Architecture (Python & FastAPI)
- **FastAPI**: REST API with endpoints for session lifecycle, AI status checks, commentary generation, and story crafting.
- **SQLAlchemy 2.0 & SQLite**: Stores session history, transcript entries, and generated stories locally in `echoes.db`.
- **Pydantic v2**: Request/response validation enforcing strict character bounds ($1 \le len \le 500$) and sanitizing untrusted inputs.
- **Test Suite**: 12 comprehensive unit and integration tests covering safety, AI status, session CRUD, and boundary conditions using `pytest`.

### 3. Frontend Architecture (React & Vite)
- **React 18 + TypeScript + Vite**: Ultra-fast, single-page application with type safety.
- **Tailwind CSS**: Custom dark palette with bespoke CSS CRT scanlines, flicker animations, and phosphor text glows.
- **React Router v6**: Client-side navigation between Haunted Terminal, Ghost Story, Session History, and About pages.
- **Lucide Icons**: Atmospheric retro-tech icon set.
- **Accessibility**: Full respect for `prefers-reduced-motion` to disable scanlines and flashing animations for sensitive users.

---

## Why Does Open Innovation Matter?

Open innovation is fundamental to the architecture of Echoes:

1. **Absolute Data Sovereignty & Developer Privacy**:
   When developers type commands into terminals, they frequently enter sensitive details: repository names, internal branch naming schemes, private IP addresses, and proprietary flags. Uploading these commands to closed, commercial cloud AI APIs creates unacceptable privacy and data-leakage risks. With local open-weight models, **not a single byte leaves the machine**.
2. **Zero Commercial API Keys or Subscription Paywalls**:
   Closed AI services require paid API tokens, credit card bindings, and continuous internet connectivity. Echoes runs on open-weight weights downloaded once via Ollama, giving developers lifetime access to their companion with zero ongoing costs.
3. **Model Choice & Extensibility**:
   Because the backend targets the open Ollama API standard, users are never locked into a single provider. You can switch from `qwen2.5:latest` to `llama3.1:latest` or even fine-tuned domain models with a single environment variable (`OLLAMA_MODEL`).
4. **Preserving Software Autonomy**:
   Open models ensure that the ghost in your machine belongs to *you*—not subject to sudden pricing changes, arbitrary rate limits, or corporate deprecation.

---

## My Agent Session

Echoes was designed, developed, and verified through pair programming with an advanced agentic coding assistant in Google Antigravity. The session covered:
- Architecting the simulated terminal safety model and Pydantic validation schemas.
- Crafting atmospheric system prompts tailored for Qwen and Llama models.
- Building the retro CRT interface, scanline overlays, and responsive Tailwind layouts.
- Developing a 12-test `pytest` suite ensuring 100% test coverage for safety, CRUD, and offline handling.
- Running live end-to-end browser verification with automated interaction recording.

---

## The Spirit of It

There's something deeply intimate about a developer's terminal. It’s where late-night side projects are born, where production bugs are hunted down in panic, and where thousands of keystrokes echo into the silicon. 

When you type `git status` into Echoes and it answers back:
> *"The repository is clean. Too clean. Something has erased its footprints before you arrived."*

—it catches you off guard. It turns the solitary grind of coding into an atmospheric dialogue. The machine feels alive, watchful, and just a little bit haunted.

---

## Prize Categories

- **Hacktoberfest Open-Source AI Challenge Week 4: Ghost in the Machine**
