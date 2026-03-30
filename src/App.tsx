import { useEffect, createContext, useContext, useMemo } from 'react'
import { Routes, Route, Navigate, useParams, useNavigate } from 'react-router-dom'
import { detectLang, isValidLang, t as translate, I18nContext } from './i18n'
import { useTheme } from './hooks/useTheme'
import { type Lang } from './design'
import Nav from './components/Nav'
import Footer from './components/Footer'
import Home from './pages/Home'
import Gallery from './pages/Gallery'
import Booking from './pages/Booking'
import Updates from './pages/Updates'
import Overlay from './pages/Overlay'
import OverlayDisplay from './pages/OverlayDisplay'

function LangLayout() {
  const { lang } = useParams<{ lang: string }>()
  const navigate = useNavigate()

  useEffect(() => {
    if (!lang || !isValidLang(lang)) {
      navigate(`/${detectLang()}/`, { replace: true })
      return
    }
    localStorage.setItem('lang', lang)
    document.documentElement.lang = lang
  }, [lang, navigate])

  const i18n = useMemo(() => ({
    lang: (lang || 'ru') as Lang,
    t: (key: string) => translate((lang || 'ru') as Lang, key),
  }), [lang])

  if (!lang || !isValidLang(lang)) return null

  return (
    <I18nContext.Provider value={i18n}>
      <Nav />
      <main>
        <Routes>
          <Route index element={<Home />} />
          <Route path="booking" element={<Booking />} />
          <Route path="gallery" element={<Gallery />} />
          <Route path="updates" element={<Updates />} />
        </Routes>
      </main>
      <Footer />
    </I18nContext.Provider>
  )
}

function LangRedirect() {
  return <Navigate to={`/${detectLang()}/`} replace />
}

type ThemeCtx = { theme: 'light' | 'dark'; toggle: () => void }
export const ThemeContext = createContext<ThemeCtx>({ theme: 'light', toggle: () => {} })
export function useThemeContext() { return useContext(ThemeContext) }

export default function App() {
  const { theme, toggle } = useTheme()

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      <Routes>
        <Route path="/overlay" element={<Overlay />} />
        <Route path="/overlay/display" element={<OverlayDisplay />} />
        <Route path="/:lang/*" element={<LangLayout />} />
        <Route path="*" element={<LangRedirect />} />
      </Routes>
    </ThemeContext.Provider>
  )
}
