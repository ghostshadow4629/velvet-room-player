import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Bell,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Compass,
  FastForward,
  GripVertical,
  Heart,
  Home,
  Library,
  ListMusic,
  ListPlus,
  Maximize2,
  Menu,
  MoreHorizontal,
  Moon,
  Pause,
  Play,
  Plus,
  Repeat2,
  Rewind,
  Search,
  Shuffle,
  SkipBack,
  SkipForward,
  Sun,
  Trash2,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';

type Track = {
  id: number;
  title: string;
  artist: string;
  album: string;
  length: string;
  seconds: number;
  cover: string;
  audioUrl: string;
  accent: string;
  glow: string;
};

type Artist = {
  name: string;
  genre: string;
  image: string;
};

type RepeatMode = 'off' | 'all' | 'one';
type PlaylistTracks = Record<string, number[]>;

const artwork = (background: string, foreground: string, label: string) =>
  `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"><rect width="400" height="400" fill="${background}"/><circle cx="335" cy="40" r="170" fill="none" stroke="${foreground}" stroke-opacity=".35" stroke-width="2"/><circle cx="335" cy="40" r="120" fill="none" stroke="${foreground}" stroke-opacity=".3" stroke-width="2"/><circle cx="335" cy="40" r="54" fill="none" stroke="${foreground}" stroke-opacity=".24" stroke-width="1"/><path d="M0 308 Q150 225 400 310 V400 H0Z" fill="${foreground}" fill-opacity=".18"/><text x="28" y="345" fill="${foreground}" font-family="sans-serif" font-size="28" font-weight="700" letter-spacing="2">${label}</text></svg>`)}`;

const tracks: Track[] = [
  {
    id: 1,
    title: 'Roads',
    artist: 'Portishead',
    album: 'Dummy',
    length: '5:02',
    seconds: 302,
    cover: artwork('#26221f', '#f0a06c', 'P'),
    audioUrl: 'https://your-direct-link.com/roads.mp3',
    accent: '#f0a06c',
    glow: 'rgba(240,160,108,0.35)',
  },
  {
    id: 2,
    title: 'Song two',
    artist: 'Burial',
    album: 'Untrue',
    length: '4:10',
    seconds: 250,
    cover: artwork('#3f4648', '#f1c478', 'B'),
    audioUrl: 'https://your-direct-link.com/song2.mp3',
    accent: '#f1c478',
    glow: 'rgba(241,196,120,0.35)',
  },
];


const artists: Artist[] = [
  { name: 'Portishead', genre: 'Bristol, UK', image: artwork('#26221f', '#f0a06c', 'P') },
  { name: 'Burial', genre: 'London, UK', image: artwork('#3f4648', '#f1c478', 'B') },
  { name: 'Sade', genre: 'Ibadan, Nigeria', image: artwork('#8e4c35', '#ead5b2', 'S') },
  { name: 'Mazzy Star', genre: 'Santa Monica, US', image: artwork('#746b73', '#f2b76c', 'M') },
  { name: 'Nils Frahm', genre: 'Hamburg, DE', image: artwork('#bd886e', '#2b1e1a', 'N') },
  { name: 'Frank Ocean', genre: 'Long Beach, US', image: artwork('#d58b65', '#fff1cf', 'F') },
  { name: 'SZA', genre: 'St. Louis, US', image: artwork('#715d7e', '#f6c27d', 'S') },
  { name: 'The Weeknd', genre: 'Toronto, CA', image: artwork('#bd4c32', '#ffd086', 'W') },
  { name: 'Billie Eilish', genre: 'Los Angeles, US', image: artwork('#5c7280', '#f5d6b3', 'B') },
  { name: 'Arctic Monkeys', genre: 'Sheffield, UK', image: artwork('#2a3338', '#e68f50', 'A') },
];

const playlists = [
  { id: 'night-drive', eyebrow: 'Playlist / 01', title: 'Night drive, no destination', count: '28 tracks · 1h 58m', className: 'featured' },
  { id: 'after-hours', eyebrow: 'Playlist / 02', title: 'After hours', count: '14 tracks · 52m', className: 'midnight' },
  { id: 'slow-sunday', eyebrow: 'Playlist / 03', title: 'Slow sunday', count: '21 tracks · 1h 21m', className: 'sunday' },
];

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${mins}:${secs}`;
}

function readStored<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const stored = window.localStorage.getItem(key);
    return stored ? JSON.parse(stored) as T : fallback;
  } catch {
    return fallback;
  }
}

function App() {
  const [activeNav, setActiveNav] = useState('Home');
  const [query, setQuery] = useState('');
  const [currentId, setCurrentId] = useState(1);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(tracks[0].seconds);
  const [liked, setLiked] = useState<number[]>(() => readStored('velvet-room-liked', [2, 5]));
  const [queued, setQueued] = useState<number[]>([7, 8, 9]);
  const [volume, setVolume] = useState(() => readStored('velvet-room-volume', 0.68));
  const [muted, setMuted] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>(() => readStored('velvet-room-theme', 'dark'));
  const [shuffleEnabled, setShuffleEnabled] = useState(false);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>('off');
  const [queueOpen, setQueueOpen] = useState(false);
  const [nowPlayingOpen, setNowPlayingOpen] = useState(false);
  const [playlistOpen, setPlaylistOpen] = useState(false);
  const [playlistTarget, setPlaylistTarget] = useState<number | null>(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState('Night drive, no destination');
  const [playlistTracks, setPlaylistTracks] = useState<PlaylistTracks>(() => readStored('velvet-room-playlists', {
    'night-drive': [1, 2, 5, 7],
    'after-hours': [4, 6, 8, 9],
    'slow-sunday': [3, 10, 11, 12],
  }));
  const [visualizerBars, setVisualizerBars] = useState<number[]>(() => Array.from({ length: 28 }, () => 8));
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceCreatedRef = useRef(false);
  const stateRef = useRef({ currentId, queued, shuffleEnabled, repeatMode });
  const playNextRef = useRef<() => void>(() => undefined);

  const currentTrack = tracks.find((track) => track.id === currentId) ?? tracks[0];
  const filteredTracks = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return tracks;
    return tracks.filter((track) =>
      [track.title, track.artist, track.album].some((value) => value.toLowerCase().includes(normalized)),
    );
  }, [query]);
  const queueTracks = queued
    .map((id) => tracks.find((track) => track.id === id))
    .filter((track): track is Track => Boolean(track));

  stateRef.current = { currentId, queued, shuffleEnabled, repeatMode };

  useEffect(() => {
    window.localStorage.setItem('velvet-room-liked', JSON.stringify(liked));
  }, [liked]);

  useEffect(() => {
    window.localStorage.setItem('velvet-room-volume', JSON.stringify(volume));
  }, [volume]);

  useEffect(() => {
    window.localStorage.setItem('velvet-room-theme', JSON.stringify(theme));
  }, [theme]);

  useEffect(() => {
    window.localStorage.setItem('velvet-room-playlists', JSON.stringify(playlistTracks));
  }, [playlistTracks]);

  const setupAnalyser = () => {
    const audio = audioRef.current;
    if (!audio || sourceCreatedRef.current || typeof window === 'undefined') return;
    try {
      const AudioContextClass = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return;
      const context = new AudioContextClass();
      const source = context.createMediaElementSource(audio);
      const analyser = context.createAnalyser();
      analyser.fftSize = 64;
      source.connect(analyser);
      analyser.connect(context.destination);
      audioContextRef.current = context;
      analyserRef.current = analyser;
      sourceCreatedRef.current = true;
    } catch {
      // A browser can reject a second media-element source; the CSS fallback still animates.
    }
  };

  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'metadata';
    audio.volume = volume;
    audioRef.current = audio;

    const syncProgress = () => setProgress(audio.currentTime);
    const syncDuration = () => {
      if (Number.isFinite(audio.duration) && audio.duration > 0) setDuration(audio.duration);
    };
    const advanceTrack = () => playNextRef.current();
    const stopOnError = () => setPlaying(false);

    audio.addEventListener('timeupdate', syncProgress);
    audio.addEventListener('loadedmetadata', syncDuration);
    audio.addEventListener('durationchange', syncDuration);
    audio.addEventListener('ended', advanceTrack);
    audio.addEventListener('error', stopOnError);

    return () => {
      audio.pause();
      audio.removeEventListener('timeupdate', syncProgress);
      audio.removeEventListener('loadedmetadata', syncDuration);
      audio.removeEventListener('durationchange', syncDuration);
      audio.removeEventListener('ended', advanceTrack);
      audio.removeEventListener('error', stopOnError);
      audio.src = '';
      audioRef.current = null;
      void audioContextRef.current?.close();
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.src = currentTrack.audioUrl;
    audio.load();
    setProgress(0);
    setDuration(currentTrack.seconds);
    if (playing) {
      void audioContextRef.current?.resume();
      void audio.play().catch(() => setPlaying(false));
    }
  }, [currentTrack.audioUrl]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = muted ? 0 : volume;
    if (playing) {
      void audioContextRef.current?.resume();
      void audio.play().catch(() => setPlaying(false));
    } else {
      audio.pause();
    }
  }, [playing, muted, volume]);

  useEffect(() => {
    let frame = 0;
    const draw = () => {
      const analyser = analyserRef.current;
      if (analyser) {
        const values = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(values);
        setVisualizerBars(Array.from(values.slice(0, 28)).map((value) => Math.max(5, Math.round(value / 3))));
      } else {
        setVisualizerBars(Array.from({ length: 28 }, (_, index) => playing ? 8 + Math.round(Math.abs(Math.sin(Date.now() / 180 + index)) * 25) : 7 + (index % 3)));
      }
      frame = requestAnimationFrame(draw);
    };
    if (playing) frame = requestAnimationFrame(draw);
    else setVisualizerBars(Array.from({ length: 28 }, (_, index) => 7 + (index % 3)));
    return () => cancelAnimationFrame(frame);
  }, [playing]);

  const chooseTrack = (id: number) => {
    if (id === currentId) {
      setProgress(0);
      if (audioRef.current) audioRef.current.currentTime = 0;
      setPlaying(true);
      return;
    }
    setCurrentId(id);
    setProgress(0);
    setPlaying(true);
  };

  const playNext = () => {
    const state = stateRef.current;
    if (state.repeatMode === 'one') {
      if (audioRef.current) audioRef.current.currentTime = 0;
      setProgress(0);
      setPlaying(true);
      return;
    }

    let nextId: number | undefined;
    if (state.shuffleEnabled) {
      const candidates = state.queued.length ? state.queued : tracks.filter((track) => track.id !== state.currentId).map((track) => track.id);
      nextId = candidates[Math.floor(Math.random() * candidates.length)];
      if (state.queued.includes(nextId)) setQueued((items) => items.filter((item) => item !== nextId));
    } else if (state.queued.length) {
      [nextId, ...[]] = state.queued;
      setQueued((items) => items.slice(1));
    } else {
      const index = tracks.findIndex((track) => track.id === state.currentId);
      if (index < tracks.length - 1) nextId = tracks[index + 1].id;
      else if (state.repeatMode === 'all') nextId = tracks[0].id;
    }

    if (nextId) chooseTrack(nextId);
    else setPlaying(false);
  };

  playNextRef.current = playNext;

  const playPrevious = () => {
    if (progress > 5) {
      seekTo(0);
      return;
    }
    const index = tracks.findIndex((track) => track.id === currentId);
    chooseTrack(tracks[(index - 1 + tracks.length) % tracks.length].id);
  };

  const toggleLiked = (id: number) => {
    setLiked((items) => items.includes(id) ? items.filter((item) => item !== id) : [...items, id]);
  };

  const toggleQueue = (id: number) => {
    setQueued((items) => items.includes(id) ? items.filter((item) => item !== id) : [...items, id]);
  };

  const seekTo = (seconds: number) => {
    const next = Math.max(0, Math.min(seconds, duration));
    setProgress(next);
    if (audioRef.current) audioRef.current.currentTime = next;
  };

  const skipBy = (seconds: number) => seekTo(progress + seconds);

  const toggleRepeat = () => {
    setRepeatMode((mode) => mode === 'off' ? 'all' : mode === 'all' ? 'one' : 'off');
  };

  const moveInQueue = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= queued.length) return;
    setQueued((items) => {
      const next = [...items];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  const removeFromQueue = (id: number) => setQueued((items) => items.filter((item) => item !== id));

  const openPlaylistPicker = (id: number) => {
    setPlaylistTarget(id);
    setPlaylistOpen(true);
  };

  const addToPlaylist = (playlistId: string) => {
    if (playlistTarget === null) return;
    setPlaylistTracks((current) => ({
      ...current,
      [playlistId]: current[playlistId]?.includes(playlistTarget) ? current[playlistId] : [...(current[playlistId] ?? []), playlistTarget],
    }));
    setPlaylistOpen(false);
    setPlaylistTarget(null);
  };

  const paletteStyle = { '--accent-color': currentTrack.accent, '--accent-glow': currentTrack.glow } as React.CSSProperties;
  const repeatLabel = repeatMode === 'one' ? 'Repeat current song' : repeatMode === 'all' ? 'Repeat playlist' : 'Repeat off';

  return (
    <div className="app-shell" data-theme={theme} style={paletteStyle}>
      <div className="ambient-gradient" aria-hidden="true" />
      <aside className="sidebar" aria-label="Primary navigation">
        <a className="brand" href="/" onClick={(event) => { event.preventDefault(); setActiveNav('Home'); }} data-testid="link-brand">
          <span className="brand-mark" aria-hidden="true" />
          <span className="brand-name">velvet<em>/</em>room</span>
        </a>
        <nav>
          <div className="nav-section">
            <div className="nav-section-label">Listen</div>
            {[
              { label: 'Home', icon: Home },
              { label: 'Discover', icon: Compass },
              { label: 'Your library', icon: Library },
            ].map(({ label, icon: Icon }) => (
              <button className={`nav-item ${activeNav === label ? 'active' : ''}`} onClick={() => setActiveNav(label)} key={label} data-testid={`button-nav-${label.toLowerCase().replaceAll(' ', '-')}`}>
                <Icon /> <span>{label}</span>
              </button>
            ))}
          </div>
          <div className="nav-section">
            <div className="nav-section-label">Your stuff</div>
            <button className={`nav-item ${activeNav === 'Liked songs' ? 'active' : ''}`} onClick={() => setActiveNav('Liked songs')} data-testid="button-nav-liked-songs"><Heart /> <span>Liked songs</span></button>
            <button className={`nav-item ${activeNav === 'Playlists' ? 'active' : ''}`} onClick={() => setActiveNav('Playlists')} data-testid="button-nav-playlists"><ListMusic /> <span>Playlists</span></button>
          </div>
        </nav>
        <div className="sidebar-bottom">
          <div className="profile-chip" data-testid="profile-current-user">
            <div className="avatar">JM</div>
            <div className="profile-meta"><strong>Jordan M.</strong><span>Personal account</span></div>
            <MoreHorizontal size={16} color="#776b64" />
          </div>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div className="topbar-title">Home <span>/</span> <b>{activeNav}</b></div>
          <div className="top-actions">
            <label className="search-box" data-testid="search-library">
              <Search size={15} />
              <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search your library" aria-label="Search your library" data-testid="input-library-search" />
            </label>
            <button className="icon-button" aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'} onClick={() => setTheme((value) => value === 'dark' ? 'light' : 'dark')} data-testid="button-toggle-theme">
              {theme === 'dark' ? <Sun /> : <Moon />}
            </button>
            <button className="icon-button" aria-label="Notifications" data-testid="button-notifications"><Bell /></button>
            <button className="icon-button mobile-menu" aria-label="Open menu" onClick={() => setMobileNavOpen((open) => !open)} data-testid="button-mobile-menu"><Menu /></button>
          </div>
        </header>

        <div className="content">
          <section className="hero" aria-labelledby="welcome-heading">
            <div className="hero-copy">
              <div className="eyebrow">Thursday, 11:48 pm · listening room open</div>
              <h1 id="welcome-heading">Make room<br />for <em>the good stuff.</em></h1>
              <p className="hero-description">A quieter corner of the internet for records that stay with you. Pick a side, drop the needle, and let the evening take its shape.</p>
              <div className="hero-actions">
                <button className="accent-button" onClick={() => setNowPlayingOpen(true)}><Maximize2 size={15} /> Open now playing</button>
                <span className="theme-note"><span className="theme-dot" /> {theme === 'dark' ? 'Dark room' : 'Daylight room'}</span>
              </div>
            </div>
            <button className={`hero-stamp ${playing ? 'is-playing' : ''}`} onClick={() => setNowPlayingOpen(true)} aria-label="Open full-screen now playing">
              <div className="stamp-top"><span>Now spinning</span><span className="stamp-orange">● {formatTime(progress)}</span></div>
              <div className="hero-disc"><img src={currentTrack.cover} alt="" /></div>
              <div className="stamp-bottom"><strong>{currentTrack.title}</strong><span>{currentTrack.artist} · {currentTrack.album}</span></div>
            </button>
          </section>

          <section aria-labelledby="recent-heading">
            <div className="section-heading">
              <h2 id="recent-heading">{query ? 'Search results' : 'Recently in rotation'}</h2>
              <button className="text-button" onClick={() => setQuery('')} data-testid="button-clear-search">{query ? 'Clear search' : 'View all'} <ChevronRight size={12} style={{ display: 'inline', verticalAlign: '-2px' }} /></button>
            </div>
            {filteredTracks.length ? (
              <div className="recent-layout">
                <div className="track-list" role="list" data-testid="track-list">
                  {filteredTracks.map((track, index) => (
                    <div className={`track-row ${track.id === currentId ? 'is-playing' : ''}`} role="listitem" key={track.id} data-testid={`row-track-${track.id}`}>
                      <span className="track-index">{String(index + 1).padStart(2, '0')}</span>
                      <div className="track-main">
                        <span className="track-cover-wrap">
                          <img className="track-cover" src={track.cover} alt="" />
                          <button className="play-tiny" onClick={() => chooseTrack(track.id)} aria-label={`${track.id === currentId && playing ? 'Pause' : 'Play'} ${track.title}`} data-testid={`button-play-track-${track.id}`}>
                            {track.id === currentId && playing ? <Pause /> : <Play />}
                          </button>
                        </span>
                        <div className="track-info"><span className="track-title">{track.title}</span><span className="track-artist">{track.artist}</span></div>
                      </div>
                      <span className="track-album">{track.album}</span>
                      <span className="track-length">{track.length}</span>
                      <div className="track-actions">
                        <button className={`icon-button heart-button ${liked.includes(track.id) ? 'liked' : ''}`} onClick={() => toggleLiked(track.id)} aria-label={`${liked.includes(track.id) ? 'Remove from' : 'Add to'} liked songs`} data-testid={`button-like-track-${track.id}`}><Heart size={15} fill={liked.includes(track.id) ? 'currentColor' : 'none'} /></button>
                        <button className="icon-button row-action" onClick={() => openPlaylistPicker(track.id)} aria-label={`Add ${track.title} to playlist`} data-testid={`button-add-playlist-${track.id}`}><ListPlus size={15} /></button>
                        <button className={`icon-button row-action ${queued.includes(track.id) ? 'queued' : ''}`} onClick={() => toggleQueue(track.id)} aria-label={`${queued.includes(track.id) ? 'Remove from' : 'Add to'} queue`} data-testid={`button-queue-track-${track.id}`}><Plus size={15} /></button>
                      </div>
                    </div>
                  ))}
                </div>
                <aside className="queue-card">
                  <div className="eyebrow">Up next · {queueTracks.length} tracks</div>
                  <h3>Keep the<br />night moving.</h3>
                  <p>Your queue is a loose thread. Pull it.</p>
                  <div className="queue-lines">
                    {queueTracks.slice(0, 3).map((track) => (
                      <div className="queue-line" key={track.id}><span>{track.artist}</span><strong>{track.title}</strong></div>
                    ))}
                    {!queueTracks.length && <div className="queue-line"><span>Queue is clear</span><strong>Add a track</strong></div>}
                  </div>
                  <button className="queue-link" onClick={() => setQueueOpen(true)}><ListMusic size={13} /> Manage play queue <ChevronRight size={13} /></button>
                </aside>
              </div>
            ) : (
              <div className="empty-state" data-testid="empty-search-state">Nothing in the room matches “{query}”. Try an artist, album, or track.</div>
            )}
          </section>

          <section aria-labelledby="playlists-heading">
            <div className="section-heading"><h2 id="playlists-heading">A few good places to start</h2><button className="text-button" onClick={() => setActiveNav('Playlists')} data-testid="button-view-playlists">All playlists <ChevronRight size={12} style={{ display: 'inline', verticalAlign: '-2px' }} /></button></div>
            <div className="playlists">
              {playlists.map((playlist) => (
                <button className={`playlist-card ${playlist.className}`} key={playlist.id} onClick={() => { setSelectedPlaylist(playlist.title); setQueued(playlistTracks[playlist.id] ?? []); }} data-testid={`button-playlist-${playlist.id}`}>
                  <div className="eyebrow">{playlist.eyebrow}</div><h3>{playlist.title}</h3><p>{selectedPlaylist === playlist.title ? 'Selected · ' : ''}{playlist.count}</p><span className="record-art" aria-hidden="true" />
                </button>
              ))}
            </div>
          </section>

          <section aria-labelledby="artists-heading">
            <div className="section-heading"><h2 id="artists-heading">Artists to spend time with</h2><button className="text-button" onClick={() => setActiveNav('Discover')} data-testid="button-view-artists">Browse artists <ChevronRight size={12} style={{ display: 'inline', verticalAlign: '-2px' }} /></button></div>
            <div className="artist-grid">
              {artists.map((artist) => (
                <button className="artist-card" key={artist.name} onClick={() => setQuery(artist.name)} data-testid={`button-artist-${artist.name.toLowerCase().replaceAll(' ', '-')}`}>
                  <img className="artist-image" src={artist.image} alt="" /><strong>{artist.name}</strong><span>{artist.genre}</span>
                </button>
              ))}
            </div>
          </section>
        </div>
      </main>

      {mobileNavOpen && (
        <div className="mobile-nav" aria-label="Mobile navigation">
          {[
            { label: 'Home', icon: Home },
            { label: 'Discover', icon: Compass },
            { label: 'Library', icon: Library },
            { label: 'Liked', icon: Heart },
          ].map(({ label, icon: Icon }) => (
            <button className={activeNav === label || (label === 'Library' && activeNav === 'Your library') ? 'active' : ''} key={label} onClick={() => { setActiveNav(label === 'Library' ? 'Your library' : label); setMobileNavOpen(false); }} data-testid={`button-mobile-nav-${label.toLowerCase()}`}><Icon /><span>{label}</span></button>
          ))}
          <button onClick={() => setMobileNavOpen(false)} aria-label="Close menu" data-testid="button-close-mobile-menu"><X /><span>Close</span></button>
        </div>
      )}

      <footer className="player" aria-label="Music player">
        <div className="now-playing">
          <button className={`now-playing-art ${playing ? 'is-spinning' : ''}`} onClick={() => setNowPlayingOpen(true)} aria-label="Open now playing"><img src={currentTrack.cover} alt="" data-testid="img-current-track" /></button>
          <div className="now-playing-info"><strong data-testid="text-current-track">{currentTrack.title}</strong><span>{currentTrack.artist}</span></div>
          <button className={`icon-button player-heart ${liked.includes(currentTrack.id) ? 'liked' : ''}`} onClick={() => toggleLiked(currentTrack.id)} aria-label="Like current track" data-testid="button-like-current"><Heart size={15} fill={liked.includes(currentTrack.id) ? 'currentColor' : 'none'} /></button>
        </div>
        <div className="player-center">
          <div className="transport">
            <button onClick={() => skipBy(-15)} aria-label="Skip back 15 seconds" data-testid="button-skip-back"><Rewind size={15} /><small>15</small></button>
            <button onClick={playPrevious} aria-label="Previous track" data-testid="button-previous"><SkipBack size={16} fill="currentColor" /></button>
            <button className="main-play" onClick={() => setPlaying((value) => !value)} aria-label={playing ? 'Pause' : 'Play'} data-testid="button-play-pause">{playing ? <Pause /> : <Play />}</button>
            <button onClick={playNext} aria-label="Next track" data-testid="button-next"><SkipForward size={16} fill="currentColor" /></button>
            <button onClick={() => skipBy(15)} aria-label="Skip forward 15 seconds" data-testid="button-skip-forward"><FastForward size={15} /><small>15</small></button>
          </div>
          <div className="progress-row">
            <span>{formatTime(progress)}</span>
            <input className="progress-slider" type="range" min="0" max={duration} step="0.1" value={Math.min(progress, duration)} onChange={(event) => seekTo(Number(event.target.value))} aria-label="Track progress" data-testid="slider-progress" />
            <span>{formatTime(duration)}</span>
          </div>
        </div>
        <div className="player-right">
          <button className={`icon-button state-button ${shuffleEnabled ? 'active' : ''}`} onClick={() => setShuffleEnabled((value) => !value)} aria-label={shuffleEnabled ? 'Turn shuffle off' : 'Turn shuffle on'} data-testid="button-shuffle"><Shuffle size={15} /></button>
          <button className={`icon-button state-button ${repeatMode !== 'off' ? 'active' : ''}`} onClick={toggleRepeat} aria-label={repeatLabel} title={repeatLabel} data-testid="button-repeat"><Repeat2 size={15} /><span className="repeat-badge">{repeatMode === 'one' ? '1' : ''}</span></button>
          <button className="icon-button" onClick={() => setMuted((value) => !value)} aria-label={muted ? 'Unmute' : 'Mute'} data-testid="button-mute">{muted || volume === 0 ? <VolumeX size={15} /> : <Volume2 size={15} />}</button>
          <input className="volume-slider" type="range" min="0" max="1" step="0.01" value={muted ? 0 : volume} onChange={(event) => { setVolume(Number(event.target.value)); setMuted(false); }} aria-label="Volume" data-testid="slider-volume" />
          <button className="icon-button" onClick={() => setQueueOpen(true)} aria-label="Open play queue" data-testid="button-open-queue"><ListMusic size={15} /></button>
        </div>
      </footer>

      {queueOpen && (
        <div className="modal-backdrop" role="presentation" onClick={() => setQueueOpen(false)}>
          <section className="modal-panel queue-panel" role="dialog" aria-modal="true" aria-labelledby="queue-title" onClick={(event) => event.stopPropagation()}>
            <div className="modal-header"><div><div className="eyebrow">Listening room</div><h2 id="queue-title">Play queue <span>{queueTracks.length}</span></h2></div><button className="icon-button" onClick={() => setQueueOpen(false)} aria-label="Close queue"><X /></button></div>
            <div className="queue-now"><img src={currentTrack.cover} alt="" /><div><span>Now playing</span><strong>{currentTrack.title}</strong><small>{currentTrack.artist}</small></div><button className="icon-button" onClick={() => setNowPlayingOpen(true)} aria-label="Open now playing"><Maximize2 size={16} /></button></div>
            <div className="queue-modal-list">
              {queueTracks.length ? queueTracks.map((track, index) => (
                <div className="queue-modal-item" key={track.id}>
                  <GripVertical size={15} className="drag-grip" />
                  <span className="queue-number">{String(index + 1).padStart(2, '0')}</span>
                  <img src={track.cover} alt="" />
                  <div><strong>{track.title}</strong><span>{track.artist}</span></div>
                  <div className="queue-item-actions">
                    <button className="icon-button" onClick={() => moveInQueue(index, -1)} disabled={index === 0} aria-label={`Move ${track.title} up`}><ChevronUp size={15} /></button>
                    <button className="icon-button" onClick={() => moveInQueue(index, 1)} disabled={index === queueTracks.length - 1} aria-label={`Move ${track.title} down`}><ChevronDown size={15} /></button>
                    <button className="icon-button danger-button" onClick={() => removeFromQueue(track.id)} aria-label={`Remove ${track.title} from queue`}><Trash2 size={15} /></button>
                  </div>
                </div>
              )) : <div className="queue-empty"><ListMusic size={24} /><strong>Your queue is empty</strong><span>Use the plus buttons beside a song to add it here.</span></div>}
            </div>
            <div className="modal-footer"><button className="subtle-button" onClick={() => setQueued([])}>Clear queue</button><button className="accent-button" onClick={() => { setQueueOpen(false); if (queueTracks[0]) chooseTrack(queueTracks[0].id); }}>Play queue <Play size={14} fill="currentColor" /></button></div>
          </section>
        </div>
      )}

      {nowPlayingOpen && (
        <div className="modal-backdrop now-playing-backdrop" role="presentation" onClick={() => setNowPlayingOpen(false)}>
          <section className="now-playing-modal" role="dialog" aria-modal="true" aria-labelledby="now-playing-title" onClick={(event) => event.stopPropagation()}>
            <button className="icon-button modal-close" onClick={() => setNowPlayingOpen(false)} aria-label="Close now playing"><X /></button>
            <div className="full-screen-art-wrap"><div className={`full-screen-art ${playing ? 'is-spinning' : ''}`}><img src={currentTrack.cover} alt="" /></div><div className="art-ring ring-one" /><div className="art-ring ring-two" /></div>
            <div className="full-screen-copy"><div className="eyebrow">Now playing · {currentTrack.album}</div><h2 id="now-playing-title">{currentTrack.title}</h2><p>{currentTrack.artist}</p></div>
            <div className="visualizer" aria-label="Audio reactive visualizer">{visualizerBars.map((height, index) => <span key={index} style={{ height: `${height}px` }} />)}</div>
            <div className="full-progress"><span>{formatTime(progress)}</span><input className="progress-slider" type="range" min="0" max={duration} step="0.1" value={Math.min(progress, duration)} onChange={(event) => seekTo(Number(event.target.value))} aria-label="Now playing progress" /><span>{formatTime(duration)}</span></div>
            <div className="full-transport"><button className={`icon-button state-button ${shuffleEnabled ? 'active' : ''}`} onClick={() => setShuffleEnabled((value) => !value)} aria-label="Toggle shuffle"><Shuffle /></button><button className="icon-button" onClick={playPrevious} aria-label="Previous track"><SkipBack /></button><button className="main-play" onClick={() => setPlaying((value) => !value)} aria-label={playing ? 'Pause' : 'Play'}>{playing ? <Pause /> : <Play />}</button><button className="icon-button" onClick={playNext} aria-label="Next track"><SkipForward /></button><button className={`icon-button state-button ${repeatMode !== 'off' ? 'active' : ''}`} onClick={toggleRepeat} aria-label={repeatLabel}><Repeat2 /></button></div>
            <div className="full-screen-meta"><button className={`icon-button ${liked.includes(currentTrack.id) ? 'liked' : ''}`} onClick={() => toggleLiked(currentTrack.id)} aria-label="Like current song"><Heart fill={liked.includes(currentTrack.id) ? 'currentColor' : 'none'} /></button><button className="subtle-button" onClick={() => openPlaylistPicker(currentTrack.id)}><ListPlus size={15} /> Add to playlist</button><button className="subtle-button" onClick={() => setQueueOpen(true)}><ListMusic size={15} /> Queue</button></div>
          </section>
        </div>
      )}

      {playlistOpen && (
        <div className="modal-backdrop" role="presentation" onClick={() => setPlaylistOpen(false)}>
          <section className="modal-panel playlist-panel" role="dialog" aria-modal="true" aria-labelledby="playlist-picker-title" onClick={(event) => event.stopPropagation()}>
            <div className="modal-header"><div><div className="eyebrow">Save this track</div><h2 id="playlist-picker-title">Add to playlist</h2></div><button className="icon-button" onClick={() => setPlaylistOpen(false)} aria-label="Close playlist picker"><X /></button></div>
            <div className="playlist-picker-track"><img src={tracks.find((track) => track.id === playlistTarget)?.cover ?? currentTrack.cover} alt="" /><div><strong>{tracks.find((track) => track.id === playlistTarget)?.title ?? currentTrack.title}</strong><span>{tracks.find((track) => track.id === playlistTarget)?.artist ?? currentTrack.artist}</span></div></div>
            <div className="playlist-options">{playlists.map((playlist) => <button className="playlist-option" key={playlist.id} onClick={() => addToPlaylist(playlist.id)}><span className={`playlist-option-art ${playlist.className}`}><ListMusic size={17} /></span><span><strong>{playlist.title}</strong><small>{playlistTracks[playlist.id]?.length ?? 0} saved tracks</small></span><Plus size={17} /></button>)}</div>
          </section>
        </div>
      )}
    </div>
  );
}

export default App;