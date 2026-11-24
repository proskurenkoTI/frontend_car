import { Wallet, Percent } from 'lucide-react'
import {
  componentLabel,
  currencySign,
  formatMoney,
  formatNumber,
  formatPriceComponent,
  numericValue,
} from '../utils/format'

const SKIP_IN_TOTAL = new Set([
  'PRICE',
  'SPENDING_ABROAD',
  'FREIGHT_TO_VLADIVOSTOK',
  'SPENDING_TO_VLADIVOSTOK',
  'REGISTRATION_COSTS',
  'COMPANY_COMMISSION',
  'SPENDING_AND_REGISTRATION',
  'CUSTOMS_DUTY_AND_FEES',
])

export default function ImportSection({ data }) {
  const total = data?.result?.total_price
  const details = data?.result?.details || {}
  const rates = data?.central_bank_currency_rate?.form || {}

  const rows = Object.entries(details)
    .filter(([, component]) => component != null)
    .map(([name, component]) => ({
      name,
      label: componentLabel(name),
      display: formatPriceComponent(component),
      value: numericValue(component),
    }))

  const maxValue = Math.max(...rows.map((r) => r.value || 0), 1)

  const mainCosts = rows.filter(
    (r) => !SKIP_IN_TOTAL.has(r.name) && r.value != null,
  )

  return (
    <div className="space-y-4">
      {/* Итог + курс */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-gradient-to-br from-brand to-brand-dark rounded-2xl p-6 text-white shadow-lg shadow-brand/20">
          <div className="flex items-center gap-2 mb-3">
            <Wallet className="w-4 h-4 opacity-80" />
            <span className="text-xs uppercase tracking-wider opacity-80 font-semibold">
              Итого «под ключ»
            </span>
          </div>
          <div className="text-4xl font-extrabold tracking-tight">
            {formatMoney(total)}
          </div>
          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-sm opacity-85">
            <span>
              Цена лота: <strong>{data.form?.price ? `${formatNumber(data.form.price)} ${currencySign(data.form.currency)}` : '—'}</strong>
            </span>
            <span>
              Направление: <strong>{data.import_country || 'Япония'}</strong>
            </span>
            <span>
              Цель: <strong>{data.form?.importPurpose === 'RESALE' ? 'перепродажа' : 'личное пользование'}</strong>
            </span>
          </div>
        </div>

        <div className="bg-white border border-border rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <Percent className="w-4 h-4 text-brand" />
            <span className="text-xs uppercase tracking-wider font-semibold text-muted">
              Курс ЦБ РФ
            </span>
          </div>
          <p className="text-xs text-muted mb-3">
            {data.central_bank_currency_rate?.date || 'Дата не указана'}
          </p>
          <div className="space-y-2">
            {Object.entries(rates).length === 0 && (
              <p className="text-sm text-muted">Курсы не переданы</p>
            )}
            {Object.entries(rates).map(([code, rate]) => (
              <div key={code} className="flex items-baseline justify-between gap-2">
                <span className="text-sm font-semibold text-dark">{code}</span>
                <span className="text-sm text-muted">
                  {formatNumber(rate.value, 4)}
                  {rate.multipliedBy ? ` × ${rate.multipliedBy}` : ''}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Структура затрат */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-3 bg-white border border-border rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-surface">
              <tr>
                <th className="text-left px-4 py-2.5 font-semibold text-muted text-xs uppercase tracking-wider">
                  Статья расходов
                </th>
                <th className="text-right px-4 py-2.5 font-semibold text-muted text-xs uppercase tracking-wider">
                  Сумма
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.name} className="border-t border-border">
                  <td className="px-4 py-2.5 text-dark">{row.label}</td>
                  <td className="px-4 py-2.5 text-right font-semibold text-dark whitespace-nowrap">
                    {row.display}
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={2} className="px-4 py-6 text-center text-muted">
                    Детализация не передана
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="lg:col-span-2 bg-white border border-border rounded-2xl p-5">
          <h3 className="text-xs uppercase tracking-wider font-semibold text-muted mb-4">
            Из чего складывается цена
          </h3>
          <div className="space-y-3">
            {mainCosts.length === 0 && (
              <p className="text-sm text-muted">Нет данных для диаграммы</p>
            )}
            {mainCosts.map((row) => (
              <div key={row.name}>
                <div className="flex items-baseline justify-between gap-2 mb-1">
                  <span className="text-xs text-muted truncate">{row.label}</span>
                  <span className="text-xs font-semibold text-dark whitespace-nowrap">
                    {formatNumber(row.value)}
                  </span>
                </div>
                <div className="h-2 rounded-full bg-surface overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-brand to-accent"
                    style={{ width: `${Math.max((row.value / maxValue) * 100, 3)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Параметры запроса к калькулятору */}
      {data.form && (
        <div className="bg-white border border-border rounded-2xl p-5">
          <h3 className="text-xs uppercase tracking-wider font-semibold text-muted mb-3">
            Параметры расчёта
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-x-4 gap-y-3 text-sm">
            <Param label="Цена" value={data.form.price ? `${formatNumber(data.form.price)} ${currencySign(data.form.currency)}` : '—'} />
            <Param label="Возраст" value={data.form.vehicleAge?.replace(/_/g, ' ').toLowerCase()} />
            <Param label="Двигатель" value={data.form.engineType === 'ELECTRIC_MOTOR' ? 'электро' : 'ДВС'} />
            <Param
              label="Объём"
              value={
                data.form.engineVolumeInCubicCentimeters
                  ? `${formatNumber(data.form.engineVolumeInCubicCentimeters)} см³`
                  : '—'
              }
            />
            <Param
              label="Мощность"
              value={
                data.form.engineHorsePower
                  ? `${formatNumber(data.form.engineHorsePower)} л.с.`
                  : '—'
              }
            />
            <Param
              label="Цель"
              value={data.form.importPurpose === 'RESALE' ? 'перепродажа' : 'для себя'}
            />
          </div>
        </div>
      )}
    </div>
  )
}

function Param({ label, value }) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-wider text-muted/80">{label}</div>
      <div className="font-semibold text-dark truncate">{value || '—'}</div>
    </div>
  )
}
