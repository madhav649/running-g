CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE cities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  center GEOGRAPHY(POINT, 4326) NOT NULL,
  geofence GEOGRAPHY(POLYGON, 4326) NOT NULL,
  h3_resolution SMALLINT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  city_id UUID REFERENCES cities(id),
  name TEXT NOT NULL,
  banner_color TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  oauth_provider TEXT,
  oauth_subject TEXT,
  password_hash TEXT,
  team_id UUID REFERENCES teams(id),
  xp BIGINT NOT NULL DEFAULT 0,
  level INTEGER NOT NULL DEFAULT 1,
  streak_days INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE zones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  city_id UUID NOT NULL REFERENCES cities(id),
  h3_index TEXT NOT NULL,
  owner_id UUID REFERENCES users(id),
  team_id UUID REFERENCES teams(id),
  capture_time TIMESTAMPTZ,
  points_generated BIGINT NOT NULL DEFAULT 0,
  zone_tier TEXT NOT NULL CHECK (zone_tier IN ('normal', 'high-value', 'landmark')),
  centroid GEOGRAPHY(POINT, 4326) NOT NULL,
  UNIQUE (city_id, h3_index)
);

CREATE TABLE capture_events (
  id BIGSERIAL PRIMARY KEY,
  zone_id UUID NOT NULL REFERENCES zones(id),
  player_id UUID NOT NULL REFERENCES users(id),
  team_id UUID NOT NULL REFERENCES teams(id),
  presence_seconds INTEGER NOT NULL,
  is_valid BOOLEAN NOT NULL,
  reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_zones_city_h3 ON zones(city_id, h3_index);
CREATE INDEX idx_zones_centroid ON zones USING GIST(centroid);
CREATE INDEX idx_capture_events_zone_created ON capture_events(zone_id, created_at DESC);

INSERT INTO cities (slug, name, center, geofence, h3_resolution)
VALUES (
  'delhi',
  'Delhi NCR',
  ST_GeogFromText('POINT(77.2090 28.6139)'),
  ST_GeogFromText('POLYGON((76.836 28.404,77.043 28.282,77.551 28.401,77.607 28.679,77.347 28.93,76.896 28.79,76.836 28.404))'),
  10
)
ON CONFLICT (slug) DO NOTHING;
