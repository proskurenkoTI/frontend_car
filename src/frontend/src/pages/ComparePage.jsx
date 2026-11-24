import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  TrendingUp,
  Timer,
  Ship,
  Gavel,
  Images,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Sparkles,
  Info,
} from 'lucide-react'
import clsx from 'clsx'
import CarSearchForm from '../components/CarSearchForm'
import AuctionCard from '../components/AuctionCard'
import SimilarCarCard from '../components/SimilarCarCard'
import ImportSection from '../components/ImportSection'
import {
  Spinner,
  EmptyState,
  ErrorBanner,
  DegradedBanner,
  Section,
} from '../components/StateBlocks'
import { buildReport } from '../services/report'
import { formatNumber } from '../utils/format'
import {
  AVAILABILITY_LABELS,
  FRAME_LABELS,
  IMPORT_PURPOSES,
  WHEEL_OPTIONS,
} from '../constants/catalog'

function readSelection(searchParams) {
  const get = (key) => searchParams.get(key) || ''
  return {
    firmId: get('firm_id'),
    modelId: get('model_id'),
    year: get('year'),
    modificationId: get('modification_id'),
    generationId: get('generation_id'),
    wheel: get('wheel') || 'UNDEFINED',
    frame: get('frame'),
    regionId: get('region_id') || '0',
    importPurpose: get('import_purpose') || 'USAGE',
    price: get('price'),
    firmTitle: get('firm_title'),
    modelTitle: get('model_title'),
    modificationTitle: get('modification_title'),
    generationTitle: get('generation_title'),
    regionName: get('region_name'),
  }
}

export default function ComparePage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const queryKey = searchParams.toString()

  const selection = useMemo(
    () => readSelection(new URLSearchParams(queryKey)),
    [queryKey],
  )

  const isComplete =
    !!selection.firmId &&
    !!selection.modelId &&
    !!selection.year &&
    !!selection.frame &&
    !!selection.modificationId

  const [report, setReport] = useState(null)
  const [degraded, setDegraded] = useState(false)
  const [degradedReason, setDegradedReason] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const compareParams = useMemo(
    () => ({
      firm_id: selection.firmId,
      model_id: selection.modelId,
      year: selection.year,
      modification_id: selection.modificationId,
      wheel: selection.wheel,
      frame: selection.frame,
      region_id: selection.regionId,
      import_purpose: selection.importPurpose,
      ...(selection.price ? { price: selection.price } : {}),
    }),
    [selection],
  )

  const loadReport = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const { report: data, degraded: isDegraded, degradedReason: reason } =
        await buildReport({
          compareParams,
          importPurpose: selection.importPurpose,
          catalog: {
            firm: { title: selection.firmTitle },
            model: { title: selection.modelTitle },
            modification: { title: selection.modificationTitle },
          },
        })
      setReport(data)
      setDegraded(Boolean(isDegraded))
      setDegradedReason(reason || '')
    } catch (err) {
      setReport(null)
      setError(err.message || 'Неизвестная ошибка')
    } finally {
      setLoading(false)
    }
  }, [compareParams, selection])

  useEffect(() => {
    if (!isComplete) return
    loadReport()
  }, [isComplete, queryKey, loadReport])

  const applySelection = (form) => {
    const params = new URLSearchParams({
      firm_id: form.firmId,
      model_id: form.modelId,
      year: form.year,
      modification_id: form.modificationId,
      generation_id: form.generationId,
      wheel: form.wheel,
      frame: form.frame,
      region_id: form.regionId,
      import_purpose: selection.importPurpose,
      firm_title: form.firm?.title || '',
      model_title: form.model?.title || '',
      modification_title: form.modification?.title || '',
      generation_title: form.generation?.title || '',
      region_name: form.region?.name || '',
    })
    // Цена прошлого лота к новой машине не относится
    setSearchParams(params)
    requestAnimationFrame(() => {
      document.getElementById('report')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }

  const patchParams = (patch) => {
    const params = new URLSearchParams(searchParams)
    Object.entries(patch).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '') params.delete(key)
      else params.set(key, value)
    })
    setSearchParams(params)
  }

  // Отчёт и ошибка относятся только к текущему набору параметров
  const shownReport = isComplete ? report : null
  const shownError = isComplete ? error : null

  const availability = shownReport?.results_availability
  const chart = shownReport?.price_change_chart
  const auctions = shownReport?.auctions
  const similar = shownReport?.similar_cars

  return (
    <div id="top">
      {/* ─── Hero + форма ───────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-darker via-dark to-brand-dark text-white">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              'radial-gradient(circle at 15% 20%, #e11d2f 0%, transparent 45%), radial-gradient(circle at 85% 10%, #ff7a45 0%, transparent 40%)',
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 pt-14 pb-28">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest bg-white/10 border border-white/15 rounded-full px-3 py-1 mb-5">
              <Sparkles className="w-3 h-3 text-accent" />
              Один отчёт вместо десяти вкладок
            </span>
            <h1 className="text-3xl md:text-5xl font-extrabold leading-[1.1] tracking-tight">
              Сколько на самом деле стоит
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-brand-soft">
                ваша машина
              </span>
            </h1>
            <p className="text-white/60 mt-4 text-base md:text-lg max-w-2xl">
              Рыночная оценка по России, лоты японских аукционов, похожие
              объявления и полный расчёт импорта с пошлинами, утильсбором и НДС.
            </p>
          </div>
        </div>
      </section>

      {/* ─── Форма поиска ───────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 -mt-20 relative z-10">
        <div className="bg-white rounded-2xl border border-border shadow-2xl shadow-black/10 p-5 md:p-6">
          <div className="flex items-center justify-between gap-3 mb-4">
            <h2 className="font-bold text-dark">Выберите автомобиль</h2>
            <span className="text-xs text-muted hidden sm:inline">
              каталог Drom · кеш 24 часа
            </span>
          </div>
          <CarSearchForm onSubmit={applySelection} />
        </div>
      </div>

      {/* ─── Отчёт ──────────────────────────────────────── */}
      <div id="report" className="max-w-7xl mx-auto px-4 py-10 scroll-mt-20">
        {!isComplete && !loading && (
          <EmptyState
            title="Заполните каталог целиком"
            text="Выберите марку, модель, год, кузов, поколение и модификацию — отчёт строится по конкретной модификации, потому что от неё зависят объём двигателя, мощность и тип топлива."
          />
        )}

        {loading && <Spinner label="Собираем отчёт: оценка, аукционы, импорт…" />}

        {shownError && !loading && (
          <ErrorBanner text={shownError} onRetry={loadReport} />
        )}

        {shownReport && !loading && (
          <div className="space-y-8">
            {/* Шапка отчёта */}
            <div className="bg-white border border-border rounded-2xl p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-extrabold text-dark">
                    {[selection.firmTitle, selection.modelTitle]
                      .filter(Boolean)
                      .join(' ') || 'Отчёт по автомобилю'}
                  </h2>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    <Chip>{selection.year} г.</Chip>
                    <Chip>{FRAME_LABELS[selection.frame] || selection.frame}</Chip>
                    <Chip>
                      {WHEEL_OPTIONS.find((w) => w.value === selection.wheel)?.label}
                    </Chip>
                    {selection.regionName && <Chip>{selection.regionName}</Chip>}
                    {selection.generationTitle && <Chip>{selection.generationTitle}</Chip>}
                  </div>
                  {selection.modificationTitle && (
                    <p className="text-sm text-muted mt-2">
                      {selection.modificationTitle}
                    </p>
                  )}
                </div>

                {/* Пересчёт */}
                <div className="flex flex-wrap items-end gap-2">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-muted mb-1">
                      Цель импорта
                    </label>
                    <div className="inline-flex rounded-lg border border-border overflow-hidden">
                      {IMPORT_PURPOSES.map((p) => (
                        <button
                          key={p.value}
                          type="button"
                          onClick={() => patchParams({ import_purpose: p.value })}
                          className={clsx(
                            'px-3 py-2 text-xs font-semibold transition-colors',
                            selection.importPurpose === p.value
                              ? 'bg-brand text-white'
                              : 'bg-white text-muted hover:bg-surface',
                          )}
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <PriceControl
                    key={`${selection.firmId}-${selection.modelId}-${selection.modificationId}`}
                    initial={selection.price}
                    onApply={(value) => patchParams({ price: value })}
                  />
                </div>
              </div>

              {/* Доступность результатов */}
              {availability && (
                <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border">
                  {Object.entries(availability).map(([key, value]) => (
                    <span
                      key={key}
                      className={clsx(
                        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold',
                        value.available
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-brand-light text-brand-dark',
                      )}
                    >
                      {value.available ? (
                        <CheckCircle2 className="w-3 h-3" />
                      ) : (
                        <XCircle className="w-3 h-3" />
                      )}
                      {AVAILABILITY_LABELS[key] || key}
                      {!value.available && value.missing_fields?.length > 0 && (
                        <span className="opacity-70 font-normal">
                          · нет: {value.missing_fields.join(', ')}
                        </span>
                      )}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {degraded && <DegradedBanner text={degradedReason} />}

            {/* Оценка цены */}
            {chart && (
              <Section
                id="assessment"
                icon={TrendingUp}
                title="Оценка стоимости"
                subtitle="Рекомендованная цена и срок продажи по региону"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-brand to-brand-dark rounded-2xl p-6 text-white shadow-lg shadow-brand/20">
                    <div className="flex items-center gap-2 mb-3 opacity-85">
                      <TrendingUp className="w-4 h-4" />
                      <span className="text-xs uppercase tracking-wider font-semibold">
                        Рекомендованная цена
                      </span>
                    </div>
                    <div className="text-4xl font-extrabold tracking-tight">
                      {chart.recommendedPrice
                        ? `${formatNumber(chart.recommendedPrice)} ₽`
                        : 'Нет данных'}
                    </div>
                    <p className="text-xs opacity-70 mt-3">
                      Расчёт по фактическим продажам в выбранном регионе
                    </p>
                  </div>

                  <div className="bg-white border border-border rounded-2xl p-6">
                    <div className="flex items-center gap-2 mb-3 text-muted">
                      <Timer className="w-4 h-4 text-brand" />
                      <span className="text-xs uppercase tracking-wider font-semibold">
                        Среднее время продажи
                      </span>
                    </div>
                    <div className="text-4xl font-extrabold text-dark tracking-tight">
                      {chart.averageSaleDays
                        ? `${chart.averageSaleDays} дн.`
                        : 'Нет данных'}
                    </div>
                    <p className="text-xs text-muted mt-3">
                      Столько в среднем машина висит в продаже по этой цене
                    </p>
                  </div>
                </div>
              </Section>
            )}

            {/* Импорт из Японии */}
            <Section
              id="import"
              icon={Ship}
              title="Импорт из Японии"
              subtitle="Доставка, пошлины, утильсбор, НДС и курс ЦБ"
            >
              {shownReport.japan_import_response ? (
                <ImportSection data={shownReport.japan_import_response} />
              ) : (
                <div className="bg-white border border-border rounded-2xl p-6 flex items-start gap-3">
                  <Info className="w-5 h-5 text-brand shrink-0 mt-0.5" />
                  <div className="text-sm text-muted">
                    <p className="font-semibold text-dark mb-1">
                      Расчёт импорта недоступен
                    </p>
                    <p>
                      {degraded
                        ? 'Калькулятор Drom вернул некорректный ответ, поэтому блок пропущен — остальные данные отчёта актуальны.'
                        : 'Не хватает данных для калькулятора. Укажите цену лота в йенах или выберите другую модификацию.'}
                    </p>
                    {availability?.japan_import_response?.missing_fields?.length > 0 && (
                      <p className="mt-2 text-xs">
                        Не хватает полей:{' '}
                        <span className="font-mono">
                          {availability.japan_import_response.missing_fields.join(', ')}
                        </span>
                      </p>
                    )}
                  </div>
                </div>
              )}
            </Section>

            {/* Аукционы */}
            <Section
              id="auctions"
              icon={Gavel}
              title="Аукционы Японии"
              subtitle={
                auctions
                  ? `${auctions.examples?.length || 0} лотов · средняя цена ¥${formatNumber(auctions.avg_price_jpy) || 0}`
                  : 'Лоты с японских аукционов'
              }
              action={
                auctions?.url && (
                  <a
                    href={auctions.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold text-brand hover:text-brand-dark no-underline"
                  >
                    Все лоты на Drom →
                  </a>
                )
              }
            >
              {auctions?.examples?.length ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                  {auctions.examples.slice(0, 8).map((car, index) => (
                    <AuctionCard key={`${car.url}-${index}`} car={car} />
                  ))}
                </div>
              ) : (
                <div className="bg-white border border-border rounded-2xl p-6 text-sm text-muted">
                  По этому запросу лоты не найдены. Попробуйте изменить год или
                  модификацию — фильтры аукциона строятся автоматически.
                </div>
              )}
            </Section>

            {/* Похожие авто */}
            <Section
              id="similar"
              icon={Images}
              title="Похожие объявления"
              subtitle="Живые предложения с Drom по этой модификации"
              action={
                similar?.searchLink && (
                  <a
                    href={similar.searchLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold text-brand hover:text-brand-dark no-underline"
                  >
                    Открыть поиск →
                  </a>
                )
              }
            >
              {similar?.bulls?.length ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                  {similar.bulls.slice(0, 8).map((bull, index) => (
                    <SimilarCarCard key={`${bull.url}-${index}`} bull={bull} />
                  ))}
                </div>
              ) : (
                <div className="bg-white border border-border rounded-2xl p-6 text-sm text-muted">
                  Похожих объявлений сейчас нет.
                </div>
              )}
            </Section>
          </div>
        )}
      </div>
    </div>
  )
}

function Chip({ children }) {
  return (
    <span className="text-[11px] font-semibold bg-surface border border-border text-muted rounded-md px-2 py-1">
      {children}
    </span>
  )
}

/** Ручная цена лота в йенах: локальный черновик + пересчёт по кнопке. */
function PriceControl({ initial, onApply }) {
  const [draft, setDraft] = useState(initial || '')

  const submit = (e) => {
    e.preventDefault()
    onApply(draft)
  }

  return (
    <form onSubmit={submit} className="flex items-end gap-2">
      <div>
        <label
          htmlFor="lot-price"
          className="block text-[11px] font-bold uppercase tracking-wider text-muted mb-1"
        >
          Цена лота, ¥
        </label>
        <input
          id="lot-price"
          type="number"
          min="1"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="авто"
          className="w-32 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/25 focus:border-brand"
        />
      </div>
      <button
        type="submit"
        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-dark text-white text-xs font-semibold hover:bg-black transition-colors"
      >
        <RefreshCw className="w-3.5 h-3.5" />
        Пересчитать
      </button>
    </form>
  )
}
