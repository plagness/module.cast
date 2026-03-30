import { useParams, Link } from 'react-router-dom'
import { useI18n } from '../i18n'
import { SUPPORTED_LANGS, LANG_NAMES } from '../design'

export default function Footer() {
  const { lang } = useParams<{ lang: string }>()
  const { t } = useI18n()

  return (
    <footer className="border-t mt-20" style={{ borderColor: 'var(--border)' }}>
      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="font-bold text-lg mb-3" style={{ color: 'var(--accent)' }}>module.cast</h3>
          <p className="text-sm" style={{ color: 'var(--secondary)' }}>{t('site.desc')}</p>
        </div>

        <div>
          <h4 className="font-semibold mb-3">{t('nav.navigation')}</h4>
          <div className="flex flex-col gap-2 text-sm">
            <Link to={`/${lang}/`} className="no-underline hover:underline" style={{ color: 'var(--secondary)' }}>{t('nav.home')}</Link>
            <Link to={`/${lang}/price`} className="no-underline hover:underline" style={{ color: 'var(--secondary)' }}>{t('nav.price')}</Link>
            <Link to={`/${lang}/gallery`} className="no-underline hover:underline" style={{ color: 'var(--secondary)' }}>{t('nav.gallery')}</Link>
            <Link to={`/${lang}/booking`} className="no-underline hover:underline" style={{ color: 'var(--secondary)' }}>{t('nav.contact')}</Link>
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-3">{t('nav.languages')}</h4>
          <div className="flex flex-wrap gap-2 text-sm">
            {SUPPORTED_LANGS.map(l => (
              <Link
                key={l}
                to={`/${l}/`}
                className={`no-underline hover:underline ${l === lang ? 'font-semibold' : ''}`}
                style={{ color: l === lang ? 'var(--accent)' : 'var(--secondary)' }}
              >
                {LANG_NAMES[l]}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="text-center text-xs py-4 border-t" style={{ color: 'var(--muted)', borderColor: 'var(--border)' }}>
        &copy; {new Date().getFullYear()} module.cast
      </div>
    </footer>
  )
}
