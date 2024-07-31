<script setup>
import { ref } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { onecallAPI, oneWeatherAPIKey } from "@/constants";
import CityCard from "@/components/CityCard.vue";

const savedCities = ref([]);
const getCities = async () => {
  if (localStorage.getItem("savedCities")) {
    savedCities.value = JSON.parse(localStorage.getItem("savedCities"));

    const requests = [];
    savedCities.value.forEach((city) => {
      requests.push(
        axios.get(
          `${onecallAPI}?lat=${city.coords.lat}&lon=${city.coords.lon}&appid=${oneWeatherAPIKey}&units=metric`
        )
      );
    });
    const weatherData = await Promise.all(requests);
    // Flicker Delay
    await new Promise((res) => setTimeout(res, 1000))

    weatherData.forEach((value, index) => {
      savedCities.value[index].weather = value.data;
    });
  }
};
await getCities();

const router = useRouter();
const goToCityView = (city) => {
  router.push({
    name: "cityView",
    params: { state: city.state, city: city.city },
    query: { id: city.id, lat: city.coords.lat, lon: city.coords.lon },
  });
};
</script>

<template>
  <div v-for="city in savedCities" :key="city.id">
    <CityCard :city="city" @click="goToCityView(city)" />
  </div>
  <p v-if="savedCities.length === 0">
    Местность не выбрана. Введите в поле ввода название местности, чтобы начать
    отслеживать в ней погоду.
    <!-- No locations added. To start tracking a location, search in
    the field above. -->
  </p>
</template>
