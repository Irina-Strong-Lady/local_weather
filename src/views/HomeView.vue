<script setup>
import axios from "axios";
import { ref } from "vue";
import { useRouter } from "vue-router"
import CityList from '@/components/CityList.vue'
import Loader from '@/components/Loader.vue'
import CityCardSkeleton from "@/components/CityCardSkeleton.vue"

const router = useRouter()

const mapBoxAPIKey =
  "pk.eyJ1IjoiaXJpbmEtc3Ryb25nLWxhZHkiLCJhIjoiY2x6NzJ2NXVlMDR6YjJpczV3bGZkdzR2bCJ9.jdfSWm-VnX5_2byMzRcOxw";
const searchQuery = ref("");
const queryTimeout = ref(null);
const mapBoxSearchREsults = ref(null);
const searchError = ref(null);

const getSearchResults = () => {
  clearTimeout(queryTimeout.value);
  queryTimeout.value = setTimeout(async () => {
    if (searchQuery.value !== "") {
      try {
        const result =
          await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/
              ${searchQuery.value}.json?access_token=${mapBoxAPIKey}&types=place`);
        mapBoxSearchREsults.value = result.data.features;
      } catch {
        searchError.value = true;
      }
      return;
    }
    mapBoxSearchREsults.value = null;
  }, 300);
}

const previewCity = (searchResult) => {
  const [city, state] = searchResult.place_name.split(',')
  router.push({
    name: 'cityView',
    params: {state: state.replaceAll('', ''), city: city},
    query: {
      lat: searchResult.geometry.coordinates[1],
      lon: searchResult.geometry.coordinates[0],
      preview: true
    },
  })
};
</script>

<template>
  <main class="container text-white">
    <div class="pt-4 mb-8 relative">
      <input
        v-model="searchQuery"
        @input="getSearchResults"
        type="text"
        placeholder="Поиск по городу или субъекту"
        class="py-2 px-1 w-full bg-transparent border-b focus:border-weather-secondary focus:outline-none focus:shadow-[0px_1px_0_0_#004E71]"
      /> <!-- Search for a city or state -->
      <ul
        class="absolute bg-weather-secondary text-white w-full shadow-md py-2 px-1 top-[66px]"
        v-if="mapBoxSearchREsults"
      >
        <p v-if="searchError">Что-то пошло не так, пожалуйста повторите.</p>
        <p v-if="!searchError && mapBoxSearchREsults.length === 0">Результаты по заданной фразе отсутствуют.</p>
        <template v-else>
          <li
            v-for="searchResult in mapBoxSearchREsults"
            :key="searchResult.id"
            class="py-2 cursor-pointer"
            @click="previewCity(searchResult)"
          >
            {{ searchResult.place_name }}
          </li>
        </template>
      </ul>
    </div>
    <div class="flex flex-col gap-4">
      <Suspense>
        <CityList />
        <template #fallback>
          <CityCardSkeleton />
        </template>
      </Suspense>
    </div>
  </main>
</template>
