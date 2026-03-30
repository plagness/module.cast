import { useI18n } from '../i18n'
import PriceConstructor from '../components/PriceConstructor'
import SEOHead from '../components/SEOHead'
import ScrollReveal from '../components/ScrollReveal'

export default function Price() {
  const { t } = useI18n()

  return (
    <section className="max-w-6xl mx-auto px-6 pt-28 pb-16">
      <SEOHead title={t('nav.price')} description={t('price.meta')} />
      <ScrollReveal>
        <h1 className="section-title text-center">{t('price.title')}</h1>
        <p className="section-subtitle text-center mx-auto mb-12">{t('price.subtitle')}</p>
      </ScrollReveal>
      <PriceConstructor />
    </section>
  )
}
