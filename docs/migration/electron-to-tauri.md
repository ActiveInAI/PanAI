# Electron to Tauri Migration

PanAI is moving the desktop shell from Electron to Tauri. This document tracks the migration boundary so the project does not become a partial rebrand where the user-facing shell says Tauri but runtime code still depends on Electron-only APIs.

## Stage 1: Tauri Shell

- Add a renderer-only Vite build that does not require `electron-vite`.
- Add `src-tauri` with the PanAI product identifier, local app icon, and Tauri desktop window config.
- Route default desktop development and packaging commands to Tauri.
- Keep install-time dependency setup Tauri-first: `postinstall` no longer rebuilds Electron native modules unless `PANAI_ELECTRON_POSTINSTALL=1` is set.
- Keep Electron commands available under `electron:*` only as a temporary fallback while native bridges are migrated.

## Linux Build Prerequisites

On Ubuntu/Debian, install the native libraries required by the Tauri WebKitGTK runtime before running `cargo check`, `bun run tauri:dev`, or `bun run tauri:build`:

```bash
sudo apt-get update
sudo apt-get install -y pkg-config libdbus-1-dev libwebkit2gtk-4.1-dev libjavascriptcoregtk-4.1-dev libsoup-3.0-dev libayatana-appindicator3-dev librsvg2-dev
```

The renderer can be validated independently with:

```bash
bun run renderer:build
```

## Stage 2: Native Bridge Replacement

Replace Electron IPC and native APIs with Tauri commands/plugins:

| Current Surface                 | Tauri Target                                   |
| ------------------------------- | ---------------------------------------------- |
| `window.electronAPI.emit/on`    | `@tauri-apps/api/core.invoke` + Tauri events   |
| `BrowserWindow` window controls | Tauri window APIs                              |
| `shell.openExternal`            | Tauri opener plugin                            |
| Electron file dialogs           | Tauri dialog plugin                            |
| Electron updater                | Tauri updater plugin                           |
| Electron notification/tray      | Tauri notification/tray plugins                |
| Electron `<webview>` usage      | Tauri WebViewWindow or browser iframe fallback |

## Stage 3: Removal

Electron dependencies, `electron-vite`, `electron-builder`, Electron preload code, and Electron-specific docs can be removed after the Tauri native bridge reaches feature parity.
