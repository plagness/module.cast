import { useI18n } from '../i18n'
import { updates } from '../data/updates'
import UpdateCard from '../components/UpdateCard'
import SEOHead from '../components/SEOHead'
import ScrollReveal from '../components/ScrollReveal'

export default function Updates() {
  const { t } = useI18n()

  const sorted = [...updates].sort((a, b) => b.date.localeCompare(a.date))

  return (
    <section className="max-w-2xl mx-auto px-6 pt-28 pb-16">
      <SEOHead title={t('updates.title')} description={t('updates.meta')} />

      <ScrollReveal>
        <h1 className="section-title text-center">{t('updates.title')}</h1>
        <p className="section-subtitle text-center mx-auto mb-12">{t('updates.subtitle')}</p>
      </ScrollReveal>

      {sorted.length === 0 ? (
        <div className="text-center py-20" style={{ color: 'var(--muted)' }}>
          <p className="text-lg mb-2">{t('updates.soon')}</p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {sorted.map((entry, i) => (
            <ScrollReveal key={entry.id} delay={Math.min(i * 0.05, 0.3)}>
              <UpdateCard entry={entry} />
            </ScrollReveal>
          ))}
        </div>
      )}
    </section>
  )
}
