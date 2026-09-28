# velvet/room

An orange-and-black music room with curated artists, playable demo audio, playlists, queue controls, search, and a responsive layout.

## Run locally

```bash
pnpm install
pnpm --filter @workspace/orange-black-music-player run dev
```

## Deploy on Render

This repository includes `render.yaml`. Connect the repository in Render and create a Blueprint; Render will use the included build and start commands automatically.

The player uses public demo audio files so it works without Spotify credentials. A future Spotify connection can replace the demo catalog and audio sources.