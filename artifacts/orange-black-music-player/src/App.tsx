import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Bell,
  ChevronRight,
  Compass,
  Heart,
  Home,
  Library,
  ListMusic,
  Menu,
  MoreHorizontal,
  Pause,
  Play,
  Plus,
  Repeat2,
  Search,
  Shuffle,
  SkipBack,
  SkipForward,
  Volume2,
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
};

type Artist = {
  name: string;
  genre: string;
  image: string;
};

const artwork = (background: string, foreground: string, label: string) =>
  `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"><rect width="400" height="400" fill="${background}"/><circle cx="335" cy="40" r="170" fill="none" stroke="${foreground}" stroke-opacity=".35" stroke-width="2"/><circle cx="335" cy="40" r="120" fill="none" stroke="${foreground}" stroke-opacity=".3" stroke-width="2"/><circle cx="335" cy="40" r="54" fill="none" stroke="${foreground}" stroke-opacity=".24" stroke-width="1"/><path d="M0 308 Q150 225 400 310 V400 H0Z" fill="${foreground}" fill-opacity=".18"/><text x="28" y="345" fill="${foreground}" font-family="sans-serif" font-size="28" font-weight="700" letter-spacing="2">${label}</text></svg>`)}`;

const tracks: Track[] = [
  { id: 1, title: 'A New Kind of Love', artist: 'Frou Frou', album: 'Details', length: '4:11', seconds: 251, cover: artwork('#d65d31', '#f7d8a6', 'FROU FROU'), audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  { id: 2, title: 'The Rip', artist: 'Portishead', album: 'Third', length: '4:29', seconds: 269, cover: artwork('#25211e', '#e6a26d', 'THIRD'), audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
  { id: 3, title: 'Nothing Arrived', artist: 'Villagers', album: 'Awayland', length: '3:46', seconds: 226, cover: artwork('#c59673', '#35221a', 'AWAYLAND'), audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
  { id: 4, title: 'Archangel', artist: 'Burial', album: 'Untrue', length: '3:59', seconds: 239, cover: artwork('#49525a', '#f2b15e', 'UNTRUE'), audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3' },
  { id: 5, title: 'Roads', artist: 'Portishead', album: 'Dummy', length: '5:10', seconds: 310, cover: artwork('#b7492f', '#1e1714', 'DUMMY'), audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3' },
  { id: 6, title: 'Teardrop', artist: 'Massive Attack', album: 'Mezzanine', length: '5:30', seconds: 330, cover: artwork('#273836', '#e7bc78', 'MEZZANINE'), audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3' },
  { id: 7, title: 'Pink + White', artist: 'Frank Ocean', album: 'Blonde', length: '3:04', seconds: 184, cover: artwork('#d58b65', '#fff1cf', 'BLONDE'), audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3' },
  { id: 8, title: 'Good Days', artist: 'SZA', album: 'SOS', length: '4:39', seconds: 279, cover: artwork('#715d7e', '#f6c27d', 'SOS'), audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3' },
  { id: 9, title: 'Out of Time', artist: 'The Weeknd', album: 'Dawn FM', length: '3:34', seconds: 214, cover: artwork('#bd4c32', '#ffd086', 'DAWN FM'), audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3' },
  { id: 10, title: 'Ocean Eyes', artist: 'Billie Eilish', album: 'dont smile at me', length: '3:20', seconds: 200, cover: artwork('#5c7280', '#f5d6b3', 'OCEAN EYES'), audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3' },
  { id: 11, title: '505', artist: 'Arctic Monkeys', album: 'Favourite Worst Nightmare', length: '4:13', seconds: 253, cover: artwork('#2a3338', '#e68f50', '505'), audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3' },
  { id: 12, title: 'Lite Spots', artist: 'KAYTRANADA', album: '99.9%', length: '3:50', seconds: 230, cover: artwork('#ba5b42', '#f8d9a1', '99.9%'), audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3' },
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
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${mins}:${secs}`;
}

function App() {
  const [activeNav, setActiveNav] = useState('Home');
  const [query, setQuery] = useState('');
  const [currentId, setCurrentId] = useState(1);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(71);
  const [liked, setLiked] = useState<number[]>([2, 5]);
  const [queued, setQueued] = useState<number[]>([7, 8, 9]);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState('Night drive, no destination');
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = tracks.find((track) => track.id === currentId) ?? tracks[0];
  const filteredTracks = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return tracks;
    return tracks.filter((track) =>
      [track.title, track.artist, track.album].some((value) => value.toLowerCase().includes(normalized)),
    );
  }, [query]);

  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'metadata';
    audioRef.current = audio;

    const syncProgress = () => setProgress(audio.currentTime);
    const advanceTrack = () => {
      setCurrentId((id) => {
        const index = tracks.findIndex((track) => track.id === id);
        return tracks[(index + 1) % tracks.length].id;
      });
      setProgress(0);
      setPlaying(true);
    };
    const stopOnError = () => setPlaying(false);

    audio.addEventListener('timeupdate', syncProgress);
    audio.addEventListener('ended', advanceTrack);
    audio.addEventListener('error', stopOnError);

    return () => {
      audio.pause();
      audio.removeEventListener('timeupdate', syncProgress);
      audio.removeEventListener('ended', advanceTrack);
      audio.removeEventListener('error', stopOnError);
      audio.src = '';
      audioRef.current = null;
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.src = currentTrack.audioUrl;
    audio.load();
    setProgress(0);
  }, [currentTrack.audioUrl]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (playing) {
      void audio.play().catch(() => setPlaying(false));
    } else {
      audio.pause();
    }
  }, [playing, currentId]);

  const chooseTrack = (id: number) => {
    if (id === currentId) {
      const audio = audioRef.current;
      if (audio) {
        audio.currentTime = 0;
        void audio.play().catch(() => setPlaying(false));
      }
      setProgress(0);
      setPlaying(true);
      return;
    }
    setCurrentId(id);
    setProgress(0);
    setPlaying(true);
  };

  const changeTrack = (direction: -1 | 1) => {
    const index = tracks.findIndex((track) => track.id === currentId);
    const next = tracks[(index + direction + tracks.length) % tracks.length];
    chooseTrack(next.id);
  };

  const toggleLiked = (id: number) => {
    setLiked((items) => items.includes(id) ? items.filter((item) => item !== id) : [...items, id]);
  };

  const toggleQueue = (id: number) => {
    setQueued((items) => items.includes(id) ? items.filter((item) => item !== id) : [...items, id]);
  };

  const seekTo = (seconds: number) => {
    setProgress(seconds);
    if (audioRef.current) audioRef.current.currentTime = seconds;
  };

  return (
    <div className="app-shell">
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
              <button
                className={`nav-item ${activeNav === label ? 'active' : ''}`}
                onClick={() => setActiveNav(label)}
                key={label}
                data-testid={`button-nav-${label.toLowerCase().replaceAll(' ', '-')}`}
              >
                <Icon /> <span>{label}</span>
              </button>
            ))}
          </div>
          <div className="nav-section">
            <div className="nav-section-label">Your stuff</div>
            <button className={`nav-item ${activeNav === 'Liked songs' ? 'active' : ''}`} onClick={() => setActiveNav('Liked songs')} data-testid="button-nav-liked-songs">
              <Heart /> <span>Liked songs</span>
            </button>
            <button className={`nav-item ${activeNav === 'Playlists' ? 'active' : ''}`} onClick={() => setActiveNav('Playlists')} data-testid="button-nav-playlists">
              <ListMusic /> <span>Playlists</span>
            </button>
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
            </div>
            <div className="hero-stamp" aria-label="Currently listening">
              <div className="stamp-top"><span>Now spinning</span><span className="stamp-orange">● 01:18</span></div>
              <div className="stamp-bottom"><strong>{currentTrack.title}</strong><span>{currentTrack.artist} · {currentTrack.album}</span></div>
            </div>
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
                      <button className={`icon-button heart-button ${liked.includes(track.id) ? 'liked' : ''}`} onClick={() => toggleLiked(track.id)} aria-label={`${liked.includes(track.id) ? 'Remove from' : 'Add to'} liked songs`} data-testid={`button-like-track-${track.id}`}>
                        <Heart size={15} fill={liked.includes(track.id) ? 'currentColor' : 'none'} />
                      </button>
                    </div>
                  ))}
                </div>
                <aside className="queue-card">
                  <div className="eyebrow">Up next · {queued.length + 1} tracks</div>
                  <h3>Keep the<br />night moving.</h3>
                  <p>Your queue is a loose thread. Pull it.</p>
                  <div className="queue-lines">
                    {tracks.filter((track) => queued.includes(track.id)).slice(0, 2).map((track) => (
                      <div className="queue-line" key={track.id}><span>{track.artist}</span><strong>{track.title}</strong></div>
                    ))}
                    {!queued.length && <div className="queue-line"><span>Queue is clear</span><strong>Add a track</strong></div>}
                  </div>
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
                <button className={`playlist-card ${playlist.className}`} key={playlist.id} onClick={() => setSelectedPlaylist(playlist.title)} data-testid={`button-playlist-${playlist.id}`}>
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
          <img src={currentTrack.cover} alt="" data-testid="img-current-track" />
          <div className="now-playing-info"><strong data-testid="text-current-track">{currentTrack.title}</strong><span>{currentTrack.artist}</span></div>
          <button className={`icon-button player-heart ${liked.includes(currentTrack.id) ? 'liked' : ''}`} onClick={() => toggleLiked(currentTrack.id)} aria-label="Like current track" data-testid="button-like-current"><Heart size={15} fill={liked.includes(currentTrack.id) ? 'currentColor' : 'none'} /></button>
        </div>
        <div className="player-center">
          <div className="transport">
            <button onClick={() => setQueued((items) => items.length ? items.slice(0, -1) : items)} aria-label="Remove last from queue" data-testid="button-queue"><ListMusic size={15} /></button>
            <button onClick={() => changeTrack(-1)} aria-label="Previous track" data-testid="button-previous"><SkipBack size={16} fill="currentColor" /></button>
            <button className="main-play" onClick={() => setPlaying((value) => !value)} aria-label={playing ? 'Pause' : 'Play'} data-testid="button-play-pause">{playing ? <Pause /> : <Play />}</button>
            <button onClick={() => changeTrack(1)} aria-label="Next track" data-testid="button-next"><SkipForward size={16} fill="currentColor" /></button>
            <button onClick={() => setQueued((items) => items.includes(currentId) ? items.filter((item) => item !== currentId) : [...items, currentId])} aria-label="Toggle queue" data-testid="button-toggle-queue"><Plus size={16} /></button>
          </div>
          <div className="progress-row">
            <span>{formatTime(progress)}</span>
            <div className="progress-track" onClick={(event) => { const bounds = event.currentTarget.getBoundingClientRect(); seekTo(((event.clientX - bounds.left) / bounds.width) * currentTrack.seconds); }} role="slider" aria-label="Track progress" aria-valuemin={0} aria-valuemax={currentTrack.seconds} aria-valuenow={progress} data-testid="slider-progress"><span className="progress-fill" style={{ width: `${Math.min(100, (progress / currentTrack.seconds) * 100)}%` }} /></div>
            <span>{currentTrack.length}</span>
          </div>
        </div>
        <div className="player-right">
          <button className="icon-button" aria-label="Shuffle" data-testid="button-shuffle"><Shuffle size={15} /></button>
          <button className="icon-button" aria-label="Repeat" data-testid="button-repeat"><Repeat2 size={15} /></button>
          <Volume2 size={15} />
          <div className="volume" aria-label="Volume"><span /></div>
        </div>
      </footer>
    </div>
  );
}

export default App;