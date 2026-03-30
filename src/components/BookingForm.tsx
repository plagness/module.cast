import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useI18n } from '../i18n'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Check, AlertCircle } from 'lucide-react'
import { sendBooking } from '../utils/telegram'
import { services, addons } from '../data/services'

export default function BookingForm() {
  const { t } = useI18n()
  const [params] = useSearchParams()
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [cooldown, setCooldown] = useState(false)

  const preService = services.find(s => s.id === params.get('service'))
  const preAddons = (params.get('addons') || '').split(',').filter(Boolean)
  const preTotal = params.get('total') || ''
  const preHours = params.get('hours') || ''

  const serviceLabel = preService
    ? `${t(`service.${preService.id}`)} (${preHours}${t('price.h')})` + (preAddons.length ? ` + ${preAddons.map(id => { const a = addons.find(a => a.id === id); return a ? t(`addon.${a.id}`) : '' }).filter(Boolean).join(', ')}` : '')
    : ''

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (cooldown) return
    setStatus('sending')

    const form = new FormData(e.currentTarget)
    const ok = await sendBooking({
      name: form.get('name') as string,
      phone: form.get('phone') as string,
      telegram: form.get('telegram') as string,
      date: form.get('date') as string,
      services: form.get('services') as string,
      total: preTotal,
      message: form.get('message') as string,
    })

    setStatus(ok ? 'success' : 'error')
    if (ok) {
      setCooldown(true)
      setTimeout(() => setCooldown(false), 30000)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="glass-card p-6 md:p-8 max-w-xl mx-auto space-y-5">
      <AnimatePresence mode="wait">
        {status === 'success' ? (
          <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'var(--accent-light)' }}>
              <Check size={32} style={{ color: 'var(--accent)' }} />
            </div>
            <h3 className="text-xl font-bold mb-2">{t('booking.success')}</h3>
            <p style={{ color: 'var(--secondary)' }}>{t('booking.success.sub')}</p>
          </motion.div>
        ) : (
          <motion.div key="form" initial={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Field label={t('booking.name')} name="name" required placeholder={t('booking.name.ph')} />
            <Field label={t('booking.phone')} name="phone" type="tel" required placeholder="+7 (___) ___-__-__" />
            <Field label={t('booking.telegram')} name="telegram" placeholder="@username" />
            <Field label={t('booking.date')} name="date" type="date" />
            <Field label={t('booking.services')} name="services" defaultValue={serviceLabel} placeholder={t('booking.services.ph')} />
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
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  )
}

function Field({ label, name, type = 'text', required, placeholder, defaultValue }: {
  label: string; name: string; type?: string; required?: boolean; placeholder?: string; defaultValue?: string
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium block">{label}</label>
      <input name={name} type={type} required={required} placeholder={placeholder} defaultValue={defaultValue} className="w-full px-4 py-2.5 rounded-xl border text-sm" style={{ borderColor: 'var(--border)', background: 'var(--bg)', color: 'var(--text)' }} />
    </div>
  )
}
