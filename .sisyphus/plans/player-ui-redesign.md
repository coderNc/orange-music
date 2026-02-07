# 播放器 UI/UX 重新设计 - Glassmorphism 风格

## TL;DR

> **Quick Summary**: 将 Orange Music 播放器升级为 Glassmorphism 风格，添加动态背景、旋转唱片动画、频谱可视化和增强进度条。
>
> **Deliverables**:
>
> - 重新设计的 PlayerBar 组件 (毛玻璃效果)
> - 颜色提取工具 (从专辑封面提取主色)
> - 音频可视化服务 (Web Audio API 频谱分析)
> - 旋转唱片动画组件
> - 增强进度条 (时间预览气泡)
>
> **Estimated Effort**: Medium (3-5 天)
> **Parallel Execution**: YES - 3 waves
> **Critical Path**: Task 1 → Task 3 → Task 5 → Task 7

---

## Context

### Original Request

使用 ui-ux-pro-max skills 将播放器的 UIUX 重新设计一遍

### Interview Summary

**Key Discussions**:

- 设计风格: Glassmorphism (毛玻璃效果)
- 布局形式: 保持底部栏，升级视觉效果
- 新特性: 动态背景 + 旋转唱片 + 频谱可视化 + 进度条增强
- 色彩方案: 保持 Orange 主题色

**Research Findings**:

- 当前使用 Howler.js html5:true 模式，需切换到 html5:false 以支持 Web Audio API
- 性能考虑：可视化需使用 Canvas + requestAnimationFrame，不走 React state
- Glassmorphism 需要 backdrop-filter: blur()

### Metis Review

**Identified Gaps** (addressed):

- Howler html5:true 限制 → 决定切换到 html5:false
- 动态背景范围 → 仅应用于播放器栏
- 可视化位置 → 作为播放器背景层

---

## Work Objectives

### Core Objective

将播放器从功能型设计升级为现代化 Glassmorphism 风格，增加视觉吸引力和交互体验。

### Concrete Deliverables

- `src/renderer/src/components/layout/PlayerBar.tsx` - 重构为 Glassmorphism 风格
- `src/renderer/src/components/player/RotatingAlbumArt.tsx` - 新组件：旋转唱片
- `src/renderer/src/components/player/ProgressBar.tsx` - 增强：时间预览气泡
- `src/renderer/src/components/player/AudioVisualizer.tsx` - 新组件：频谱可视化
- `src/renderer/src/hooks/useColorExtractor.ts` - 新 Hook：颜色提取
- `src/renderer/src/services/audio-service.ts` - 修改：暴露 AudioContext
- `src/renderer/src/assets/main.css` - 新增 Glassmorphism 和动画样式

### Definition of Done

- [x] 播放器栏显示毛玻璃效果 (backdrop-filter: blur)
- [x] 专辑封面在播放时旋转，暂停时停止
- [x] 背景颜色根据专辑封面动态变化
- [x] 频谱可视化在播放时显示跳动的条形图
- [x] 进度条 hover 时显示时间预览气泡
- [x] Dark/Light 模式均正常工作
- [x] 无性能卡顿 (60fps)

### Must Have

- Glassmorphism 毛玻璃效果
- 旋转唱片动画 (播放时旋转)
- 频谱条形图可视化
- 动态背景渐变 (从封面提取颜色)
- 进度条时间预览气泡
- 保持所有现有功能

### Must NOT Have (Guardrails)

- ❌ 不修改播放逻辑 (play/pause/seek/next/previous)
- ❌ 不修改 player-store 状态结构
- ❌ 不使用 React state 存储可视化数据 (性能)
- ❌ 不使用 emoji 作为图标
- ❌ 不破坏现有键盘快捷键
- ❌ 不改变布局结构 (保持三栏式)

---

## Verification Strategy

> **UNIVERSAL RULE: ZERO HUMAN INTERVENTION**
>
> ALL tasks in this plan MUST be verifiable WITHOUT any human action.

### Test Decision

- **Infrastructure exists**: YES (Vitest)
- **Automated tests**: NO - 视觉验证通过 Playwright
- **Framework**: Playwright for visual verification

### Agent-Executed QA Scenarios (MANDATORY)

**Verification Tool by Deliverable Type:**

| Type              | Tool                   | How Agent Verifies                     |
| ----------------- | ---------------------- | -------------------------------------- |
| **UI Components** | Playwright             | Navigate, inspect CSS, screenshot      |
| **Animations**    | Playwright             | Check computed styles, animation state |
| **Audio Service** | Bash (dev server logs) | Verify AudioContext initialization     |

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Start Immediately):
├── Task 1: 修改 AudioService 暴露 AudioContext
├── Task 2: 创建颜色提取 Hook
└── Task 3: 添加 Glassmorphism 全局样式

Wave 2 (After Wave 1):
├── Task 4: 创建旋转唱片组件
├── Task 5: 创建频谱可视化组件
└── Task 6: 增强进度条组件

Wave 3 (After Wave 2):
└── Task 7: 重构 PlayerBar 整合所有组件

Critical Path: Task 1 → Task 5 → Task 7
Parallel Speedup: ~50% faster than sequential
```

### Dependency Matrix

| Task | Depends On | Blocks | Can Parallelize With |
| ---- | ---------- | ------ | -------------------- |
| 1    | None       | 5      | 2, 3                 |
| 2    | None       | 7      | 1, 3                 |
| 3    | None       | 4, 7   | 1, 2                 |
| 4    | 3          | 7      | 5, 6                 |
| 5    | 1          | 7      | 4, 6                 |
| 6    | None       | 7      | 4, 5                 |
| 7    | 2, 4, 5, 6 | None   | None (final)         |

### Agent Dispatch Summary

| Wave | Tasks   | Recommended Agents                 |
| ---- | ------- | ---------------------------------- |
| 1    | 1, 2, 3 | visual-engineering + ui-ux-pro-max |
| 2    | 4, 5, 6 | visual-engineering + ui-ux-pro-max |
| 3    | 7       | visual-engineering + ui-ux-pro-max |

---

## TODOs

- [x] 1. 修改 AudioService 支持 Web Audio API

  **What to do**:
  - 将 Howler 配置从 `html5: true` 改为 `html5: false`
  - 暴露 AudioContext 和 AnalyserNode 供可视化使用
  - 添加 `getAnalyserNode()` 方法
  - 确保 AudioContext 在用户交互后 resume()

  **Must NOT do**:
  - 不改变播放控制逻辑
  - 不改变 Howler 实例的创建/销毁逻辑

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: 单文件修改，逻辑清晰
  - **Skills**: [`ui-ux-pro-max`]
    - `ui-ux-pro-max`: 提供 Web Audio API 最佳实践

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 2, 3)
  - **Blocks**: Task 5
  - **Blocked By**: None

  **References**:
  - `src/renderer/src/services/audio-service.ts:126` - 当前 html5:true 配置位置
  - `src/renderer/src/stores/player-store.ts` - 状态管理，了解播放流程
  - Howler.js 文档: https://github.com/goldfire/howler.js#html5-audio

  **Acceptance Criteria**:

  **Agent-Executed QA Scenarios:**

  ```
  Scenario: AudioService exposes AnalyserNode
    Tool: Bash
    Preconditions: Dev server running
    Steps:
      1. grep -n "getAnalyserNode" src/renderer/src/services/audio-service.ts
      2. Assert: Method exists in file
      3. grep -n "html5: false" src/renderer/src/services/audio-service.ts
      4. Assert: html5 is set to false
    Expected Result: AnalyserNode method exists, html5 is false
    Evidence: grep output captured

  Scenario: Audio still plays correctly
    Tool: Playwright
    Preconditions: Dev server running on localhost:5173
    Steps:
      1. Navigate to: http://localhost:5173
      2. Wait for: .track-list-item visible (timeout: 10s)
      3. Double-click: first .track-list-item
      4. Wait for: [data-playing="true"] on play button (timeout: 5s)
      5. Assert: Audio is playing (check isPlaying state)
      6. Screenshot: .sisyphus/evidence/task-1-audio-plays.png
    Expected Result: Audio plays without errors
    Evidence: .sisyphus/evidence/task-1-audio-plays.png
  ```

  **Commit**: YES
  - Message: `feat(audio): switch to Web Audio API mode for visualizer support`
  - Files: `src/renderer/src/services/audio-service.ts`

---

- [x] 2. 创建颜色提取 Hook

  **What to do**:
  - 创建 `useColorExtractor.ts` Hook
  - 使用 Canvas 从专辑封面图片提取主色调
  - 返回 dominant color 和 palette (2-3 色)
  - 支持颜色变化时的平滑过渡
  - 处理无封面/加载失败的 fallback 颜色

  **Must NOT do**:
  - 不引入额外的颜色提取库 (使用原生 Canvas)
  - 不阻塞主线程 (使用 requestAnimationFrame 或 Web Worker)

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: 涉及图像处理和颜色算法
  - **Skills**: [`ui-ux-pro-max`]
    - `ui-ux-pro-max`: 颜色理论和调色板生成

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1, 3)
  - **Blocks**: Task 7
  - **Blocked By**: None

  **References**:
  - `src/renderer/src/components/common/LazyImage.tsx` - 图片加载模式
  - `src/renderer/src/stores/player-store.ts:currentTrack.coverUrl` - 封面 URL 来源

  **Acceptance Criteria**:

  **Agent-Executed QA Scenarios:**

  ```
  Scenario: Hook file exists with correct exports
    Tool: Bash
    Preconditions: None
    Steps:
      1. ls src/renderer/src/hooks/useColorExtractor.ts
      2. Assert: File exists
      3. grep -n "export function useColorExtractor" src/renderer/src/hooks/useColorExtractor.ts
      4. Assert: Hook is exported
    Expected Result: Hook file exists with correct export
    Evidence: ls and grep output

  Scenario: Hook returns color values
    Tool: Playwright
    Preconditions: Dev server running, integrate hook in PlayerBar temporarily
    Steps:
      1. Navigate to: http://localhost:5173
      2. Double-click: first track to start playing
      3. Execute JS: window.__extractedColors (set by debug code)
      4. Assert: Result contains { dominant: string, palette: string[] }
    Expected Result: Color extraction works
    Evidence: Console output captured
  ```

  **Commit**: YES
  - Message: `feat(hooks): add useColorExtractor for dynamic theming`
  - Files: `src/renderer/src/hooks/useColorExtractor.ts`

---

- [x] 3. 添加 Glassmorphism 全局样式

  **What to do**:
  - 在 `main.css` 添加 Glassmorphism 工具类
  - 定义 `.glass-panel` 类 (backdrop-filter, 半透明背景)
  - 添加旋转动画 `@keyframes spin-slow`
  - 添加动态背景渐变动画
  - 确保 Dark/Light 模式兼容

  **Must NOT do**:
  - 不修改现有组件的类名
  - 不破坏现有样式

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: CSS 样式设计
  - **Skills**: [`ui-ux-pro-max`]
    - `ui-ux-pro-max`: Glassmorphism 最佳实践，动画性能

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1, 2)
  - **Blocks**: Tasks 4, 7
  - **Blocked By**: None

  **References**:
  - `src/renderer/src/assets/main.css` - 现有全局样式
  - UI/UX Pro Max skill: Glassmorphism 规范

  **Acceptance Criteria**:

  **Agent-Executed QA Scenarios:**

  ```
  Scenario: Glassmorphism classes defined
    Tool: Bash
    Preconditions: None
    Steps:
      1. grep -n "glass-panel" src/renderer/src/assets/main.css
      2. Assert: Class definition exists
      3. grep -n "backdrop-filter" src/renderer/src/assets/main.css
      4. Assert: backdrop-filter property used
      5. grep -n "spin-slow" src/renderer/src/assets/main.css
      6. Assert: Spin animation defined
    Expected Result: All glassmorphism styles defined
    Evidence: grep output

  Scenario: Styles work in browser
    Tool: Playwright
    Preconditions: Dev server running, test element with .glass-panel class
    Steps:
      1. Navigate to: http://localhost:5173
      2. Add test element: document.body.innerHTML += '<div class="glass-panel" style="width:100px;height:100px;position:fixed;top:0;left:0;"></div>'
      3. Get computed style: backdropFilter
      4. Assert: Contains "blur"
    Expected Result: Glassmorphism effect applies
    Evidence: Computed style value
  ```

  **Commit**: YES
  - Message: `style: add glassmorphism utilities and animations`
  - Files: `src/renderer/src/assets/main.css`

---

- [x] 4. 创建旋转唱片组件

  **What to do**:
  - 创建 `RotatingAlbumArt.tsx` 组件
  - 圆形裁剪的专辑封面，带唱片纹理效果
  - 播放时应用 `spin-slow` 动画
  - 暂停时暂停动画 (animation-play-state: paused)
  - 接受 `src`, `isPlaying`, `size` props

  **Must NOT do**:
  - 不改变播放状态管理
  - 不使用会造成布局偏移的 scale 动画

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: 视觉组件设计
  - **Skills**: [`ui-ux-pro-max`]
    - `ui-ux-pro-max`: 动画最佳实践，唱片 UI 设计

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 5, 6)
  - **Blocks**: Task 7
  - **Blocked By**: Task 3

  **References**:
  - `src/renderer/src/components/common/LazyImage.tsx` - 图片加载模式
  - `src/renderer/src/assets/main.css` - spin-slow 动画 (Task 3 创建)
  - `src/renderer/src/stores/player-store.ts:isPlaying` - 播放状态

  **Acceptance Criteria**:

  **Agent-Executed QA Scenarios:**

  ```
  Scenario: Component renders with rotation
    Tool: Playwright
    Preconditions: Dev server running, component integrated
    Steps:
      1. Navigate to: http://localhost:5173
      2. Double-click: first track to start playing
      3. Wait for: .rotating-album-art visible
      4. Get computed style: animationPlayState
      5. Assert: animationPlayState === "running"
      6. Click: pause button
      7. Get computed style: animationPlayState
      8. Assert: animationPlayState === "paused"
      9. Screenshot: .sisyphus/evidence/task-4-rotating-album.png
    Expected Result: Album art rotates when playing, pauses when paused
    Evidence: .sisyphus/evidence/task-4-rotating-album.png
  ```

  **Commit**: YES
  - Message: `feat(player): add rotating album art component`
  - Files: `src/renderer/src/components/player/RotatingAlbumArt.tsx`

---

- [x] 5. 创建频谱可视化组件

  **What to do**:
  - 创建 `AudioVisualizer.tsx` 组件
  - 使用 Canvas 绘制频谱条形图
  - 从 AudioService 获取 AnalyserNode
  - 使用 requestAnimationFrame 循环更新
  - 不使用 React state 存储频谱数据
  - 支持自定义条数、颜色、高度

  **Must NOT do**:
  - 不将频谱数据存入 React state 或 Zustand
  - 不在组件 unmount 后继续动画循环
  - 不阻塞主线程

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Canvas 绑定和动画性能优化
  - **Skills**: [`ui-ux-pro-max`]
    - `ui-ux-pro-max`: 可视化最佳实践

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 4, 6)
  - **Blocks**: Task 7
  - **Blocked By**: Task 1

  **References**:
  - `src/renderer/src/services/audio-service.ts` - getAnalyserNode() (Task 1 创建)
  - Web Audio API AnalyserNode 文档

  **Acceptance Criteria**:

  **Agent-Executed QA Scenarios:**

  ```
  Scenario: Visualizer canvas exists and animates
    Tool: Playwright
    Preconditions: Dev server running, component integrated in PlayerBar
    Steps:
      1. Navigate to: http://localhost:5173
      2. Double-click: first track to start playing
      3. Wait for: canvas.audio-visualizer visible (timeout: 5s)
      4. Execute JS: document.querySelector('canvas.audio-visualizer').getContext('2d') !== null
      5. Assert: Canvas context exists
      6. Wait: 1 second
      7. Screenshot: .sisyphus/evidence/task-5-visualizer-frame1.png
      8. Wait: 500ms
      9. Screenshot: .sisyphus/evidence/task-5-visualizer-frame2.png
    Expected Result: Visualizer shows animated bars
    Evidence: Two screenshots showing different frame states

  Scenario: Visualizer stops when paused
    Tool: Playwright
    Preconditions: Dev server running, track playing
    Steps:
      1. Click: pause button
      2. Wait: 500ms
      3. Screenshot: .sisyphus/evidence/task-5-visualizer-paused.png
      4. Assert: Visualizer bars are at minimum height or static
    Expected Result: Visualizer stops animating when paused
    Evidence: .sisyphus/evidence/task-5-visualizer-paused.png
  ```

  **Commit**: YES
  - Message: `feat(player): add audio spectrum visualizer component`
  - Files: `src/renderer/src/components/player/AudioVisualizer.tsx`

---

- [x] 6. 增强进度条组件

  **What to do**:
  - 修改 `ProgressBar.tsx`
  - 添加 hover 时的时间预览气泡 (tooltip)
  - 气泡显示 hover 位置对应的时间
  - 增大可点击区域 (从 h-1 改为 h-2 或更大)
  - 添加平滑过渡效果

  **Must NOT do**:
  - 不改变 seek 逻辑
  - 不改变现有 props 接口

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: UI 交互增强
  - **Skills**: [`ui-ux-pro-max`]
    - `ui-ux-pro-max`: Tooltip 最佳实践，交互设计

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 4, 5)
  - **Blocks**: Task 7
  - **Blocked By**: None

  **References**:
  - `src/renderer/src/components/player/ProgressBar.tsx` - 当前实现
  - `src/renderer/src/utils/index.ts:formatTime` - 时间格式化

  **Acceptance Criteria**:

  **Agent-Executed QA Scenarios:**

  ```
  Scenario: Time tooltip appears on hover
    Tool: Playwright
    Preconditions: Dev server running, track playing
    Steps:
      1. Navigate to: http://localhost:5173
      2. Double-click: first track
      3. Wait for: .progress-bar-container visible
      4. Hover: .progress-bar-container at 50% width position
      5. Wait for: .time-tooltip visible (timeout: 2s)
      6. Assert: .time-tooltip contains time format (e.g., "1:23")
      7. Screenshot: .sisyphus/evidence/task-6-tooltip.png
    Expected Result: Tooltip shows time at hover position
    Evidence: .sisyphus/evidence/task-6-tooltip.png

  Scenario: Tooltip follows mouse
    Tool: Playwright
    Preconditions: Tooltip visible from previous scenario
    Steps:
      1. Move mouse to 25% position on progress bar
      2. Assert: Tooltip position changed
      3. Assert: Tooltip time value changed
    Expected Result: Tooltip follows mouse and updates time
    Evidence: Position comparison
  ```

  **Commit**: YES
  - Message: `feat(player): add time preview tooltip to progress bar`
  - Files: `src/renderer/src/components/player/ProgressBar.tsx`

---

- [x] 7. 重构 PlayerBar 整合所有组件

  **What to do**:
  - 应用 Glassmorphism 样式 (.glass-panel)
  - 集成动态背景 (使用 useColorExtractor)
  - 替换专辑封面为 RotatingAlbumArt
  - 添加 AudioVisualizer 作为背景层
  - 确保所有现有功能正常
  - 优化 Dark/Light 模式适配

  **Must NOT do**:
  - 不改变组件接口
  - 不改变布局结构 (三栏式)
  - 不移除任何现有功能

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: 组件整合和样式调优
  - **Skills**: [`ui-ux-pro-max`]
    - `ui-ux-pro-max`: 整体 UI 协调

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 3 (final)
  - **Blocks**: None
  - **Blocked By**: Tasks 2, 4, 5, 6

  **References**:
  - `src/renderer/src/components/layout/PlayerBar.tsx` - 当前实现
  - `src/renderer/src/hooks/useColorExtractor.ts` - Task 2
  - `src/renderer/src/components/player/RotatingAlbumArt.tsx` - Task 4
  - `src/renderer/src/components/player/AudioVisualizer.tsx` - Task 5
  - `src/renderer/src/components/player/ProgressBar.tsx` - Task 6

  **Acceptance Criteria**:

  **Agent-Executed QA Scenarios:**

  ```
  Scenario: Glassmorphism effect applied
    Tool: Playwright
    Preconditions: Dev server running
    Steps:
      1. Navigate to: http://localhost:5173
      2. Wait for: .player-bar visible
      3. Get computed style: backdropFilter
      4. Assert: Contains "blur"
      5. Screenshot: .sisyphus/evidence/task-7-glass-effect.png
    Expected Result: Player bar has glassmorphism effect
    Evidence: .sisyphus/evidence/task-7-glass-effect.png

  Scenario: Dynamic background changes with track
    Tool: Playwright
    Preconditions: Dev server running
    Steps:
      1. Navigate to: http://localhost:5173
      2. Double-click: first track
      3. Wait for: background gradient visible
      4. Screenshot: .sisyphus/evidence/task-7-bg-track1.png
      5. Click: next track button
      6. Wait: 1 second for transition
      7. Screenshot: .sisyphus/evidence/task-7-bg-track2.png
    Expected Result: Background color changes between tracks
    Evidence: Two screenshots showing different background colors

  Scenario: All player controls work
    Tool: Playwright
    Preconditions: Dev server running
    Steps:
      1. Navigate to: http://localhost:5173
      2. Double-click: first track
      3. Assert: Track is playing (isPlaying = true)
      4. Click: pause button
      5. Assert: Track is paused (isPlaying = false)
      6. Click: next button
      7. Assert: Track changed (title different)
      8. Click: previous button
      9. Assert: Track changed back
      10. Drag: progress bar to 50%
      11. Assert: Position updated
      12. Drag: volume slider to 50%
      13. Assert: Volume updated
      14. Screenshot: .sisyphus/evidence/task-7-controls-work.png
    Expected Result: All playback controls function correctly
    Evidence: .sisyphus/evidence/task-7-controls-work.png

  Scenario: Dark mode works correctly
    Tool: Playwright
    Preconditions: Dev server running
    Steps:
      1. Navigate to: http://localhost:5173
      2. Toggle dark mode (if toggle exists) or set via devtools
      3. Assert: .dark class on root element
      4. Assert: Player bar colors adapt
      5. Screenshot: .sisyphus/evidence/task-7-dark-mode.png
    Expected Result: Dark mode styling correct
    Evidence: .sisyphus/evidence/task-7-dark-mode.png
  ```

  **Commit**: YES
  - Message: `feat(player): redesign PlayerBar with glassmorphism and visualizations`
  - Files: `src/renderer/src/components/layout/PlayerBar.tsx`

---

## Commit Strategy

| After Task | Message                                     | Files                | Verification            |
| ---------- | ------------------------------------------- | -------------------- | ----------------------- |
| 1          | `feat(audio): switch to Web Audio API mode` | audio-service.ts     | Audio still plays       |
| 2          | `feat(hooks): add useColorExtractor`        | useColorExtractor.ts | Hook exports correctly  |
| 3          | `style: add glassmorphism utilities`        | main.css             | Classes defined         |
| 4          | `feat(player): add rotating album art`      | RotatingAlbumArt.tsx | Animation works         |
| 5          | `feat(player): add audio visualizer`        | AudioVisualizer.tsx  | Canvas animates         |
| 6          | `feat(player): add progress tooltip`        | ProgressBar.tsx      | Tooltip appears         |
| 7          | `feat(player): redesign PlayerBar`          | PlayerBar.tsx        | All features integrated |

---

## Success Criteria

### Verification Commands

```bash
# Dev server runs without errors
npm run dev  # Expected: Server starts on localhost:5173

# TypeScript compiles
npm run typecheck  # Expected: No type errors

# Build succeeds
npm run build  # Expected: Build completes successfully
```

### Final Checklist

- [x] Glassmorphism 毛玻璃效果在 PlayerBar 上可见
- [x] 专辑封面在播放时旋转
- [x] 背景颜色随专辑变化
- [x] 频谱可视化在播放时跳动
- [x] 进度条 hover 显示时间预览
- [x] Dark/Light 模式均正常
- [x] 所有播放控制功能正常
- [x] 无性能问题 (60fps)
- [x] TypeScript 编译无错误
- [x] Build 成功
