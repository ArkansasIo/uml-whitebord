# MLTA UML Studio

A lightweight, static browser UML editor with a diagram canvas, UML shapes, editable relationships, local persistence, undo/redo, and JSON/SVG interchange.

## Run locally

Open `index.html` in a current desktop browser, or serve this folder with a static web server. The app does not require npm, a build process, or a backend.

For example, from the repository root:

```sh
python -m http.server 8000
```

Then open `http://localhost:8000/uml-studio/`.

## Current features

- Class, interface, package, component, use-case, actor, database, note, and state shapes.
- Drag to position shapes, connect elements, and edit names, descriptions, members, dimensions, and relationships.
- Grid visibility, snap-to-grid, zoom, and fit-to-diagram controls.
- Undo/redo and keyboard shortcuts.
- Browser-local save/restore with JSON import/export.
- SVG export for vector workflows.
- Responsive layout for desktop and mobile-sized screens.
- UML, Brain, Agents, Memory, Source, Docs, Git, and Runtime workspaces.
- Command palette and AI/runtime adapter foundations.

## Complete feature specification

See [`FEATURES.md`](./FEATURES.md) for the complete functional target, including structural and behavioral UML, project management, validation, source integration, AI, agents, collaboration, accessibility, security, performance, and testing.

## Complete tool catalog

See [`TOOLS.md`](./TOOLS.md) for the planned toolbar, UML object, relationship, arrangement, validation, AI, agent, Git, runtime, collaboration, accessibility, and security tools.

## Architecture

See [`ARCHITECTURE.md`](./ARCHITECTURE.md) for the model, command, AI, collaboration, source-sync, persistence, security, and testing architecture.

## Roadmap

See [`ROADMAP.md`](./ROADMAP.md) for the implementation sequence and definition of done.

## Keyboard shortcuts

| Shortcut | Action |
|---|---|
| Ctrl/Cmd + Z | Undo |
| Ctrl/Cmd + Y | Redo |
| Ctrl/Cmd + S | Save in this browser |
| Delete / Backspace | Delete selected shape or relationship |
| C | Connector tool |
| Escape | Return to selection tool |

## Saving and portability

The Save button writes the current diagram to browser local storage for this site. Browser storage is local to a browser profile and origin; it is not cloud synchronization. Use **Export → Editable JSON file** to back up or transfer a diagram, and **Export → Import JSON file** to reopen it elsewhere.

Imported JSON is validated for expected shape and relationship references before replacing the current diagram. Keep exported files under version control only when that is appropriate for your project.

## GitHub Pages

The workflow at `.github/workflows/mlta-uml-studio.yml` checks JavaScript syntax and required app files, then deploys the `uml-studio/` directory to GitHub Pages on pushes to `main` and manual workflow runs.

The repository's Pages deployment must use **GitHub Actions** as its build and deployment source. The workflow needs permission to deploy to the `github-pages` environment. The published address is normally:

`https://arkansasio.github.io/uml-whitebord/`

Confirm the exact URL and deployment status in **Settings → Pages** and the **Actions** tab after the workflow completes.

## Scope and limitations

This is still a client-side prototype. Diagrams live in one browser unless exported and transferred manually. There is no account system, server-side storage, live collaboration, cloud sharing, comments, or server API integration. Specialized sequence/activity/state editors and advanced UML validation remain planned features. The feature and tool documents explicitly distinguish implemented capabilities from planned work.
