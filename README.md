# @akong/chat-bubble

akong ChatBubble · 消息气泡 · iMessage / 微信 / 小红书私信风 · 跨端 (Web + React Native)

## Demo

[GitHub Pages 演示](https://yarnovo.github.io/akong-chat-bubble/)

## 安装

```bash
npm i github:yarnovo/akong-chat-bubble github:yarnovo/akong-tokens
```

## Web

```tsx
import { ChatBubble } from '@akong/chat-bubble'
import '@akong/chat-bubble/style.css'
import '@akong/tokens/style.css'  // 顶层引一次 token

<ChatBubble role="user" content="帮我写一段广告文案" time="12:34" status="sent" />

<ChatBubble role="assistant" content="好的，给你三版..." time="12:35" />

<ChatBubble role="system" content="对方撤回了一条消息" />

<ChatBubble role="user" variant="image" imageUrl="https://..." />

<ChatBubble role="user" variant="file" fileName="report.pdf" fileSize="2.3 MB" />

<ChatBubble role="assistant" variant="voice" voiceDurationSec={12} />
```

## React Native

```tsx
import { ChatBubble } from '@akong/chat-bubble'

<ChatBubble role="user" content="hi" onLongPress={() => copy()} />
```

Metro bundler 自动按 `.native.tsx` 后缀解析 · 同 `import` 路径两端通用。

## API

| Prop | Type | Default | 说明 |
|---|---|---|---|
| role | `user` / `assistant` / `system` | — | 必传 · 决定对齐 + 气泡样式 |
| variant | `text` / `image` / `file` / `voice` | `text` | 内容形态 |
| content | string | — | text variant 文本 · 也用作 system 文本 |
| imageUrl | string | — | image variant 图片 URL |
| fileName | string | — | file variant 文件名 |
| fileSize | string | — | file variant 大小 (调用方格式化) |
| voiceDurationSec | number | — | voice variant 时长 (秒) |
| time | string | — | 气泡下方时间 (如 "12:34") |
| status | `sending` / `sent` / `failed` | — | 仅 user · 发送状态 |
| avatar | string | — | assistant 头像 URL · user 不显示头像 |
| name | string | — | system 消息发起人名 |
| onPress | () => void | — | 单击 (image 预览 / file 下载) |
| onLongPress | () => void | — | 长按 500ms (复制 / 撤回菜单) |

## 视觉规约

- **user**: 右对齐 · `bg var(--ak-fg)` · `text var(--ak-fg-inverse)` · 圆角 `2xl` · 右下角 `sm` (4px tail)
- **assistant**: 左对齐 · `bg var(--ak-bg-subtle)` · `text var(--ak-fg)` · 圆角 `2xl` · 左下角 `sm`
- **system**: 居中 · 灰色小字 · 无气泡
- **max-w**: 80%
- **padding**: 12px (左右) × 8px (上下)
- text 自动换行 (whitespace pre-line)
- image: 嵌入气泡 · max-w 240
- voice: icon + 时长 (60s 内 `N"` · 60s+ `M'SS"`)
- status: sending → spinner · failed → 红色 `!` icon · sent → 不显示
- time: 气泡外 · `text-xs text-fg-subtle` · 用户消息右对齐 · assistant 左对齐

## 设计原则

- **一份 props**：Web 跟 RN 共享 `ChatBubble.types.ts`
- **两端实现**：`ChatBubble.tsx` (Web · DOM) + `ChatBubble.native.tsx` (RN · `<Pressable>`)
- **行为契约共享**：`ChatBubble.behavior.ts` 描述 press / long-press 场景 · 两端测试都跑这套
- **token 100% 接 @akong/tokens**：改一处 token 自动 update
