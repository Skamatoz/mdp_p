<template>
  <section class="bg-white overflow-auto">
    <!-- Профиль пользователя -->
    <div class="w-full p-1">
      <div class="flex h-fit w-full bg-[#F7F7F8] p-2 rounded-xl justify-between">
        <div class="flex gap-5">
          <div class="flex h-16 w-16 bg-white rounded-xl text-4xl items-center justify-center">
            {{ firstLetter }}
          </div>
          <div class="mt-1">
            <h1 class="font-semibold text-xl">{{ name }}</h1>
            <h2>{{ email }}</h2>
          </div>
        </div>
      </div>
    </div>

    <!-- Переключатель периодов -->
    <div class="flex flex-wrap sm:flex-nowrap text-lg mb-4 p-1 gap-2">
      <div class="w-full p-1">
        <div class="flex h-fit w-full bg-[#F7F7F8] p-2 gap-2 rounded-xl">
          <button
            :class="!isGarageView ? 'bg-[#1F0B31] text-white' : ''"
            :aria-pressed="!isGarageView"
            aria-label="Показать аренды"
            @click="isGarageView = false"
            class="py-2 rounded-lg w-full transition-colors duration-200 hover:bg-gray-100"
          >
            Аренды
          </button>
          <button
            :class="isGarageView ? 'bg-[#1F0B31] text-white' : ''"
            :aria-pressed="isGarageView"
            aria-label="Показать гараж"
            @click="isGarageView = true"
            class="py-2 rounded-lg w-full transition-colors duration-200 hover:bg-gray-100"
          >
            Гараж
          </button>
        </div>
        <div v-show="!isGarageView" class="flex h-fit w-full bg-[#F7F7F8] p-2 gap-2 rounded-xl mt-2">
          <select
            :value="anchorMonth"
            @change="setAnchorMonth($event.target.value)"
            aria-label="Выбрать месяц"
            class="py-2 px-2 rounded-lg w-full transition-colors duration-200 hover:bg-gray-100 capitalize cursor-pointer appearance-none text-center bg-white"
          >
            <option v-for="m in monthOptions" :key="m.value" :value="m.value">
              {{ m.label }}
            </option>
          </select>
        </div>
      </div>

      <!-- Карточки статистики -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
        <div
          v-for="stat in currentStats"
          :key="stat.key"
          class="flex flex-col w-full sm:w-96 h-fit bg-[#F7F7F8] p-4 rounded-2xl"
        >
          <span class="flex w-full text-base">{{ stat.title }}</span>
          <span class="flex w-full text-4xl font-semibold" :class="stat.color">{{ stat.value }}</span>
          <hr class="my-2 border-t border-[#E9E6EC]" />
          <span class="flex w-full text-base text-stone-400">{{ stat.subtitle }}</span>
        </div>
      </div>
    </div>

    <!-- Переключатель типа транспорта -->
    <div v-show="showVehicleToggle" class="p-1">
      <div class="flex h-fit w-full bg-[#F7F7F8] p-2 gap-2 rounded-xl">
        <button
          v-for="type in VEHICLE_TYPES"
          :key="type.value"
          :class="vehicleType === type.value ? 'bg-[#1F0B31] text-white' : ''"
          :aria-pressed="vehicleType === type.value"
          @click="setVehicleType(type.value)"
          class="py-2 rounded-lg w-full transition-colors duration-200 hover:bg-gray-100"
        >
          {{ type.label }}
        </button>
      </div>
    </div>

    <!-- Поиск и сброс -->
    <div class="flex space-x-2 items-center py-2 pl-1 w-full pr-1 h-16">
      <div class="flex gap-2 h-full w-full sm:w-96">
        <div class="h-full w-full">
          <input
            v-model="searchTerm"
            id="search-input"
            name="q"
            type="text"
            placeholder="Модель или номер"
            class="h-full p-2 px-4 border-2 border-[#E9E6EC] rounded-xl w-full focus:border-[#1F0B31] focus:outline-none transition-colors"
            @input="onSearchInput"
          />
        </div>
        <button
          @click="clearSearch"
          class="bg-[#E9E6EC] h-full px-4 rounded-xl hover:bg-gray-200 transition-colors duration-200"
          :disabled="!searchTerm"
        >
          Сброс
        </button>
      </div>
    </div>

    <!-- Кнопки сортировки -->
    <div class="flex gap-2 mb-4 h-13 p-1">
      <button
        v-for="sort in SORT_OPTIONS"
        :key="sort.key"
        @click="setSort(sort.key)"
        class="bg-[#E9E6EC] h-full w-full rounded-xl hover:bg-gray-200 transition-colors duration-200"
        :aria-label="`Сортировать по ${sort.label.toLowerCase()}`"
      >
        <span class="px-1">{{ sort.label }} {{ getSortIcon(sort.key) }}</span>
      </button>
    </div>

    <!-- Состояние загрузки -->
    <div v-if="pending" class="flex items-center justify-center h-32">
      <div class="flex flex-col items-center gap-2">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1F0B31]"></div>
        <p class="text-gray-500">Загрузка данных...</p>
      </div>
    </div>

    <!-- Ошибка -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-xl p-4 m-1">
      <p class="text-red-600">Произошла ошибка при загрузке данных</p>
      <button
        @click="refresh"
        class="mt-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
      >
        Повторить
      </button>
    </div>

    <!-- Таблица байков -->
    <table v-show="vehicleType === 'Bike' && !pending" class="w-full mb-8">
      <thead class="bg-[#F7F7F8]">
        <tr>
          <th class="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">
            Модель
          </th>
          <th class="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">
            Прош
          </th>
          <th class="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">
            Этот
          </th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-200">
        <tr v-for="vehicle in filteredBikes" :key="vehicle.id" class="hover:bg-gray-100 transition-colors">
          <td class="px-2 py-3 text-lg font-bold text-gray-900">
            <div class="flex flex-wrap gap-1 mb-1">
              <span class="p-1 text-xs text-gray-500 rounded-xl font-normal">
                {{ vehicle.price.toLocaleString('ru-RU') }} ฿
              </span>
              <span class="p-1 text-xs text-gray-500 rounded-xl font-normal">
                [{{ vehicle.mileageNow.toLocaleString('ru-RU') }} км.]
              </span>
            </div>
            {{ vehicle.name }}
          </td>
          <td class="px-2 py-3 text-sm text-gray-900 font-medium">
            {{ vehicle.lastMonthRevenue.toLocaleString('ru-RU') }} ฿
          </td>
          <td class="px-2 py-3 text-sm text-gray-900 font-medium">
            {{ vehicle.revenue.toLocaleString('ru-RU') }} ฿
          </td>
        </tr>
      </tbody>
      <tfoot class="bg-[#F7F7F8]">
        <tr>
          <td class="px-2 py-2 font-medium">Итого байки</td>
          <td class="px-2 py-2 font-medium">{{ totalBikeRevenueLastMonth.toLocaleString('ru-RU') }} ฿</td>
          <td class="px-2 py-2 font-medium">{{ totalBikeRevenue.toLocaleString('ru-RU') }} ฿</td>
        </tr>
      </tfoot>
    </table>

    <!-- Таблица авто -->
    <table v-show="vehicleType === 'Cars' && !pending" class="w-full mb-8">
      <thead class="bg-[#F7F7F8]">
        <tr>
          <th class="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">
            Модель
          </th>
          <th class="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">
            Прош
          </th>
          <th class="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">
            Этот
          </th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-200">
        <tr v-for="vehicle in filteredCars" :key="vehicle.id" class="hover:bg-gray-100 transition-colors">
          <td class="px-2 py-3 text-lg font-bold text-gray-900">
            <div class="flex flex-wrap gap-1 mb-1">
              <span class="p-1 text-xs text-gray-500 rounded-xl font-normal">
                {{ vehicle.price.toLocaleString('ru-RU') }} ฿
              </span>
              <span class="p-1 text-xs text-gray-500 rounded-xl font-normal">
                [{{ vehicle.mileageNow.toLocaleString('ru-RU') }} км.]
              </span>
            </div>
            {{ vehicle.name }}
          </td>
          <td class="px-2 py-3 text-sm text-gray-900 font-medium">
            {{ vehicle.lastMonthRevenue.toLocaleString('ru-RU') }} ฿
          </td>
          <td class="px-2 py-3 text-sm text-gray-900 font-medium">
            {{ vehicle.revenue.toLocaleString('ru-RU') }} ฿
          </td>
        </tr>
      </tbody>
      <tfoot class="bg-[#F7F7F8]">
        <tr>
          <td class="px-2 py-2 font-medium">Итого авто</td>
          <td class="px-2 py-2 font-medium">{{ totalCarRevenueLastMonth.toLocaleString('ru-RU') }} ฿</td>
          <td class="px-2 py-2 font-medium">{{ totalCarRevenue.toLocaleString('ru-RU') }} ฿</td>
        </tr>
      </tfoot>
    </table>

    <!-- Футер с кнопкой выхода -->
    <div  class="w-full p-1 mt-8">
      <div class="flex h-fit w-full bg-[#F7F7F8] p-2 rounded-xl justify-between">
        <div class="flex gap-5">
          <div class="flex h-16 w-16 bg-white rounded-xl"></div>
          <div class="mt-1">
            <h1 class="font-semibold text-xl">{{ name }}</h1>
            <h2>{{ email }}</h2>
          </div>
        </div>
        <button
          @click="logout"
          :disabled="loggingOut"
          class="flex items-center justify-center gap-3 px-3 w-22 h-10 rounded-xl text-xs bg-[#1F0B31] text-white font-medium cursor-pointer mt-3 hover:bg-[#2D1640] transition-colors disabled:opacity-50"
        >
          {{ loggingOut ? 'Выход...' : 'Выйти' }}
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, ref, reactive, watch, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

// Встроенные компоненты (без defineAsyncComponent)
// Они будут определены в template как обычные элементы

// Дебаунс-функция (простая реализация без @vueuse/core)
function useDebounceFn(fn, delay) {
  let timeoutId
  return function(...args) {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn.apply(this, args), delay)
  }
}

// Константы
// Список месяцев для дропдаунa: текущий + 6 предыдущих
const MONTH_DEPTH = 7

function monthKey(year, monthIndex) {
  return `${year}-${String(monthIndex + 1).padStart(2, '0')}`
}

function parseMonthKey(key) {
  const [y, m] = key.split('-').map(Number)
  return { year: y, monthIndex: m - 1 }
}

function monthLabel(year, monthIndex) {
  return new Date(year, monthIndex, 1).toLocaleString('ru', { month: 'long', year: 'numeric' })
}

const VEHICLE_TYPES = [
  { value: 'Bike', label: 'Байки' },
  { value: 'Cars', label: 'Авто' }
]

const SORT_OPTIONS = [
  { key: 'mileageNow', label: 'Пробег' },
  { key: 'price', label: 'Цена' },
  { key: 'lastMonthRevenue', label: 'Прошлый' },
  { key: 'revenue', label: 'Текущий' }
]

// Композабли и роутер
const router = useRouter()
const config = useRuntimeConfig()

// Реактивные данные пользователя
const email = ref(localStorage.getItem('email'))
const name = ref(localStorage.getItem('name'))
const firstLetter = computed(() => name.value?.charAt(0) || '?')

// Состояние UI
const searchTerm = ref('')
const anchorMonth = ref((() => {
  const now = new Date()
  return monthKey(now.getFullYear(), now.getMonth())
})())
const isGarageView = ref(false)

// Опции дропдауна: текущий + 6 предыдущих месяцев
const monthOptions = computed(() => {
  const opts = []
  const now = new Date()
  for (let i = 0; i < MONTH_DEPTH; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    opts.push({
      value: monthKey(d.getFullYear(), d.getMonth()),
      label: monthLabel(d.getFullYear(), d.getMonth())
    })
  }
  return opts
})
const vehicleType = ref('Bike')
const showFooter = ref(false)
const loggingOut = ref(false)

// Состояние сортировки
const sortKey = ref('revenue')
const sortDirection = ref('desc')

// Параметры запроса
const params2 = reactive({ q: '' })

// Вычисляемые свойства для UI
const showVehicleToggle = computed(() => countCars.value > 0)

// API запросы
const { data: partnerData } = await useFetch(`${config.public.apiBase}/api/partner/kabinet/all`, {
  credentials: 'include',
  params: { email: email.value }
})

const partnerId = computed(() => partnerData.value?.data || null)

const { data, pending, error, refresh } = await useFetch(
  () => partnerId.value ? `${config.public.apiBase}/api/partner/portal/${partnerId.value}` : null,
  {
    credentials: 'include',
    params: params2,
    immediate: true,
    onResponseError({ response }) {
      console.error('API Error:', response.status)
    }
  }
)

// Данные партнера и гаражей
const partner = computed(() =>
  data.value?.data || { garages: [], royaltyBike: 0, royaltyCar: 0 }
)
const garages = computed(() => partner.value.garages || [])

// Коэффициенты выручки
const coefficients = computed(() => ({
  bike: partner.value.royaltyBike / 100,
  car: partner.value.royaltyCar / 100
}))

// Утилиты для работы с датами
// isCurrentMonth — попадает ли дата в ВЫБРАННЫЙ (anchor) месяц
// isLastMonth — попадает ли дата в месяц, предшествующий выбранному
const dateUtils = {
  isCurrentMonth(date) {
    const { year, monthIndex } = parseMonthKey(anchorMonth.value)
    const d = new Date(date)
    return d.getFullYear() === year && d.getMonth() === monthIndex
  },

  isLastMonth(date) {
    const { year, monthIndex } = parseMonthKey(anchorMonth.value)
    const d = new Date(date)
    const prev = new Date(year, monthIndex - 1, 1)
    return d.getFullYear() === prev.getFullYear() && d.getMonth() === prev.getMonth()
  }
}

// Функции расчета выручки
function calculatePaidAmount(bookings, filterFn) {
  return bookings
    .filter(filterFn)
    .reduce((sum, booking) => sum + Number(booking.paid || 0), 0)
}

function sumPaidThisMonth(bookings) {
  return calculatePaidAmount(bookings, b => dateUtils.isCurrentMonth(b.startRental))
}

function sumPaidLastMonth(bookings) {
  return calculatePaidAmount(bookings, b => dateUtils.isLastMonth(b.startRental))
}

// Обработка транспортных средств
function processVehicles(isBike) {
  const coefficient = isBike ? coefficients.value.bike : coefficients.value.car

  return garages.value
    .filter(g => isBike
      ? (g.vehicleType === 'SCOOTER' || g.vehicleType === 'MOTORCYCLE')
      : g.vehicleType === 'CAR'
    )
    .map(g => {
      const currentRevenue = sumPaidThisMonth(g.bookings)
      const lastMonthRevenue = sumPaidLastMonth(g.bookings)

      return {
        id: g.id,
        name: g.name,
        mileageNow: g.mileageNow || 0,
        price: Number(g.price) || 0,
        revenue: Math.round(currentRevenue * coefficient),
        lastMonthRevenue: Math.round(lastMonthRevenue * coefficient)
      }
    })
}

// Данные по транспорту
const rawBikeData = computed(() => processVehicles(true))
const rawCarData = computed(() => processVehicles(false))

// Сортировка данных
function sortData(data) {
  return [...data].sort((a, b) => {
    const valA = Number(a[sortKey.value]) || 0
    const valB = Number(b[sortKey.value]) || 0
    return sortDirection.value === 'asc' ? valA - valB : valB - valA
  })
}

const bikeRevenue = computed(() => sortData(rawBikeData.value))
const carRevenue = computed(() => sortData(rawCarData.value))

// Фильтрация по поисковому запросу
const filteredBikes = computed(() => {
  if (!searchTerm.value.trim()) return bikeRevenue.value

  const query = searchTerm.value.toLowerCase().trim()
  return bikeRevenue.value.filter(bike =>
    bike.name.toLowerCase().includes(query)
  )
})

const filteredCars = computed(() => {
  if (!searchTerm.value.trim()) return carRevenue.value

  const query = searchTerm.value.toLowerCase().trim()
  return carRevenue.value.filter(car =>
    car.name.toLowerCase().includes(query)
  )
})

// Итоговые суммы
const totals = computed(() => {
  const bikes = bikeRevenue.value
  const cars = carRevenue.value

  return {
    bike: {
      revenue: bikes.reduce((sum, x) => sum + x.revenue, 0),
      lastMonthRevenue: bikes.reduce((sum, x) => sum + x.lastMonthRevenue, 0),
      price: bikes.reduce((sum, x) => sum + x.price, 0),
      count: bikes.length
    },
    car: {
      revenue: cars.reduce((sum, x) => sum + x.revenue, 0),
      lastMonthRevenue: cars.reduce((sum, x) => sum + x.lastMonthRevenue, 0),
      price: cars.reduce((sum, x) => sum + x.price, 0),
      count: cars.length
    }
  }
})

// Удобные алиасы для шаблона
const totalBikeRevenue = computed(() => totals.value.bike.revenue)
const totalCarRevenue = computed(() => totals.value.car.revenue)
const totalBikeRevenueLastMonth = computed(() => totals.value.bike.lastMonthRevenue)
const totalCarRevenueLastMonth = computed(() => totals.value.car.lastMonthRevenue)
const totalBikePrice = computed(() => totals.value.bike.price)
const totalCarPrice = computed(() => totals.value.car.price)
const countBikes = computed(() => totals.value.bike.count)
const countCars = computed(() => totals.value.car.count)

// Статистика для текущего периода
const anchorLabel = computed(() => {
  const { year, monthIndex } = parseMonthKey(anchorMonth.value)
  return monthLabel(year, monthIndex)
})

const currentStats = computed(() => {
  if (!isGarageView.value) {
    const subtitle = `За ${anchorLabel.value}`
    return [
      {
        key: 'total-current',
        title: 'Общая выручка',
        value: `${(totalBikeRevenue.value + totalCarRevenue.value).toLocaleString('ru-RU')} ฿`,
        subtitle,
        color: 'text-green-700'
      },
      {
        key: 'bike-current',
        title: 'Выручка байков',
        value: `${totalBikeRevenue.value.toLocaleString('ru-RU')} ฿`,
        subtitle,
        color: 'text-green-700'
      },
      {
        key: 'car-current',
        title: 'Выручка авто',
        value: `${totalCarRevenue.value.toLocaleString('ru-RU')} ฿`,
        subtitle,
        color: 'text-green-700'
      }
    ]
  }

  // garage view
  return (() => {
    return [
        {
          key: 'bike-count',
          title: 'Количество байков',
          value: `${countBikes.value.toLocaleString('ru-RU')} шт.`,
          subtitle: '--',
          color: 'text-gray-700'
        },
        {
          key: 'car-count',
          title: 'Количество авто',
          value: `${countCars.value.toLocaleString('ru-RU')} шт.`,
          subtitle: '--',
          color: 'text-gray-700'
        },
        {
          key: 'bike-price',
          title: 'Стоимость байков',
          value: `${totalBikePrice.value.toLocaleString('ru-RU')} ฿`,
          subtitle: '--',
          color: 'text-gray-700'
        },
        {
          key: 'car-price',
          title: 'Стоимость авто',
          value: `${totalCarPrice.value.toLocaleString('ru-RU')} ฿`,
          subtitle: '--',
          color: 'text-gray-700'
        },
        {
          key: 'total-price',
          title: 'Стоимость общая',
          value: `${(totalCarPrice.value + totalBikePrice.value).toLocaleString('ru-RU')} ฿`,
          subtitle: '--',
          color: 'text-gray-700'
        }
      ]
  })()
})

// Обработчики событий
function setAnchorMonth(key) {
  anchorMonth.value = key
}

function setVehicleType(type) {
  vehicleType.value = type
}

function setSort(key) {
  if (sortKey.value === key) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortDirection.value = 'desc'
  }
}

function getSortIcon(key) {
  if (sortKey.value !== key) return ''
  return sortDirection.value === 'asc' ? '▲' : '▼'
}

// Дебаунс для поиска
const debouncedSearch = useDebounceFn(() => {
  params2.q = searchTerm.value.trim()
  refresh()
}, 300)

function onSearchInput() {
  debouncedSearch()
}

function clearSearch() {
  searchTerm.value = ''
  params2.q = ''
  refresh()
}

// Логаут с обработкой ошибок
async function logout() {
  try {
    loggingOut.value = true

    await fetch(`${config.public.apiBase}/api/auth/logout`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user: partnerId.value }),
      keepalive: true
    })
  } catch (err) {
    console.error('Logout error:', err)
  } finally {
    // Очищаем localStorage в любом случае
    const keysToRemove = ['role', 'email', 'userName', 'auth', 'name']
    keysToRemove.forEach(key => localStorage.removeItem(key))

    loggingOut.value = false
    router.push('/login')
  }
}

// Отслеживание состояния загрузки
watch(pending, (newVal) => {
  if (newVal) {
    showFooter.value = true
  }
})

// Обновление данных пользователя при изменении localStorage
function updateUserData() {
  email.value = localStorage.getItem('email')
  name.value = localStorage.getItem('name')
}

// Слушаем изменения в localStorage (если данные обновляются из других компонентов)
window.addEventListener('storage', updateUserData)

// Очистка при размонтировании
onUnmounted(() => {
  window.removeEventListener('storage', updateUserData)
})
</script>

<style scoped>
/* Кастомные стили для улучшения анимаций */
.transition-colors {
  transition-property: color, background-color, border-color;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}

/* Улучшение фокуса для доступности */
button:focus-visible,
input:focus-visible {
  outline: 2px solid #1F0B31;
  outline-offset: 2px;
}

/* Плавная анимация для таблиц */
table {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
