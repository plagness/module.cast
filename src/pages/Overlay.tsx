import { useState } from 'react'
import { Send, EyeOff, Monitor, Type, MessageSquare, LetterText } from 'lucide-react'

type OverlayStyle = 'lowerthird' | 'fullscreen' | 'ticker'

const styles: { id: OverlayStyle; label: string; icon: typeof Type }[] = [
  { id: 'lowerthird', label: 'Нижняя треть', icon: LetterText },
  { id: 'fullscreen', label: 'Вопрос', icon: MessageSquare },
  { id: 'ticker', label: 'Бегущая строка', icon: Type },
]

const channel = typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel('modulecast-overlay') : null

export default function Overlay() {
  const [text, setText] = useState('')
  const [style, setStyle] = useState<OverlayStyle>('lowerthird')
  const [fontSize, setFontSize] = useState(32)
  const [isShowing, setIsShowing] = useState(false)

  const show = () => {
    if (!text.trim()) return
    channel?.postMessage({ type: 'show', text: text.trim(), style, fontSize })
    setIsShowing(true)
  }

  const hide = () => {
    channel?.postMessage({ type: 'hide' })
    setIsShowing(false)
  }

  return (
    <div className="min-h-screen p-6" style={{ background: 'var(--bg)', color: 'var(--text)' }}>
      <div className="max-w-xl mx-auto">
        <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--accent)' }}>module.cast overlay</h1>
        <p className="text-sm mb-8" style={{ color: 'var(--secondary)' }}>
          Панель управления плашками для прямого эфира.
          OBS Browser Source: <code className="px-1.5 py-0.5 rounded text-xs" style={{ background: 'var(--card)' }}>/overlay/display</code>
        </p>

        {/* Style select */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {styles.map(s => (
            <button
              key={s.id}
              onClick={() => setStyle(s.id)}
              className={`glass-card p-4 text-center cursor-pointer transition-all ${s.id === style ? 'ring-2' : ''}`}
              style={s.id === style ? { borderColor: 'var(--accent)', boxShadow: '0 0 0 2px var(--accent)' } : {}}
            >
              <s.icon size={24} className="mx-auto mb-2" style={{ color: s.id === style ? 'var(--accent)' : 'var(--secondary)' }} />
              <div className="text-xs font-medium">{s.label}</div>
            </button>
          ))}
        </div>

        {/* Text input */}
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Текст плашки..."
          rows={3}
          className="w-full px-4 py-3 rounded-xl border text-sm mb-4"
          style={{ borderColor: 'var(--border)', background: 'var(--surface)', color: 'var(--text)' }}
        />

        {/* Font size */}
        <div className="flex items-center gap-3 mb-6">
          <span className="text-sm" style={{ color: 'var(--secondary)' }}>Размер шрифта:</span>
          <input type="range" min={16} max={64} value={fontSize} onChange={e => setFontSize(Number(e.target.value))} className="flex-1" />
          <span className="text-sm font-mono w-10 text-right">{fontSize}px</span>
        </div>

        {/* Controls */}
        <div className="flex gap-3">
          <button onClick={show} className="btn-primary flex-1 flex items-center justify-center gap-2">
            <Send size={18} /> Показать
          </button>
          <button
            onClick={hide}
            className="flex-1 px-4 py-3 rounded-xl border font-semibold flex items-center justify-center gap-2 cursor-pointer hover:bg-[var(--surface-hover)] transition-colors"
            style={{ borderColor: 'var(--border)' }}
          >
            <EyeOff size={18} /> Скрыть
          </button>
        </div>

        {/* Preview */}
        <div className="mt-8">
          <div className="flex items-center gap-2 mb-3">
            <Monitor size={16} style={{ color: 'var(--secondary)' }} />
            <span className="text-sm font-medium" style={{ color: 'var(--secondary)' }}>Превью</span>
          </div>
          <div className="aspect-video rounded-xl border relative overflow-hidden" style={{ borderColor: 'var(--border)', background: '#000' }}>
            {isShowing && text.trim() && (
              <OverlayPreview text={text} style={style} fontSize={fontSize} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function OverlayPreview({ text, style, fontSize }: { text: string; style: OverlayStyle; fontSize: number }) {
  const scale = 0.4

  if (style === 'fullscreen') {
    return (
      <div className="absolute inset-0 flex items-center justify-center p-8">
        <div className="bg-black/70 backdrop-blur-sm rounded-2xl px-8 py-6 text-white text-center" style={{ fontSize: fontSize * scale }}>
          {text}
        </div>
      </div>
    )
  }

  if (style === 'ticker') {
    return (
      <div className="absolute bottom-0 left-0 right-0 bg-[var(--accent)] text-white py-2 overflow-hidden">
        <div className="whitespace-nowrap animate-[scroll_10s_linear_infinite]" style={{ fontSize: fontSize * scale * 0.8 }}>
          {text} &nbsp;&nbsp;&nbsp; {text} &nbsp;&nbsp;&nbsp; {text}
        </div>
      </div>
    )
  }

  // lowerthird
  return (
    <div className="absolute bottom-4 left-4 right-4">
      <div className="bg-black/80 backdrop-blur-sm rounded-xl px-6 py-3 text-white" style={{ fontSize: fontSize * scale }}>
        {text}
      </div>
    </div>
  )
}
