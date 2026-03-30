import { Sun, Moon } from 'lucide-react'
import { useThemeContext } from '../App'

export default function ThemeToggle() {
  const { theme, toggle } = useThemeContext()
  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className="p-2 rounded-full hover:bg-[var(--surface-hover)] transition-colors cursor-pointer"
    >
      {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
    </button>
  )
}
