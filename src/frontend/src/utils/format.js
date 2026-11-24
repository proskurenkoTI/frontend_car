const CURRENCY_CODES = {
  RUB: '₽',
  JPY: '¥',
  USD: '$',
  EUR: '€',
  CNY: '¥',
}

export function currencySign(currency) {
  return CURRENCY_CODES[currency] || currency || ''
}

/** Число с разделителями: 1234567 → «1 234 567». */
export function formatNumber(value, digits = 0) {
  if (value === null || value === undefined || value === '') return null
  const number = Number(value)
  if (Number.isNaN(number)) return null
  return number.toLocaleString('ru-RU', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })
}

/** Деньги из схемы Money: { currency, value }. */
export function formatMoney(money, digits = 0) {
  if (!money || money.value === null || money.value === undefined) return '—'
  const value = formatNumber(money.value, digits)
  if (value === null) return '—'
  return `${value} ${currencySign(money.currency)}`
}

/** MoneyRange: { left, right }. */
export function formatMoneyRange(range, digits = 0) {
  if (!range?.left || !range?.right) return '—'
  const left = formatNumber(range.left.value, digits)
  const right = formatNumber(range.right.value, digits)
  if (left === null || right === null) return '—'
  return `${left} – ${right} ${currencySign(range.left.currency)}`
}

/** Значение PriceComponent: либо Money, либо MoneyRange. */
export function formatPriceComponent(component) {
  if (!component?.major) return '—'
  const { major } = component
  if (major.value !== undefined) return formatMoney(major)
  if (major.left) return formatMoneyRange(major)
  return '—'
}

/** Числовое значение компонента для диаграммы (в основной валюте). */
export function numericValue(component) {
  const major = component?.major
  if (!major) return null
  if (major.value !== undefined && major.value !== null) return Number(major.value)
  if (major.left && major.right)
    return (Number(major.left.value) + Number(major.right.value)) / 2
  return null
}

const TITLE_CASE = {
  PRICE: 'Цена автомобиля',
  SPENDING_ABROAD: 'Расходы за границей',
  FREIGHT_TO_VLADIVOSTOK: 'Доставка до Владивостока',
  SPENDING_TO_VLADIVOSTOK: 'Расходы до Владивостока',
  REGISTRATION_COSTS: 'Расходы на регистрацию',
  COMPANY_COMMISSION: 'Комиссия компании',
  CUSTOMS_DUTY: 'Пошлина и сборы',
  EXCISE_TAX: 'Акциз',
  CUSTOMS_FEE: 'Таможенный сбор',
  RECYCLING_FEE: 'Утилизационный сбор',
  VAT: 'НДС',
  SPENDING_AND_REGISTRATION: 'Расходы и регистрация',
  CUSTOMS_DUTY_AND_FEES: 'Пошлина и сборы',
}

export function componentLabel(name) {
  return TITLE_CASE[name] || name.replace(/_/g, ' ').toLowerCase()
}

export function humanize(value) {
  if (!value) return '—'
  return String(value)
    .replace(/_/g, ' ')
    .replace(/^\w/, (c) => c.toUpperCase())
}
