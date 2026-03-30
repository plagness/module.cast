import { useState, useRef, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { Globe } from 'lucide-react'
import { SUPPORTED_LANGS, LANG_NAMES, type Lang } from '../design'

export default function LangSwitcher() {
  const { lang } = useParams<{ lang: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const switchLang = (newLang: Lang) => {
    const pathWithoutLang = location.pathname.replace(`/${lang}`, '')
    navigate(`/${newLang}${pathWithoutLang || '/'}`)
    setOpen(false)
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2 py-1.5 rounded-full hover:bg-[var(--surface-hover)] transition-colors cursor-pointer text-sm"
      >
        <Globe size={16} />
        <span className="hidden sm:inline">{LANG_NAMES[(lang as Lang) || 'ru']}</span>
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 glass-card py-2 min-w-[160px] z-50">
          {SUPPORTED_LANGS.map(l => (
            <button
              key={l}
              onClick={() => switchLang(l)}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-[var(--surface-hover)] transition-colors cursor-pointer ${
                l === lang ? 'font-semibold text-[var(--accent)]' : ''
              }`}
            >
              {LANG_NAMES[l]}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
