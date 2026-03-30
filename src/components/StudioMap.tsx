import { useState, useRef, useCallback } from 'react'
import { YMaps, Map, Placemark } from '@pbe/react-yandex-maps'
import { useI18n } from '../i18n'
import { Footprints, Bus, Car } from 'lucide-react'

const API_KEY = import.meta.env.VITE_YANDEX_MAPS_KEY || ''
const STUDIO: [number, number] = [55.720307, 37.434262]

type TransportMode = 'pedestrian' | 'masstransit' | 'auto'

interface Station {
  name: string
  coords: [number, number]
  color: string
  type: 'metro' | 'mcd'
  lines: string
}

const STATIONS: Station[] = [
  { name: 'Рабочий Посёлок', coords: [55.7145, 37.4735], color: '#EF7E24', type: 'mcd', lines: 'D1' },
  { name: 'Сетунь', coords: [55.7178, 37.4520], color: '#EF7E24', type: 'mcd', lines: 'D1' },
  { name: 'Кунцевская', coords: [55.7306, 37.4461], color: '#0072BA', type: 'metro', lines: '3, 4, БКЛ' },
  { name: 'Молодёжная', coords: [55.7408, 37.4167], color: '#0072BA', type: 'metro', lines: '3' },
]

const PARKING: [number, number][] = [
  [55.7198, 37.4330],
  [55.7215, 37.4380],
]

const MODE_LABELS: Record<TransportMode, { ru: string; en: string; icon: typeof Footprints }> = {
  pedestrian: { ru: 'Пешком', en: 'Walk', icon: Footprints },
  masstransit: { ru: 'Транспорт', en: 'Transit', icon: Bus },
  auto: { ru: 'На машине', en: 'By car', icon: Car },
}

function stationLabel(s: Station) {
  return `${s.type === 'mcd' ? 'Д' : 'М'}. ${s.name}`
}

function svgIcon(size: number, inner: string) {
  return 'data:image/svg+xml,' + encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">${inner}</svg>`
  )
}

export default function StudioMap() {
  const { t } = useI18n()
  const isRu = t('home.walk.min') !== 'min walk'

  const [mode, setMode] = useState<TransportMode>('pedestrian')
  const [activeStation, setActiveStation] = useState(0) // index in STATIONS
  const [duration, setDuration] = useState<number | null>(null)
  const [distance, setDistance] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapRef = useRef<any>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ymapsRef = useRef<any>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const routeRef = useRef<any>(null)

  const updateRoute = useCallback((stationIdx: number, routingMode: TransportMode) => {
    const map = mapRef.current
    const ym = ymapsRef.current
    if (!map || !ym) return

    // Remove old route
    if (routeRef.current) {
      map.geoObjects.remove(routeRef.current)
      routeRef.current = null
    }

    setLoading(true)
    setDuration(null)
    setDistance(null)

    const station = STATIONS[stationIdx]
    const multiRoute = new ym.multiRouter.MultiRoute(
      {
        referencePoints: [station.coords, STUDIO],
        params: { routingMode },
      },
      {
        boundsAutoApply: true,
        routeActiveStrokeWidth: 5,
        routeActiveStrokeColor: station.color,
      }
    )

    multiRoute.model.events.add('requestsuccess', () => {
      try {
        const active = multiRoute.getActiveRoute()
        if (active) {
          const dur = active.properties.get('duration')
          const dist = active.properties.get('distance')
          setDuration(Math.round((dur?.value || 0) / 60))
          setDistance(Math.round(dist?.value || 0))
        }
      } catch {
        // route loaded but can't read properties yet
      }
      setLoading(false)
    })

    multiRoute.model.events.add('requestfail', () => {
      setLoading(false)
    })

    map.geoObjects.add(multiRoute)
    routeRef.current = multiRoute
  }, [])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onMapLoad = useCallback((ym: any) => {
    ymapsRef.current = ym
  }, [])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onMapInstance = useCallback((ref: any) => {
    if (ref && !mapRef.current) {
      mapRef.current = ref
      // Initial route after map + ymaps are ready
      const tryInit = () => {
        if (ymapsRef.current && mapRef.current) {
          updateRoute(0, 'pedestrian')
        } else {
          setTimeout(tryInit, 300)
        }
      }
      tryInit()
    }
  }, [updateRoute])

  // Update route when mode or station changes
  const selectStation = (idx: number) => {
    setActiveStation(idx)
    updateRoute(idx, mode)
  }

  const selectMode = (m: TransportMode) => {
    setMode(m)
    updateRoute(activeStation, m)
  }

  const station = STATIONS[activeStation]

  return (
    <div>
      {/* Mode buttons */}
      <div className="flex gap-2 mb-3 justify-center">
        {(Object.keys(MODE_LABELS) as TransportMode[]).map(m => {
          const { icon: Icon } = MODE_LABELS[m]
          const label = isRu ? MODE_LABELS[m].ru : MODE_LABELS[m].en
          const active = mode === m
          return (
            <button
              key={m}
              onClick={() => selectMode(m)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${
                active ? 'text-white shadow-md' : 'hover:bg-[var(--surface-hover)]'
              }`}
              style={active
                ? { background: 'var(--accent)' }
                : { color: 'var(--secondary)', border: '1px solid var(--border)' }
              }
            >
              <Icon size={16} />
              {label}
            </button>
          )
        })}
      </div>

      {/* Station chips */}
      <div className="flex flex-wrap gap-1.5 mb-4 justify-center">
        {STATIONS.map((s, i) => {
          const active = activeStation === i
          return (
            <button
              key={s.name}
              onClick={() => selectStation(i)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer border ${
                active ? 'text-white' : 'hover:bg-[var(--surface-hover)]'
              }`}
              style={active
                ? { background: s.color, borderColor: s.color }
                : { borderColor: 'var(--border)', color: 'var(--secondary)' }
              }
            >
              {stationLabel(s)}
            </button>
          )
        })}
      </div>

      {/* Map */}
      <div className="rounded-2xl overflow-hidden border" style={{ borderColor: 'var(--border)', height: 440 }}>
        <YMaps query={{ apikey: API_KEY, lang: 'ru_RU', load: 'package.full' }}>
          <Map
            defaultState={{ center: STUDIO, zoom: 14, controls: ['zoomControl'] }}
            style={{ width: '100%', height: '100%' }}
            onLoad={onMapLoad}
            instanceRef={onMapInstance}
            modules={['multiRouter.MultiRoute']}
          >
            {/* Studio marker */}
            <Placemark
              geometry={STUDIO}
              options={{
                iconLayout: 'default#imageWithContent',
                iconImageHref: svgIcon(42, `<circle cx="21" cy="21" r="19" fill="%23F97316" stroke="white" stroke-width="3"/><text x="21" y="27" text-anchor="middle" font-family="Inter,sans-serif" font-weight="800" font-size="18" fill="white">M</text>`),
                iconImageSize: [42, 42],
                iconImageOffset: [-21, -21],
              }}
              properties={{
                hintContent: t('brand'),
                balloonContentHeader: `<strong style="color:#F97316;font-size:15px">${t('brand')}</strong>`,
                balloonContentBody: `<div style="font-family:Inter,sans-serif">${t('home.location.sub')}</div>`,
              }}
            />

            {/* Station markers */}
            {STATIONS.map((s, i) => {
              const label = s.type === 'mcd' ? 'Д' : 'М'
              const isActive = activeStation === i
              const sz = isActive ? 32 : 26
              const r = sz / 2
              return (
                <Placemark
                  key={s.name}
                  geometry={s.coords}
                  options={{
                    iconLayout: 'default#imageWithContent',
                    iconImageHref: svgIcon(sz,
                      `<circle cx="${r}" cy="${r}" r="${r - 2}" fill="${s.color}" stroke="white" stroke-width="${isActive ? 3 : 2}"/>` +
                      `<text x="${r}" y="${r + 5}" text-anchor="middle" font-family="Inter,sans-serif" font-weight="700" font-size="${isActive ? 14 : 11}" fill="white">${label}</text>`
                    ),
                    iconImageSize: [sz, sz],
                    iconImageOffset: [-r, -r],
                  }}
                  properties={{
                    hintContent: stationLabel(s),
                    balloonContentHeader: `<strong style="font-size:14px">${stationLabel(s)}</strong>`,
                    balloonContentBody: `<div style="font-family:Inter,sans-serif;color:#888;font-size:12px">${s.lines}</div>`,
                  }}
                />
              )
            })}

            {/* Parking — only in auto mode */}
            {mode === 'auto' && PARKING.map((coords, i) => (
              <Placemark
                key={`p-${i}`}
                geometry={coords}
                options={{
                  iconLayout: 'default#imageWithContent',
                  iconImageHref: svgIcon(24, `<rect width="24" height="24" rx="6" fill="%233B82F6" opacity="0.8"/><text x="12" y="17" text-anchor="middle" font-family="Inter,sans-serif" font-weight="700" font-size="14" fill="white">P</text>`),
                  iconImageSize: [24, 24],
                  iconImageOffset: [-12, -12],
                }}
                properties={{ hintContent: isRu ? 'Парковка' : 'Parking' }}
              />
            ))}
          </Map>
        </YMaps>
      </div>

      {/* Info panel */}
      <div className="glass-card px-5 py-4 mt-4 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: station.color }}>
            <span className="text-white font-bold text-sm">{station.type === 'mcd' ? 'Д' : 'М'}</span>
          </div>
          <div>
            <div className="font-semibold text-sm">{stationLabel(station)}</div>
            <div className="text-xs" style={{ color: 'var(--muted)' }}>
              {station.lines} → {t('brand')}
            </div>
          </div>
        </div>

        <div className="text-right">
          {loading ? (
            <div className="text-sm" style={{ color: 'var(--muted)' }}>...</div>
          ) : duration !== null ? (
            <>
              <div className="font-bold text-2xl" style={{ color: 'var(--accent)' }}>
                {duration} <span className="text-sm font-normal" style={{ color: 'var(--muted)' }}>{isRu ? 'мин' : 'min'}</span>
              </div>
              {distance !== null && (
                <div className="text-xs" style={{ color: 'var(--muted)' }}>
                  {(distance / 1000).toFixed(1)} {isRu ? 'км' : 'km'} •{' '}
                  {isRu ? MODE_LABELS[mode].ru.toLowerCase() : MODE_LABELS[mode].en.toLowerCase()}
                </div>
              )}
            </>
          ) : null}
        </div>
      </div>
    </div>
  )
}
