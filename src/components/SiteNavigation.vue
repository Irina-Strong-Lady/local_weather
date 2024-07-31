<script setup>
import { ref } from 'vue'
import { uid } from 'uid'
import { RouterLink, useRoute, useRouter } from "vue-router";
import BaseModal from '@/components/BaseModal.vue'

const route = useRoute()
const router = useRouter()
const modalActive = ref(null)
const toggleModal = () => {
  modalActive.value = !modalActive.value
}

const savedCities = ref([])
const addCity = () => {
  if (localStorage.getItem('savedCities')) {
    savedCities.value = JSON.parse(localStorage.getItem('savedCities')
    )
  }
  const locationObj = {
    id: uid(),
    state: route.params.state,
    city: route.params.city,
    coords: {
      lat: route.query.lat,
      lon: route.query.lon
    }
  }
  savedCities.value.push(locationObj)
  localStorage.setItem('savedCities', JSON.stringify(savedCities.value)
  )
  let query = Object.assign({}, route.query)
  delete query.preview
  query.id = locationObj.id
  router.replace({ query })
};

</script>

<template>
  <header class="sticky top-0 bg-weather-primary shadow-lg">
    <nav
      class="container flex flex-col sm:flex-row items-center gap-4 text-white py-6"
    >
      <RouterLink :to="{ name: 'home' }">
        <div class="flex items-center gap-3">
          <i class="fa-solid fa-sun text-2xl"></i>
          <p class="text-2xl">Календарь погоды</p>
        </div>
      </RouterLink>

      <div class="flex gap-3 flex-1 justify-end">
        <i
          class="fa-solid fa-circle-info
          text-xl hover:text-weather-secondary
          duration-150 cursor-pointer"
          @click="toggleModal"
        ></i>
        <i
          class="fa-solid fa-plus
          text-xl hover:text-weather-secondary
          duration-150 cursor-pointer"
          @click="addCity"
          v-if="route.query.preview"
        ></i>
      </div>
      <BaseModal :modalActive="modalActive" @close-modal="toggleModal">
        <div class="text-black">
          <h1 class="text-2xl mb-1"><!-- About -->О продукте:</h1>
          <p class="mb-4">
            Календарь погоды позволяет отслеживать текущую и
            прогнозируемую погоду в указанной Вами местности.
            <!-- The Local Weather allows you to track the current and
            future weather of cities of your choosing. -->
          </p>
          <h2 class="text-2xl"><!-- How it works -->Как это работает:</h2>
          <ol class="list-decimal list-inside mb-4">
            <li>
              Найдите Ваш населенный пункт введя его название в строку поиска.
              <!-- Search for your city by entering the name into the
              search bar. -->
            </li>
            <li>
              Выберите Ваш населенный пункт из появившегося списка.
              <!-- Select a city within the results, this will take
              you to the current weather for your selection. -->
            </li>
            <li>
              Отслеживайте погоду в вабранной Вами местности, нажав
              иконку "+" вверху справа. Это сохранит выбранный Вами
              населенный пункт для быстрого доступа в дальнейшем.
              <!-- Track the city by clicking on the "+" icon in the
              top right. This will save the city to view at a
              later time on the home page. -->
            </li>
          </ol>

          <h2 class="text-2xl"><!-- Removing a city -->Удаление выбранной местности</h2>
          <p>
            Если дальнейшее отслеживание погоды в сохранненом населенном
            пункте более не требуется, просто выберите из списка другой
            населенный пункт. Внизу страницы появится опция удаления ранее
            сохранненой местности.
            <!-- If you no longer wish to track a city, simply select
            the city within the home page. At the bottom of the
            page, there will be am option to delete the city. -->
          </p>
        </div>
      </BaseModal>
    </nav>
  </header>
</template>
