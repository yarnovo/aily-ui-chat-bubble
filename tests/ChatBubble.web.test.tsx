/**
 * Web 端组件测试 · vitest + @testing-library/react
 *
 * 12+ 件事:
 * - 3 role 渲染对齐 (user / assistant / system)
 * - 4 variant (text / image / file / voice)
 * - onPress / onLongPress 触发
 * - 3 status (sending / sent / failed) 显示
 * - time 显示 / 不传不显示
 * - 长内容 line break
 * - assistant avatar 显示 / 不显示
 * - system name 显示
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { ChatBubble } from '../src/ChatBubble'
import { bubbleScenarios } from '../src/ChatBubble.behavior'

describe('ChatBubble · role 渲染对齐', () => {
  it('role=user 右对齐 · 无头像', () => {
    const { container } = render(<ChatBubble role="user" content="你好" />)
    const row = container.querySelector('.ak-chat-bubble-row')
    expect(row).toHaveClass('ak-chat-bubble-row--user')
    expect(container.querySelector('.ak-chat-bubble__avatar-slot')).toBeNull()
    expect(container.querySelector('.ak-chat-bubble--user')).toBeTruthy()
  })

  it('role=assistant 左对齐 · 显示头像 placeholder', () => {
    const { container } = render(<ChatBubble role="assistant" content="收到" />)
    const row = container.querySelector('.ak-chat-bubble-row')
    expect(row).toHaveClass('ak-chat-bubble-row--assistant')
    expect(container.querySelector('.ak-chat-bubble__avatar-slot')).toBeTruthy()
    expect(container.querySelector('.ak-chat-bubble__avatar--placeholder')).toBeTruthy()
  })

  it('role=assistant 带 avatar URL · 显示真头像', () => {
    const { container } = render(
      <ChatBubble role="assistant" content="收到" avatar="https://example.com/a.png" />,
    )
    const img = container.querySelector('.ak-chat-bubble__avatar') as HTMLImageElement | null
    expect(img).toBeTruthy()
    expect(img!.tagName).toBe('IMG')
    expect(img!.src).toBe('https://example.com/a.png')
  })

  it('role=system 居中 · 无气泡 · 无头像', () => {
    const { container } = render(<ChatBubble role="system" content="对方撤回了一条消息" />)
    expect(container.querySelector('.ak-chat-bubble-row--system')).toBeTruthy()
    expect(container.querySelector('.ak-chat-bubble--system')).toBeTruthy()
    // 不应渲染 user / assistant 气泡
    expect(container.querySelector('.ak-chat-bubble--user')).toBeNull()
    expect(container.querySelector('.ak-chat-bubble--assistant')).toBeNull()
    expect(container.querySelector('.ak-chat-bubble__avatar-slot')).toBeNull()
  })

  it('role=system 带 name · 显示发起人', () => {
    render(<ChatBubble role="system" name="管理员" content="撤回了一条消息" />)
    expect(screen.getByText(/管理员/)).toBeInTheDocument()
    expect(screen.getByText(/撤回了一条消息/)).toBeInTheDocument()
  })
})

describe('ChatBubble · variant', () => {
  it('variant=text · 渲染 content · 长文 whitespace-pre-line', () => {
    const long = '第一行\n第二行\n第三行 abcdefghijklmn'
    const { container } = render(<ChatBubble role="user" variant="text" content={long} />)
    const text = container.querySelector('.ak-chat-bubble__text')
    expect(text).toBeTruthy()
    expect(text!.textContent).toBe(long)
    // 必须有 pre-line 才能换行
    const cs = window.getComputedStyle(text as Element)
    expect(['pre-line', 'pre-wrap']).toContain(cs.whiteSpace)
  })

  it('variant=image · 渲染 <img> · src 正确', () => {
    const { container } = render(
      <ChatBubble role="user" variant="image" imageUrl="https://example.com/x.png" />,
    )
    const img = container.querySelector('.ak-chat-bubble__image') as HTMLImageElement | null
    expect(img).toBeTruthy()
    expect(img!.src).toBe('https://example.com/x.png')
  })

  it('variant=file · 渲染 fileName + fileSize', () => {
    render(
      <ChatBubble role="user" variant="file" fileName="report.pdf" fileSize="2.3 MB" />,
    )
    expect(screen.getByText('report.pdf')).toBeInTheDocument()
    expect(screen.getByText('2.3 MB')).toBeInTheDocument()
  })

  it('variant=voice · 渲染时长 (秒 < 60 · N")', () => {
    const { container } = render(
      <ChatBubble role="user" variant="voice" voiceDurationSec={12} />,
    )
    expect(container.querySelector('.ak-chat-bubble__voice')).toBeTruthy()
    expect(container.textContent).toContain('12"')
  })

  it('variant=voice · 时长 ≥ 60 · 渲染 M\'SS"', () => {
    const { container } = render(
      <ChatBubble role="user" variant="voice" voiceDurationSec={75} />,
    )
    expect(container.textContent).toContain(`1'15"`)
  })
})

describe('ChatBubble · 交互', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  it('onPress · click 触发', () => {
    const onPress = vi.fn()
    render(<ChatBubble role="user" content="hi" onPress={onPress} />)
    fireEvent.click(screen.getByTestId('ak-chat-bubble'))
    expect(onPress).toHaveBeenCalledOnce()
  })

  it('onLongPress · pointerDown 持续 500ms 触发', () => {
    const onLongPress = vi.fn()
    render(<ChatBubble role="user" content="hi" onLongPress={onLongPress} />)
    const bubble = screen.getByTestId('ak-chat-bubble')
    fireEvent.pointerDown(bubble)
    expect(onLongPress).not.toHaveBeenCalled()
    act(() => {
      vi.advanceTimersByTime(500)
    })
    expect(onLongPress).toHaveBeenCalledOnce()
  })

  it('onLongPress · pointerUp 早于 500ms · 不触发', () => {
    const onLongPress = vi.fn()
    const onPress = vi.fn()
    render(<ChatBubble role="user" content="hi" onLongPress={onLongPress} onPress={onPress} />)
    const bubble = screen.getByTestId('ak-chat-bubble')
    fireEvent.pointerDown(bubble)
    act(() => {
      vi.advanceTimersByTime(200)
    })
    fireEvent.pointerUp(bubble)
    fireEvent.click(bubble)
    expect(onLongPress).not.toHaveBeenCalled()
    expect(onPress).toHaveBeenCalledOnce()
  })

  it('long-press 触发后 click 不再 fire onPress', () => {
    const onLongPress = vi.fn()
    const onPress = vi.fn()
    render(<ChatBubble role="user" content="hi" onLongPress={onLongPress} onPress={onPress} />)
    const bubble = screen.getByTestId('ak-chat-bubble')
    fireEvent.pointerDown(bubble)
    act(() => {
      vi.advanceTimersByTime(500)
    })
    fireEvent.click(bubble)
    expect(onLongPress).toHaveBeenCalledOnce()
    expect(onPress).not.toHaveBeenCalled()
  })
})

describe('ChatBubble · 行为契约 (共享 spec)', () => {
  it.each(bubbleScenarios)('$name', (sc) => {
    const onPress = vi.fn()
    const onLongPress = vi.fn()
    render(
      <ChatBubble
        role={sc.props.role!}
        content="x"
        status={sc.props.status}
        onPress={onPress}
        onLongPress={onLongPress}
      />,
    )
    fireEvent.click(screen.getByTestId('ak-chat-bubble'))
    if (sc.onPressOutcome === 'callback-fired') {
      expect(onPress).toHaveBeenCalledOnce()
    } else {
      expect(onPress).not.toHaveBeenCalled()
    }
  })
})

describe('ChatBubble · status 显示', () => {
  it('user · status=sending · 显示 spinner', () => {
    const { container } = render(<ChatBubble role="user" content="x" status="sending" />)
    expect(container.querySelector('.ak-chat-bubble__status--sending')).toBeTruthy()
    expect(container.querySelector('.ak-chat-bubble__spinner')).toBeTruthy()
  })

  it('user · status=failed · 显示红色 ! icon', () => {
    const { container } = render(<ChatBubble role="user" content="x" status="failed" />)
    expect(container.querySelector('.ak-chat-bubble__status--failed')).toBeTruthy()
    expect(container.querySelector('[aria-label="发送失败"]')).toBeTruthy()
  })

  it('user · status=sent · 不显示 spinner / failed icon', () => {
    const { container } = render(<ChatBubble role="user" content="x" status="sent" />)
    expect(container.querySelector('.ak-chat-bubble__status--sending')).toBeNull()
    expect(container.querySelector('.ak-chat-bubble__status--failed')).toBeNull()
  })

  it('assistant · status 即使传也不显示 (status 仅 user)', () => {
    const { container } = render(<ChatBubble role="assistant" content="x" status="failed" />)
    expect(container.querySelector('.ak-chat-bubble__status')).toBeNull()
  })
})

describe('ChatBubble · time', () => {
  it('time 传值 · 渲染', () => {
    render(<ChatBubble role="user" content="x" time="12:34" />)
    expect(screen.getByText('12:34')).toBeInTheDocument()
  })

  it('time 不传 · 不渲染', () => {
    const { container } = render(<ChatBubble role="user" content="x" />)
    expect(container.querySelector('.ak-chat-bubble__time')).toBeNull()
  })

  it('system + time · 显示在气泡下方', () => {
    render(<ChatBubble role="system" content="对方撤回了一条消息" time="昨天 12:34" />)
    expect(screen.getByText('昨天 12:34')).toBeInTheDocument()
  })
})
