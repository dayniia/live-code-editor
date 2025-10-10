# live-code-editor

Browser-based HTML/CSS/JS code editor with live preview, Ace integration and a small sandbox for running tests.

Lightweight, student-friendly playground for teaching, prototyping and sharing small web exercises.

---

## Features

- Live HTML/CSS/JS editing using Ace Editor
- Sandboxed preview (iframe) with optional test injection
- Save / Load projects as JSON
- Dark / Light theme toggle (Ace theme switches automatically)
- Keyboard shortcuts: Ctrl/Cmd+S to save, Ctrl/Cmd+Enter to run
- Output / console area for logs
- Small footprint — no build step, works by opening `index.html`

## Quick start

1. Clone the repository:

   git clone https://github.com/dayniia/live-code-editor.git

2. Open the project folder and open `index.html` in a modern browser (Chrome, Edge, Firefox). No server required.

Optional: use a local server to avoid some iframe restrictions:

```bash
# with Python 3
python -m http.server 8000
```

Then open http://localhost:8000 in your browser.

## Usage

- Edit HTML, CSS and JS in the three panes.
- Click Run to update the preview or press Ctrl/Cmd+Enter.
- Use the `Run with tests` button to append validation tests written in the test area (JS only).
- Save your work to a JSON file with the Save button or Ctrl/Cmd+S. Use Load to restore a saved project.
- Toggle theme with the moon / sun button in the header. The choice persists for the session.

## Keyboard shortcuts

- Ctrl/Cmd + Enter — Run preview
- Ctrl/Cmd + S — Save project and download JSON

## Live Demo
<a href="https://dayniia.github.io/live-code-editor/ " target="_blank">try live code editor</a>

## Development notes

- Editor panes are powered by Ace Editor. Themes are switched programmatically when toggling light/dark.
- The preview runs inside a sandboxed iframe to reduce risk. If you need full access for advanced demos, adjust `sandbox` attributes carefully.
- The app autosaves to localStorage (if enabled) and can restore on load.


