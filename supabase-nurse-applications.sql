-- ============================================================
-- ACHIEVE · nurse_applications migration
-- Run this in your Supabase SQL editor
-- ============================================================

CREATE TABLE IF NOT EXISTS nurse_applications (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Step 1: Identity
  first_name        TEXT NOT NULL,
  last_name         TEXT NOT NULL,
  email             TEXT NOT NULL UNIQUE,
  phone             TEXT,

  -- Step 2: Background
  role              TEXT,
  specialty         TEXT,
  years_experience  TEXT,
  languages         TEXT[] DEFAULT '{}',

  -- Step 3: Location
  state             TEXT,
  city              TEXT,
  zip               TEXT,
  serves_underserved TEXT,             -- 'yes' | 'no' | 'somewhat'

  -- Step 4: Motivation
  motivation_text   TEXT,
  goal              TEXT,

  -- Step 5: Availability
  hours_per_month   TEXT,
  source            TEXT,

  -- System fields
  email_verified    BOOLEAN NOT NULL DEFAULT FALSE,
  status            TEXT NOT NULL DEFAULT 'pending',
  -- 'pending' | 'reviewing' | 'selected' | 'rejected' | 'waitlisted'
  cohort            TEXT NOT NULL DEFAULT 'cohort-4',

  applied_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  verified_at       TIMESTAMPTZ,
  reviewed_at       TIMESTAMPTZ,
  admin_notes       TEXT,

  -- ── Training ────────────────────────────────────────────────────────────
  training_status               TEXT NOT NULL DEFAULT 'not_invited',
  -- 'not_invited' | 'invited' | 'in_progress' | 'completed' | 'failed' | 'waived'

  training_invited_at           TIMESTAMPTZ,
  training_invitation_url       TEXT,         -- 发给护士的培训链接
  training_invited_by           UUID,         -- admin user id（无 FK，admin 表未建）

  training_started_at           TIMESTAMPTZ,
  training_completed_at         TIMESTAMPTZ,
  training_status_updated_at    TIMESTAMPTZ,
  training_status_updated_by    UUID,         -- admin user id（无 FK）

  -- ── License / Licensure verification ────────────────────────────────────
  license_type                  TEXT,
  -- e.g. 'RN' | 'LPN' | 'LVN' | 'NP'

  license_number                TEXT,
  license_state                 TEXT,
  license_expiration_date       DATE,

  license_verification_status   TEXT NOT NULL DEFAULT 'not_started',
  -- 'not_started' | 'pending' | 'verified' | 'failed' | 'expired' | 'waived'

  license_verified_at           TIMESTAMPTZ,
  license_verified_by           UUID,         -- admin user id（无 FK）
  license_verification_notes    TEXT,

  -- ── Matching eligibility ─────────────────────────────────────────────────
  -- 由 admin 在 training=completed + license=verified 后手动开启
  eligible_for_matching         BOOLEAN NOT NULL DEFAULT FALSE,
  eligibility_updated_at        TIMESTAMPTZ,
  eligibility_notes             TEXT
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_nurse_applications_email
  ON nurse_applications(email);

CREATE INDEX IF NOT EXISTS idx_nurse_applications_status
  ON nurse_applications(status);

CREATE INDEX IF NOT EXISTS idx_nurse_applications_applied_at
  ON nurse_applications(applied_at DESC);

-- Row Level Security（可选，如果你想从客户端直接查询的话开启）
-- ALTER TABLE nurse_applications ENABLE ROW LEVEL SECURITY;
-- 建议通过 service_role key 从服务端操作，不需要 RLS

-- ============================================================
-- Migration 2: applicant edit control + updated_at
-- Run AFTER the initial CREATE TABLE above
-- ============================================================

ALTER TABLE nurse_applications
  ADD COLUMN IF NOT EXISTS updated_at               TIMESTAMPTZ NOT NULL DEFAULT now(),
  ADD COLUMN IF NOT EXISTS applicant_can_edit        BOOLEAN NOT NULL DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS last_applicant_edited_at  TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS applicant_edit_count      INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS locked_at                 TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS locked_by                 UUID,      -- admin user id（无 FK，admin 表未建）
  ADD COLUMN IF NOT EXISTS lock_reason               TEXT;

-- Trigger: 每次 UPDATE 自动维护 updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER nurse_applications_updated_at
  BEFORE UPDATE ON nurse_applications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();


-- ─── RPC: increment_edit_count ────────────────────────────────────────────────
-- Called by the edit API route each time an applicant saves changes.
CREATE OR REPLACE FUNCTION increment_edit_count(app_id UUID)
RETURNS void AS $$
  UPDATE nurse_applications
  SET applicant_edit_count = applicant_edit_count + 1
  WHERE id = app_id;
$$ LANGUAGE sql;
