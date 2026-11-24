import { Car } from 'lucide-react'

const YEAR = new Date().getFullYear()

export default function Footer() {
  return (
    <footer className="bg-darker text-white/70 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center">
                <Car className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-extrabold text-white">
                Авто<span className="text-brand">Срав</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed">
              Один отчёт вместо пяти вкладок: рыночная оценка, аукционы Японии,
              похожие объявления и полная стоимость импорта под ключ.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">
              В отчёте
            </h4>
            <ul className="space-y-2 text-sm">
              <li>Рекомендованная цена и срок продажи</li>
              <li>Лоты японских аукционов и средняя цена в йенах</li>
              <li>Пошлины, утильсбор, НДС и доставка</li>
              <li>Актуальные курсы ЦБ РФ</li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">
              Данные
            </h4>
            <ul className="space-y-2 text-sm">
              <li>Каталог марок, моделей и модификаций</li>
              <li>Поколения, рестайлинги и типы кузова</li>
              <li>85 регионов России</li>
              <li>Кеширование каталога 24 часа</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 mt-8 pt-6 text-center text-xs">
          © {YEAR} АвтоСрав. Данные предоставлены сервисами Drom.ru.
        </div>
      </div>
    </footer>
  )
}
