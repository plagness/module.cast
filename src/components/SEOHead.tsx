import { useEffect } from 'react'
import { useParams, useLocation } from 'react-router-dom'
import { SUPPORTED_LANGS } from '../design'

const BASE = 'https://module.moscow'

interface SEOHeadProps {
  title: string
  description: string
}

export default function SEOHead({ title, description }: SEOHeadProps) {
  const { lang } = useParams<{ lang: string }>()
  const location = useLocation()

  useEffect(() => {
    document.title = `${title} | module.cast`

    const setMeta = (name: string, content: string) => {
      let el = document.querySelector(`meta[name="${name}"]`) || document.querySelector(`meta[property="${name}"]`)
      if (!el) {
        el = document.createElement('meta')
        if (name.startsWith('og:')) {
          el.setAttribute('property', name)
        } else {
          el.setAttribute('name', name)
        }
        document.head.appendChild(el)
      }
      el.setAttribute('content', content)
    }

    setMeta('description', description)
    setMeta('og:title', `${title} | module.cast`)
    setMeta('og:description', description)
    setMeta('og:url', `${BASE}${location.pathname}`)
    setMeta('og:type', 'website')

    // hreflang
    document.querySelectorAll('link[hreflang]').forEach(el => el.remove())
    const pathWithoutLang = location.pathname.replace(`/${lang}`, '')
    for (const l of SUPPORTED_LANGS) {
      const link = document.createElement('link')
      link.rel = 'alternate'
      link.hreflang = l
      link.href = `${BASE}/${l}${pathWithoutLang || '/'}`
      document.head.appendChild(link)
    }
    const xDefault = document.createElement('link')
    xDefault.rel = 'alternate'
    xDefault.hreflang = 'x-default'
    xDefault.href = `${BASE}/ru${pathWithoutLang || '/'}`
    document.head.appendChild(xDefault)

    return () => {
      document.querySelectorAll('link[hreflang]').forEach(el => el.remove())
    }
  }, [title, description, lang, location.pathname])

  return null
}

export function LocalBusinessSchema() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Модуль Каст / module.cast',
    description: 'Студия в Москве. Запись видео, прямые эфиры.',
    url: BASE,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Можайское шоссе 13',
      addressLocality: 'Москва',
      addressCountry: 'RU',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 55.720307,
      longitude: 37.434262,
    },
    priceRange: '$$',
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
