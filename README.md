# @akong/chat-bubble

akong ChatBubble · 极简 · 跨端 (Web + React Native)

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
import '@akong/tokens/style.css'  // 顶层引一次 token (整个 app 共用)

<ChatBubble variant="primary" size="md" onClick={...}>下单</ChatBubble>
<ChatBubble variant="secondary" loading>处理中</ChatBubble>
<ChatBubble variant="ghost" iconLeft={<Plus />}>新建</ChatBubble>
<ChatBubble variant="destructive" disabled>删除</ChatBubble>
<ChatBubble variant="link">查看详情</ChatBubble>
```

## React Native

```tsx
import { ChatBubble } from '@akong/chat-bubble'

<ChatBubble variant="primary" size="md" onPress={...}>下单</ChatBubble>
```

Metro bundler 自动按 `.native.tsx` 后缀解析 · 同 `import` 路径两端通用。

## API

| Prop | Type | Default | 说明 |
|---|---|---|---|
| variant | `primary` / `secondary` / `ghost` / `destructive` / `link` | `primary` | |
| size | `sm` / `md` / `lg` | `md` | |
| disabled | boolean | false | |
| loading | boolean | false | 转圈 + 锁交互 |
| fullWidth | boolean | false | |
| iconLeft / iconRight | ReactNode | — | |
| onClick / onPress | () => void | — | Web 用 onClick · RN 用 onPress · 都传也行 |
| ariaLabel | string | — | a11y |

## 设计原则

- **一份 props**：Web 跟 RN 共享 `ChatBubble.types.ts`
- **两端实现**：`ChatBubble.tsx` (Web · DOM `<button>`) + `ChatBubble.native.tsx` (RN · `<Pressable>`)
- **触摸目标 ≥ 44pt**：所有 size 都满足 iOS HIG
- **极简反馈**：active 0.7 opacity (不缩放 · 不晃)
- **token 100% 接 @akong/tokens**：改一处 token 自动 update

## 状态

| 状态 | Web | RN |
|---|---|---|
| default | `:not(:active)` | `pressed: false` |
| active | `:active` opacity 0.7 | `pressed: true` opacity 0.7 |
| hover | `:hover` (桌面 only) | — |
| disabled | `disabled` opacity 0.4 | `disabled` opacity 0.4 |
| loading | `.ak-btn--loading` 转圈 | `<ActivityIndicator />` |
| focus | `:focus-visible` outline | RN 默认 a11y focus |
