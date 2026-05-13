import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
)

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!

async function geocode(city?: string, state?: string, zip?: string): Promise<[number, number] | null> {
  const parts = [city, state, zip].filter(Boolean)
  if (parts.length === 0) return null

  const query = encodeURIComponent(parts.join(', ') + ', USA')
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?country=US&limit=1&access_token=${MAPBOX_TOKEN}`

  try {
    const res = await fetch(url)
    const data = await res.json()
    const feature = data?.features?.[0]
    if (!feature) return null
    const [lng, lat] = feature.geometry.coordinates
    return [lat, lng]
  } catch {
    return null
  }
}

export async function POST() {
  // Fetch all nurses without coordinates
  const { data: nurses, error } = await supabase
    .from('nurse_applications')
    .select('id, city, state, zip')
    .or('latitude.is.null,longitude.is.null')

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  let success = 0
  let failed = 0

  for (const nurse of nurses ?? []) {
    const coords = await geocode(nurse.city, nurse.state, nurse.zip)
    if (coords) {
      const { error: updateError } = await supabase
        .from('nurse_applications')
        .update({ latitude: coords[0], longitude: coords[1] })
        .eq('id', nurse.id)

      if (updateError) {
        console.error(`[geocode] Failed to update ${nurse.id}:`, updateError)
        failed++
      } else {
        success++
      }
    } else {
      failed++
    }

    // Rate-limit: Mapbox free tier allows ~600 req/min, add small delay
    await new Promise((r) => setTimeout(r, 100))
  }

  return NextResponse.json({ total: nurses?.length ?? 0, success, failed })
}
