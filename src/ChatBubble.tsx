import type { ChatBubbleProps } from './ChatBubble.types'
import './ChatBubble.css'

const cls = (...parts: (string | false | undefined)[]) => parts.filter(Boolean).join(' ')

/** akong ChatBubble · Web · DOM `<button>` */
export function ChatBubble(props: ChatBubbleProps) {
  const {
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    fullWidth = false,
    iconLeft,
    iconRight,
    children,
    onClick,
    onPress,
    type = 'button',
    ariaLabel,
  } = props

  const handle = () => {
    if (disabled || loading) return
    onClick?.()
    onPress?.()
  }

  return (
    <button
      type={type}
      aria-label={ariaLabel}
      aria-busy={loading || undefined}
      aria-disabled={disabled || undefined}
      disabled={disabled}
      onClick={handle}
      className={cls(
        'ak-chat-bubble',
        `ak-chat-bubble--${variant}`,
        `ak-chat-bubble--${size}`,
        fullWidth && 'ak-chat-bubble--full-width',
        loading && 'ak-chat-bubble--loading',
      )}
    >
      {iconLeft && <span className="ak-chat-bubble__icon">{iconLeft}</span>}
      {children && <span>{children}</span>}
      {iconRight && <span className="ak-chat-bubble__icon">{iconRight}</span>}
    </button>
  )
}

export default ChatBubble
