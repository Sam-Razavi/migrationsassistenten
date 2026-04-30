interface Props {
  appealDeadline: string | null | undefined
  className?: string
}

function getDaysRemaining(deadline: string): number {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const d = new Date(deadline)
  d.setHours(0, 0, 0, 0)
  return Math.round((d.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
}

export default function DeadlineBadge({ appealDeadline, className = '' }: Props) {
  if (!appealDeadline) return null

  const days = getDaysRemaining(appealDeadline)
  const expired = days < 0
  const urgent = !expired && days <= 7
  const warning = !expired && !urgent && days <= 14

  let style = 'bg-emerald-50 text-emerald-700 border border-emerald-200'
  let label = ''

  if (expired) {
    style = 'bg-slate-100 text-slate-500'
    label = 'Överklagandetiden har gått ut'
  } else if (urgent) {
    style = 'bg-red-50 text-red-700 border border-red-200'
    label = `⚠ ${days} dag${days === 1 ? '' : 'ar'} kvar`
  } else if (warning) {
    style = 'bg-amber-50 text-amber-700 border border-amber-200'
    label = `${days} dagar kvar`
  } else {
    label = `${days} dagar kvar`
  }

  return (
    <span className={`inline-flex items-center rounded-md text-xs font-medium px-2 py-0.5 ${style} ${className}`}>
      {label}
    </span>
  )
}
