import { useState, useEffect, useCallback } from 'react'
import { GitCompareArrows, Loader2, ChevronDown } from 'lucide-react'
import clsx from 'clsx'
import {
  getFirms,
  getModels,
  getYears,
  getFrames,
  getGenerations,
  getModifications,
  getRegions,
} from '../services/api'
import { FRAME_LABELS, WHEEL_OPTIONS } from '../constants/catalog'

const selectCls =
  'w-full appearance-none rounded-lg border bg-white px-3 py-2.5 pr-9 text-sm text-dark ' +
  'focus:outline-none focus:ring-2 focus:ring-brand/25 focus:border-brand transition-all'

function Field({ label, disabled, loading, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-muted">
          {label}
        </span>
      </div>
      <div className="relative">
        {children}
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
        {loading && (
          <Loader2 className="absolute right-9 top-1/2 -translate-y-1/2 w-4 h-4 text-brand animate-spin" />
        )}
      </div>
      {disabled && <span className="sr-only">Поле недоступно</span>}
    </div>
  )
}

/**
 * Каскадный каталог: регион → марка → модель → руль → год → кузов →
 * поколение → модификация. При отправке отдаёт выбранные объекты целиком,
 * чтобы страница могла строить fallback-запросы по названиям.
 */
export default function CarSearchForm({ onSubmit, disabled = false }) {
  const [regions, setRegions] = useState([])
  const [firms, setFirms] = useState([])
  const [models, setModels] = useState([])
  const [years, setYears] = useState([])
  const [frames, setFrames] = useState([])
  const [generations, setGenerations] = useState([])
  const [modifications, setModifications] = useState([])
  const [loading, setLoading] = useState({})

  const [regionId, setRegionId] = useState('0')
  const [firmId, setFirmId] = useState('')
  const [modelId, setModelId] = useState('')
  const [wheel, setWheel] = useState('UNDEFINED')
  const [year, setYear] = useState('')
  const [frame, setFrame] = useState('')
  const [generationId, setGenerationId] = useState('')
  const [modificationId, setModificationId] = useState('')

  useEffect(() => {
    getRegions().then(setRegions).catch(() => {})
    getFirms().then(setFirms).catch(() => {})
  }, [])

  const resetDependent = () => {
    setModelId('')
    setModels([])
    setYear('')
    setYears([])
    setFrame('')
    setFrames([])
    setGenerationId('')
    setGenerations([])
    setModificationId('')
    setModifications([])
  }

  const load = async (key, fn, apply) => {
    setLoading((l) => ({ ...l, [key]: true }))
    try {
      apply(await fn())
    } catch {
      apply([])
    } finally {
      setLoading((l) => ({ ...l, [key]: false }))
    }
  }

  const onFirm = useCallback(
    (id) => {
      setFirmId(id)
      resetDependent()
      if (id) load('models', () => getModels(id, Number(regionId)), setModels)
    },
    [regionId],
  )

  const onModel = useCallback(
    (id) => {
      setModelId(id)
      setYear(''); setYears([])
      setFrame(''); setFrames([])
      setGenerationId(''); setGenerations([])
      setModificationId(''); setModifications([])
      if (id) load('years', () => getYears(id, wheel), setYears)
    },
    [wheel],
  )

  const onWheel = useCallback(
    (value) => {
      setWheel(value)
      setYear(''); setYears([])
      setFrame(''); setFrames([])
      setGenerationId(''); setGenerations([])
      setModificationId(''); setModifications([])
      if (modelId) load('years', () => getYears(modelId, value), setYears)
    },
    [modelId],
  )

  const onYear = useCallback(
    (value) => {
      setYear(value)
      setFrame(''); setFrames([])
      setGenerationId(''); setGenerations([])
      setModificationId(''); setModifications([])
      if (value && modelId)
        load('frames', () => getFrames(modelId, value, wheel), setFrames)
    },
    [modelId, wheel],
  )

  const onFrame = useCallback(
    (value) => {
      setFrame(value)
      setGenerationId(''); setGenerations([])
      setModificationId(''); setModifications([])
      if (value && modelId && year)
        load('generations', () => getGenerations(modelId, year, value, wheel), setGenerations)
    },
    [modelId, year, wheel],
  )

  const onGeneration = useCallback(
    (id) => {
      setGenerationId(id)
      setModificationId('')
      setModifications([])
      const generation = generations.find((g) => g.id === id)
      if (generation && modelId && year && frame)
        load(
          'modifications',
          () => getModifications(modelId, year, frame, id, wheel),
          setModifications,
        )
    },
    [generations, modelId, year, frame, wheel],
  )

  const isReady =
    !!firmId && !!modelId && !!year && !!frame && !!generationId && !!modificationId

  const submit = (e) => {
    e.preventDefault()
    if (!isReady || disabled) return
    onSubmit?.({
      regionId,
      firmId,
      modelId,
      wheel,
      year,
      frame,
      generationId,
      modificationId,
      firm: firms.find((f) => String(f.id) === firmId),
      model: models.find((m) => String(m.id) === modelId),
      generation: generations.find((g) => g.id === generationId),
      modification: modifications.find((m) => String(m.id) === modificationId),
      region: regions.find((r) => String(r.code) === regionId),
    })
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <Field label="Регион">
          <select
            className={selectCls}
            value={regionId}
            onChange={(e) => setRegionId(e.target.value)}
          >
            {regions.map((r) => (
              <option key={r.code} value={String(r.code)}>
                {r.name}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Марка" loading={loading.models}>
          <select
            className={selectCls}
            value={firmId}
            onChange={(e) => onFirm(e.target.value)}
          >
            <option value="">Все марки</option>
            {firms.map((f) => (
              <option key={f.id} value={String(f.id)}>
                {f.title}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Модель" loading={loading.years} disabled={!firmId}>
          <select
            className={clsx(selectCls, !firmId && 'opacity-50 cursor-not-allowed')}
            value={modelId}
            onChange={(e) => onModel(e.target.value)}
            disabled={!firmId}
          >
            <option value="">Выберите модель</option>
            {models.map((m) => (
              <option key={m.id} value={String(m.id)}>
                {m.title}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Руль">
          <select
            className={selectCls}
            value={wheel}
            onChange={(e) => onWheel(e.target.value)}
          >
            {WHEEL_OPTIONS.map((w) => (
              <option key={w.value} value={w.value}>
                {w.label}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Год" loading={loading.frames} disabled={!modelId}>
          <select
            className={clsx(selectCls, !modelId && 'opacity-50 cursor-not-allowed')}
            value={year}
            onChange={(e) => onYear(e.target.value)}
            disabled={!modelId}
          >
            <option value="">Выберите год</option>
            {years.map((y) => (
              <option key={y} value={String(y)}>
                {y}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Кузов" loading={loading.generations} disabled={!year}>
          <select
            className={clsx(selectCls, !year && 'opacity-50 cursor-not-allowed')}
            value={frame}
            onChange={(e) => onFrame(e.target.value)}
            disabled={!year}
          >
            <option value="">Выберите кузов</option>
            {frames.map((f) => (
              <option key={f} value={f}>
                {FRAME_LABELS[f] || f}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Поколение" loading={loading.modifications} disabled={!frame}>
          <select
            className={clsx(selectCls, !frame && 'opacity-50 cursor-not-allowed')}
            value={generationId}
            onChange={(e) => onGeneration(e.target.value)}
            disabled={!frame}
          >
            <option value="">Выберите поколение</option>
            {generations.map((g) => (
              <option key={g.id} value={g.id}>
                {g.title}
                {g.periodTitle ? ` · ${g.periodTitle}` : ''}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Модификация" disabled={!generationId}>
          <select
            className={clsx(selectCls, !generationId && 'opacity-50 cursor-not-allowed')}
            value={modificationId}
            onChange={(e) => setModificationId(e.target.value)}
            disabled={!generationId}
          >
            <option value="">Выберите модификацию</option>
            {modifications.map((m) => (
              <option key={m.id} value={String(m.id)}>
                {m.title}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="flex flex-wrap items-center gap-3 pt-1">
        <button
          type="submit"
          disabled={!isReady || disabled}
          className={clsx(
            'inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all no-underline',
            isReady && !disabled
              ? 'bg-brand text-white hover:bg-brand-dark shadow-lg shadow-brand/25'
              : 'bg-border text-muted cursor-not-allowed',
          )}
        >
          <GitCompareArrows className="w-4 h-4" />
          Построить отчёт
        </button>
        {!isReady && (
          <span className="text-xs text-muted">
            Заполните все поля — отчёт строится по модификации
          </span>
        )}
      </div>
    </form>
  )
}
