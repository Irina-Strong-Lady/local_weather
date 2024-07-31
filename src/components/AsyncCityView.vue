<script setup>
import { ref, computed } from 'vue'
import axios from "axios";
import { useRoute, useRouter } from "vue-router";
import { oneWeatherAPIKey, onecallAPI, weatherImgAPI } from "@/constants";

const route = useRoute();
const router = useRouter();
const getWeatherData = async () => {
  try {
    const weatherData = await axios.get(
      `${onecallAPI}?lat=${route.query.lat}&lon=${route.query.lon}&exclude={part}&appid=${oneWeatherAPIKey}&units=metric`
    );
    // cal current date & time
    const localOffset = new Date().getTimezoneOffset() * 60000;
    const utc = weatherData.data.current.dt * 1000 + localOffset;
    weatherData.data.currentTime =
      utc + 1000 * weatherData.data.timezone_offset;

    // cal hourly weather offset
    weatherData.data.hourly.forEach((hour) => {
      const utc = hour.dt * 1000 + localOffset;
      hour.currentTime = utc + 1000 * weatherData.data.timezone_offset;
    });

    // Flicker Delay
    await new Promise((res) => setTimeout(res, 1000))

    return weatherData.data;
  } catch (err) {
    console.log(err);
  }
};
const weatherData = await getWeatherData();

const removeCity = () => {
  const cities = JSON.parse(localStorage.getItem("savedCities"))
  const updatedCities = cities.filter((city) => city.id !== route.query.id)
  localStorage.setItem("savedCities", JSON.stringify(updatedCities))
  router.push({
    name: "home"
      }
    )
  };

</script>

<template>
  <div class="flex flex-col flex-1 items-center">
    <!-- Banner -->
    <div
      v-if="route.query.preview"
      class="text-white p-4 bg-weather-secondary w-full text-center text-sm"
    >
      <p>
        Нажмите на иконку "+", чтобы в дальнейшем отслеживать погоду в выбранной
        Вами местности.
        <br><br/>
        Нажмите на иконку&nbsp;"<i class="fa-solid fa-sun"></i>"&nbsp;,&nbsp;чтобы вернуться на начальный экран.
        <!-- You are currently previewing city, click the "+" icon to start tracking
        this city. -->
      </p>
    </div>
    <!-- Weather overview -->
    <div class="flex flex-col items-center text-white py-12">
      <h1 class="text-4xl mb-2">{{ route.params.city }}</h1>
      <p class="text-sm mb-12">
        {{
          new Date(weatherData.currentTime).toLocaleDateString("ru", {
            weekday: "short",
            day: "2-digit",
            month: "long",
            year: "numeric",
          })
        }}
        {{
          new Date(weatherData.currentTime).toLocaleTimeString("ru", {
            timeStyle: "short",
          })
        }}
      </p>
      <p class="text-6xl mb-8">
        {{ Math.round(weatherData.current.temp) }}&deg;
      </p>
      <p>
        Ощущается как:
        {{ Math.round(weatherData.current.feels_like) }}&deg;
      </p>
      <p class="capitalize">
        {{ weatherData.current.weather[0].description }}
      </p>
      <img
        :src="`${weatherImgAPI}${weatherData.current.weather[0].icon}@2x.png`"
        alt=""
        class="w-[150px] h-auto"
      />
    </div>
    <hr class="border-white border-opacity-10 border w-full" />
    <!-- Hourly weather -->
    <div class="max-w-screen-md w-full py-12">
      <div class="mx-8 text-white">
        <h2 class="mb-4">Прогноз на сутки</h2>
        <div class="flex gap-10 overflow-x-scroll">
          <div
            v-for="hourData in weatherData.hourly"
            :key="hourData.dt"
            class="flex flex-col gap-4 items-center"
          >
            <p class="whitespace-nowrap text-md">
              {{
                new Date(hourData.currentTime).toLocaleTimeString("ru", {
                  hour: "numeric",
                })
              }}
            </p>
            <img
              :src="`${weatherImgAPI}${hourData.weather[0].icon}@2x.png`"
              alt=""
              class="w-auto h-auto object-cover"
            />
            <p class="text-xl">{{ Math.round(hourData.temp) }}&deg;</p>
          </div>
        </div>
      </div>
    </div>
    <hr class="border-white border-opacity-10 border w-full" />
    <!-- Weekly Weather -->
    <div class="max-w-screen-md w-full py-12">
      <div class="mx-8 text-white">
        <h2 class="mb-4">Прогноз на неделю</h2>
        <div
          v-for="day in weatherData.daily"
          :key="day.dt"
          class="flex items-center"
        >
          <p class="flex-1">
            {{
              new Date(day.dt * 1000).toLocaleDateString("ru", {
                weekday: "long",
              })
            }}
          </p>
          <img
            :src="`${weatherImgAPI}${day.weather[0].icon}@2x.png`"
            alt=""
            class="w-[50px] h-[50px] object-cover"
          />
          <div class="flex gap-2 flex-1 justify-end">
            <p>Max: {{ Math.round(day.temp.max) }}&deg;</p>
            <p>Min: {{ Math.round(day.temp.min) }}&deg;</p>
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="!route.query.preview"
      class="flex items-center gap-2 py-12 text-white cursor-pointer duration-150 hover:text-red-500"
      @click="removeCity"
    >
      <i class="fa-solid fa-trash"></i>
      <p>Удалить место</p>
    </div>
  </div>
</template>
