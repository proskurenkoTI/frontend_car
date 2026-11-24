import { Loader2, AlertTriangle, Compass, PlugZap } from 'lucide-react'

export function Spinner({ label = 'Загружаем данные…' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-20 text-muted">
      <Loader2 className="w-8 h-8 text-brand animate-spin" />
      <span className="text-sm">{label}</span>
    </div>
  )
}

export function EmptyState({ title, text }) {
  return (
    <div className="bg-white border border-dashed border-brand-soft rounded-2xl p-12 text-center">
      <Compass className="w-10 h-10 mx-auto mb-4 text-brand/40" />
      <h3 className="font-bold text-dark text-lg mb-1">{title}</h3>
      <p className="text-sm text-muted max-w-md mx-auto">{text}</p>
    </div>
  )
}

export function ErrorBanner({ title = 'Не удалось построить отчёт', text, onRetry }) {
  return (
    <div className="bg-brand-light border border-brand-soft rounded-2xl p-5 flex items-start gap-4">
      <AlertTriangle className="w-5 h-5 text-brand-dark shrink-0 mt-0.5" />
      <div className="flex-1">
        <h3 className="font-semibold text-brand-dark text-sm mb-1">{title}</h3>
        <p className="text-sm text-brand-dark/80 break-words">{text}</p>
      </div>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="shrink-0 text-xs font-semibold text-brand-dark border border-brand-soft rounded-lg px-3 py-2 bg-white hover:bg-brand-light transition-colors"
        >
          Повторить
        </button>
      )}
    </div>
  )
}

/**
 * Частичный отчёт: комбинированный эндпоинт отдал 500, данные собраны
 * из отдельных вызовов, поэтому расчёт импорта недоступен.
 */
export function DegradedBanner({ text }) {
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-start gap-4">
      <PlugZap className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
      <div>
        <h3 className="font-semibold text-amber-900 text-sm mb-1">
          Отчёт собран по частям
        </h3>
        <p className="text-sm text-amber-800/80">
          Комбинированный эндпоинт <code className="font-mono text-xs">/car_compare</code>{' '}
          вернул ошибку на расчёте импорта, поэтому оценка, аукционы и похожие
          объявления получены отдельными запросами.{' '}
          {text && <span className="font-mono text-xs">{text}</span>}
        </p>
      </div>
    </div>
  )
}

export function Section({ id, icon: Icon, title, subtitle, action, children }) {
  return (
    <section id={id} className="scroll-mt-24 animate-rise">
      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-brand-light flex items-center justify-center shrink-0">
            <Icon className="w-5 h-5 text-brand" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-dark leading-tight">{title}</h2>
            {subtitle && <p className="text-xs text-muted mt-0.5">{subtitle}</p>}
          </div>
        </div>
        {action}
      </div>
      {children}
    </section>
  )
}
