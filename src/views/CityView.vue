<script setup>
import AsyncCityView from "@/components/AsyncCityView.vue"
import Loader from "@/components/Loader.vue";
import CityViewSkeleton from "@/components/CityViewSkeleton.vue";
</script>

<template>
  <div>
    <Suspense>
      <AsyncCityView />
      <template #fallback>
        <CityViewSkeleton />
      </template>
    </Suspense>
  </div>
</template>
