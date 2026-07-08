# seanyang.me

Personal website built with Next.js, React, and TypeScript. Deployed on Vercel.

## Tech Stack

- [Next.js 15](https://nextjs.org/) (App Router)
- [React 19](https://react.dev/)
- TypeScript
- Vercel Analytics & Speed Insights

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

| Variable | Description |
|----------|-------------|
| `LASTFM_API_KEY` | Last.fm API key for the now-playing vinyl widget |
| `HARDCOVER_API_TOKEN` | Hardcover API token (from [hardcover.app/account/api](https://hardcover.app/account/api)) for the currently-reading book widget |

The Letterboxd widget uses the public RSS feed and needs no key.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
