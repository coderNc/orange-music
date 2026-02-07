# Draft: 播放器 UI/UX 重新设计

## 项目概述

**项目名称**: Orange Music Player
**技术栈**: React 19 + TypeScript + Electron + Tailwind CSS 4 + Zustand + Howler.js

## 当前播放器架构 (已确认)

### 组件结构

- `PlayerBar.tsx` - 主播放器容器（底部固定）
- `PlaybackControls.tsx` - 播放控制按钮
- `ProgressBar.tsx` - 进度条和时间显示
- `VolumeControl.tsx` - 音量控制
- `LyricsPanel.tsx` - 歌词面板
- `QueuePanel.tsx` - 播放队列

### 状态管理

- Zustand store (`player-store.ts`)
- Audio service wrapper (`audio-service.ts`)

### 当前样式

- Tailwind CSS 4 工具类
- 支持 Dark/Light 模式
- 自定义 CSS 动画

---

## 用户需求 (已确认)

### 设计风格偏好

- [x] **Glassmorphism** - 毛玻璃效果，半透明背景，现代感强

### 布局形式

- [x] **底部栏** - 保持现有布局，但升级视觉效果

### 新增特性需求

- [x] **动态背景** - 根据专辑封面颜色动态调整背景渐变
- [x] **专辑封面动画** - 播放时封面旋转或脉冲动画
- [x] **波形可视化** - 显示音频波形或频谱动画
- [x] **进度条增强** - 更大的可交互区域，拖拽预览

### 色彩方案

- [x] **保持 Orange 主题** - 继续使用橙色作为品牌强调色

---

## 详细设计决策 (已确认)

### 波形可视化

- **类型**: 频谱条形图 (均衡器风格)
- **技术**: Web Audio API + Canvas/CSS

### 专辑封面动画

- **类型**: 旋转唱片效果
- **细节**: 播放时持续旋转，暂停时停止

### 进度条样式

- **类型**: 时间预览气泡
- **细节**: hover 时显示时间预览

### 动态背景

- **类型**: 渐变过渡
- **细节**: 从专辑封面提取颜色，歌曲切换时柔和过渡

---

## 研究发现

### Metis 分析结果 (关键发现)

1. **Howler html5:true 限制**
   - 当前配置阻止直接连接 Web Audio API AnalyserNode
   - **决策**: 切换到 `html5: false` 模式

2. **性能风险**
   - Glassmorphism + 实时 Canvas + CSS 动画会造成 GPU 负载
   - **应对**: 使用 `requestAnimationFrame` 和 Canvas ref，不走 React state

3. **动态背景范围**
   - **决策**: 仅应用于播放器栏背景

4. **可视化位置**
   - **决策**: 作为播放器背景层，半透明不干扰控件

---

## 工作范围与边界 (已确认)

### IN SCOPE (要做的)

- [x] 播放器组件 UI 重设计
- [x] 音频服务增强 (频谱可视化)
- [x] 颜色提取工具 (从封面提取主色)
- [x] 全局样式修改 (Glassmorphism)

### OUT OF SCOPE (不改的)

- [x] 不改播放逻辑 (play/pause/seek)
- [x] 不改状态结构 (player-store)

### 测试策略

- **无单元测试** - 通过 Playwright 视觉验证
- **Agent QA Scenarios** - 每个任务的验收标准

---

## 自检清单

**CLEARANCE CHECK:**

- [x] 核心目标明确？ → Glassmorphism 风格 + 动态背景 + 可视化
- [x] 范围边界确定？ → 4 项 IN / 2 项 OUT
- [x] 无重大歧义？ → 所有设计决策已确认
- [x] 技术方案确定？ → Web Audio API + Canvas + 颜色提取
- [x] 测试策略确认？ → 无单元测试，Playwright 验证
- [x] 无阻塞问题？ → 已全部解答

**→ ALL YES - 准备生成工作计划**
