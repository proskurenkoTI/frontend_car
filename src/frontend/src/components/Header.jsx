import { Car, FileJson } from 'lucide-react'

const SECTIONS = [
  { id: 'assessment', label: 'Оценка цены' },
  { id: 'import', label: 'Импорт из Японии' },
  { id: 'auctions', label: 'Аукционы' },
  { id: 'similar', label: 'Похожие авто' },
]

export default function Header() {
  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <header className="bg-white border-b border-brand-soft sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16 gap-4">
          <a href="#top" className="flex items-center gap-2 no-underline shrink-0">
            <div className="w-9 h-9 bg-brand rounded-lg flex items-center justify-center shadow-md shadow-brand/30">
              <Car className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-extrabold text-dark tracking-tight">
              Авто<span className="text-brand">Срав</span>
            </span>
          </a>

          <nav className="hidden lg:flex items-center gap-1">
            {SECTIONS.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => scrollTo(s.id)}
                className="px-3 py-2 rounded-lg text-sm font-medium text-muted hover:text-brand hover:bg-brand-light transition-colors cursor-pointer"
              >
                {s.label}
              </button>
            ))}
          </nav>

          <a
            href="/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand border border-brand-soft rounded-lg px-3 py-2 hover:bg-brand-light no-underline transition-colors"
          >
            <FileJson className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">API</span>
          </a>
        </div>
      </div>
    </header>
  )
}
