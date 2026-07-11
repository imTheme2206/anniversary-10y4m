import { useEffect, useState } from 'react'

const MS_PER_DAY = 1000 * 60 * 60 * 24

function computeDays(sinceISO: string): number {
  const since = new Date(sinceISO).getTime()
  const now = Date.now()
  if (Number.isNaN(since) || now < since) return 0
  return Math.floor((now - since) / MS_PER_DAY)
}

/** Live "days together" counter — recalculates as the day rolls over. */
export function useDayCounter(sinceISO: string): number {
  const [days, setDays] = useState(() => computeDays(sinceISO))

  useEffect(() => {
    setDays(computeDays(sinceISO))
    // Cheap tick — recomputing daily elapsed time doesn't need per-second
    // precision, but a minute-level tick keeps it feeling "live" without
    // any measurable cost.
    const id = window.setInterval(() => setDays(computeDays(sinceISO)), 60_000)
    return () => window.clearInterval(id)
  }, [sinceISO])

  return days
}
