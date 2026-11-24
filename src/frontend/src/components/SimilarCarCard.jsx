import { ExternalLink } from 'lucide-react'
import { formatNumber } from '../utils/format'

export default function SimilarCarCard({ bull }) {
  return (
    <a
      href={bull.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block bg-white rounded-xl border border-border overflow-hidden hover:shadow-lg hover:border-brand/30 transition-all group no-underline"
    >
      {bull.src ? (
        <div className="aspect-[4/3] overflow-hidden bg-surface">
          <img
            src={bull.src2x || bull.src}
            alt=""
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </div>
      ) : (
        <div className="aspect-[4/3] bg-gradient-to-br from-brand-light to-brand-soft" />
      )}
      <div className="p-3 flex items-center justify-between gap-2">
        <span className="font-extrabold text-sm text-dark">
          {formatNumber(bull.price) ? `${formatNumber(bull.price)} ₽` : 'Цена не указана'}
        </span>
        <ExternalLink className="w-3.5 h-3.5 text-muted group-hover:text-brand transition-colors shrink-0" />
      </div>
    </a>
  )
}
