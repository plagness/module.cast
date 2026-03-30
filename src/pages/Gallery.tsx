import { useI18n } from '../i18n'
import GalleryGrid from '../components/GalleryGrid'
import SEOHead from '../components/SEOHead'
import ScrollReveal from '../components/ScrollReveal'

export default function Gallery() {
  const { t } = useI18n()

  return (
    <section className="max-w-6xl mx-auto px-6 pt-28 pb-16">
      <SEOHead title={t('gallery.title')} description={t('gallery.meta')} />
      <ScrollReveal>
        <h1 className="section-title text-center">{t('gallery.title')}</h1>
        <p className="section-subtitle text-center mx-auto mb-12">{t('gallery.subtitle')}</p>
      </ScrollReveal>
      <GalleryGrid />
    </section>
  )
}
