<template>
  <section class=" bg-white overflow-auto">
      <!-- <div v-if="pending || !data">
        <p class="text-gray-400">Загрузка данных...</p>
      </div> -->
      <div  class="w-full p-1">
          <div class="flex h-fit w-full bg-[#F7F7F8] p-2 rounded-xl justify-between">
              <div class="flex gap-5">
              <div class="flex h-16 w-16 bg-white rounded-xl text-4xl items-center justify-center">{{firstLetter}}</div>
              <div class="mt-1">
                  <h1 class="font-semibold text-xl">{{name}}</h1>
                  <h2>{{email}}</h2>
              </div>
              </div>

          </div>
      </div>

    <div class="flex flex-wrap sm:flex-nowra text-lg mb-4 p-1 gap-2">
        <div  class="w-full p-1">
            <div class="flex h-fit w-full bg-[#F7F7F8] p-2 gap-2 rounded-xl">
                <button :class="month==='this'? 'bg-[#1F0B31] text-white ': ''" @click="monthF('this')" class="py-2 rounded-lg w-full">Сейчас</button>
                <button :class="month==='past'? 'bg-[#1F0B31] text-white ': ''" @click="monthF('past')" class="py-2 rounded-lg w-full">Прошлый</button>
                <button :class="month==='garage'? 'bg-[#1F0B31] text-white ': ''" @click="monthF('garage')" class="py-2 rounded-lg w-full">Гараж</button>
            </div>
        </div>
        <!-- ПРОШЛЫЙ -->
        <div v-show="month==='past'" class="flex flex-wrap w-full gap-2">
        <div class="flex flex-col w-full sm:w-96 h-fit bg-[#F7F7F8] p-4 rounded-2xl ">
            <span class="flex w-full text-base">Общая выручка</span>
            <span class="flex w-full text-4xl font-semibold text-orange-500">{{(Math.round( totalBikeRevenueLastMonth + totalCarRevenueLastMonth)|| 0).toLocaleString('ru-RU')}} ฿</span>
            <hr class="my-2 border-t border-[#E9E6EC]" />
            <span class="flex w-full text-base text-stone-400">За прошлый месяц</span>
        </div>

        <div class="flex flex-col w-full sm:w-96 h-fit bg-[#F7F7F8] p-4 rounded-2xl ">
            <span class="flex w-full text-base">Выручка байков</span>
            <span class="flex w-full text-4xl font-semibold text-orange-500">{{(totalBikeRevenueLastMonth|| 0).toLocaleString('ru-RU')}} ฿</span>
            <hr class="my-2 border-t border-[#E9E6EC]" />
            <span class="flex w-full text-base text-stone-400">За прошлый месяц</span>
        </div>

        <div class="flex flex-col w-full sm:w-96 h-fit bg-[#F7F7F8] p-4 rounded-2xl ">
            <span class="flex w-full text-base">Выручка авто</span>
            <span class="flex w-full text-4xl font-semibold text-orange-500">{{(totalCarRevenueLastMonth|| 0).toLocaleString('ru-RU')}} ฿</span>
            <hr class="my-2 border-t border-[#E9E6EC]" />
            <span class="flex w-full text-base text-stone-400">За прошлый месяц</span>
        </div>
        </div>
        <!-- ТЕКУЩИЙ -->
        <div v-show="month==='this'" class="flex flex-wrap w-full gap-2">
        <div class="flex flex-col w-full sm:w-96 h-fit bg-[#F7F7F8] p-4 rounded-2xl ">
            <span class="flex w-full text-base">Общая выручка</span>
            <span class="flex w-full text-4xl font-semibold text-green-700">{{(Math.round(totalBikeRevenue + totalCarRevenue)|| 0).toLocaleString('ru-RU')}} ฿</span>
            <hr class="my-2 border-t border-[#E9E6EC]" />
            <span class="flex w-full text-base text-stone-400">За текущий месяц</span>
        </div>

        <div class="flex flex-col w-full sm:w-96 h-fit bg-[#F7F7F8] p-4 rounded-2xl ">
            <span class="flex w-full text-base">Выручка авто</span>
            <span class="flex w-full text-4xl font-semibold text-green-700">{{(totalBikeRevenue|| 0).toLocaleString('ru-RU')}} ฿</span>
            <hr class="my-2 border-t border-[#E9E6EC]" />
            <span class="flex w-full text-base text-stone-400">За текущий месяц</span>
        </div>

        <div class="flex flex-col w-full sm:w-96 h-fit bg-[#F7F7F8] p-4 rounded-2xl ">
            <span class="flex w-full text-base">Выручка авто</span>
            <span class="flex w-full text-4xl font-semibold text-green-700">{{(totalCarRevenue|| 0).toLocaleString('ru-RU')}} ฿</span>
            <hr class="my-2 border-t border-[#E9E6EC]" />
            <span class="flex w-full text-base text-stone-400">За текущий месяц</span>
        </div>
        </div>
        <!-- Количество -->
        <div v-show="month==='garage'" class="flex flex-wrap w-full gap-2">
        <div class="flex flex-col w-full sm:w-96 h-fit bg-[#F7F7F8] p-4 rounded-2xl ">
            <span class="flex w-full text-base">Количество байков</span>
            <span class="flex w-full text-4xl font-semibold text-gray-700">{{(countBikes|| 0).toLocaleString('ru-RU')}} шт.</span>
            <hr class="my-2 border-t border-[#E9E6EC]" />
            <span class="flex w-full text-base text-stone-400">Нужно больше золота, милорд</span>
        </div>

        <div class="flex flex-col w-full sm:w-96 h-fit bg-[#F7F7F8] p-4 rounded-2xl ">
            <span class="flex w-full text-base">Количество авто</span>
            <span class="flex w-full text-4xl font-semibold text-gray-700">{{(countCars|| 0).toLocaleString('ru-RU')}} шт.</span>
            <hr class="my-2 border-t border-[#E9E6EC]" />
            <span class="flex w-full text-base text-stone-400">Нужно больше золота, милорд</span>
        </div>

        <div class="flex flex-col w-full sm:w-96 h-fit bg-[#F7F7F8] p-4 rounded-2xl ">
            <span class="flex w-full text-base">Стоимость байков</span>
            <span class="flex w-full text-4xl font-semibold text-gray-700">{{(totalBikePrice|| 0).toLocaleString('ru-RU')}} ฿</span>
            <hr class="my-2 border-t border-[#E9E6EC]" />
            <span class="flex w-full text-base text-stone-400">Нужно больше золота, милорд</span>
        </div>

        <div class="flex flex-col w-full sm:w-96 h-fit bg-[#F7F7F8] p-4 rounded-2xl ">
            <span class="flex w-full text-base">Стоимость авто</span>
            <span class="flex w-full text-4xl font-semibold text-gray-700">{{(totalCarPrice|| 0).toLocaleString('ru-RU')}} ฿</span>
            <hr class="my-2 border-t border-[#E9E6EC]" />
            <span class="flex w-full text-base text-stone-400">Нужно больше золота, милорд</span>
        </div>

        <div class="flex flex-col w-full sm:w-96 h-fit bg-[#F7F7F8] p-4 rounded-2xl ">
            <span class="flex w-full text-base">Стоимость общая</span>
            <span class="flex w-full text-4xl font-semibold text-gray-700">{{(Math.round(totalCarPrice + totalBikePrice)|| 0).toLocaleString('ru-RU')}} ฿</span>
            <hr class="my-2 border-t border-[#E9E6EC]" />
            <span class="flex w-full text-base text-stone-400">Нужно больше золота, милорд</span>
        </div>

        </div>


          <!-- Текущий месяц<br>
      Выручка общая <span class="font-bold">{{ Math.round(totalBikeRevenue + totalCarRevenue).toLocaleString('ru-RU') }}</span><br>
      <span v-show="totalCarRevenue===0">Выручка Байков <span class="font-bold">{{ totalBikeRevenue.toLocaleString('ru-RU') }}</span><br>
      <span v-show="totalCarRevenue===0">Выручка Авто <span class="font-bold">{{ totalCarRevenue.toLocaleString('ru-RU') }}</span></span></span><br>
      <span>Количество байков <span class="font-bold">{{ countBikes }}</span></span><br>
      <span v-show="totalCarRevenue===0">Количество авто <span class="font-bold">{{ countCars }}</span></span> -->
      <!-- <div class="bg-gray-100 p-2 rounded-lg text-center w-min-[70]">
        <h3 class="text-gray-700 font-semibold">В прош месяце</h3>
        <p class="mt-2 text-3xl font-bold text-green-600">{{ Math.round( totalBikeRevenueLastMonth + totalCarRevenueLastMonth).toLocaleString('ru-RU') }}</p>
      </div>
      <div v-show="countCars > 0" class="bg-gray-100 p-2 rounded-lg text-center w-min-[70]">
        <h3 class="text-gray-700 font-semibold">В прош месяце байков</h3>
        <p class="mt-2 text-3xl font-bold text-green-600">{{totalBikeRevenueLastMonth.toLocaleString('ru-RU') }}</p>
      </div>
      <div v-show="countCars > 0"  class="bg-gray-100 p-2 rounded-lg text-center w-min-[70]">
        <h3 class="text-gray-700 font-semibold">В прош месяце авто</h3>
        <p class="mt-2 text-3xl font-bold text-green-600">{{ totalCarRevenueLastMonth.toLocaleString('ru-RU') }}</p>
      </div> -->


<!--
      <div class="bg-gray-100 p-2 rounded-lg text-center w-min-[70]">
        <h3 class="text-gray-700 font-semibold">В этом месяце</h3>
        <p class="mt-2 text-3xl font-bold text-green-600">{{ Math.round(totalBikeRevenue + totalCarRevenue).toLocaleString('ru-RU') }}</p>
      </div>
      <div v-show="countCars > 0" class="bg-gray-100 p-2 rounded-lg text-center w-min-[70]">
        <h3 class="text-gray-700 font-semibold">В этом месяце байков</h3>
        <p class="mt-2 text-3xl font-bold text-green-600">{{ totalBikeRevenue.toLocaleString('ru-RU') }}</p>
      </div>
      <div v-show="countCars > 0"  class="bg-gray-100 p-2 rounded-lg text-center w-min-[70]">
        <h3 class="text-gray-700 font-semibold">В этом месяце авто</h3>
        <p class="mt-2 text-3xl font-bold text-green-600">{{ totalCarRevenue.toLocaleString('ru-RU') }}</p>
      </div> -->
      <!-- <div class="bg-gray-100 p-2 rounded-lg text-center w-min-[70]">
        <h3 class="text-gray-700 font-semibold">Количество байков</h3>
        <p class="mt-2 text-3xl font-bold text-green-600">{{ countBikes }}</p>
      </div>
      <div v-show="countCars > 0" class="bg-gray-100 p-2 rounded-lg text-center w-min-[70]">
        <h3 class="text-gray-700 font-semibold">Количество авто</h3>
        <p class="mt-2 text-3xl font-bold text-green-600">{{ countCars }}</p>
      </div>-->
    </div>

    <div v-show="countCars > 0"  class="p-1">
    <div class="flex h-fit w-full bg-[#F7F7F8] p-2 gap-2 rounded-xl">
        <button :class="changeType==='Bike'? 'bg-[#1F0B31] text-white ': ''" @click="paramsF()" class="py-2 rounded-lg w-full">Байки</button>
        <button :class="changeType==='Cars'? 'bg-[#1F0B31] text-white ': ''" @click="paramsF()" class="py-2 rounded-lg w-full">Авто</button>
    </div>
    </div>

    <div autocomplete="off"  class="flex space-x-2 items-center  py-2 pl-1 w-full pr-1 h-16">
        <div class="flex gap-2 h-full w-full sm:w-96">
            <div class="h-full w-full">
                <input
                v-model="searchTerm"
                id="search-input"
                name="q"
                type="text"
                placeholder="Модель или номер"
                class="h-full p-2 px-4 border-2 border-[#E9E6EC] rounded-xl w-full "/>
            </div>
            <!-- <button type="submit" class="bg-[#E9E6EC] h-full w-22 rounded-xl hover:bg-gray-200">
                <span class="flex items-center justify-center">
                    <div v-if="pending" class="h-6 w-6 border-4 border-gray-200 border-t-gray-500 rounded-full animate-spin" role="status" aria-label="Loading"></div>
                </span>
                <span class="px-1" v-if="!pending">Искать</span>
            </button> -->
            <button @click="ofSearch()" class="bg-[#E9E6EC] h-full w-22 rounded-xl hover:bg-gray-200">
                <span class="px-1" >Сброс</span>
            </button>
        </div>
    </div>

    <div class="flex gap-2 mb-4 h-13 p-1">
        <button @click="setSort('mileageNow')" class="bg-[#E9E6EC] h-full w-full rounded-xl hover:bg-gray-200">
            <span class="px-1" >Пробег {{ sortIcon('mileageNow') }}</span>
        </button>
        <button @click="setSort('price')" class="bg-[#E9E6EC] h-full w-full rounded-xl hover:bg-gray-200">
            <span class="px-1" >Цена {{ sortIcon('price') }}</span>
        </button>
        <button @click="setSort('lastMonthRevenue')" class="bg-[#E9E6EC] h-full w-full rounded-xl hover:bg-gray-200">
            <span class="px-1" >Прошлый {{ sortIcon('lastMonthRevenue') }}</span>
        </button>
        <button @click="setSort('revenue')" class="bg-[#E9E6EC] h-full w-full rounded-xl hover:bg-gray-200">
            <span class="px-1" >Текущий {{ sortIcon('revenue') }}</span>
        </button>
    </div>

    <!-- Таблица байков -->
    <table v-show="changeType==='Bike'" class="w-full mb-8">
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
          <!-- <th class="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">
              Пробег
          </th>
          <th class=" px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase"> Цена </th> -->

        </tr>
      </thead>
      <tbody class="divide-y divide-gray-200">
        <tr v-for="g in filteredBikes" :key="g.id" class="hover:bg-gray-100" >
          <td class="px-2 py-3 text-lg font-bold text-gray-900">
              <span class="p-1 text-xs text-gray-500  rounded-xl font-normal">{{ g.price }} ฿</span>
              <span class="p-1 text-xs text-gray-500  rounded-xl font-normal">[{{ g.mileageNow }} км.]</span>
              <br>

            {{ g.name }}
          </td>
          <td class="px-2 py-3 text-sm text-gray-900 font-medium">
            {{ (g.lastMonthRevenue|| 0).toLocaleString('ru-RU') }} ฿
          </td>
          <td class="px-2 py-3 text-sm text-gray-900 font-medium">
            {{ (g.revenue|| 0).toLocaleString('ru-RU') }} ฿
          </td>
          <!-- <td class="px-2 py-3 text-sm text-gray-900 font-medium">
              {{ g.mileageNow }}
          </td>

          <td class=" px-2 py-3 text-sm text-gray-900">{{ g.price }}</td> -->

        </tr>
      </tbody>
      <tfoot class="bg-[#F7F7F8]">
        <tr>
          <td class="px-2 py-2 font-medium">Итого байки</td>
          <td class="px-2 py-2 font-medium"> {{ (totalBikeRevenueLastMonth|| 0).toLocaleString('ru-RU') }} </td>
          <td class="px-2 py-2 font-medium">{{ (totalBikeRevenue|| 0).toLocaleString('ru-RU') }}</td>
          <!-- <td class="px-2 py-2 font-medium">--</td>
          <td class=" px-2 py-2 font-medium">{{ totalBikePrice }}</td> -->
        </tr>
      </tfoot>
    </table>

    <!-- Таблица авто  🔔 -->
    <table class="w-full" v-show="changeType==='Cars'">
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
          <!-- <th class="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">
            Пробег
          </th>
          <th class="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">
            Стоимость
          </th> -->
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-200">
        <tr v-for="g in filteredCars" :key="g.id" class="hover:bg-gray-100" >
            <td class="px-2 py-3 text-lg font-bold text-gray-900">
                <span class="p-1 text-xs text-gray-500  rounded-xl font-normal">{{ g.price }} ฿</span>
                <span class="p-1 text-xs text-gray-500  rounded-xl font-normal">[{{ g.mileageNow }} км.]</span>
                <br>

              {{ g.name }}
            </td>          <td class="px-2 py-3 text-sm text-gray-900">
            {{ (g.lastMonthRevenue|| 0).toLocaleString('ru-RU') }}
          </td>
          <td class="px-2 py-3 text-sm text-gray-900">
            {{ (g.revenue|| 0).toLocaleString('ru-RU') }}
          </td>

          <!-- <td class="px-2 py-3 text-sm text-gray-900">{{ g.mileageNow }}</td>
          <td class="px-2 py-3 text-sm text-gray-900">{{ g.price }}</td> -->
        </tr>
      </tbody>
      <tfoot class="bg-[#F7F7F8]">
        <tr>
          <td class="px-2 py-2 font-medium">Итого авто</td>
          <td class="px-2 py-2 font-medium">
            {{ (totalCarRevenueLastMonth|| 0).toLocaleString('ru-RU') }}
          </td>
          <td class="px-2 py-2 font-medium">
            {{ (totalCarRevenue|| 0).toLocaleString('ru-RU') }}
          </td>

          <!-- <td class="px-2 py-2 font-medium">--</td>
          <td class="px-2 py-2 font-medium">{{ totalCarPrice }}</td> -->
        </tr>
      </tfoot>
    </table>

    <p v-if="pending" class="mt-4 text-gray-500 h-96">Загрузка...</p>
    <p v-if="error" class="mt-4 text-red-500">Ошибка: {{ error.message }}</p>
    <div v-show="footer" class="w-full p-1">
        <div class="flex h-fit w-full bg-[#F7F7F8] p-2 rounded-xl justify-between">
            <div class="flex gap-5">
            <div class="flex h-16 w-16 bg-white rounded-xl "></div>
            <div class="mt-1">
                <h1 class="font-semibold text-xl">{{name}}</h1>
                <h2>{{email}}</h2>
            </div>
            </div>
            <button
            @click="logout"
            class="flex items-center justify-center gap-3 px-3 w-22 h-10 rounded-xl text-xs bg-[#1F0B31] text-white font-medium cursor-pointer mt-3">
            Выйти
            </button>
        </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'

import { useRouter } from 'vue-router'
const footer = ref(false)
const router = useRouter()

const config = useRuntimeConfig()
const email = localStorage.getItem('email') // из стораджа
const name = localStorage.getItem('name') // из стораджа
const firstLetter = name.charAt(0)

const searchTerm = ref('')
const params2 = reactive({ q: '' })
const month = ref('this')

function monthF(p) {
  month.value = p
  console.log(month.value)
}

const changeType = ref('Bike')




function paramsF() {
  if (changeType.value==='Bike'){
    changeType.value = 'Cars'
    console.log(changeType.value)

  } else  {
    changeType.value = 'Bike'
    console.log(changeType.value)

  }
}

const matchedId = useFetch(`${config.public.apiBase}/api/partner/kabinet/all`, {
  credentials: 'include',
  params: { email }
})
const partnerId = computed(() => matchedId.data.value?.data || null)


const { data, pending, error, refresh } = useFetch(
  () =>
    partnerId.value
      ? `${config.public.apiBase}/api/partner/portal/${partnerId.value}`
      : null, // <-- не делает запрос, пока partnerId null
  {
    credentials: 'include',
    params: params2,
    immediate: true,
  }
)
function onSearch() {
  params2.q    = searchTerm.value.trim()
  refresh()
}

function ofSearch() {
  searchTerm.value = ''
}

watch(pending, (newVal) => {
  if (newVal === true) {
    footer.value = true
  }
})

// Реактивные данные партнёра и гаражей
const partner = computed(() =>
  data.value?.data || { garages: [], royaltyBike: 0, royaltyCar: 0 }
)
const garages = computed(() => partner.value.garages || [])

// Текущий год и месяц
const now = new Date()
const currY = now.getFullYear()
const currM = now.getMonth()

// Сумма paid за этот месяц по startRental
function sumPaidThisMonth(bookings) {
  return bookings
    .filter(b => {
      const d = new Date(b.startRental)
      return d.getFullYear() === currY && d.getMonth() === currM
    })
    .reduce((s, b) => s + Number(b.paid || 0), 0)
}

// Коэффициенты (100% → 1, 50% → 0.5)
const coefBike = computed(() => partner.value.royaltyBike / 100)
const coefCar  = computed(() => partner.value.royaltyCar  / 100)


function sumPaidLastMonth(bookings) {
  return bookings
    .filter(b => {
      const d = new Date(b.startRental)
      const isLastMonth =
        (d.getFullYear() === currY && d.getMonth() === currM - 1) ||
        (currM === 0 && d.getFullYear() === currY - 1 && d.getMonth() === 11)

      return isLastMonth
    })
    .reduce((s, b) => s + Number(b.paid || 0), 0)
}

// Байки
const bikeRevenue = computed(() =>
  sortData(
  garages.value
    .filter(g => g.isBike)
    .map(g => {
      const rawCurr = sumPaidThisMonth(g.bookings)
      const rawPrev = sumPaidLastMonth(g.bookings)
      return {
        id: g.id,
        name: g.name,
        mileageNow: g.mileageNow,
        price: g.price,
        revenue: Math.round(rawCurr * coefBike.value),
        lastMonthRevenue: Math.round(rawPrev * coefBike.value),
      }
    })
    )
)

// Авто
const carRevenue = computed(() =>
  sortData(
  garages.value
    .filter(g => !g.isBike)
    .map(g => {
      const rawCurr = sumPaidThisMonth(g.bookings)
      const rawPrev = sumPaidLastMonth(g.bookings)
      return {
        id: g.id,
        name: g.name,
        mileageNow: g.mileageNow,
        price: g.price,
        revenue: Math.round(rawCurr * coefCar.value),
        lastMonthRevenue: Math.round(rawPrev * coefCar.value),
      }
    })
    )

)

// Итоги для байков
const totalBikeRevenue = computed(() =>
  bikeRevenue.value.reduce((sum, x) => sum + x.revenue, 0)
)
const totalBikeMileage = computed(() =>
  bikeRevenue.value.reduce((sum, x) => sum + Number(x.mileageNow || 0), 0)
)
const totalBikePrice = computed(() =>
  bikeRevenue.value.reduce((sum, x) => sum + Number(x.price || 0), 0)
)

// Итоги для авто
const totalCarRevenue = computed(() =>
  carRevenue.value.reduce((sum, x) => sum + x.revenue, 0)
)
const totalCarMileage = computed(() =>
  carRevenue.value.reduce((sum, x) => sum + Number(x.mileageNow || 0), 0)
)
const totalCarPrice = computed(() =>
  carRevenue.value.reduce((sum, x) => sum + Number(x.price || 0), 0)
)

const countBikes = computed(() => bikeRevenue.value.length)
const countCars = computed(() => carRevenue.value.length)

const totalBikeRevenueLastMonth = computed(() =>
  bikeRevenue.value.reduce((sum, x) => sum + x.lastMonthRevenue, 0)
)

const totalCarRevenueLastMonth = computed(() =>
  carRevenue.value.reduce((sum, x) => sum + x.lastMonthRevenue, 0)

)

const filteredBikes = computed(() => {
  const query = searchTerm.value.toLowerCase().trim()
  if (!query) return bikeRevenue.value

  return bikeRevenue.value.filter(g =>
    g.name.toLowerCase().includes(query)
  )
})

const filteredCars = computed(() => {
  const query = searchTerm.value.toLowerCase().trim()
  if (!query) return carRevenue.value

  return carRevenue.value.filter(g =>
    g.name.toLowerCase().includes(query)
  )
})


const sortKey = ref('revenue') // revenue, mileageNow, price, lastMonthRevenue
const sortDirection = ref('desc') // 'asc' или 'desc'

function setSort(key) {
  if (sortKey.value === key) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortDirection.value = 'desc'
  }
}
function sortData(data) {
  return [...data].sort((a, b) => {
    const valA = a[sortKey.value]
    const valB = b[sortKey.value]

    return sortDirection.value === 'asc' ? valA - valB : valB - valA
  })
}
function sortIcon(key) {
  if (sortKey.value !== key) return ''
  return sortDirection.value === 'asc' ? '▲' : '▼'
}

async function logout() {
  // 1) Сообщаем бэку, чтобы удалил cookie
  // await fetch(`${config.public.apiBase}/api/auth/logout`, {
  //   method: 'POST',
  //   credentials: 'include',
  //   headers: {'Content-Type': 'application/json'},
  //     body: JSON.stringify({ user: id })
  // })
  fetch(`${config.public.apiBase}/api/auth/logout`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user: partnerId.value }),
      keepalive: true
    }).catch(err => console.error('Logout log failed:', err))

    localStorage.removeItem('role')
    localStorage.removeItem('email')
    localStorage.removeItem('userName')
    localStorage.removeItem('auth')
    localStorage.removeItem('name')


    router.push('/login')
}



</script>
