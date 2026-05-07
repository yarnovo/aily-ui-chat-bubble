import { useRef } from 'react'
import type { PointerEvent } from 'react'
import type { ChatBubbleProps } from './ChatBubble.types'
import './ChatBubble.css'

const cls = (...parts: (string | false | undefined)[]) => parts.filter(Boolean).join(' ')

const LONG_PRESS_MS = 500

/** 格式化语音时长 · 60s 内显示 N" · 60s+ 显示 M'SS" */
function formatVoiceDuration(sec: number): string {
  if (sec < 60) return `${Math.round(sec)}"`
  const m = Math.floor(sec / 60)
  const s = Math.round(sec % 60)
  return `${m}'${String(s).padStart(2, '0')}"`
}

/** 状态 icon · 内联 SVG · 不依赖 @akong/icons (RN 端用 react-native-svg) */
function StatusIcon({ status }: { status: NonNullable<ChatBubbleProps['status']> }) {
  if (status === 'sending') {
    return (
      <span className="ak-chat-bubble__status ak-chat-bubble__status--sending" aria-label="发送中">
        <span className="ak-chat-bubble__spinner" />
      </span>
    )
  }
  if (status === 'failed') {
    return (
      <span className="ak-chat-bubble__status ak-chat-bubble__status--failed" aria-label="发送失败">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <circle cx="7" cy="7" r="6.5" fill="currentColor" />
          <path d="M7 4v3.5" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" />
          <circle cx="7" cy="9.6" r="0.8" fill="#fff" />
        </svg>
      </span>
    )
  }
  // 'sent' · 简陋版不画 icon · 留位
  return null
}

/** akong ChatBubble · Web · iMessage / 微信 / 小红书私信风 */
export function ChatBubble(props: ChatBubbleProps) {
  const {
    role,
    variant = 'text',
    content,
    imageUrl,
    fileName,
    fileSize,
    voiceDurationSec,
    time,
    status,
    onPress,
    onLongPress,
    avatar,
    name,
  } = props

  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const longPressTriggered = useRef(false)

  const clearLongPressTimer = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current)
      longPressTimer.current = null
    }
  }

  const handlePointerDown = (_e: PointerEvent<HTMLDivElement>) => {
    if (!onLongPress) return
    longPressTriggered.current = false
    clearLongPressTimer()
    longPressTimer.current = setTimeout(() => {
      longPressTriggered.current = true
      onLongPress()
    }, LONG_PRESS_MS)
  }

  const handlePointerUp = () => {
    clearLongPressTimer()
  }

  const handlePointerLeave = () => {
    clearLongPressTimer()
  }

  const handleClick = () => {
    // 长按已触发就不再 fire press · 否则两个回调同时来撞
    if (longPressTriggered.current) {
      longPressTriggered.current = false
      return
    }
    onPress?.()
  }

  // === system 消息 · 居中灰小字 · 无气泡 ===
  if (role === 'system') {
    return (
      <div className="ak-chat-bubble-row ak-chat-bubble-row--system" data-role="system">
        <div className="ak-chat-bubble--system" role="status">
          {name && <span className="ak-chat-bubble__system-name">{name} </span>}
          {content}
        </div>
        {time && <div className="ak-chat-bubble__time ak-chat-bubble__time--system">{time}</div>}
      </div>
    )
  }

  // === user / assistant ===
  const bubbleInner = (() => {
    switch (variant) {
      case 'image':
        return imageUrl ? (
          <img
            src={imageUrl}
            alt={content || ''}
            className="ak-chat-bubble__image"
            draggable={false}
          />
        ) : null
      case 'file':
        return (
          <div className="ak-chat-bubble__file">
            <span className="ak-chat-bubble__file-icon" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M5 2.5h6.5L16 7v9.5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-13a1 1 0 0 1 1-1Z"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinejoin="round"
                />
                <path d="M11.5 2.5V7H16" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
              </svg>
            </span>
            <span className="ak-chat-bubble__file-meta">
              <span className="ak-chat-bubble__file-name">{fileName}</span>
              {fileSize && <span className="ak-chat-bubble__file-size">{fileSize}</span>}
            </span>
          </div>
        )
      case 'voice':
        return (
          <div className="ak-chat-bubble__voice">
            <span className="ak-chat-bubble__voice-icon" aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M3 6v4M6 4v8M9 5.5v5M12 7v2"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            <span className="ak-chat-bubble__voice-duration">
              {typeof voiceDurationSec === 'number' ? formatVoiceDuration(voiceDurationSec) : ''}
            </span>
          </div>
        )
      case 'text':
      default:
        return <span className="ak-chat-bubble__text">{content}</span>
    }
  })()

  return (
    <div
      className={cls('ak-chat-bubble-row', `ak-chat-bubble-row--${role}`)}
      data-role={role}
    >
      {role === 'assistant' && (
        <div className="ak-chat-bubble__avatar-slot">
          {avatar ? (
            <img src={avatar} alt="" className="ak-chat-bubble__avatar" />
          ) : (
            <div className="ak-chat-bubble__avatar ak-chat-bubble__avatar--placeholder" aria-hidden="true" />
          )}
        </div>
      )}

      <div className="ak-chat-bubble__main">
        <div
          className={cls(
            'ak-chat-bubble',
            `ak-chat-bubble--${role}`,
            `ak-chat-bubble--${variant}`,
          )}
          role="button"
          tabIndex={0}
          onClick={handleClick}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerLeave}
          onPointerCancel={handlePointerLeave}
          data-testid="ak-chat-bubble"
        >
          {bubbleInner}
        </div>

        <div className="ak-chat-bubble__meta">
          {role === 'user' && status && <StatusIcon status={status} />}
          {time && <span className="ak-chat-bubble__time">{time}</span>}
        </div>
      </div>
    </div>
  )
}

export default ChatBubble
