-- Migration: Add geocoded coordinates to nurse_applications
-- Run this in Supabase SQL editor

ALTER TABLE nurse_applications
  ADD COLUMN IF NOT EXISTS latitude  FLOAT8,
  ADD COLUMN IF NOT EXISTS longitude FLOAT8;

-- Optional: index for spatial queries later
CREATE INDEX IF NOT EXISTS idx_nurse_applications_lat_lng
  ON nurse_applications (latitude, longitude)
  WHERE latitude IS NOT NULL AND longitude IS NOT NULL;
