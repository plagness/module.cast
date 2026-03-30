import { useEffect, useState, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup, GeoJSON, useMap } from 'react-leaflet'
import L from 'leaflet'
import { useI18n } from '../i18n'
import 'leaflet/dist/leaflet.css'

const STUDIO = { lat: 55.720307, lng: 37.434262 }

interface Station {
  name: string
  nameEn: string
  lat: number
  lng: number
  color: string
  type: 'metro' | 'mcd'
  lines: string
}

const STATIONS: Station[] = [
  { name: 'Сетунь', nameEn: 'Setun', lat: 55.7178, lng: 37.4520, color: '#EF7E24', type: 'mcd', lines: 'МЦД-1' },
  { name: 'Кунцевская', nameEn: 'Kuntsevskaya', lat: 55.7306, lng: 37.4461, color: '#0072BA', type: 'metro', lines: '3, 4, БКЛ' },
  { name: 'Славянский бульвар', nameEn: 'Slavyansky Blvd', lat: 55.7297, lng: 37.4714, color: '#0072BA', type: 'metro', lines: '3' },
  { name: 'Молодёжная', nameEn: 'Molodezhnaya', lat: 55.7408, lng: 37.4167, color: '#0072BA', type: 'metro', lines: '3' },
]

const PARKING = [
  { lat: 55.7198, lng: 37.4330 },
  { lat: 55.7215, lng: 37.4380 },
]

const ROUTE_COLORS = ['#F97316', '#0072BA', '#3B82F6', '#8B5CF6']

function studioIcon() {
  return L.divIcon({
    html: `<div style="
      background: #F97316; width: 40px; height: 40px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      color: white; font-weight: 800; font-size: 18px;
      box-shadow: 0 3px 12px rgba(249,115,22,0.5); border: 3px solid white;
    ">M</div>`,
    className: '',
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  })
}

function stationIcon(color: string, type: 'metro' | 'mcd') {
  const label = type === 'mcd' ? 'Д' : 'М'
  return L.divIcon({
    html: `<div style="
      background: ${color}; width: 28px; height: 28px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      color: white; font-weight: 700; font-size: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3); border: 2px solid white;
    ">${label}</div>`,
    className: '',
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  })
}

function parkingIcon() {
  return L.divIcon({
    html: `<div style="
      background: #6B7280; width: 22px; height: 22px; border-radius: 6px;
      display: flex; align-items: center; justify-content: center;
      color: white; font-weight: 700; font-size: 11px;
      box-shadow: 0 1px 4px rgba(0,0,0,0.2); opacity: 0.7;
    ">P</div>`,
    className: '',
    iconSize: [22, 22],
    iconAnchor: [11, 11],
  })
}

interface RouteData {
  stationIdx: number
  duration: number
  distance: number
  geojson: GeoJSON.FeatureCollection
}

function FitBounds({ routes }: { routes: RouteData[] }) {
  const map = useMap()
  const fitted = useRef(false)
  useEffect(() => {
    if (routes.length > 0 && !fitted.current) {
      fitted.current = true
      const allPoints: L.LatLngTuple[] = [
        [STUDIO.lat, STUDIO.lng],
        ...STATIONS.map(s => [s.lat, s.lng] as L.LatLngTuple),
      ]
      map.fitBounds(L.latLngBounds(allPoints), { padding: [30, 30] })
    }
  }, [routes, map])
  return null
}

export default function StudioMap() {
  const { t } = useI18n()
  const [routes, setRoutes] = useState<RouteData[]>([])

  useEffect(() => {
    async function fetchRoutes() {
      const results: RouteData[] = []
      for (let i = 0; i < STATIONS.length; i++) {
        const s = STATIONS[i]
        try {
          const res = await fetch(
            `https://router.project-osrm.org/route/v1/foot/${s.lng},${s.lat};${STUDIO.lng},${STUDIO.lat}?overview=full&geometries=geojson`
          )
          const data = await res.json()
          if (data.routes?.[0]) {
            const r = data.routes[0]
            results.push({
              stationIdx: i,
              duration: Math.round(r.duration / 60),
              distance: Math.round(r.distance),
              geojson: {
                type: 'FeatureCollection',
                features: [{ type: 'Feature', properties: {}, geometry: r.geometry }],
              },
            })
          }
        } catch { /* skip */ }
      }
      setRoutes(results)
    }
    fetchRoutes()
  }, [])

  return (
    <div>
      <div className="rounded-2xl overflow-hidden border" style={{ borderColor: 'var(--border)', height: 440 }}>
        <MapContainer
          center={[STUDIO.lat, STUDIO.lng]}
          zoom={14}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={false}
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://osm.org/copyright">OSM</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <FitBounds routes={routes} />

          {/* Walking routes (draw first, under markers) */}
          {routes.map((r, i) => (
            <GeoJSON
              key={`route-${i}`}
              data={r.geojson}
              style={{
                color: ROUTE_COLORS[r.stationIdx % ROUTE_COLORS.length],
                weight: 4,
                opacity: 0.6,
                dashArray: '8 6',
              }}
            />
          ))}

          {/* Studio */}
          <Marker position={[STUDIO.lat, STUDIO.lng]} icon={studioIcon()}>
            <Popup>
              <div style={{ fontFamily: 'Inter, sans-serif', minWidth: 180 }}>
                <strong style={{ color: '#F97316', fontSize: 14 }}>{t('brand')}</strong><br />
                <span style={{ color: '#666', fontSize: 12 }}>{t('home.location.sub')}</span>
              </div>
            </Popup>
          </Marker>

          {/* Stations */}
          {STATIONS.map((s, i) => {
            const route = routes.find(r => r.stationIdx === i)
            return (
              <Marker key={s.name} position={[s.lat, s.lng]} icon={stationIcon(s.color, s.type)}>
                <Popup>
                  <div style={{ fontFamily: 'Inter, sans-serif', minWidth: 160 }}>
                    <strong style={{ fontSize: 13 }}>{s.type === 'mcd' ? 'Д' : 'М'} {s.name}</strong><br />
                    <span style={{ color: '#888', fontSize: 11 }}>{s.lines}</span><br />
                    {route && (
                      <span style={{ color: '#F97316', fontWeight: 600, fontSize: 13 }}>
                        🚶 {route.duration} мин ({(route.distance / 1000).toFixed(1)} км)
                      </span>
                    )}
                  </div>
                </Popup>
              </Marker>
            )
          })}

          {/* Parking */}
          {PARKING.map((p, i) => (
            <Marker key={`p-${i}`} position={[p.lat, p.lng]} icon={parkingIcon()}>
              <Popup><span style={{ fontFamily: 'Inter, sans-serif', fontSize: 12 }}>{t('home.parking')}</span></Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Legend below map */}
      {routes.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
          {routes
            .sort((a, b) => a.duration - b.duration)
            .map(r => {
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
