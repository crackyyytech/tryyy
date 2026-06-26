import { Link } from 'react-router-dom'

export default function EmptyState({
  emoji = '🍽️',
  title = 'Nothing here yet',
  description = '',
  actionLabel,
  actionTo,
  onAction,
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="text-6xl mb-4 animate-float">{emoji}</div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      {description && <p className="text-gray-500 max-w-md mb-6 text-sm leading-relaxed">{description}</p>}
      {actionLabel && actionTo && (
        <Link to={actionTo} className="btn-primary">{actionLabel}</Link>
      )}
      {actionLabel && onAction && (
        <button onClick={onAction} className="btn-primary">{actionLabel}</button>
      )}
    </div>
  )
}
