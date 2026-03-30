import { useState } from 'react'
import { Link, useParams, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { useI18n } from '../i18n'
import ThemeToggle from './ThemeToggle'
import LangSwitcher from './LangSwitcher'

const navItems = [
  { path: '', key: 'nav.home' },
  { path: 'booking', key: 'nav.booking' },
  { path: 'gallery', key: 'nav.gallery' },
]

export default function Nav() {
  const { lang } = useParams<{ lang: string }>()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const { t } = useI18n()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-4">
      <nav className="glass-nav px-6 py-3 flex items-center gap-6 max-w-3xl w-full">
        <Link to={`/${lang}/`} className="font-bold text-lg tracking-tight no-underline" style={{ color: 'var(--accent)' }}>
          {t('brand')}
        </Link>

        <div className="hidden md:flex items-center gap-1 flex-1">
          {navItems.map(item => {
            const href = `/${lang}/${item.path}`
            const isActive = item.path === ''
              ? location.pathname === `/${lang}/` || location.pathname === `/${lang}`
              : location.pathname.startsWith(href)
            return (
              <Link
                key={item.path}
                to={href}
                className={`px-3 py-1.5 rounded-full text-sm transition-colors no-underline ${
                  isActive ? 'bg-[var(--accent)] text-white font-medium' : 'hover:bg-[var(--surface-hover)]'
                }`}
                style={isActive ? {} : { color: 'var(--text)' }}
              >
                {t(item.key)}
              </Link>
            )
          })}
        </div>

        <div className="flex items-center gap-1 ml-auto">
          <LangSwitcher />
          <ThemeToggle />
          <button
            className="md:hidden p-2 rounded-full hover:bg-[var(--surface-hover)] transition-colors cursor-pointer"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="md:hidden fixed inset-x-0 top-16 glass mx-4 p-4 flex flex-col gap-2 z-50">
          {navItems.map(item => (
            <Link
              key={item.path}
              to={`/${lang}/${item.path}`}
              onClick={() => setMenuOpen(false)}
              className="px-4 py-3 rounded-xl text-sm no-underline hover:bg-[var(--surface-hover)] transition-colors"
              style={{ color: 'var(--text)' }}
            >
              {t(item.key)}
            </Link>
          ))}
        </div>
      )}
    </header>
  )
}
