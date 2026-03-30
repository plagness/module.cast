import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from 'react-leaflet'
import L from 'leaflet'
import { useI18n } from '../i18n'
import 'leaflet/dist/leaflet.css'

const STUDIO = { lat: 55.720307, lng: 37.434262 }

const METRO_STATIONS = [
  { name: 'Кунцевская', nameEn: 'Kuntsevskaya', lat: 55.7308, lng: 37.3907, color: '#E42313', lines: '1, 11' },
  { name: 'Молодежная', nameEn: 'Molodezhnaya', lat: 55.7410, lng: 37.4164, color: '#E42313', lines: '1' },
  { name: 'Славянский бульвар', nameEn: 'Slavyansky Blvd', lat: 55.7265, lng: 37.4710, color: '#0072BA', lines: '3' },
]

const PARKING = [
  { name: 'Парковка Можайское ш.', lat: 55.7198, lng: 37.4330, spots: 105 },
  { name: 'Парковка ТЦ', lat: 55.7215, lng: 37.4380, spots: 50 },
]

function studioIcon() {
  return L.divIcon({
    html: '<div style="background:#F97316;width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-weight:bold;font-size:16px;box-shadow:0 2px 8px rgba(0,0,0,0.3);border:3px solid white">M</div>',
    className: '',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  })
}

function metroIcon(color: string) {
  return L.divIcon({
    html: `<div style="background:${color};width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-weight:bold;font-size:11px;box-shadow:0 2px 6px rgba(0,0,0,0.3);border:2px solid white">М</div>`,
    className: '',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  })
}

function parkingIcon() {
  return L.divIcon({
    html: '<div style="background:#3B82F6;width:22px;height:22px;border-radius:6px;display:flex;align-items:center;justify-content:center;color:white;font-weight:bold;font-size:12px;box-shadow:0 2px 4px rgba(0,0,0,0.2)">P</div>',
    className: '',
    iconSize: [22, 22],
    iconAnchor: [11, 11],
  })
}

interface RouteData {
  stationName: string
  duration: number
  geojson: GeoJSON.FeatureCollection
  color: string
}

export default function StudioMap() {
  const { t } = useI18n()
  const [routes, setRoutes] = useState<RouteData[]>([])

  useEffect(() => {
    async function fetchRoutes() {
      const results: RouteData[] = []
      for (const station of METRO_STATIONS) {
        try {
          const res = await fetch(
            `https://router.project-osrm.org/route/v1/foot/${station.lng},${station.lat};${STUDIO.lng},${STUDIO.lat}?overview=full&geometries=geojson`
          )
          const data = await res.json()
          if (data.routes?.[0]) {
            const route = data.routes[0]
            results.push({
              stationName: station.name,
              duration: Math.round(route.duration / 60),
              geojson: {
                type: 'FeatureCollection',
                features: [{ type: 'Feature', properties: {}, geometry: route.geometry }],
              },
              color: station.color,
            })
          }
        } catch {
          // ignore fetch errors
        }
      }
      setRoutes(results)
    }
    fetchRoutes()
  }, [])

  return (
    <div className="rounded-2xl overflow-hidden border" style={{ borderColor: 'var(--border)', height: 420 }}>
      <MapContainer center={[STUDIO.lat, STUDIO.lng]} zoom={14} style={{ height: '100%', width: '100%' }} scrollWheelZoom={false}>
        <TileLayer
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Studio marker */}
        <Marker position={[STUDIO.lat, STUDIO.lng]} icon={studioIcon()}>
          <Popup>
            <strong style={{ color: '#F97316' }}>{t('brand')}</strong><br />
            {t('home.location.sub')}
          </Popup>
        </Marker>

        {/* Metro stations */}
        {METRO_STATIONS.map(station => {
          const routeInfo = routes.find(r => r.stationName === station.name)
          return (
            <Marker key={station.name} position={[station.lat, station.lng]} icon={metroIcon(station.color)}>
              <Popup>
                <strong>М {station.name}</strong><br />
                <span style={{ color: '#666' }}>Линии: {station.lines}</span><br />
                {routeInfo && <span style={{ color: '#F97316', fontWeight: 600 }}>🚶 {routeInfo.duration} {t('home.walk.min')}</span>}
              </Popup>
            </Marker>
          )
        })}

        {/* Walking routes */}
        {routes.map(route => (
          <GeoJSON
            key={route.stationName}
            data={route.geojson}
            style={{ color: route.color, weight: 4, opacity: 0.7, dashArray: '8 6' }}
          />
        ))}

        {/* Parking */}
        {PARKING.map(p => (
          <Marker key={p.name} position={[p.lat, p.lng]} icon={parkingIcon()}>
            <Popup>
              <strong>{t('home.parking')}</strong><br />
              {p.name}<br />
              <span style={{ color: '#666' }}>{p.spots} мест</span>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Route legend */}
      {routes.length > 0 && (
        <div className="flex flex-wrap gap-4 px-4 py-3" style={{ background: 'var(--surface)' }}>
          {routes.map(r => (
            <div key={r.stationName} className="flex items-center gap-2 text-sm">
              <div className="w-3 h-3 rounded-full" style={{ background: r.color }} />
              <span>М {r.stationName}</span>
              <span className="font-semibold" style={{ color: 'var(--accent)' }}>
                {r.duration} {t('home.walk.min')}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
