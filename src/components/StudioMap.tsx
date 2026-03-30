import { useEffect, useState, useCallback, useRef } from 'react'
import { YMaps, Map, Placemark, Polyline } from '@pbe/react-yandex-maps'
import { useI18n } from '../i18n'

const API_KEY = import.meta.env.VITE_YANDEX_MAPS_KEY || ''
const STUDIO: [number, number] = [55.720307, 37.434262]

interface Station {
  name: string
  nameEn: string
  coords: [number, number]
  color: string
  type: 'metro' | 'mcd'
  lines: string
}

const STATIONS: Station[] = [
  { name: 'Сетунь', nameEn: 'Setun', coords: [55.7178, 37.4520], color: '#EF7E24', type: 'mcd', lines: 'МЦД-1' },
  { name: 'Кунцевская', nameEn: 'Kuntsevskaya', coords: [55.7306, 37.4461], color: '#0072BA', type: 'metro', lines: '3, 4, БКЛ' },
  { name: 'Славянский бульвар', nameEn: 'Slavyansky Blvd', coords: [55.7297, 37.4714], color: '#0072BA', type: 'metro', lines: '3' },
  { name: 'Молодёжная', nameEn: 'Molodezhnaya', coords: [55.7408, 37.4167], color: '#0072BA', type: 'metro', lines: '3' },
]

const PARKING: [number, number][] = [
  [55.7198, 37.4330],
  [55.7215, 37.4380],
]

const ROUTE_COLORS = ['#F97316', '#0072BA', '#3B82F6', '#8B5CF6']

interface RouteInfo {
  stationIdx: number
  duration: number
  distance: number
  path: [number, number][]
}

export default function StudioMap() {
  const { t } = useI18n()
  const [routes, setRoutes] = useState<RouteInfo[]>([])
  const ymapsRef = useRef<typeof ymaps | null>(null)

  const onYmapsLoad = useCallback((ymapsInstance: typeof ymaps) => {
    ymapsRef.current = ymapsInstance

    // Calculate pedestrian routes for each station
    STATIONS.forEach((station, idx) => {
      const multiRoute = new ymapsInstance.multiRouter.MultiRoute(
        { referencePoints: [station.coords, STUDIO], params: { routingMode: 'pedestrian' } },
        { boundsAutoApply: false }
      )

      multiRoute.model.events.add('requestsuccess', () => {
        try {
          const activeRoute = multiRoute.getActiveRoute()
          if (!activeRoute) return

          const duration = Math.round(activeRoute.properties.get('duration').value / 60)
          const distance = Math.round(activeRoute.properties.get('distance').value)

          // Extract path coordinates
          const paths = activeRoute.getPaths()
          const coords: [number, number][] = []
          paths.each((path: { getSegments: () => { each: (fn: (seg: { geometry: { getCoordinates: () => [number, number][] } }) => void) => void } }) => {
            path.getSegments().each((segment: { geometry: { getCoordinates: () => [number, number][] } }) => {
              const segCoords = segment.geometry.getCoordinates()
              coords.push(...segCoords)
            })
          })

          setRoutes(prev => {
            const filtered = prev.filter(r => r.stationIdx !== idx)
            return [...filtered, { stationIdx: idx, duration, distance, path: coords }].sort((a, b) => a.duration - b.duration)
          })
        } catch {
          // fallback: direct line
          setRoutes(prev => {
            if (prev.some(r => r.stationIdx === idx)) return prev
            return [...prev, {
              stationIdx: idx,
              duration: 0,
              distance: 0,
              path: [station.coords, STUDIO],
            }].sort((a, b) => a.duration - b.duration)
          })
        }
      })
    })
  }, [])

  // Fallback: if ymaps multiRouter fails, use OSRM
  useEffect(() => {
    const timer = setTimeout(() => {
      if (routes.length < STATIONS.length) {
        STATIONS.forEach(async (station, idx) => {
          if (routes.some(r => r.stationIdx === idx)) return
          try {
            const res = await fetch(
              `https://router.project-osrm.org/route/v1/foot/${station.coords[1]},${station.coords[0]};${STUDIO[1]},${STUDIO[0]}?overview=full&geometries=geojson`
            )
            const data = await res.json()
            if (data.routes?.[0]) {
              const r = data.routes[0]
              const path = r.geometry.coordinates.map(([lng, lat]: [number, number]) => [lat, lng] as [number, number])
              setRoutes(prev => {
                if (prev.some(pr => pr.stationIdx === idx)) return prev
                return [...prev, {
                  stationIdx: idx,
                  duration: Math.round(r.duration / 60),
                  distance: Math.round(r.distance),
                  path,
                }].sort((a, b) => a.duration - b.duration)
              })
            }
          } catch { /* skip */ }
        })
      }
    }, 5000)
    return () => clearTimeout(timer)
  }, [routes])

  return (
    <div>
      <div className="rounded-2xl overflow-hidden border" style={{ borderColor: 'var(--border)', height: 440 }}>
        <YMaps query={{ apikey: API_KEY, lang: 'ru_RU', load: 'package.full' }}>
          <Map
            defaultState={{ center: STUDIO, zoom: 14, controls: ['zoomControl'] }}
            style={{ width: '100%', height: '100%' }}
            onLoad={onYmapsLoad}
            modules={['multiRouter.MultiRoute']}
          >
            {/* Studio marker */}
            <Placemark
              geometry={STUDIO}
              options={{
                iconLayout: 'default#imageWithContent',
                iconImageHref: 'data:image/svg+xml,' + encodeURIComponent(
                  '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40"><circle cx="20" cy="20" r="18" fill="%23F97316" stroke="white" stroke-width="3"/><text x="20" y="26" text-anchor="middle" font-family="Inter,sans-serif" font-weight="800" font-size="18" fill="white">M</text></svg>'
                ),
                iconImageSize: [40, 40],
                iconImageOffset: [-20, -20],
              }}
              properties={{
                hintContent: t('brand'),
                balloonContentHeader: `<strong style="color:#F97316">${t('brand')}</strong>`,
                balloonContentBody: t('home.location.sub'),
              }}
            />

            {/* Metro/MCD station markers */}
            {STATIONS.map((station, i) => {
              const label = station.type === 'mcd' ? 'Д' : 'М'
              const routeInfo = routes.find(r => r.stationIdx === i)
              return (
                <Placemark
                  key={station.name}
                  geometry={station.coords}
                  options={{
                    iconLayout: 'default#imageWithContent',
                    iconImageHref: 'data:image/svg+xml,' + encodeURIComponent(
                      `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28"><circle cx="14" cy="14" r="12" fill="${station.color}" stroke="white" stroke-width="2"/><text x="14" y="19" text-anchor="middle" font-family="Inter,sans-serif" font-weight="700" font-size="12" fill="white">${label}</text></svg>`
                    ),
                    iconImageSize: [28, 28],
                    iconImageOffset: [-14, -14],
                  }}
                  properties={{
                    hintContent: `${label} ${station.name}`,
                    balloonContentHeader: `<strong>${label} ${station.name}</strong>`,
                    balloonContentBody: `<div style="font-family:Inter,sans-serif">
                      <span style="color:#888;font-size:12px">${station.lines}</span><br/>
                      ${routeInfo && routeInfo.duration > 0
                        ? `<span style="color:#F97316;font-weight:600">🚶 ${routeInfo.duration} мин (${(routeInfo.distance / 1000).toFixed(1)} км)</span>`
                        : ''}
                    </div>`,
                  }}
                />
              )
            })}

            {/* Walking route polylines */}
            {routes.map(r => (
              <Polyline
                key={`route-${r.stationIdx}`}
                geometry={r.path}
                options={{
                  strokeColor: ROUTE_COLORS[r.stationIdx % ROUTE_COLORS.length],
                  strokeWidth: 4,
                  strokeOpacity: 0.6,
                  strokeStyle: 'shortdash',
                }}
              />
            ))}

            {/* Parking markers */}
            {PARKING.map((coords, i) => (
              <Placemark
                key={`parking-${i}`}
                geometry={coords}
                options={{
                  iconLayout: 'default#imageWithContent',
                  iconImageHref: 'data:image/svg+xml,' + encodeURIComponent(
                    '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22"><rect width="22" height="22" rx="5" fill="%236B7280" opacity="0.7"/><text x="11" y="16" text-anchor="middle" font-family="Inter,sans-serif" font-weight="700" font-size="13" fill="white">P</text></svg>'
                  ),
                  iconImageSize: [22, 22],
                  iconImageOffset: [-11, -11],
                }}
                properties={{ hintContent: t('home.parking') }}
              />
            ))}
          </Map>
        </YMaps>
      </div>

      {/* Legend cards */}
      {routes.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
          {routes.filter(r => r.duration > 0).map(r => {
            const s = STATIONS[r.stationIdx]
            const color = ROUTE_COLORS[r.stationIdx % ROUTE_COLORS.length]
            return (
              <div key={s.name} className="glass-card px-4 py-3 text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: color }} />
                  <span className="text-xs font-medium truncate">
                    {s.type === 'mcd' ? 'Д' : 'М'} {s.name}
                  </span>
                </div>
                <div className="font-bold text-lg" style={{ color: 'var(--accent)' }}>
                  {r.duration} <span className="text-xs font-normal" style={{ color: 'var(--muted)' }}>{t('home.walk.min')}</span>
                </div>
                <div className="text-xs" style={{ color: 'var(--muted)' }}>
                  {(r.distance / 1000).toFixed(1)} км
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
