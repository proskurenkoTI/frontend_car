import { Calendar, Gauge, Route, ExternalLink, Star } from 'lucide-react'

export default function AuctionCard({ car }) {
  return (
    <div className="bg-white rounded-xl border border-border overflow-hidden hover:shadow-lg hover:border-brand-soft transition-all group flex flex-col">
      <div className="p-4 space-y-3 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-sm text-dark leading-snug">
            {car.model || 'Без названия'}
          </h3>
          <span className="text-brand font-extrabold text-sm whitespace-nowrap">
            {car.price_jpy ? `¥${car.price_jpy.toLocaleString('ru-RU')}` : 'Цена не указана'}
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {car.year && (
            <span className="inline-flex items-center gap-1 text-xs bg-surface px-2 py-1 rounded-md text-muted">
              <Calendar className="w-3 h-3" /> {car.year}
            </span>
          )}
          {car.engine_volume && (
            <span className="inline-flex items-center gap-1 text-xs bg-surface px-2 py-1 rounded-md text-muted">
              <Gauge className="w-3 h-3" /> {(car.engine_volume / 1000).toFixed(1)} л
            </span>
          )}
          {car.mileage && (
            <span className="inline-flex items-center gap-1 text-xs bg-surface px-2 py-1 rounded-md text-muted">
              <Route className="w-3 h-3" /> {(car.mileage / 1000).toFixed(0)} тыс. км
            </span>
          )}
        </div>

        {car.rating != null && (
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 fill-brand text-brand" />
            <span className="text-xs text-muted font-medium">
              {car.rating.toFixed(1)} — оценка состояния
            </span>
          </div>
        )}
      </div>

      {car.url && (
        <a
          href={car.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between px-4 py-2.5 bg-brand-light text-brand-dark text-xs font-semibold no-underline border-t border-brand-soft group-hover:bg-brand group-hover:text-white transition-colors"
        >
          Лот на Drom
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      )}
    </div>
  )
}
