# RSS reading app client

Client for the [RSS app](https://github.com/emp74ark/rss-nest) built with Angular 20 and Angular Material.

## Tech stack
- Angular 20
- Angular Material

## Prerequisites
- Node.js 20+ (Node 22 used in Dockerfile)
- npm 9+
- Angular CLI 20 globally installed (optional):
  ```bash
  npm i -g @angular/cli@20
  ```
- Backend: [Repository](https://github.com/emp74ark/rss-nest)

## Getting started (local development)
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the dev server:
   ```bash
   npm start
   # or
   ng serve
   ```
3. Open http://localhost:4200


## Deploy

Using docker compose: [repository](https://github.com/emp74ark/rss-deploy)

## Project structure (high level)
- `src/app/pages` — feature pages: auth, articles, bookmarks, feeds, tags, user, status
- `src/app/components` — reusable components: article list, paginator, dialogs, forms
- `src/app/services` — API services (auth, feed, tag, user, page, title)
- `src/environments` — environment configs (`development` and `production`)

## License
ISC (see package.json)
