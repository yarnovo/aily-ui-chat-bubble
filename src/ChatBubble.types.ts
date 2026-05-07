import type { ReactNode } from 'react'

export type ChatBubbleVariant = 'primary' | 'secondary' | 'ghost' | 'destructive' | 'link'
export type ChatBubbleSize = 'sm' | 'md' | 'lg'

export interface ChatBubbleProps {
  variant?: ChatBubbleVariant
  size?: ChatBubbleSize
  disabled?: boolean
  loading?: boolean
  fullWidth?: boolean
  iconLeft?: ReactNode
  iconRight?: ReactNode
  children?: ReactNode
  onClick?: () => void
  /** RN 用 onPress · Web 自动用 onClick · 跨端写法可同时传 */
  onPress?: () => void
  /** Web 提交表单等 · RN 忽略 */
  type?: 'button' | 'submit' | 'reset'
  /** a11y */
  ariaLabel?: string
}
