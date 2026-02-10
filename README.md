# CityGrid (Delhi-first Multiplayer Territory Capture)

Production-oriented monorepo for a mobile-first territory capture game with Delhi NCR as the launch city.

## Architecture
- **Frontend**: React + TypeScript + Mapbox GL for efficient vector rendering and low battery overhead.
- **Backend**: Node.js + Express + Socket.io for API + realtime battles.
- **Spatial Layer**: Postgres + PostGIS + H3 indexing for geofenced zone logic.
- **Scale**: Redis cache, BullMQ async event processing, websocket rooms per city/team.

## Delhi Launch Defaults
- Default center: **28.6139, 77.2090**
- Gameplay geofence: Delhi + Gurgaon + Noida polygon.
- Hex grid strategy: H3 resolution 10 (~150-220m edge), suitable for walking gameplay.
- Landmark zones baked in: Connaught Place, India Gate, Cyber Hub, Hauz Khas, Delhi University, Select Citywalk Mall.

## Key Features Implemented
- JWT auth middleware and OAuth-ready user model.
- Capture endpoint with geofence enforcement and anti-cheat velocity/spoof checks.
- Queue-driven capture processing for high-throughput workloads.
- Socket events for map updates and landmark battle notifications.
- Mobile-first map UI with Delhi geofence overlay and landmark markers.
- Extensible `cityRegistry` for adding future cities without refactoring core flow.

## Folder Structure
- `apps/client`: React web app.
- `apps/server`: Express API + Socket.io + workers.
- `packages/shared`: Shared Delhi config and types.
- `infra/sql`: PostGIS schema and Delhi seed.
- `infra/aws`: Deployment playbook.

## API Surface
- `GET /api/health`
- `GET /api/city/bootstrap`
- `POST /api/capture` (JWT required)

## Performance and Battery Optimizations
- Websocket-only transport (no long polling fallback).
- Mapbox vector style with lightweight overlays.
- Queue offloading avoids synchronous capture writes.
- Landmark events broadcast by room scoping (`city:*`, `team:*`).

## Quick Start
```bash
npm install
npm run typecheck
```

Start services locally:
```bash
# terminal 1
npm run dev --workspace @citygrid/server

# terminal 2
npm run dev --workspace @citygrid/client
```

Apply DB schema:
```bash
psql "$DATABASE_URL" -f infra/sql/schema.sql
```

## Security Best Practices
- Rotate JWT secret and OAuth keys via Secrets Manager.
- Enforce TLS everywhere and set short token expiry.
- Rate-limit capture/auth endpoints and monitor anomaly patterns.
- Validate geolocation server-side only; never trust client capture decisions.
