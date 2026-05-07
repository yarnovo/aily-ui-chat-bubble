/**
 * 跨端行为契约 · Web + RN 都遵循
 *
 * "给定 props · 模拟 press / long-press · 期望某 callback 触发 / 不触发"
 * 各端测试 import 这份 spec 跑 · 行为强一致
 */

import type { ChatBubbleRole, ChatBubbleVariant, ChatBubbleStatus } from './ChatBubble.types'

export type Outcome = 'callback-fired' | 'callback-skipped'

export interface PressScenario {
  name: string
  props: { role?: ChatBubbleRole; status?: ChatBubbleStatus }
  /** 模拟一次"按下" · 期望结果 */
  onPressOutcome: Outcome
  onLongPressOutcome: Outcome
}

/** 共享场景 · Web + RN 都跑 */
export const bubbleScenarios: PressScenario[] = [
  {
    name: 'user · default · press 跟 long-press 都触发',
    props: { role: 'user' },
    onPressOutcome: 'callback-fired',
    onLongPressOutcome: 'callback-fired',
  },
  {
    name: 'assistant · default · press 跟 long-press 都触发',
    props: { role: 'assistant' },
    onPressOutcome: 'callback-fired',
    onLongPressOutcome: 'callback-fired',
  },
  {
    name: 'user · status=sending · press 仍触发 (允许点重试 / 取消)',
    props: { role: 'user', status: 'sending' },
    onPressOutcome: 'callback-fired',
    onLongPressOutcome: 'callback-fired',
  },
  {
    name: 'user · status=failed · press 仍触发 (允许点重发)',
    props: { role: 'user', status: 'failed' },
    onPressOutcome: 'callback-fired',
    onLongPressOutcome: 'callback-fired',
  },
]

export const variantList: ChatBubbleVariant[] = ['text', 'image', 'file', 'voice']
export const roleList: ChatBubbleRole[] = ['user', 'assistant', 'system']
export const statusList: ChatBubbleStatus[] = ['sending', 'sent', 'failed']
