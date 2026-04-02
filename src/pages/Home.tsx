import { lazy, Suspense } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useI18n } from '../i18n'
import { Video, Camera, Radio, ArrowRight, Headphones, Zap, MapPin } from 'lucide-react'
import { motion } from 'framer-motion'
import ScrollReveal from '../components/ScrollReveal'
import SEOHead, { LocalBusinessSchema } from '../components/SEOHead'

const StudioMap = lazy(() => import('../components/StudioMap'))

const S3 = 'https://modulecast-hot.s3.twcstorage.ru/team'

const team = [
  { name: 'Данил Седнев', nameEn: 'Danil Sednev', nameZh: '丹尼尔·塞德涅夫', role: 'Основатель', roleEn: 'Founder', roleZh: '创始人', photo: `${S3}/danil.webp`, url: 'https://svoypodcast.ru' },
  { name: 'Валерий Теневой', nameEn: 'Valery Tenevoy', nameZh: '瓦列里·捷涅沃伊', role: 'Основатель', roleEn: 'Founder', roleZh: '创始人', photo: `${S3}/valery.webp`, url: 'https://plag.space' },
]

const serviceCards = [
  { icon: Video, key: 'studio', price: '5 000' },
  { icon: Camera, key: 'studio-own', price: '3 000' },
  { icon: Radio, key: 'stream', price: '7 000' },
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
              <span style={{ color: 'var(--accent)' }}>{t('brand.accent')}</span>{t('brand.rest')}
            </h1>
            <p className="text-xl md:text-2xl mb-8" style={{ color: 'var(--secondary)' }}>{t('home.title')}</p>
            <p className="text-lg mb-10 max-w-xl mx-auto" style={{ color: 'var(--muted)' }}>{t('home.subtitle')}</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="flex flex-wrap gap-4 justify-center">
            <Link to={`/${lang}/booking`} className="btn-primary no-underline inline-flex items-center gap-2">
              {t('home.book')} <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Services */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <ScrollReveal>
          <h2 className="section-title text-center">{t('home.services')}</h2>
          <p className="section-subtitle text-center mx-auto mb-12">{t('home.services.sub')}</p>
        </ScrollReveal>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
          {serviceCards.map((s, i) => (
            <ScrollReveal key={s.key} delay={i * 0.1}>
              <Link to={`/${lang}/booking`} className="no-underline">
                <div className="glass-card p-8 h-full flex flex-col items-center text-center hover:scale-[1.02] transition-transform">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5" style={{ background: 'var(--accent-light)' }}>
                    <s.icon size={32} style={{ color: 'var(--accent)' }} />
                  </div>
                  <h3 className="font-semibold text-xl mb-2" style={{ color: 'var(--text)' }}>{t(`service.${s.key}`)}</h3>
                  <p className="text-sm mb-4" style={{ color: 'var(--secondary)' }}>{t(`service.${s.key}.desc`)}</p>
                  <p className="font-bold text-2xl" style={{ color: 'var(--text)' }}>
                    {t('home.from')} {s.price} &#8381;
                    <span className="text-sm font-normal" style={{ color: 'var(--muted)' }}> / {t('home.hour')}</span>
                  </p>
                </div>
              </Link>
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

      {/* Map */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <ScrollReveal>
          <h2 className="section-title text-center">{t('home.location')}</h2>
          <p className="section-subtitle text-center mx-auto mb-10">{t('home.location.sub')}</p>
        </ScrollReveal>
        <Suspense fallback={<div className="h-[420px] rounded-2xl" style={{ background: 'var(--card)' }} />}>
          <StudioMap />
        </Suspense>
      </section>

      {/* Team */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <ScrollReveal>
          <h2 className="section-title text-center">{t('home.team')}</h2>
          <p className="section-subtitle text-center mx-auto mb-12">{t('home.team.sub')}</p>
        </ScrollReveal>
        <div className="flex flex-wrap justify-center gap-10">
          {team.map((m, i) => (
            <ScrollReveal key={m.nameEn} delay={i * 0.1}>
              <a href={m.url} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center text-center w-44 no-underline group">
                <div className="w-32 h-32 rounded-2xl overflow-hidden mb-4 shadow-lg group-hover:scale-105 transition-transform">
                  <img src={m.photo} alt={lang === 'ru' ? m.name : m.nameEn} className="w-full h-full object-cover" loading="lazy" />
                </div>
                <h3 className="font-semibold text-base" style={{ color: 'var(--text)' }}>{lang === 'zh' ? m.nameZh : lang === 'en' ? m.nameEn : m.name}</h3>
                <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>{lang === 'zh' ? m.roleZh : lang === 'en' ? m.roleEn : m.role}</p>
              </a>
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
