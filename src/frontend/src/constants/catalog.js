/** Значения и подписи, общие для формы каталога и отчёта. */

export const WHEEL_OPTIONS = [
  { value: 'UNDEFINED', label: 'Не важно' },
  { value: 'LEFT', label: 'Левый' },
  { value: 'RIGHT', label: 'Правый' },
  { value: 'LEFT_OR_RIGHT', label: 'Левый / правый' },
]

export const FRAME_LABELS = {
  other: 'Другое',
  OPEN: 'Открытый',
  COUPE: 'Купе',
  SUV: 'Внедорожник',
  HATCHBACK: 'Хэтчбек',
  SEDAN: 'Седан',
  MINIVAN_2_ROW_SEATS: 'Минивэн (2 ряда)',
  VAN: 'Фургон',
  WAGON: 'Универсал',
  MINIVAN_3_ROW_SEATS: 'Минивэн (3 ряда)',
  PICKUP: 'Пикап',
  TRUCK: 'Грузовой',
  HATCHBACK_3DR: 'Хэтчбек 3-дв',
  SUV_3DR: 'Внедорожник 3-дв',
  LIFTBACK: 'Лифтбек',
  BUS: 'Автобус',
  BOX_TRUCK: 'Бортовой',
  CHASSIS_CAB: 'Шасси с кабиной',
  TRUCK_TRACTOR: 'Тягач',
}

export const IMPORT_PURPOSES = [
  { value: 'USAGE', label: 'Для себя' },
  { value: 'RESALE', label: 'На перепродажу' },
]

export const AVAILABILITY_LABELS = {
  price_change_chart: 'Оценка цены',
  similar_cars: 'Похожие авто',
  auctions: 'Аукционы',
  japan_import_response: 'Расчёт импорта',
}
