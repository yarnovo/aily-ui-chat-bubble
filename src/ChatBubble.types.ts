/**
 * akong ChatBubble · 跨端 props
 *
 * 一份 props · Web (.tsx · DOM) + RN (.native.tsx · View/Pressable) 两端共享
 */

export type ChatBubbleRole = 'user' | 'assistant' | 'system'
export type ChatBubbleVariant = 'text' | 'image' | 'file' | 'voice'
export type ChatBubbleStatus = 'sending' | 'sent' | 'failed'

export interface ChatBubbleProps {
  /** 发送方 · user 右对齐 / assistant 左对齐 / system 居中无气泡 */
  role: ChatBubbleRole
  /** 内容形态 · text / image / file / voice */
  variant?: ChatBubbleVariant
  /** text variant 的文本内容 · 自动换行 (whitespace-pre-line) */
  content?: string
  /** image variant 的图片 URL · 嵌入气泡 · max-w 240 */
  imageUrl?: string
  /** file variant 的文件名 */
  fileName?: string
  /** file variant 的文件大小展示文本 (如 "2.3 MB" · 调用方自己格式化) */
  fileSize?: string
  /** voice variant 的时长 (秒) · 简陋版只显示 icon + 时长 */
  voiceDurationSec?: number
  /** 气泡下方时间 · 12:34 / 昨天 12:34 / 5-7 12:34 等 · 不传则不显示 */
  time?: string
  /** 用户消息状态 · 发送中 spinner / 已发 / 失败 ! · 仅 role=user 时有意义 */
  status?: ChatBubbleStatus
  /** 单击 (主要用于 image 预览 / file 下载等) */
  onPress?: () => void
  /** 长按 (复制 / 撤回菜单) · Web 用 pointer events 模拟 · RN 自带 onLongPress */
  onLongPress?: () => void
  /** assistant 端头像 URL · user 端不显示头像 · system 端不显示头像 */
  avatar?: string
  /** system 消息显示的发起者名 (如 "管理员撤回了一条消息") · role=system 用 */
  name?: string
}
