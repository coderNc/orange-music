import { BrowserWindow, screen } from 'electron'
import { existsSync } from 'fs'
import { join } from 'path'
import {
  IPC_CHANNELS,
  type DesktopLyricsPayload,
  type DesktopLyricsControlAction,
  type DesktopLyricsSettingsAction
} from '@shared/types'

let desktopLyricsWindow: BrowserWindow | null = null
let desktopLyricsSettingsWindow: BrowserWindow | null = null
let mainWindowRef: BrowserWindow | null = null
let latestPayload: DesktopLyricsPayload = {
  currentLine: '未播放',
  nextLine: '',
  trackTitle: 'OrangeMusic',
  artist: '',
  isPlaying: false
}

interface DesktopLyricsStyleState {
  currentLineSize: number
  nextLineSize: number
  focusMaskOpacity: number
  singleLineMode: boolean
  colorIndex: number
}

const colorPresets = ['#fb923c', '#22d3ee', '#a78bfa', '#34d399', '#f43f5e']

const defaultStyleState: DesktopLyricsStyleState = {
  currentLineSize: 21,
  nextLineSize: 21,
  focusMaskOpacity: 0.78,
  singleLineMode: false,
  colorIndex: 0
}

let styleState: DesktopLyricsStyleState = { ...defaultStyleState }

export function registerMainWindow(window: BrowserWindow): void {
  mainWindowRef = window
}

export function handleDesktopLyricsControlAction(action: DesktopLyricsControlAction): void {
  if (!mainWindowRef || mainWindowRef.isDestroyed()) return
  mainWindowRef.webContents.send(IPC_CHANNELS.DESKTOP_LYRICS_CONTROL_EVENT, action)
}

function buildDesktopLyricsHtml(): string {
  return `<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Desktop Lyrics</title>
    <style>
      :root {
        color-scheme: dark;
        --current-line-size: 21px;
        --next-line-size: 21px;
        --focus-mask-opacity: 0.78;
      }
      html,
      body {
        margin: 0;
        width: 100%;
        height: 100%;
        overflow: visible;
        background: transparent;
        font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
        user-select: none;
      }
      .root {
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 12px;
        box-sizing: border-box;
        -webkit-app-region: no-drag;
        overflow: visible;
      }
      .card {
        position: relative;
        width: 100%;
        height: 100%;
        border-radius: 14px;
        border: 1px solid transparent;
        backdrop-filter: none;
        box-shadow: none;
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 8px;
        padding: 10px 16px;
        box-sizing: border-box;
        transition: box-shadow 160ms ease, border-color 160ms ease;
        -webkit-app-region: drag;
        overflow: visible;
      }
      body.focused .card {
        border-color: rgba(255, 255, 255, 0.5);
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.18);
        backdrop-filter: blur(2px);
      }
      .card::before {
        content: '';
        position: absolute;
        inset: 0;
        border-radius: inherit;
        background: rgba(226, 226, 226, 0.78);
        border: 1px solid rgba(255, 255, 255, 0.55);
        opacity: 0;
        transition: opacity 160ms ease;
        pointer-events: none;
      }
      body.focused .card::before {
        opacity: var(--focus-mask-opacity);
      }
      .meta {
        position: relative;
        z-index: 1;
        font-size: 11px;
        line-height: 1.3;
        color: rgba(255, 255, 255, 0.66);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        transition: color 160ms ease;
      }
      body.focused .meta {
        color: rgba(75, 85, 99, 0.9);
      }
      .lyrics-grid {
        position: relative;
        z-index: 1;
        display: grid;
        grid-template-columns: minmax(0, 1fr);
        gap: 6px;
        align-items: center;
        -webkit-app-region: drag;
      }
      .controls {
        position: relative;
        z-index: 2;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        -webkit-app-region: no-drag;
      }
      .ctrl-btn {
        width: 24px;
        height: 24px;
        border-radius: 6px;
        border: 1px solid transparent;
        background: transparent;
        color: rgba(255, 255, 255, 0.86);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        -webkit-app-region: no-drag;
      }
      .ctrl-btn:hover {
        border-color: rgba(255, 255, 255, 0.28);
        background: rgba(255, 255, 255, 0.1);
      }
      .ctrl-btn.active {
        color: #fb923c;
      }
      .settings-wrap {
        position: relative;
        -webkit-app-region: no-drag;
      }
      body.focused .ctrl-btn {
        color: rgba(113, 113, 122, 0.95);
      }
      body.focused .ctrl-btn.active {
        color: #fb923c;
      }
      .lyrics-grid.single .line:not(.current) {
        display: none;
      }
      .line {
        font-size: var(--next-line-size);
        line-height: 1.28;
        color: rgba(244, 244, 245, 0.85);
        text-shadow: 0 2px 10px rgba(0, 0, 0, 0.4);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        text-align: center;
        -webkit-text-stroke: 0.8px rgba(22, 22, 24, 0.3);
        transition:
          color 160ms ease,
          -webkit-text-stroke-color 160ms ease,
          opacity 160ms ease;
      }
      .line.current {
        font-size: var(--current-line-size);
        color: #f97316;
        font-weight: 700;
        -webkit-text-stroke: 0.9px rgba(197, 78, 0, 0.35);
      }
      body.focused .line {
        color: #9ca3af;
        -webkit-text-stroke: 0.9px rgba(82, 82, 91, 0.35);
        text-shadow: none;
      }
      body.focused .line.current {
        color: #fb923c;
        -webkit-text-stroke: 0.9px rgba(251, 146, 60, 0.5);
      }
      .line.paused {
        opacity: 0.68;
      }
    </style>
  </head>
  <body>
    <div class="root">
      <div class="card">
        <div id="meta" class="meta">OrangeMusic</div>
        <div class="controls">
          <button id="btnPrev" class="ctrl-btn" title="上一首">⏮</button>
          <button id="btnPlay" class="ctrl-btn" title="播放/暂停">▶</button>
          <button id="btnNext" class="ctrl-btn" title="下一首">⏭</button>
          <div class="settings-wrap">
            <button id="btnSettings" class="ctrl-btn" title="设置">⚙</button>
          </div>
          <button id="btnClose" class="ctrl-btn" title="关闭桌面歌词">✕</button>
        </div>
        <div class="lyrics-grid">
          <div id="currentLine" class="line current">未播放</div>
          <div id="nextLine" class="line">♪</div>
        </div>
      </div>
    </div>
    <script>
      (function () {
        const bodyEl = document.body
        const rootEl = document.documentElement
        const metaEl = document.getElementById('meta')
        const lyricsGridEl = document.querySelector('.lyrics-grid')
        const currentLineEl = document.getElementById('currentLine')
        const nextLineEl = document.getElementById('nextLine')
        const btnPrev = document.getElementById('btnPrev')
        const btnPlay = document.getElementById('btnPlay')
        const btnNext = document.getElementById('btnNext')
        const btnSettings = document.getElementById('btnSettings')
        const btnClose = document.getElementById('btnClose')
        let trackMeta = 'OrangeMusic'

        function applyStyleState(state) {
          const currentLineSize = Number(state && state.currentLineSize) || 21
          const nextLineSize = Number(state && state.nextLineSize) || 21
          const focusMaskOpacity =
            typeof state?.focusMaskOpacity === 'number' ? state.focusMaskOpacity : 0.78
          const singleLineMode = Boolean(state && state.singleLineMode)
          const currentColor =
            state && typeof state.currentColor === 'string' && state.currentColor ? state.currentColor : '#fb923c'

          rootEl.style.setProperty('--current-line-size', currentLineSize + 'px')
          rootEl.style.setProperty('--next-line-size', nextLineSize + 'px')
          rootEl.style.setProperty('--focus-mask-opacity', String(focusMaskOpacity))
          currentLineEl.style.color = currentColor
          if (lyricsGridEl) {
            lyricsGridEl.classList.toggle('single', singleLineMode)
          }
          metaEl.textContent =
            trackMeta +
            '  |  字号 ' +
            currentLineSize +
            '  ' +
            (singleLineMode ? '单行' : '双行') +
            '  遮罩 ' +
            Math.round(focusMaskOpacity * 100) +
            '%'
        }

        async function sendControl(action) {
          if (!window.api || !window.api.desktopLyricsControl) return
          await window.api.desktopLyricsControl(action)
        }

        async function openSettingsWindow() {
          if (!window.api || !window.api.openDesktopLyricsSettings) return
          await window.api.openDesktopLyricsSettings()
        }

        window.addEventListener('focus', function () {
          bodyEl.classList.add('focused')
        })

        window.addEventListener('blur', function () {
          bodyEl.classList.remove('focused')
        })

        if (document.hasFocus()) {
          bodyEl.classList.add('focused')
        }

        window.addEventListener('keydown', function (event) {
          if (!event.ctrlKey) return

          if (event.key === 'ArrowUp') event.preventDefault()
          if (event.key === 'ArrowDown') event.preventDefault()
          if (event.key === ']') event.preventDefault()
          if (event.key === '[') event.preventDefault()
          if (event.key === '0') event.preventDefault()
        })

        btnPrev.addEventListener('click', function () {
          void sendControl('previous')
        })

        btnPlay.addEventListener('click', function () {
          void sendControl('play-pause')
        })

        btnNext.addEventListener('click', function () {
          void sendControl('next')
        })

        btnSettings.addEventListener('click', function () {
          void openSettingsWindow()
        })

        btnClose.addEventListener('click', function () {
          void sendControl('close-desktop-lyrics')
        })

        window.__applyDesktopLyricsSettings = function (state) {
          applyStyleState(state)
        }

        window.__updateDesktopLyrics = function (payload) {
          const currentLine =
            payload && typeof payload.currentLine === 'string' ? payload.currentLine : ''
          const nextLine = payload && typeof payload.nextLine === 'string' ? payload.nextLine : ''
          const trackTitle = payload && typeof payload.trackTitle === 'string' ? payload.trackTitle : ''
          const artist = payload && typeof payload.artist === 'string' ? payload.artist : ''
          const isPlaying = Boolean(payload && payload.isPlaying)
          btnPlay.textContent = isPlaying ? '⏸' : '▶'
          btnPlay.classList.toggle('active', isPlaying)

          trackMeta = [trackTitle, artist].filter(Boolean).join(' - ') || 'OrangeMusic'
          currentLineEl.textContent = currentLine || '♪'
          nextLineEl.textContent = nextLine || '♪'
          currentLineEl.classList.toggle('paused', !isPlaying)
          nextLineEl.classList.toggle('paused', !isPlaying)
          if (window.__desktopLyricsStyleState) {
            applyStyleState(window.__desktopLyricsStyleState)
          }
        }
      })()
    </script>
  </body>
</html>`
}

function ensureDesktopLyricsWindow(): BrowserWindow {
  if (desktopLyricsWindow && !desktopLyricsWindow.isDestroyed()) {
    return desktopLyricsWindow
  }

  desktopLyricsWindow = new BrowserWindow({
    width: 560,
    height: 240,
    minWidth: 420,
    minHeight: 190,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    skipTaskbar: true,
    resizable: true,
    movable: true,
    show: false,
    hasShadow: false,
    autoHideMenuBar: true,
    webPreferences: {
      preload: resolveDesktopLyricsPreloadPath(),
      sandbox: false,
      contextIsolation: true,
      nodeIntegration: false
    }
  })

  const win = desktopLyricsWindow

  win.setAlwaysOnTop(true, 'screen-saver')
  positionDesktopLyricsWindow(win)
  win.loadURL(`data:text/html;charset=UTF-8,${encodeURIComponent(buildDesktopLyricsHtml())}`)

  win.on('closed', () => {
    desktopLyricsWindow = null
  })

  win.webContents.on('did-finish-load', () => {
    applyDesktopLyricsUpdate(latestPayload)
    applyDesktopLyricsStyleState()
  })

  win.on('move', () => {
    if (desktopLyricsSettingsWindow && !desktopLyricsSettingsWindow.isDestroyed()) {
      positionDesktopLyricsSettingsWindow(win, desktopLyricsSettingsWindow)
    }
  })

  win.on('resize', () => {
    if (desktopLyricsSettingsWindow && !desktopLyricsSettingsWindow.isDestroyed()) {
      positionDesktopLyricsSettingsWindow(win, desktopLyricsSettingsWindow)
    }
  })

  return win
}

function resolveDesktopLyricsPreloadPath(): string {
  const candidates = [
    join(__dirname, '../preload/index.mjs'),
    join(__dirname, '../../preload/index.mjs')
  ]
  const resolved = candidates.find((filePath) => existsSync(filePath))
  return resolved ?? candidates[0]
}

function buildDesktopLyricsSettingsHtml(): string {
  return `<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Desktop Lyrics Settings</title>
    <style>
      html,
      body {
        margin: 0;
        padding: 0;
        background: transparent;
        font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
      }
      .panel {
        padding: 8px;
        border-radius: 12px;
        border: 1px solid rgba(228, 228, 231, 0.85);
        background: rgba(250, 250, 250, 0.95);
        box-shadow: 0 12px 30px rgba(20, 20, 24, 0.22);
        backdrop-filter: blur(10px);
      }
      .btn {
        width: 100%;
        border: 0;
        border-radius: 8px;
        background: transparent;
        color: rgba(63, 63, 70, 0.95);
        text-align: left;
        padding: 8px 10px;
        font-size: 12px;
        cursor: pointer;
      }
      .btn:hover {
        background: rgba(244, 244, 245, 0.95);
      }
    </style>
  </head>
  <body>
    <div class="panel">
      <button class="btn" data-action="font-increase">字号 +</button>
      <button class="btn" data-action="font-decrease">字号 -</button>
      <button class="btn" data-action="toggle-line-mode">单双行切换</button>
      <button class="btn" data-action="next-color">切换歌词颜色</button>
      <button class="btn" data-action="reset">恢复默认</button>
    </div>
    <script>
      document.querySelectorAll('[data-action]').forEach((node) => {
        node.addEventListener('click', async () => {
          const action = node.getAttribute('data-action')
          if (!action || !window.api || !window.api.desktopLyricsSettingsAction) return
          await window.api.desktopLyricsSettingsAction(action)
        })
      })
    </script>
  </body>
</html>`
}

function getStyleSnapshot(): DesktopLyricsStyleState & { currentColor: string } {
  return {
    ...styleState,
    currentColor: colorPresets[styleState.colorIndex] ?? colorPresets[0]
  }
}

function applyDesktopLyricsStyleState(): void {
  if (!desktopLyricsWindow || desktopLyricsWindow.isDestroyed()) return
  const snapshot = getStyleSnapshot()
  const script = `window.__desktopLyricsStyleState=${JSON.stringify(snapshot)};if(window.__applyDesktopLyricsSettings){window.__applyDesktopLyricsSettings(window.__desktopLyricsStyleState)}`
  void desktopLyricsWindow.webContents.executeJavaScript(script).catch(() => undefined)
}

function applyDesktopLyricsUpdate(payload: DesktopLyricsPayload): void {
  if (!desktopLyricsWindow || desktopLyricsWindow.isDestroyed()) return

  const script = `window.__updateDesktopLyrics(${JSON.stringify(payload)})`
  void desktopLyricsWindow.webContents.executeJavaScript(script).catch((error: unknown) => {
    console.warn('[DesktopLyrics] Failed to apply update', error)
  })
}

function positionDesktopLyricsWindow(win: BrowserWindow): void {
  const display = screen.getDisplayMatching(win.getBounds())
  const bounds = display.workArea
  const [width, height] = win.getSize()
  const x = Math.round(bounds.x + (bounds.width - width) / 2)
  const y = Math.round(bounds.y + bounds.height - height - 280)
  win.setPosition(x, Math.max(bounds.y + 24, y))
}

export function showDesktopLyricsWindow(): void {
  const win = ensureDesktopLyricsWindow()
  win.loadURL(`data:text/html;charset=UTF-8,${encodeURIComponent(buildDesktopLyricsHtml())}`)
  positionDesktopLyricsWindow(win)
  win.showInactive()
  win.setAlwaysOnTop(true, 'screen-saver')
  applyDesktopLyricsUpdate(latestPayload)
  applyDesktopLyricsStyleState()
}

export function hideDesktopLyricsWindow(): void {
  closeDesktopLyricsSettingsWindow()
  if (!desktopLyricsWindow || desktopLyricsWindow.isDestroyed()) return
  desktopLyricsWindow.close()
}

export function updateDesktopLyrics(payload: DesktopLyricsPayload): void {
  latestPayload = payload
  if (
    !desktopLyricsWindow ||
    desktopLyricsWindow.isDestroyed() ||
    !desktopLyricsWindow.isVisible()
  ) {
    return
  }

  applyDesktopLyricsUpdate(payload)
}

export function closeDesktopLyricsWindow(): void {
  closeDesktopLyricsSettingsWindow()
  if (!desktopLyricsWindow || desktopLyricsWindow.isDestroyed()) return
  desktopLyricsWindow.close()
}

function positionDesktopLyricsSettingsWindow(
  lyricsWindow: BrowserWindow,
  settingsWindow: BrowserWindow
): void {
  const bounds = lyricsWindow.getBounds()
  const [menuWidth] = settingsWindow.getSize()
  const x = bounds.x + bounds.width - menuWidth - 12
  const y = bounds.y + 36
  settingsWindow.setPosition(x, y)
}

function closeDesktopLyricsSettingsWindow(): void {
  if (!desktopLyricsSettingsWindow || desktopLyricsSettingsWindow.isDestroyed()) return
  desktopLyricsSettingsWindow.close()
  desktopLyricsSettingsWindow = null
}

export function openDesktopLyricsSettingsWindow(): void {
  const lyricsWindow = ensureDesktopLyricsWindow()
  if (!lyricsWindow.isVisible()) {
    showDesktopLyricsWindow()
  }

  if (desktopLyricsSettingsWindow && !desktopLyricsSettingsWindow.isDestroyed()) {
    closeDesktopLyricsSettingsWindow()
    return
  }

  desktopLyricsSettingsWindow = new BrowserWindow({
    width: 196,
    height: 206,
    resizable: false,
    frame: false,
    transparent: true,
    show: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    parent: lyricsWindow,
    modal: false,
    webPreferences: {
      preload: resolveDesktopLyricsPreloadPath(),
      sandbox: false,
      contextIsolation: true,
      nodeIntegration: false
    }
  })

  desktopLyricsSettingsWindow.loadURL(
    `data:text/html;charset=UTF-8,${encodeURIComponent(buildDesktopLyricsSettingsHtml())}`
  )
  desktopLyricsSettingsWindow.setAlwaysOnTop(true, 'screen-saver')
  positionDesktopLyricsSettingsWindow(lyricsWindow, desktopLyricsSettingsWindow)
  desktopLyricsSettingsWindow.showInactive()

  desktopLyricsSettingsWindow.on('closed', () => {
    desktopLyricsSettingsWindow = null
  })

  desktopLyricsSettingsWindow.on('blur', () => {
    closeDesktopLyricsSettingsWindow()
  })
}

export function handleDesktopLyricsSettingsAction(action: DesktopLyricsSettingsAction): void {
  switch (action) {
    case 'font-increase':
      styleState.currentLineSize = Math.min(42, styleState.currentLineSize + 1)
      break
    case 'font-decrease':
      styleState.currentLineSize = Math.max(14, styleState.currentLineSize - 1)
      break
    case 'toggle-line-mode':
      styleState.singleLineMode = !styleState.singleLineMode
      break
    case 'next-color':
      styleState.colorIndex = (styleState.colorIndex + 1) % colorPresets.length
      break
    case 'reset':
      styleState = { ...defaultStyleState }
      break
    default:
      break
  }

  applyDesktopLyricsStyleState()
}
