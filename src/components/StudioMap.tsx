import { useEffect, useState } from 'react'
import { YMaps, Map, Placemark, Polyline } from '@pbe/react-yandex-maps'
import { useI18n } from '../i18n'
import { Footprints, TrainFront, Car, Bus } from 'lucide-react'

const API_KEY = import.meta.env.VITE_YANDEX_MAPS_KEY || ''
const STUDIO: [number, number] = [55.720307, 37.434262]

type TransportMode = 'walk' | 'transit' | 'car'
type ViewMode = 'all' | TransportMode | number // number = station index

interface Station {
  name: string
  nameEn: string
  coords: [number, number]
  color: string
  type: 'metro' | 'mcd'
  lines: string
}

const STATIONS: Station[] = [
  { name: 'Рабочий Посёлок', nameEn: 'Rabochiy Poselok', coords: [55.7145, 37.4735], color: '#EF7E24', type: 'mcd', lines: 'МЦД-1' },
  { name: 'Сетунь', nameEn: 'Setun', coords: [55.7178, 37.4520], color: '#EF7E24', type: 'mcd', lines: 'МЦД-1' },
  { name: 'Кунцевская', nameEn: 'Kuntsevskaya', coords: [55.7306, 37.4461], color: '#0072BA', type: 'metro', lines: '3, 4, БКЛ' },
  { name: 'Славянский бульвар', nameEn: 'Slavyansky Blvd', coords: [55.7297, 37.4714], color: '#0072BA', type: 'metro', lines: '3' },
  { name: 'Молодёжная', nameEn: 'Molodezhnaya', coords: [55.7408, 37.4167], color: '#0072BA', type: 'metro', lines: '3' },
]

const PARKING: [number, number][] = [
  [55.7198, 37.4330],
  [55.7215, 37.4380],
]

const ROUTE_COLORS = ['#F97316', '#FB923C', '#0072BA', '#3B82F6', '#8B5CF6']

interface RouteInfo {
  stationIdx: number
  duration: number
  distance: number
  path: [number, number][]
  mode: TransportMode
}

export default function StudioMap() {
  const { t } = useI18n()
  const [routes, setRoutes] = useState<RouteInfo[]>([])
  const [view, setView] = useState<ViewMode>('all')
  const [carRoute, setCarRoute] = useState<RouteInfo | null>(null)
  const [transitRoutes, setTransitRoutes] = useState<RouteInfo[]>([])

  // Fetch walking routes via OSRM (reliable, no ymaps dependency issues)
  useEffect(() => {
    STATIONS.forEach(async (station, idx) => {
      try {
        const res = await fetch(
          `https://router.project-osrm.org/route/v1/foot/${station.coords[1]},${station.coords[0]};${STUDIO[1]},${STUDIO[0]}?overview=full&geometries=geojson`
        )
        const data = await res.json()
        if (data.routes?.[0]) {
          const r = data.routes[0]
          const path = r.geometry.coordinates.map(([lng, lat]: [number, number]) => [lat, lng] as [number, number])
          setRoutes(prev => {
            if (prev.some(pr => pr.stationIdx === idx && pr.mode === 'walk')) return prev
            return [...prev, {
              stationIdx: idx, duration: Math.round(r.duration / 60),
              distance: Math.round(r.distance), path, mode: 'walk' as const,
            }].sort((a, b) => a.duration - b.duration)
          })
        }
      } catch { /* skip */ }
    })
  }, [])

  // Fetch car route from center (МКАД direction)
  useEffect(() => {
    async function fetchCar() {
      try {
        const from: [number, number] = [55.7558, 37.6173] // центр Москвы
        const res = await fetch(
          `https://router.project-osrm.org/route/v1/driving/${from[1]},${from[0]};${STUDIO[1]},${STUDIO[0]}?overview=full&geometries=geojson`
        )
        const data = await res.json()
        if (data.routes?.[0]) {
          const r = data.routes[0]
          const path = r.geometry.coordinates.map(([lng, lat]: [number, number]) => [lat, lng] as [number, number])
          setCarRoute({
            stationIdx: -1, duration: Math.round(r.duration / 60),
            distance: Math.round(r.distance), path, mode: 'car' as const,
          })
        }
      } catch { /* skip */ }
    }
    fetchCar()
  }, [])

  // Fetch transit routes (bus/tram) — use OSRM driving as approximation for bus
  useEffect(() => {
    const busStations = STATIONS.slice(0, 3) // closest 3
    busStations.forEach(async (station, idx) => {
      try {
        const res = await fetch(
          `https://router.project-osrm.org/route/v1/driving/${station.coords[1]},${station.coords[0]};${STUDIO[1]},${STUDIO[0]}?overview=full&geometries=geojson`
        )
        const data = await res.json()
        if (data.routes?.[0]) {
          const r = data.routes[0]
          const path = r.geometry.coordinates.map(([lng, lat]: [number, number]) => [lat, lng] as [number, number])
          setTransitRoutes(prev => {
            if (prev.some(pr => pr.stationIdx === idx)) return prev
            return [...prev, {
              stationIdx: idx, duration: Math.round(r.duration / 60) + 3, // +3 min waiting
              distance: Math.round(r.distance), path, mode: 'transit' as const,
            }].sort((a, b) => a.duration - b.duration)
          })
        }
      } catch { /* skip */ }
    })
  }, [])

  // Which routes to show
  const visibleRoutes = (() => {
    if (view === 'all') return routes
    if (view === 'walk') return routes
    if (view === 'car') return carRoute ? [carRoute] : []
    if (view === 'transit') return transitRoutes
    if (typeof view === 'number') return routes.filter(r => r.stationIdx === view)
    return routes
  })()

  const showStations = view === 'all' || view === 'walk' || typeof view === 'number'
  const showParking = view === 'all' || view === 'car'

  return (
    <div>
      {/* Mode buttons */}
      <div className="flex flex-wrap gap-2 mb-4 justify-center">
        <ModeBtn active={view === 'all'} onClick={() => setView('all')} icon={null} label={t('home.walk.min') === 'min walk' ? 'All' : 'Все'} />
        <ModeBtn active={view === 'walk'} onClick={() => setView('walk')} icon={<Footprints size={16} />} label={t('home.walk.min') === 'min walk' ? 'Walk' : 'Пешком'} />
        <ModeBtn active={view === 'transit'} onClick={() => setView('transit')} icon={<Bus size={16} />} label={t('home.walk.min') === 'min walk' ? 'Transit' : 'Транспорт'} />
        <ModeBtn active={view === 'car'} onClick={() => setView('car')} icon={<Car size={16} />} label={t('home.walk.min') === 'min walk' ? 'By car' : 'На машине'} />
      </div>

      {/* Station filter chips (show when walk mode) */}
      {(view === 'walk' || view === 'all' || typeof view === 'number') && (
        <div className="flex flex-wrap gap-2 mb-4 justify-center">
          {STATIONS.map((s, i) => {
            const r = routes.find(rt => rt.stationIdx === i)
            const isActive = view === i
            return (
              <button
                key={s.name}
                onClick={() => setView(isActive ? 'walk' : i)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer border ${
                  isActive ? 'text-white' : 'hover:bg-[var(--surface-hover)]'
                }`}
                style={isActive
                  ? { background: ROUTE_COLORS[i], borderColor: ROUTE_COLORS[i] }
                  : { borderColor: 'var(--border)', color: 'var(--secondary)' }
                }
              >
                <TrainFront size={12} />
                {s.type === 'mcd' ? 'Д' : 'М'} {s.name}
                {r && r.duration > 0 && (
                  <span className={isActive ? 'opacity-80' : ''} style={isActive ? {} : { color: 'var(--accent)' }}>
                    {r.duration}′
                  </span>
                )}
              </button>
            )
          })}
        </div>
      )}

      {/* Map */}
      <div className="rounded-2xl overflow-hidden border" style={{ borderColor: 'var(--border)', height: 440 }}>
        <YMaps query={{ apikey: API_KEY, lang: 'ru_RU', load: 'package.full' }}>
          <Map
            defaultState={{ center: STUDIO, zoom: 14, controls: ['zoomControl'] }}
            style={{ width: '100%', height: '100%' }}
            modules={['multiRouter.MultiRoute']}
          >
            {/* Studio marker */}
            <Placemark
              geometry={STUDIO}
              options={{
                iconLayout: 'default#imageWithContent',
                iconImageHref: svgIcon(40, `<circle cx="20" cy="20" r="18" fill="%23F97316" stroke="white" stroke-width="3"/><text x="20" y="26" text-anchor="middle" font-family="Inter,sans-serif" font-weight="800" font-size="18" fill="white">M</text>`),
                iconImageSize: [40, 40],
                iconImageOffset: [-20, -20],
              }}
              properties={{
                hintContent: t('brand'),
                balloonContentHeader: `<strong style="color:#F97316">${t('brand')}</strong>`,
                balloonContentBody: t('home.location.sub'),
              }}
            />

            {/* Station markers */}
            {showStations && STATIONS.map((station, i) => {
              if (typeof view === 'number' && view !== i) return null
              const label = station.type === 'mcd' ? 'Д' : 'М'
              const r = routes.find(rt => rt.stationIdx === i)
              return (
                <Placemark
                  key={station.name}
                  geometry={station.coords}
                  options={{
                    iconLayout: 'default#imageWithContent',
                    iconImageHref: svgIcon(28, `<circle cx="14" cy="14" r="12" fill="${station.color}" stroke="white" stroke-width="2"/><text x="14" y="19" text-anchor="middle" font-family="Inter,sans-serif" font-weight="700" font-size="12" fill="white">${label}</text>`),
                    iconImageSize: [28, 28],
                    iconImageOffset: [-14, -14],
                  }}
                  properties={{
                    hintContent: `${label} ${station.name}`,
                    balloonContentHeader: `<strong>${label} ${station.name}</strong>`,
                    balloonContentBody: `<div style="font-family:Inter,sans-serif">
                      <span style="color:#888;font-size:12px">${station.lines}</span><br/>
                      ${r && r.duration > 0 ? `<span style="color:#F97316;font-weight:600">🚶 ${r.duration} мин (${(r.distance / 1000).toFixed(1)} км)</span>` : ''}
                    </div>`,
                  }}
                />
              )
            })}

            {/* Route polylines */}
            {visibleRoutes.map((r, i) => (
              <Polyline
                key={`route-${r.mode}-${r.stationIdx}-${i}`}
                geometry={r.path}
                options={{
                  strokeColor: r.mode === 'car' ? '#10B981' : r.mode === 'transit' ? '#8B5CF6' : ROUTE_COLORS[r.stationIdx % ROUTE_COLORS.length],
                  strokeWidth: r.mode === 'car' ? 5 : 4,
                  strokeOpacity: typeof view === 'number' ? 0.9 : 0.6,
                  strokeStyle: r.mode === 'car' ? 'solid' : 'shortdash',
                }}
              />
            ))}

            {/* Parking */}
            {showParking && PARKING.map((coords, i) => (
              <Placemark
                key={`parking-${i}`}
                geometry={coords}
                options={{
                  iconLayout: 'default#imageWithContent',
                  iconImageHref: svgIcon(22, `<rect width="22" height="22" rx="5" fill="%236B7280" opacity="0.7"/><text x="11" y="16" text-anchor="middle" font-family="Inter,sans-serif" font-weight="700" font-size="13" fill="white">P</text>`),
                  iconImageSize: [22, 22],
                  iconImageOffset: [-11, -11],
                }}
                properties={{ hintContent: t('home.parking') }}
              />
            ))}
          </Map>
        </YMaps>
      </div>

      {/* Info panel */}
      <div className="mt-4">
        {/* Walking legend */}
        {(view === 'all' || view === 'walk' || typeof view === 'number') && routes.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {routes.filter(r => r.duration > 0 && (typeof view !== 'number' || r.stationIdx === view)).map(r => {
              const s = STATIONS[r.stationIdx]
              const color = ROUTE_COLORS[r.stationIdx % ROUTE_COLORS.length]
              return (
                <button
                  key={s.name}
                  onClick={() => setView(view === r.stationIdx ? 'walk' : r.stationIdx)}
                  className="glass-card px-3 py-2.5 text-center cursor-pointer transition-all hover:scale-[1.02]"
                  style={view === r.stationIdx ? { borderColor: color, boxShadow: `0 0 0 2px ${color}` } : {}}
                >
                  <div className="flex items-center justify-center gap-1.5 mb-1">
                    <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: color }} />
                    <span className="text-[11px] font-medium truncate">{s.type === 'mcd' ? 'Д' : 'М'} {s.name}</span>
                  </div>
                  <div className="font-bold text-base" style={{ color: 'var(--accent)' }}>
                    {r.duration} <span className="text-[10px] font-normal" style={{ color: 'var(--muted)' }}>мин</span>
                  </div>
                  <div className="text-[10px]" style={{ color: 'var(--muted)' }}>{(r.distance / 1000).toFixed(1)} км</div>
                </button>
              )
            })}
          </div>
        )}

        {/* Car info */}
        {view === 'car' && carRoute && (
          <div className="glass-card px-6 py-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Car size={18} style={{ color: '#10B981' }} />
              <span className="font-medium">{t('home.walk.min') === 'min walk' ? 'From city center' : 'Из центра Москвы'}</span>
            </div>
            <div className="font-bold text-2xl" style={{ color: '#10B981' }}>
              ~{carRoute.duration} <span className="text-sm font-normal" style={{ color: 'var(--muted)' }}>мин</span>
            </div>
            <div className="text-xs mt-1" style={{ color: 'var(--muted)' }}>{(carRoute.distance / 1000).toFixed(0)} км • {t('home.parking')}</div>
          </div>
        )}

        {/* Transit info */}
        {view === 'transit' && transitRoutes.length > 0 && (
          <div className="glass-card px-6 py-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Bus size={18} style={{ color: '#8B5CF6' }} />
              <span className="font-medium">{t('home.walk.min') === 'min walk' ? 'Public transit' : 'Общественный транспорт'}</span>
            </div>
            <div className="text-sm" style={{ color: 'var(--secondary)' }}>
              {t('home.walk.min') === 'min walk'
                ? 'Bus routes: 103, 157, 198, 231, 610, 732, 779, 840'
                : 'Автобусы: 103, 157, 198, 231, 610, 732, 779, 840'}
            </div>
            <div className="text-xs mt-2" style={{ color: 'var(--muted)' }}>
              {t('home.walk.min') === 'min walk'
                ? 'From nearest metro stations to the studio by bus'
                : 'От ближайших станций метро до студии на автобусе'}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function ModeBtn({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${
        active ? 'text-white' : 'hover:bg-[var(--surface-hover)]'
      }`}
      style={active ? { background: 'var(--accent)' } : { color: 'var(--secondary)', border: '1px solid var(--border)' }}
    >
      {icon}
      {label}
    </button>
  )
}

function svgIcon(size: number, inner: string) {
  return 'data:image/svg+xml,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">${inner}</svg>`)
}
