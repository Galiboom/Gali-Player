import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Clock3,
  Heart,
  Home,
  Library,
  ListMusic,
  Lock,
  LogIn,
  LogOut,
  Mail,
  Pause,
  Play,
  Repeat2,
  Search,
  Shuffle,
  SkipBack,
  SkipForward,
  Sparkles,
  User,
  Volume2,
  Zap,
} from 'lucide-react'
import { tracks } from './data/tracks.js'

const navItems = [
  { label: '首页', icon: Home },
  { label: '发现', icon: Sparkles },
  { label: '音乐库', icon: Library },
  { label: '歌单', icon: ListMusic },
]

const waveBars = [42, 76, 54, 94, 48, 68, 86, 40, 72, 58, 90, 46]
const demoAccount = {
  name: 'GaLi 用户',
  email: 'demo@gali.player',
}

function formatTime(value) {
  if (!Number.isFinite(value)) return '0:00'
  const minutes = Math.floor(value / 60)
  const seconds = Math.floor(value % 60).toString().padStart(2, '0')
  return `${minutes}:${seconds}`
}

function getSavedUser() {
  try {
    const saved = localStorage.getItem('gali-player-user')
    return saved ? JSON.parse(saved) : null
  } catch {
    return null
  }
}

// ─── 发现页面 ───────────────────────────────────────────────────────────────
function DiscoverPage({ selectTrack, currentTrack, likedTracks, toggleLike }) {
  const moods = ['专注', '放松', '治愈', '活力', '深夜']
  const moodTracks = (mood) => tracks.filter((t) => t.mood === mood).slice(0, 4)

  return (
    <motion.section
      className="dashboard-grid"
      key="discover"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >
      <div className="content-grid">
        <div className="section-heading">
          <div>
            <span className="eyebrow">按心情探索</span>
            <h2>发现音乐</h2>
          </div>
        </div>
        {moods.map((mood) => {
          const list = moodTracks(mood)
          if (!list.length) return null
          return (
            <div key={mood} style={{ marginBottom: '2rem' }}>
              <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                # {mood}
              </h3>
              <div className="track-grid">
                {list.map((track) => (
                  <motion.button
                    className={track.id === currentTrack.id ? 'track-card active' : 'track-card'}
                    key={track.id}
                    onClick={() => selectTrack(track.id)}
                    whileHover={{ y: -6, scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    style={{ '--track-color': track.color, '--track-accent': track.accent }}
                  >
                    <div className="cover-art"><span /></div>
                    <div className="track-meta">
                      <strong>{track.title}</strong>
                      <span>{track.artist}</span>
                    </div>
                    <div className="track-footer">
                      <small>{track.mood}</small>
                      <small>{track.duration}</small>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </motion.section>
  )
}

// ─── 音乐库页面 ─────────────────────────────────────────────────────────────
function LibraryPage({ selectTrack, currentTrack, likedTracks, toggleLike }) {
  const [sortBy, setSortBy] = useState('title')

  const sorted = useMemo(() => {
    return [...tracks].sort((a, b) => {
      if (sortBy === 'title') return a.title.localeCompare(b.title)
      if (sortBy === 'artist') return a.artist.localeCompare(b.artist)
      if (sortBy === 'album') return a.album.localeCompare(b.album)
      return 0
    })
  }, [sortBy])

  return (
    <motion.section
      className="dashboard-grid"
      key="library"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >
      <div className="content-grid">
        <div className="section-heading">
          <div>
            <span className="eyebrow">全部歌曲</span>
            <h2>我的音乐库</h2>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {['title', 'artist', 'album'].map((key) => (
              <button
                key={key}
                onClick={() => setSortBy(key)}
                className={sortBy === key ? 'ghost-button active' : 'ghost-button'}
                style={{ fontSize: '0.78rem', padding: '0.3rem 0.75rem' }}
              >
                {{ title: '歌名', artist: '歌手', album: '专辑' }[key]}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {sorted.map((track, i) => (
            <motion.button
              key={track.id}
              className={track.id === currentTrack.id ? 'track-card active' : 'track-card'}
              onClick={() => selectTrack(track.id)}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.03 }}
              whileHover={{ x: 6 }}
              style={{
                '--track-color': track.color,
                '--track-accent': track.accent,
                flexDirection: 'row',
                alignItems: 'center',
                gap: '1rem',
                padding: '0.75rem 1rem',
                textAlign: 'left',
              }}
            >
              <span style={{ color: 'var(--text-muted)', width: '1.5rem', fontSize: '0.8rem' }}>{i + 1}</span>
              <div className="cover-art" style={{ width: '2.5rem', height: '2.5rem', flexShrink: 0 }}><span /></div>
              <div style={{ flex: 1 }}>
                <strong style={{ display: 'block' }}>{track.title}</strong>
                <span style={{ fontSize: '0.8rem' }}>{track.artist}</span>
              </div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{track.album}</span>
              <button
                className={likedTracks.has(track.id) ? 'icon-button liked' : 'icon-button'}
                onClick={(e) => { e.stopPropagation(); toggleLike(track.id) }}
              >
                <Heart size={15} fill={likedTracks.has(track.id) ? 'currentColor' : 'none'} />
              </button>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', width: '3rem', textAlign: 'right' }}>{track.duration}</span>
            </motion.button>
          ))}
        </div>
      </div>
    </motion.section>
  )
}

// ─── 歌单页面 ───────────────────────────────────────────────────────────────
function PlaylistPage({ selectTrack, currentTrack, likedTracks, toggleLike }) {
  const likedList = tracks.filter((t) => likedTracks.has(t.id))
  const recentList = tracks.slice(0, 5)

  const Playlist = ({ title, subtitle, list }) => (
    <div style={{ marginBottom: '2.5rem' }}>
      <div className="section-heading" style={{ marginBottom: '1rem' }}>
        <div>
          <span className="eyebrow">{subtitle}</span>
          <h2>{title}</h2>
        </div>
        <span className="result-count">{list.length} 首</span>
      </div>
      {list.length === 0 ? (
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', padding: '1.5rem 0' }}>
          暂无歌曲，去收藏一些吧 ♪
        </p>
      ) : (
        <div className="track-grid">
          {list.map((track) => (
            <motion.button
              className={track.id === currentTrack.id ? 'track-card active' : 'track-card'}
              key={track.id}
              onClick={() => selectTrack(track.id)}
              whileHover={{ y: -6, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              style={{ '--track-color': track.color, '--track-accent': track.accent }}
            >
              <div className="cover-art"><span /></div>
              <div className="track-meta">
                <strong>{track.title}</strong>
                <span>{track.artist}</span>
              </div>
              <div className="track-footer">
                <small>{track.mood}</small>
                <small>{track.duration}</small>
              </div>
            </motion.button>
          ))}
        </div>
      )}
    </div>
  )

  return (
    <motion.section
      className="dashboard-grid"
      key="playlist"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >
      <div className="content-grid">
        <div className="section-heading">
          <div>
            <span className="eyebrow">我的收藏</span>
            <h2>歌单</h2>
          </div>
        </div>
        <Playlist title="我喜欢的音乐" subtitle="已收藏" list={likedList} />
        <Playlist title="最近播放" subtitle="历史记录" list={recentList} />
      </div>
    </motion.section>
  )
}

// ─── 主页面（原有内容）──────────────────────────────────────────────────────
function HomePage({ isPlaying, setIsPlaying, currentTrack, likedTracks, toggleLike, filteredTracks, selectTrack, query, setQuery, nextTrackTitle }) {
  return (
    <>
      <motion.section
        className="hero"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.12 }}
      >
        <div className="hero-copy">
          <span className="eyebrow">精选电台</span>
          <h1>GaLiPlayer</h1>
          <p>暗黑毛玻璃、克制发光、顺滑动效和完整播放控制，让音乐界面既高级又好用。</p>
          <div className="hero-actions">
            <button className="primary-button" onClick={() => setIsPlaying((v) => !v)}>
              {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
              {isPlaying ? '暂停播放' : '开始播放'}
            </button>
            <button className="ghost-button" onClick={() => toggleLike(currentTrack.id)}>
              <Heart size={17} fill={likedTracks.has(currentTrack.id) ? 'currentColor' : 'none'} />
              收藏
            </button>
          </div>
        </div>
        <div className="visual-stack">
          <motion.div
            className="hero-disc"
            animate={{ rotate: isPlaying ? 360 : 0 }}
            transition={{ duration: 13, repeat: isPlaying ? Infinity : 0, ease: 'linear' }}
          >
            <div />
          </motion.div>
          <div className={isPlaying ? 'wave active' : 'wave'} aria-hidden="true">
            {waveBars.map((height, index) => (
              <span key={height + index} style={{ '--bar-height': `${height}%`, '--delay': `${index * 80}ms` }} />
            ))}
          </div>
        </div>
      </motion.section>

      <section className="dashboard-grid">
        <div className="content-grid">
          <div className="section-heading">
            <div>
              <span className="eyebrow">推荐歌曲</span>
              <h2>为此刻准备</h2>
            </div>
            <span className="result-count">{filteredTracks.length} 首歌曲</span>
          </div>
          <div className="track-grid">
            <AnimatePresence mode="popLayout">
              {filteredTracks.map((track) => (
                <motion.button
                  className={track.id === currentTrack.id ? 'track-card active' : 'track-card'}
                  key={track.id}
                  layout
                  onClick={() => selectTrack(track.id)}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  whileHover={{ y: -8, scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  style={{ '--track-color': track.color, '--track-accent': track.accent }}
                >
                  <div className="cover-art"><span /></div>
                  <div className="track-meta">
                    <strong>{track.title}</strong>
                    <span>{track.artist}</span>
                  </div>
                  <div className="track-footer">
                    <small>{track.mood}</small>
                    <small>{track.duration}</small>
                  </div>
                </motion.button>
              ))}
            </AnimatePresence>
          </div>
        </div>

        <aside className="queue-panel glass-panel">
          <div className="section-heading compact">
            <div>
              <span className="eyebrow">播放队列</span>
              <h2>即将播放</h2>
            </div>
            <Clock3 size={18} />
          </div>
          <div className="current-card">
            <div className="mini-cover large" />
            <div>
              <strong>{currentTrack.title}</strong>
              <span>{currentTrack.album}</span>
            </div>
          </div>
          <div className="stats-grid">
            <div>
              <Zap size={16} />
              <strong>{currentTrack.bpm}</strong>
              <span>节拍</span>
            </div>
            <div>
              <Repeat2 size={16} />
              <strong>{nextTrackTitle}</strong>
              <span>下一首</span>
            </div>
          </div>
        </aside>
      </section>
    </>
  )
}

// ─── 主组件 ─────────────────────────────────────────────────────────────────
export default function App() {
  const [activePage, setActivePage] = useState('首页') // ← 新增：当前页面状态
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.75)
  const [query, setQuery] = useState('')
  const [isShuffling, setIsShuffling] = useState(false)
  const [likedTracks, setLikedTracks] = useState(() => new Set([1]))
  const [user, setUser] = useState(getSavedUser)
  const [isAuthOpen, setIsAuthOpen] = useState(false)
  const [authError, setAuthError] = useState('')
  const [authForm, setAuthForm] = useState({ name: '', email: '', password: '', remember: true })
  const audioRef = useRef(null)
  const currentTrack = tracks[currentIndex]

  const filteredTracks = useMemo(() => {
    const keyword = query.trim().toLowerCase()
    if (!keyword) return tracks
    return tracks.filter((track) =>
      [track.title, track.artist, track.album, track.mood].some((v) => v.toLowerCase().includes(keyword)),
    )
  }, [query])

  const progressPercent = duration ? (progress / duration) * 100 : 0
  const nextTrackTitle = tracks[(currentIndex + 1) % tracks.length].title

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume
  }, [volume])

  useEffect(() => {
    if (!audioRef.current) return
    if (isPlaying) audioRef.current.play().catch(() => setIsPlaying(false))
    else audioRef.current.pause()
  }, [isPlaying, currentIndex])

  const selectTrack = (id) => {
    const index = tracks.findIndex((t) => t.id === id)
    if (index < 0) return
    setCurrentIndex(index)
    setProgress(0)
    setIsPlaying(true)
  }

  const nextTrack = () => {
    setCurrentIndex((index) => {
      if (!isShuffling) return (index + 1) % tracks.length
      if (tracks.length < 2) return index
      let next = index
      while (next === index) next = Math.floor(Math.random() * tracks.length)
      return next
    })
    setProgress(0)
    setIsPlaying(true)
  }

  const previousTrack = () => {
    setCurrentIndex((index) => (index - 1 + tracks.length) % tracks.length)
    setProgress(0)
    setIsPlaying(true)
  }

  const toggleLike = (id) => {
    setLikedTracks((current) => {
      const next = new Set(current)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const updateAuthField = (field, value) => {
    setAuthError('')
    setAuthForm((c) => ({ ...c, [field]: value }))
  }

  const completeLogin = (account) => {
    setUser(account)
    if (authForm.remember) localStorage.setItem('gali-player-user', JSON.stringify(account))
    setIsAuthOpen(false)
    setAuthError('')
  }

  const handleLogin = (event) => {
    event.preventDefault()
    const name = authForm.name.trim()
    const email = authForm.email.trim()
    if (!name || !email || !authForm.password) { setAuthError('请填写昵称、邮箱和密码。'); return }
    if (!email.includes('@')) { setAuthError('请输入有效的邮箱地址。'); return }
    if (authForm.password.length < 6) { setAuthError('密码至少需要 6 位。'); return }
    completeLogin({ name, email })
  }

  const handleDemoLogin = () => {
    setAuthForm((c) => ({ ...c, ...demoAccount, password: 'gali2026' }))
    completeLogin(demoAccount)
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem('gali-player-user')
  }

  const onTimeUpdate = () => {
    const audio = audioRef.current
    setProgress(audio.currentTime)
    setDuration(audio.duration || 0)
  }

  const onSeek = (event) => {
    const next = Number(event.target.value)
    audioRef.current.currentTime = next
    setProgress(next)
  }

  // ─── 页面渲染逻辑 ──────────────────────────────────────────────────────────
  const renderPage = () => {
    const sharedProps = { selectTrack, currentTrack, likedTracks, toggleLike }
    switch (activePage) {
      case '发现':
        return <DiscoverPage {...sharedProps} />
      case '音乐库':
        return <LibraryPage {...sharedProps} />
      case '歌单':
        return <PlaylistPage {...sharedProps} />
      default:
        return (
          <HomePage
            {...sharedProps}
            isPlaying={isPlaying}
            setIsPlaying={setIsPlaying}
            filteredTracks={filteredTracks}
            query={query}
            setQuery={setQuery}
            nextTrackTitle={nextTrackTitle}
          />
        )
    }
  }

  return (
    <main
      className="app-shell"
      style={{ '--current-color': currentTrack.color, '--current-accent': currentTrack.accent }}
    >
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <div className="ambient ambient-three" />

      <motion.aside
        className="sidebar glass-panel"
        initial={{ opacity: 0, x: -24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="brand">
          <div className="brand-mark">G</div>
          <div>
            <p>GaLi</p>
            <span>Player</span>
          </div>
        </div>

        <nav className="nav-list" aria-label="主导航">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <motion.button
                className={activePage === item.label ? 'nav-item active' : 'nav-item'} // ← 修复：动态 active
                key={item.label}
                onClick={() => setActivePage(item.label)} // ← 修复：点击切换页面
                whileHover={{ x: 5 }}
                whileTap={{ scale: 0.97 }}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </motion.button>
            )
          })}
        </nav>

        <div className="sidebar-card">
          <span className="pulse-dot" />
          <p>{user ? '已登录' : '游客模式'}</p>
          <strong>{user ? user.name : '深度专注'}</strong>
          <small>{user ? `已收藏 ${likedTracks.size} 首` : '登录后同步听歌偏好'}</small>
        </div>
      </motion.aside>

      <section className="main-stage">
        <motion.header
          className="topbar"
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.08 }}
        >
          <div>
            <span className="eyebrow">欢迎回来</span>
            <h2>{user ? `${user.name} 的私人听歌空间` : '登录后开启私人听歌空间'}</h2>
          </div>
          <div className="topbar-tools">
            <label className="search-box">
              <Search size={17} />
              <input
                placeholder="搜索歌曲、歌手、专辑或心情"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </label>
            {user ? (
              <div className="account-card">
                <div className="avatar" aria-hidden="true">{user.name.slice(0, 1).toUpperCase()}</div>
                <div>
                  <strong>{user.name}</strong>
                  <span>{user.email}</span>
                </div>
                <button className="icon-button" aria-label="退出登录" onClick={handleLogout}>
                  <LogOut size={17} />
                </button>
              </div>
            ) : (
              <button className="login-button" onClick={() => setIsAuthOpen(true)}>
                <LogIn size={17} />
                登录
              </button>
            )}
          </div>
        </motion.header>

        {/* ← 修复：根据 activePage 渲染对应页面，带过渡动画 */}
        <AnimatePresence mode="wait">
          {renderPage()}
        </AnimatePresence>
      </section>

      <motion.footer
        className="player-bar glass-panel"
        initial={{ opacity: 0, y: 34 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, delay: 0.2 }}
      >
        <audio
          ref={audioRef}
          src={currentTrack.src}
          onTimeUpdate={onTimeUpdate}
          onLoadedMetadata={onTimeUpdate}
          onEnded={nextTrack}
        />

        <AnimatePresence mode="wait">
          <motion.div
            className="now-playing"
            key={currentTrack.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
          >
            <div className="mini-cover" />
            <div>
              <strong>{currentTrack.title}</strong>
              <span>{currentTrack.artist}</span>
            </div>
            <button
              className={likedTracks.has(currentTrack.id) ? 'icon-button liked' : 'icon-button'}
              aria-label="收藏歌曲"
              onClick={() => toggleLike(currentTrack.id)}
            >
              <Heart size={17} fill={likedTracks.has(currentTrack.id) ? 'currentColor' : 'none'} />
            </button>
          </motion.div>
        </AnimatePresence>

        <div className="controls">
          <div className="control-buttons">
            <button
              className={isShuffling ? 'icon-button active' : 'icon-button'}
              aria-label="随机播放"
              onClick={() => setIsShuffling((v) => !v)}
            >
              <Shuffle size={17} />
            </button>
            <button className="icon-button" onClick={previousTrack} aria-label="上一首">
              <SkipBack size={19} />
            </button>
            <motion.button
              className="play-button"
              onClick={() => setIsPlaying((v) => !v)}
              aria-label={isPlaying ? '暂停' : '播放'}
              whileTap={{ scale: 0.94 }}
            >
              {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
            </motion.button>
            <button className="icon-button" onClick={nextTrack} aria-label="下一首">
              <SkipForward size={19} />
            </button>
          </div>
          <div className="progress-row">
            <span>{formatTime(progress)}</span>
            <input
              className="range"
              max={duration || 0}
              min="0"
              onChange={onSeek}
              step="1"
              type="range"
              value={progress}
              style={{ '--range-progress': `${progressPercent}%` }}
            />
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        <label className="volume-control">
          <Volume2 size={18} />
          <input
            className="range"
            max="1"
            min="0"
            onChange={(e) => setVolume(Number(e.target.value))}
            step="0.01"
            type="range"
            value={volume}
            style={{ '--range-progress': `${volume * 100}%` }}
          />
        </label>
      </motion.footer>

      <AnimatePresence>
        {isAuthOpen && (
          <motion.div
            className="auth-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.form
              className="auth-modal glass-panel"
              onSubmit={handleLogin}
              initial={{ opacity: 0, y: 28, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
              transition={{ duration: 0.28 }}
            >
              <div className="auth-header">
                <div className="brand-mark">G</div>
                <div>
                  <span className="eyebrow">账号登录</span>
                  <h2>登录 GaLiPlayer</h2>
                </div>
              </div>
              <p className="auth-copy">登录后可保留你的账号信息、收藏状态和私人播放空间展示。</p>
              <label className="auth-field">
                <User size={17} />
                <input autoFocus placeholder="昵称" value={authForm.name} onChange={(e) => updateAuthField('name', e.target.value)} />
              </label>
              <label className="auth-field">
                <Mail size={17} />
                <input placeholder="邮箱" type="email" value={authForm.email} onChange={(e) => updateAuthField('email', e.target.value)} />
              </label>
              <label className="auth-field">
                <Lock size={17} />
                <input placeholder="密码" type="password" value={authForm.password} onChange={(e) => updateAuthField('password', e.target.value)} />
              </label>
              <label className="remember-row">
                <input checked={authForm.remember} type="checkbox" onChange={(e) => updateAuthField('remember', e.target.checked)} />
                <span>记住登录状态</span>
              </label>
              {authError && <p className="auth-error">{authError}</p>}
              <div className="auth-actions">
                <button className="primary-button" type="submit"><LogIn size={17} />登录</button>
                <button className="ghost-button" type="button" onClick={handleDemoLogin}>演示登录</button>
              </div>
              <button className="auth-close" type="button" onClick={() => setIsAuthOpen(false)}>稍后再说</button>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
