import { useState, useMemo } from 'react'
import { useI18n } from '../i18n'
import { motion, AnimatePresence } from 'framer-motion'
import { Video, Radio, ArrowRight, Minus, Plus, Send, Check, AlertCircle } from 'lucide-react'
import { services, addons } from '../data/services'
import { sendBooking } from '../utils/telegram'
import SEOHead from '../components/SEOHead'
import ScrollReveal from '../components/ScrollReveal'

const iconMap = { Video, Radio }

export default function Booking() {
  const { t } = useI18n()
  const [selectedService, setSelectedService] = useState<string>('video')
  const [date, setDate] = useState('')
  const [hours, setHours] = useState(2)
  const [selectedAddons, setSelectedAddons] = useState<Set<string>>(new Set())
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [cooldown, setCooldown] = useState(false)

  const service = services.find(s => s.id === selectedService)!
  const category = service.category

  const availableAddons = useMemo(
    () => addons.filter(a => a.categories.includes(category)),
    [category]
  )

  const toggleAddon = (id: string) => {
    setSelectedAddons(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const total = useMemo(() => {
    let sum = service.basePrice * hours
    for (const a of availableAddons) {
      if (!selectedAddons.has(a.id)) continue
      sum += a.unit === 'hour' ? a.price * hours : a.price
    }
    return sum
  }, [service, hours, selectedAddons, availableAddons])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (cooldown) return
    setStatus('sending')

    const form = new FormData(e.currentTarget)
    const addonNames = [...selectedAddons].map(id => t(`addon.${id}`)).join(', ')
    const ok = await sendBooking({
      name: form.get('name') as string,
      phone: form.get('phone') as string,
      telegram: form.get('telegram') as string,
      date,
      services: `${t(`service.${selectedService}`)} (${hours}${t('booking.h')})${addonNames ? ` + ${addonNames}` : ''}`,
      total: total.toLocaleString(),
      message: form.get('message') as string,
    })

    setStatus(ok ? 'success' : 'error')
    if (ok) {
      setCooldown(true)
      setTimeout(() => setCooldown(false), 30000)
    }
  }

  return (
    <section className="max-w-3xl mx-auto px-6 pt-28 pb-16">
      <SEOHead title={t('booking.title')} description={t('booking.meta')} />

      <ScrollReveal>
        <h1 className="section-title text-center">{t('booking.title')}</h1>
        <p className="section-subtitle text-center mx-auto mb-12">{t('booking.subtitle')}</p>
      </ScrollReveal>

      {/* Step 1: Service */}
      <div className="mb-8">
        <h3 className="font-semibold mb-4" style={{ color: 'var(--secondary)' }}>{t('booking.step.service')}</h3>
        <div className="grid grid-cols-2 gap-4">
          {services.map(s => {
            const Icon = iconMap[s.icon as keyof typeof iconMap]
            const active = s.id === selectedService
            return (
              <button
                key={s.id}
                onClick={() => { setSelectedService(s.id); setSelectedAddons(new Set()) }}
                className={`glass-card p-6 text-center cursor-pointer transition-all ${active ? 'ring-2' : ''}`}
                style={active ? { borderColor: 'var(--accent)', boxShadow: '0 0 0 2px var(--accent)' } : {}}
              >
                <Icon size={32} className="mx-auto mb-3" style={{ color: active ? 'var(--accent)' : 'var(--secondary)' }} />
                <div className="font-semibold mb-1">{t(`service.${s.id}`)}</div>
                <div className="text-sm" style={{ color: 'var(--muted)' }}>
                  {s.basePrice.toLocaleString()} &#8381;/{t('booking.per.hour')}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Step 2: Date */}
      <div className="mb-8">
        <h3 className="font-semibold mb-4" style={{ color: 'var(--secondary)' }}>{t('booking.step.date')}</h3>
        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          min={new Date().toISOString().split('T')[0]}
          className="w-full glass-card px-4 py-3 text-sm cursor-pointer"
          style={{ color: 'var(--text)', background: 'var(--surface)' }}
        />
      </div>

      {/* Step 3: Duration */}
      <div className="mb-8">
        <h3 className="font-semibold mb-4" style={{ color: 'var(--secondary)' }}>{t('booking.step.duration')}</h3>
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="font-medium">{t('booking.step.duration')}</span>
            <span className="font-bold text-lg">{hours} {t('booking.h')}</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setHours(h => Math.max(1, h - 1))} className="p-2 rounded-lg border cursor-pointer hover:bg-[var(--surface-hover)] transition-colors" style={{ borderColor: 'var(--border)' }}>
              <Minus size={18} />
            </button>
            <input type="range" min={1} max={12} value={hours} onChange={e => setHours(Number(e.target.value))} className="flex-1 accent-[var(--accent)]" />
            <button onClick={() => setHours(h => Math.min(12, h + 1))} className="p-2 rounded-lg border cursor-pointer hover:bg-[var(--surface-hover)] transition-colors" style={{ borderColor: 'var(--border)' }}>
              <Plus size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Step 4: Addons */}
      <div className="mb-8">
        <h3 className="font-semibold mb-4" style={{ color: 'var(--secondary)' }}>{t('booking.step.addons')}</h3>
        <div className="glass-card p-6">
          <AnimatePresence mode="popLayout">
            {availableAddons.map(a => (
              <motion.label key={a.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex items-center justify-between py-3 border-b last:border-b-0 cursor-pointer" style={{ borderColor: 'var(--border)' }}>
                <div className="flex items-center gap-3">
                  <input type="checkbox" checked={selectedAddons.has(a.id)} onChange={() => toggleAddon(a.id)} className="w-5 h-5 accent-[var(--accent)] cursor-pointer" />
                  <span className="text-sm">{t(`addon.${a.id}`)}</span>
                </div>
                <span className="text-sm font-medium" style={{ color: 'var(--secondary)' }}>
                  +{a.price.toLocaleString()} &#8381;{a.unit === 'hour' ? `/${t('booking.per.hour')}` : ''}
                </span>
              </motion.label>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Step 5: Total */}
      <div className="glass-card p-6 mb-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="text-sm" style={{ color: 'var(--secondary)' }}>{t('booking.step.total')}</div>
          <motion.div key={total} initial={{ scale: 0.95, opacity: 0.5 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 25 }} className="text-3xl font-extrabold">
            {total.toLocaleString()} &#8381;
          </motion.div>
        </div>
      </div>

      {/* Step 6: Form */}
      <AnimatePresence mode="wait">
        {status === 'success' ? (
          <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass-card p-8 text-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'var(--accent-light)' }}>
              <Check size={32} style={{ color: 'var(--accent)' }} />
            </div>
            <h3 className="text-xl font-bold mb-2">{t('booking.success')}</h3>
            <p style={{ color: 'var(--secondary)' }}>{t('booking.success.sub')}</p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="glass-card p-6 md:p-8 space-y-5">
            <Field label={t('booking.name')} name="name" required placeholder={t('booking.name.ph')} />
            <Field label={t('booking.phone')} name="phone" type="tel" required placeholder="+7 (___) ___-__-__" />
            <Field label={t('booking.telegram')} name="telegram" placeholder="@username" />
            <div className="space-y-1.5">
              <label className="text-sm font-medium block">{t('booking.comment')}</label>
              <textarea name="message" rows={3} className="w-full px-4 py-2.5 rounded-xl border text-sm" style={{ borderColor: 'var(--border)', background: 'var(--bg)', color: 'var(--text)' }} placeholder={t('booking.comment.ph')} />
            </div>

            {status === 'error' && (
              <div className="flex items-center gap-2 text-sm" style={{ color: '#EF4444' }}>
                <AlertCircle size={16} /> {t('booking.error')}
              </div>
            )}

            <button type="submit" disabled={status === 'sending' || cooldown} className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50">
              <Send size={18} />
              {status === 'sending' ? t('booking.sending') : t('booking.submit')}
              {status === 'idle' && <ArrowRight size={18} />}
            </button>
          </form>
        )}
      </AnimatePresence>
    </section>
  )
}

function Field({ label, name, type = 'text', required, placeholder }: {
  label: string; name: string; type?: string; required?: boolean; placeholder?: string
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium block">{label}</label>
      <input name={name} type={type} required={required} placeholder={placeholder} className="w-full px-4 py-2.5 rounded-xl border text-sm" style={{ borderColor: 'var(--border)', background: 'var(--bg)', color: 'var(--text)' }} />
    </div>
  )
}
