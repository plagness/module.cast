import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type OverlayStyle = 'lowerthird' | 'fullscreen' | 'ticker'

interface OverlayData {
  text: string
  style: OverlayStyle
  fontSize: number
}

export default function OverlayDisplay() {
  const [data, setData] = useState<OverlayData | null>(null)

  useEffect(() => {
    if (typeof BroadcastChannel === 'undefined') return

    const channel = new BroadcastChannel('modulecast-overlay')
    channel.onmessage = (e) => {
      if (e.data.type === 'show') {
        setData({ text: e.data.text, style: e.data.style, fontSize: e.data.fontSize })
      }
      if (e.data.type === 'hide') {
        setData(null)
      }
    }
    return () => channel.close()
  }, [])

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'transparent', overflow: 'hidden', fontFamily: "'Inter', sans-serif" }}>
      <AnimatePresence>
        {data && (
          <>
            {data.style === 'lowerthird' && (
              <motion.div
                key="lowerthird"
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                style={{
                  position: 'absolute', bottom: 40, left: 40, right: 40,
                  background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(16px)',
                  borderRadius: 16, padding: '20px 32px',
                  color: 'white', fontSize: data.fontSize,
                  borderLeft: '4px solid #F97316',
                }}
              >
                {data.text}
              </motion.div>
            )}

            {data.style === 'fullscreen' && (
              <motion.div
                key="fullscreen"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ type: 'spring', damping: 20 }}
                style={{
                  position: 'absolute', inset: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  padding: 60,
                }}
              >
                <div style={{
                  background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(20px)',
                  borderRadius: 24, padding: '40px 60px',
                  color: 'white', fontSize: data.fontSize, textAlign: 'center',
                  border: '2px solid rgba(249,115,22,0.3)',
                  maxWidth: '80%',
                }}>
                  {data.text}
                </div>
              </motion.div>
            )}

            {data.style === 'ticker' && (
              <motion.div
                key="ticker"
                initial={{ y: 60 }}
                animate={{ y: 0 }}
                exit={{ y: 60 }}
                transition={{ type: 'spring', damping: 25 }}
                style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0,
                  background: '#F97316', color: 'white',
                  padding: '12px 0', overflow: 'hidden',
                  fontSize: data.fontSize * 0.8,
                }}
              >
                <div style={{
                  whiteSpace: 'nowrap',
                  animation: 'tickerScroll 15s linear infinite',
                }}>
                  {data.text} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {data.text} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {data.text}
                </div>
              </motion.div>
            )}
          </>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes tickerScroll {
          from { transform: translateX(100%); }
          to { transform: translateX(-100%); }
        }
      `}</style>
    </div>
  )
}
