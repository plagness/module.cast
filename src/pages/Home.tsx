import { Link, useParams } from 'react-router-dom'
import { useI18n } from '../i18n'
import { Mic, Radio, Video, Camera, ArrowRight, Headphones, Zap, MapPin } from 'lucide-react'
import { motion } from 'framer-motion'
import ScrollReveal from '../components/ScrollReveal'
import SEOHead, { LocalBusinessSchema } from '../components/SEOHead'

const serviceCards = [
  { icon: Mic, key: 'podcast', price: '5 000' },
  { icon: Radio, key: 'stream', price: '8 000' },
  { icon: Video, key: 'video', price: '7 000' },
  { icon: Camera, key: 'photo', price: '4 000' },
]

const features = [
  { icon: Headphones, key: 'sound' },
  { icon: Zap, key: 'equipment' },
  { icon: MapPin, key: 'location' },
]

export default function Home() {
  const { lang } = useParams<{ lang: string }>()
  const { t } = useI18n()

  return (
    <>
      <SEOHead title={t('home.title')} description={t('site.desc.meta')} />
      <LocalBusinessSchema />

      {/* Hero */}
      <section className="min-h-screen flex items-center justify-center px-6 pt-24 pb-12">
        <div className="text-center max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight mb-6">
              <span style={{ color: 'var(--accent)' }}>module</span>.cast
            </h1>
            <p className="text-xl md:text-2xl mb-8" style={{ color: 'var(--secondary)' }}>{t('home.title')}</p>
            <p className="text-lg mb-10 max-w-xl mx-auto" style={{ color: 'var(--muted)' }}>{t('home.subtitle')}</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="flex flex-wrap gap-4 justify-center">
            <Link to={`/${lang}/booking`} className="btn-primary no-underline inline-flex items-center gap-2">
              {t('home.book')} <ArrowRight size={18} />
            </Link>
            <Link to={`/${lang}/price`} className="no-underline px-7 py-3 rounded-xl font-semibold border transition-colors hover:bg-[var(--surface-hover)]" style={{ borderColor: 'var(--border)', color: 'var(--text)' }}>
              {t('home.calc')}
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Services */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <ScrollReveal>
          <h2 className="section-title text-center">{t('home.services')}</h2>
          <p className="section-subtitle text-center mx-auto mb-12">{t('home.services.sub')}</p>
        </ScrollReveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {serviceCards.map((s, i) => (
            <ScrollReveal key={s.key} delay={i * 0.1}>
              <div className="glass-card p-6 h-full flex flex-col">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: 'var(--accent-light)' }}>
                  <s.icon size={24} style={{ color: 'var(--accent)' }} />
                </div>
                <h3 className="font-semibold text-lg mb-2">{t(`service.${s.key}`)}</h3>
                <p className="text-sm mb-4 flex-1" style={{ color: 'var(--secondary)' }}>{t(`service.${s.key}.desc`)}</p>
                <p className="font-bold text-lg">
                  {t('home.from')} {s.price} &#8381;
                  <span className="text-sm font-normal" style={{ color: 'var(--muted)' }}> / {t('home.hour')}</span>
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <ScrollReveal><h2 className="section-title text-center">{t('home.why')}</h2></ScrollReveal>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
          {features.map((f, i) => (
            <ScrollReveal key={f.key} delay={i * 0.1}>
              <div className="text-center">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: 'var(--accent-light)' }}>
                  <f.icon size={28} style={{ color: 'var(--accent)' }} />
                </div>
                <h3 className="font-semibold mb-2">{t(`feature.${f.key}`)}</h3>
                <p className="text-sm" style={{ color: 'var(--secondary)' }}>{t(`feature.${f.key}.desc`)}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-6 py-20 text-center">
        <ScrollReveal>
          <h2 className="section-title">{t('home.ready')}</h2>
          <p className="section-subtitle mx-auto mb-8">{t('home.ready.sub')}</p>
          <Link to={`/${lang}/booking`} className="btn-primary no-underline inline-flex items-center gap-2 text-lg">
            {t('home.book.studio')} <ArrowRight size={20} />
          </Link>
        </ScrollReveal>
      </section>
    </>
  )
}
