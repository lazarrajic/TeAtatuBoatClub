// Scheduled daily ping so the free-tier Supabase project doesn't pause from
// inactivity (Supabase sleeps a free project after ~7 days with no queries).
// Runs one trivial query to register activity. Once this project is on a paid
// Supabase plan, paid projects don't pause and this can be removed.
//
// NOTE: a paused project won't wake from this — restore it once in the Supabase
// dashboard, then the daily ping keeps it awake.
import { supabase } from './_supabase.js'

export const handler = async () => {
  try {
    await supabase().from('berths').select('id').limit(1)
    return { statusCode: 200, body: 'ok' }
  } catch (e) {
    console.error('keepalive error', e)
    return { statusCode: 500, body: 'error' }
  }
}

// Daily at 12:00 UTC (cron syntax — Netlify Scheduled Functions).
export const config = { schedule: '0 12 * * *' }
