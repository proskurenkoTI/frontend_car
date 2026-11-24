import {
  getCarCompare,
  getPriceChangeChart,
  getSimilarCars,
  getAuctions,
  sendLog,
} from './api'

/**
 * Как бэкенд превращает название каталога в slug аукциона:
 * пробелы → подчёркивания, нижний регистр.
 */
function auctionSlug(title = '') {
  return title.trim().toLowerCase().replace(/\s+/g, '_')
}

/** Объём двигателя из названия модификации: «2.0 л, 150 л.с.». */
function engineVolumeFromTitle(title = '') {
  const match = title.match(/^\s*(\d+(?:[.,]\d+)?)\s*л(?:\.?)(?=\s*,)/)
  if (!match) return null
  return Math.round(Number(match[1].replace(',', '.')) * 1000)
}

/**
 * Отчёт по автомобилю.
 *
 * Сначала пробуем комбинированный `/car_compare`. Если он падает (500 на
 * калькуляторе Японии или недоступность части данных), собираем отчёт
 * из отдельных эндпоинтов — они не зависят от калькулятора и продолжают
 * работать. Так страница отдаёт результат вместо ошибки.
 */
export async function buildReport({ compareParams, catalog, importPurpose }) {
  try {
    const data = await getCarCompare(compareParams)
    return { report: data, degraded: false }
  } catch (error) {
    if (error.status !== 500) throw error

    // Пишем в журнал сервера, чтобы инцидент был виден на стороне бэкенда.
    sendLog(
      `car_compare failed (500), fallback to separate endpoints: ${error.message}`,
    ).catch(() => {})

    const { firm, model, modification } = catalog
    const engineVolume = engineVolumeFromTitle(modification?.title || '')

    const [chart, similar, auctions] = await Promise.all([
      getPriceChangeChart(compareParams).catch(() => null),
      getSimilarCars(compareParams).catch(() => null),
      getAuctions(
        auctionSlug(firm?.title),
        auctionSlug(model?.title),
        compareParams.year,
        engineVolume,
      ).catch(() => null),
    ])

    if (!chart && !similar && !auctions) throw error

    const hasPrices = (auctions?.examples || []).some(
      (car) => car.price_jpy > 0,
    )

    return {
      report: {
        query: { ...compareParams, import_purpose: importPurpose },
        price_change_chart: chart,
        similar_cars: similar,
        auctions,
        japan_import_response: null,
        results_availability: {
          price_change_chart: { available: Boolean(chart), missing_fields: [] },
          similar_cars: { available: Boolean(similar), missing_fields: [] },
          auctions: { available: Boolean(auctions), missing_fields: [] },
          japan_import_response: {
            available: false,
            missing_fields: hasPrices ? [] : ['price'],
          },
        },
      },
      degraded: true,
      degradedReason: error.message,
    }
  }
}
