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

  let bg = 'bg-green-100 text-green-800'
  let label = ''

  if (expired) {
    bg = 'bg-gray-100 text-gray-500'
    label = 'Överklagandetiden har gått ut'
  } else if (urgent) {
    bg = 'bg-red-100 text-red-700'
    label = `⚠ ${days} dag${days === 1 ? '' : 'ar'} kvar`
  } else if (warning) {
    bg = 'bg-amber-100 text-amber-800'
    label = `${days} dagar kvar`
  } else {
    label = `${days} dagar kvar`
  }

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${bg} ${className}`}>
      {label}
    </span>
  )
}
