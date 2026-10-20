# MLTA UML Studio

An original browser-based UML diagram editor prototype inspired by visual diagramming workspaces such as Lucidchart. It does not use Lucidchart source code, branding, or assets.

## Run

Open index.html in a modern browser or serve this folder with any static web server. No package installation or build step is required.

## Included

- UML palette: class, interface, package, component, use case, actor, database, note, and state.
- Click to add shapes; drag existing shapes to move them.
- Connector tool and relationship types: association, dependency, inheritance, composition, aggregation.
- Inspector for element name/type/description, class members, position, and dimensions.
- Grid and snap-to-grid settings, canvas background, zoom controls, and fit reset.
- Undo/redo and keyboard shortcuts.
- Browser local-storage save/restore.
- SVG export and editable JSON export/import.
- Responsive workspace and sample MLTAEngine class diagram.

## Keyboard shortcuts

- Ctrl/Cmd+Z: undo
- Ctrl/Cmd+Y: redo
- Ctrl/Cmd+S: save locally
- Delete/Backspace: delete selection
- C: connector mode
- Escape: selection mode

## Prototype limitations

This is not a complete Lucidchart replacement. It does not yet include accounts, cloud persistence, live multi-user collaboration, access controls, comments, version history, specialized sequence/activity/state-machine editors, or UML standards validation. Sharing is via the exported JSON file. The MLTAEngine C++ backend is not yet connected to this static app.
