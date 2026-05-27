// Shared type for nurse application records from Supabase
export interface NurseApplication {
  id: string
  first_name: string
  last_name: string
  email: string
  phone?: string
  role?: string
  specialty?: string
  years_experience?: string
  languages?: string[]
  address?: string
  state?: string
  city?: string
  zip?: string
  serves_underserved?: string
  motivation_text?: string
  goal?: string
  hours_per_month?: string
  source?: string
  email_verified: boolean
  status: string
  cohort: string
  applied_at: string
  verified_at?: string
  reviewed_at?: string
  admin_notes?: string
  training_status: string
  training_invited_at?: string
  training_invitation_url?: string
  training_started_at?: string
  training_completed_at?: string
  training_status_updated_at?: string
  license_type?: string
  license_number?: string
  license_state?: string
  license_expiration_date?: string
  license_verification_status: string
  license_verified_at?: string
  license_verification_notes?: string
  eligible_for_matching: boolean
  eligibility_updated_at?: string
  eligibility_notes?: string
  latitude?: number | null
  longitude?: number | null
}
