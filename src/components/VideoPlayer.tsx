import { useRef, useState, useCallback, useEffect } from 'react'
import { Play, Pause, Maximize, Minimize, Subtitles, Volume2, VolumeX, Languages, Share2 } from 'lucide-react'

interface Props {
  src: string
  poster?: string
  subtitles?: Record<string, string>
  activeLang?: string
  orientation?: 'portrait' | 'landscape'
  shareUrl?: string
}

export default function VideoPlayer({ src, poster, subtitles, activeLang = 'ru', orientation = 'portrait', shareUrl }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [muted, setMuted] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [subsEnabled, setSubsEnabled] = useState(true)
  const [subsLang, setSubsLang] = useState(activeLang)
  const [showSubsMenu, setShowSubsMenu] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [started, setStarted] = useState(false)
  const hideTimer = useRef<ReturnType<typeof setTimeout>>(null)

  const togglePlay = useCallback(() => {
    const v = videoRef.current
    if (!v) return
    if (v.paused) {
      v.play()
      setPlaying(true)
      setStarted(true)
    } else {
      v.pause()
      setPlaying(false)
    }
  }, [])

  const seek = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const v = videoRef.current
    if (!v || !duration) return
    const rect = e.currentTarget.getBoundingClientRect()
    const pct = (e.clientX - rect.left) / rect.width
    v.currentTime = pct * duration
  }, [duration])

  const toggleFullscreen = useCallback(() => {
    const el = containerRef.current
    if (!el) return
    if (document.fullscreenElement) {
      document.exitFullscreen()
      setIsFullscreen(false)
    } else {
      el.requestFullscreen()
      setIsFullscreen(true)
    }
  }, [])

  const handleShare = useCallback(async () => {
    if (!shareUrl) return
    if (navigator.share) {
      await navigator.share({ url: shareUrl })
    } else {
      await navigator.clipboard.writeText(shareUrl)
    }
  }, [shareUrl])

  // Update subtitle tracks
  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    for (let i = 0; i < v.textTracks.length; i++) {
      const track = v.textTracks[i]
      track.mode = subsEnabled && track.language === subsLang ? 'showing' : 'hidden'
    }
  }, [subsEnabled, subsLang])

  // Time update
  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    const onTime = () => {
      setCurrentTime(v.currentTime)
      setProgress(v.duration ? (v.currentTime / v.duration) * 100 : 0)
    }
    const onMeta = () => setDuration(v.duration)
    const onEnd = () => { setPlaying(false); setStarted(false) }
    v.addEventListener('timeupdate', onTime)
    v.addEventListener('loadedmetadata', onMeta)
    v.addEventListener('ended', onEnd)
    return () => {
      v.removeEventListener('timeupdate', onTime)
      v.removeEventListener('loadedmetadata', onMeta)
      v.removeEventListener('ended', onEnd)
    }
  }, [])

  // Auto-hide controls
  const showControlsTemporary = useCallback(() => {
    setShowControls(true)
    if (hideTimer.current) clearTimeout(hideTimer.current)
    if (playing) {
      hideTimer.current = setTimeout(() => setShowControls(false), 3000)
    }
  }, [playing])

  const fmt = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = Math.floor(s % 60)
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  const aspectClass = orientation === 'portrait' ? 'aspect-[9/16]' : 'aspect-video'

  return (
    <div
      ref={containerRef}
      className={`relative ${aspectClass} bg-black rounded-xl overflow-hidden group cursor-pointer`}
      onMouseMove={showControlsTemporary}
      onMouseEnter={() => setShowControls(true)}
      onClick={(e) => {
        if ((e.target as HTMLElement).closest('[data-controls]')) return
        togglePlay()
      }}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        playsInline
        preload="metadata"
        muted={muted}
        className="w-full h-full object-contain"
        crossOrigin="anonymous"
      >
        {subtitles && Object.entries(subtitles).map(([lang, url]) => (
          <track
            key={lang}
            src={url}
            kind="subtitles"
            srcLang={lang}
            label={lang === 'ru' ? 'Русский' : lang === 'en' ? 'English' : lang === 'zh' ? '中文' : lang}
            default={lang === activeLang}
          />
        ))}
      </video>

      {/* Big play button (before first play) */}
      {!started && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
          <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
            <Play size={28} fill="var(--accent)" style={{ color: 'var(--accent)', marginLeft: 3 }} />
          </div>
        </div>
      )}

      {/* Controls overlay */}
      {started && (
        <div
          data-controls
          className={`absolute inset-x-0 bottom-0 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}
          style={{ background: 'linear-gradient(transparent, rgba(0,0,0,0.7))' }}
        >
          {/* Progress bar */}
          <div className="px-3 pt-4 pb-1 cursor-pointer" onClick={seek}>
            <div className="h-1 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all" style={{ width: `${progress}%`, background: '#F97316' }} />
            </div>
          </div>

          {/* Bottom bar */}
          <div className="flex items-center gap-2 px-3 pb-2.5">
            <button onClick={togglePlay} className="text-white/90 hover:text-white p-1 cursor-pointer">
              {playing ? <Pause size={18} /> : <Play size={18} />}
            </button>

            <span className="text-white/70 text-xs font-mono min-w-[70px]">
              {fmt(currentTime)} / {fmt(duration)}
            </span>

            <div className="flex-1" />

            {/* Mute */}
            <button onClick={() => setMuted(!muted)} className="text-white/70 hover:text-white p-1 cursor-pointer">
              {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>

            {/* Subtitles */}
            {subtitles && Object.keys(subtitles).length > 0 && (
              <div className="relative">
                <button
                  onClick={() => setShowSubsMenu(!showSubsMenu)}
                  className={`p-1 cursor-pointer ${subsEnabled ? 'text-[#F97316]' : 'text-white/70 hover:text-white'}`}
                >
                  <Subtitles size={16} />
                </button>
                {showSubsMenu && (
                  <div className="absolute bottom-full right-0 mb-2 rounded-lg py-1.5 min-w-[120px] shadow-xl" style={{ background: 'rgba(0,0,0,0.9)' }}>
                    <button
                      onClick={() => { setSubsEnabled(false); setShowSubsMenu(false) }}
                      className={`w-full text-left px-3 py-1.5 text-xs cursor-pointer hover:bg-white/10 ${!subsEnabled ? 'text-[#F97316]' : 'text-white/70'}`}
                    >
                      Выкл
                    </button>
                    {Object.entries(subtitles).map(([lang]) => (
                      <button
                        key={lang}
                        onClick={() => { setSubsLang(lang); setSubsEnabled(true); setShowSubsMenu(false) }}
                        className={`w-full text-left px-3 py-1.5 text-xs cursor-pointer hover:bg-white/10 ${subsEnabled && subsLang === lang ? 'text-[#F97316]' : 'text-white/70'}`}
                      >
                        {lang === 'ru' ? 'Русский' : lang === 'en' ? 'English' : lang === 'zh' ? '中文' : lang}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Audio tracks (placeholder) */}
            <button className="text-white/30 p-1 cursor-not-allowed" title="Audio tracks (coming soon)">
              <Languages size={16} />
            </button>

            {/* Share */}
            {shareUrl && (
              <button onClick={handleShare} className="text-white/70 hover:text-white p-1 cursor-pointer">
                <Share2 size={16} />
              </button>
            )}

            {/* Fullscreen */}
            <button onClick={toggleFullscreen} className="text-white/70 hover:text-white p-1 cursor-pointer">
              {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
