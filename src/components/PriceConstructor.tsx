import { useState, useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useI18n } from '../i18n'
import { motion, AnimatePresence } from 'framer-motion'
import { Mic, Radio, Video, Camera, ArrowRight, Minus, Plus } from 'lucide-react'
import { services, addons } from '../data/services'

const iconMap = { Mic, Radio, Video, Camera }

export default function PriceConstructor() {
  const { lang } = useParams<{ lang: string }>()
  const { t } = useI18n()
  const [selectedService, setSelectedService] = useState<string>('podcast')
  const [hours, setHours] = useState(2)
  const [selectedAddons, setSelectedAddons] = useState<Set<string>>(new Set())

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

  const queryStr = useMemo(() => {
    const params = new URLSearchParams()
    params.set('service', selectedService)
    params.set('hours', String(hours))
    params.set('addons', [...selectedAddons].join(','))
    params.set('total', String(total))
    return params.toString()
  }, [selectedService, hours, selectedAddons, total])

  return (
    <div className="max-w-3xl mx-auto">
      {/* Service select */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {services.map(s => {
          const Icon = iconMap[s.icon as keyof typeof iconMap]
          const active = s.id === selectedService
          return (
            <button
              key={s.id}
              onClick={() => { setSelectedService(s.id); setSelectedAddons(new Set()) }}
              className={`glass-card p-4 text-center cursor-pointer transition-all ${active ? 'ring-2' : ''}`}
              style={active ? { borderColor: 'var(--accent)', boxShadow: '0 0 0 2px var(--accent)' } : {}}
            >
              <Icon size={24} className="mx-auto mb-2" style={{ color: active ? 'var(--accent)' : 'var(--secondary)' }} />
              <div className="text-sm font-medium">{t(`service.${s.id}`)}</div>
              <div className="text-xs mt-1" style={{ color: 'var(--muted)' }}>
                {s.basePrice.toLocaleString()} &#8381;/{t('price.per.hour')}
              </div>
            </button>
          )
        })}
      </div>

      {/* Hours */}
      <div className="glass-card p-6 mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="font-medium">{t('price.duration')}</span>
          <span className="font-bold text-lg">{hours} {t('price.h')}</span>
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

      {/* Addons */}
      <div className="glass-card p-6 mb-8">
        <h3 className="font-medium mb-4">{t('price.addons')}</h3>
        <AnimatePresence mode="popLayout">
          {availableAddons.map(a => (
            <motion.label
              key={a.id}
              layout
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center justify-between py-3 border-b last:border-b-0 cursor-pointer"
              style={{ borderColor: 'var(--border)' }}
            >
              <div className="flex items-center gap-3">
                <input type="checkbox" checked={selectedAddons.has(a.id)} onChange={() => toggleAddon(a.id)} className="w-5 h-5 accent-[var(--accent)] cursor-pointer" />
                <span className="text-sm">{t(`addon.${a.id}`)}</span>
              </div>
              <span className="text-sm font-medium" style={{ color: 'var(--secondary)' }}>
                +{a.price.toLocaleString()} &#8381;{a.unit === 'hour' ? `/${t('price.per.hour')}` : ''}
              </span>
            </motion.label>
          ))}
        </AnimatePresence>
      </div>

      {/* Total */}
      <div className="glass-card p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="text-sm" style={{ color: 'var(--secondary)' }}>{t('price.total')}</div>
          <motion.div key={total} initial={{ scale: 0.95, opacity: 0.5 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 25 }} className="text-3xl font-extrabold">
            {total.toLocaleString()} &#8381;
          </motion.div>
        </div>
        <Link to={`/${lang}/booking?${queryStr}`} className="btn-primary no-underline inline-flex items-center gap-2">
          {t('home.book')} <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  )
}
