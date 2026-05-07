/**
 * akong ChatBubble · React Native 实现
 *
 * Metro bundler 默认按 `.native.tsx` 后缀解析 RN 端 · `.tsx` 解析 Web 端
 * 用方 `import { ChatBubble } from '@akong/chat-bubble'` 自动取对应平台
 */

import {
  Pressable,
  Text,
  View,
  Image,
  ActivityIndicator,
  useColorScheme,
} from 'react-native'
import { tokens } from '@akong/tokens'
import type { ChatBubbleProps } from './ChatBubble.types'

function formatVoiceDuration(sec: number): string {
  if (sec < 60) return `${Math.round(sec)}"`
  const m = Math.floor(sec / 60)
  const s = Math.round(sec % 60)
  return `${m}'${String(s).padStart(2, '0')}"`
}

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

  const scheme = (useColorScheme() ?? 'light') as 'light' | 'dark'
  const t = scheme === 'dark' ? tokens.dark : tokens.light

  // === system · 居中灰小字 · 无气泡 ===
  if (role === 'system') {
    return (
      <View
        style={{
          width: '100%',
          alignItems: 'center',
          marginVertical: tokens.space[2],
        }}
        accessibilityRole="text"
      >
        <Text style={{ color: t.fgSubtle, fontSize: tokens.text.xs, textAlign: 'center' }}>
          {name ? <Text style={{ color: t.fgMuted, fontWeight: tokens.weight.medium as '500' }}>{name} </Text> : null}
          {content}
        </Text>
        {time ? (
          <Text style={{ color: t.fgSubtle, fontSize: tokens.text.xs, marginTop: tokens.space[1] }}>
            {time}
          </Text>
        ) : null}
      </View>
    )
  }

  const isUser = role === 'user'
  const bubbleBg = isUser ? t.fg : t.bgSubtle
  const bubbleFg = isUser ? t.fgInverse : t.fg

  // === 内容渲染 ===
  const renderInner = () => {
    switch (variant) {
      case 'image':
        return imageUrl ? (
          <Image
            source={{ uri: imageUrl }}
            style={{
              width: 240,
              height: 240,
              maxWidth: 240,
              maxHeight: 320,
              borderRadius: tokens.radius['2xl'],
            }}
            resizeMode="cover"
            accessibilityLabel={content || undefined}
          />
        ) : null
      case 'file':
        return (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: tokens.space[2], minWidth: 160 }}>
            <View style={{ width: 28, height: 28, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ color: bubbleFg, fontSize: tokens.text.lg }}>📄</Text>
            </View>
            <View style={{ flexShrink: 1 }}>
              <Text
                style={{
                  color: bubbleFg,
                  fontSize: tokens.text.sm,
                  fontWeight: tokens.weight.medium as '500',
                }}
                numberOfLines={1}
              >
                {fileName}
              </Text>
              {fileSize ? (
                <Text style={{ color: bubbleFg, fontSize: tokens.text.xs, opacity: 0.7 }}>
                  {fileSize}
                </Text>
              ) : null}
            </View>
          </View>
        )
      case 'voice':
        return (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: tokens.space[2], minWidth: 80 }}>
            <Text style={{ color: bubbleFg, fontSize: tokens.text.md }}>🔊</Text>
            <Text style={{ color: bubbleFg, fontSize: tokens.text.sm }}>
              {typeof voiceDurationSec === 'number' ? formatVoiceDuration(voiceDurationSec) : ''}
            </Text>
          </View>
        )
      case 'text':
      default:
        return (
          <Text style={{ color: bubbleFg, fontSize: tokens.text.base, lineHeight: tokens.text.base * 1.35 }}>
            {content}
          </Text>
        )
    }
  }

  // === status icon ===
  const renderStatus = () => {
    if (!isUser || !status) return null
    if (status === 'sending') {
      return <ActivityIndicator size="small" color={t.fgSubtle} accessibilityLabel="发送中" />
    }
    if (status === 'failed') {
      return (
        <View
          style={{
            width: 14,
            height: 14,
            borderRadius: 7,
            backgroundColor: t.accent,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          accessibilityLabel="发送失败"
        >
          <Text style={{ color: '#fff', fontSize: 10, fontWeight: tokens.weight.bold as '700', lineHeight: 12 }}>!</Text>
        </View>
      )
    }
    return null
  }

  // image variant 不画 bubble bg (走图自身圆角)
  const isImageVariant = variant === 'image'

  return (
    <View
      style={{
        flexDirection: 'row',
        width: '100%',
        marginVertical: tokens.space[2],
        justifyContent: isUser ? 'flex-end' : 'flex-start',
        gap: isUser ? 0 : tokens.space[2],
      }}
      accessibilityRole="none"
    >
      {/* assistant avatar slot */}
      {role === 'assistant' ? (
        <View style={{ width: 32, height: 32, alignSelf: 'flex-end', marginBottom: 18 }}>
          {avatar ? (
            <Image
              source={{ uri: avatar }}
              style={{ width: 32, height: 32, borderRadius: 16 }}
              resizeMode="cover"
            />
          ) : (
            <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: t.bgSubtle }} />
          )}
        </View>
      ) : null}

      <View
        style={{
          maxWidth: '80%',
          alignItems: isUser ? 'flex-end' : 'flex-start',
        }}
      >
        <Pressable
          onPress={onPress}
          onLongPress={onLongPress}
          delayLongPress={500}
          accessibilityRole="button"
          style={({ pressed }: { pressed: boolean }) => ({
            paddingHorizontal: isImageVariant ? 0 : tokens.space[3],
            paddingVertical: isImageVariant ? 0 : tokens.space[2],
            backgroundColor: isImageVariant ? 'transparent' : bubbleBg,
            borderRadius: tokens.radius['2xl'],
            borderBottomRightRadius: isUser ? tokens.radius.sm : tokens.radius['2xl'],
            borderBottomLeftRadius: !isUser ? tokens.radius.sm : tokens.radius['2xl'],
            opacity: pressed ? 0.85 : 1,
            overflow: 'hidden',
          })}
        >
          {renderInner()}
        </Pressable>

        <View
          style={{
            flexDirection: isUser ? 'row-reverse' : 'row',
            alignItems: 'center',
            gap: tokens.space[1],
            marginTop: tokens.space[1],
            minHeight: 14,
          }}
        >
          {renderStatus()}
          {time ? (
            <Text style={{ color: t.fgSubtle, fontSize: tokens.text.xs }}>{time}</Text>
          ) : null}
        </View>
      </View>
    </View>
  )
}

export default ChatBubble
