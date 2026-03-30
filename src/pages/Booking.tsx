import { useI18n } from '../i18n'
import BookingForm from '../components/BookingForm'
import SEOHead from '../components/SEOHead'
import ScrollReveal from '../components/ScrollReveal'

export default function Booking() {
  const { t } = useI18n()

  return (
    <section className="max-w-6xl mx-auto px-6 pt-28 pb-16">
      <SEOHead title={t('home.book')} description={t('booking.meta')} />
      <ScrollReveal>
        <h1 className="section-title text-center">{t('booking.title')}</h1>
        <p className="section-subtitle text-center mx-auto mb-12">{t('booking.subtitle')}</p>
      </ScrollReveal>
      <BookingForm />
    </section>
  )
}
