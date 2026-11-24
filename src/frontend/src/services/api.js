/**
 * Клиент Cars Compare API.
 *
 * Все пути относительные — Vite проксирует их на бэкенд, поэтому
 * CORS не мешает ни в dev, ни в preview.
 */

async function request(path, params = {}) {
  const url = new URL(path, window.location.origin)
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, value)
    }
  })

  const response = await fetch(url)
  if (!response.ok) {
    const body = await response.json().catch(() => ({}))
    const error = new Error(body.detail || `HTTP ${response.status}`)
    error.status = response.status
    throw error
  }
  return response.json()
}

// ─── Справочники ──────────────────────────────────────────
export const getHealth = () => request('/health')
export const getRegions = () => request('/regions')

// ─── Каталог rate-car ─────────────────────────────────────
export const getFirms = () => request('/rate-car/firms')
export const getModels = (firmId, regionId = 0) =>
  request('/rate-car/models', { firm_id: firmId, region_id: regionId })
export const getYears = (modelId, wheel) =>
  request('/rate-car/years', { model_id: modelId, wheel })
export const getFrames = (modelId, year, wheel) =>
  request('/rate-car/frames', { model_id: modelId, year, wheel })
export const getGenerations = (modelId, year, frame, wheel) =>
  request('/rate-car/generations', { model_id: modelId, year, frame, wheel })
export const getModifications = (modelId, year, frame, generationId, wheel) =>
  request('/rate-car/modifications', {
    model_id: modelId,
    year,
    frame,
    generation_id: generationId,
    wheel,
  })

// ─── Отдельные результаты ─────────────────────────────────
export const getPriceChangeChart = (params) =>
  request('/rate-car/price-change-chart', params)
export const getSimilarCars = (params) =>
  request('/rate-car/similar-cars', params)
export const getAuctions = (firm, model, year, engineVolume) =>
  request('/auctions', { firm, model, year, engine_volume: engineVolume })

// ─── Комбинированный отчёт ────────────────────────────────
export const getCarCompare = (params) => request('/car_compare', params)

// ─── Журнал сервера ───────────────────────────────────────
export async function sendLog(message) {
  const response = await fetch('/log', {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' },
    body: message,
  })
  if (!response.ok) throw new Error(`HTTP ${response.status}`)
  return response.json()
}
