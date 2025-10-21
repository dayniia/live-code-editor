# Changelog

## [1.0.1] - 2025-10-21

### Added

- New logo: replaced the old logo with a modern, theme-consistent code icon.
- Theme-aware keyboard shortcut chips: “Ctrl”, “S”, and “Enter” now adapt to both light and dark modes for better readability.
- Improved light theme support for tabs, editors, and output panels.

### Changed

- General UI polish: smoother gradients, better contrast, and more consistent styling across themes.

### Fixed

- HTML editor: re-enabled Ace linting for real-time feedback, and removed the placeholder comment to avoid DOCTYPE errors.

---

## [1.0.0] - 2025-10-09

### Added

- Initial public release: `live-code-editor` — a lightweight browser-based HTML/CSS/JS editor with live preview.
- Live editing panes (HTML, CSS, JS) using Ace Editor with built-in keyboard shortcuts (Ctrl/Cmd+S to save, Ctrl/Cmd+Enter to run).
- Sandboxed preview using an iframe with optional test injection for simple validation scripts.
- Save / Load project functionality (JSON export/import).
- Dark / Light theme toggle; Ace editor theme is switched programmatically when toggling.
- Output/console area to show logs produced by the editor/preview.
- Basic UI: tabs for editors, preview pane, assignment/test input panel, and project controls (Run, Save, Load).
- Polished README and .gitignore included.

### Changed

- N/A (initial release)

### Fixed

- N/A (initial release)

### Known issues / Notes

- The iframe preview uses sandboxing for safety; certain features that require full browser privileges may be restricted by the sandbox attributes.
- Ace editor selection and gutter colors are controlled by Ace themes; the light theme uses Ace's 'chrome' theme which may differ visually from the surrounding UI.
- Theme persistence is currently session-based; consider enabling persistent setting via localStorage (planned enhancement).

### Upgrade notes

- No upgrade steps required for the initial release.

### Contributors

- Initial author: dayniia
