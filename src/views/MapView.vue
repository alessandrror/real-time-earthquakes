<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { formatDateTime } from '@/helpers/datetime.helper'
import { toUpperCaseFirstLetter } from '@/helpers/string.helper'
import { getRealTimeEarthquakes } from '@/services/earthquake.service'

import type { EarthquakeRegistry } from '@/types/earthquake'

import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { LMap, LTileLayer, LMarker, LPopup, LLayerGroup } from '@vue-leaflet/vue-leaflet'

const popUpContent = ref<EarthquakeRegistry | {}>({})
const realTimeRegistry = ref<InstanceType<typeof LLayerGroup> | null>(null)
const earthquakesRegistry = ref<EarthquakeRegistry[] | []>([])
const localDateTime = ref(formatDateTime(new Date()))

setInterval(() => (localDateTime.value = formatDateTime(new Date())), 1000)

const changePopUpContent = (earthquakeRegistry: EarthquakeRegistry) => {
  popUpContent.value = earthquakeRegistry
  if (realTimeRegistry.value?.leafletObject !== undefined) {
    realTimeRegistry.value?.leafletObject.openPopup([
      earthquakeRegistry?.latitude,
      earthquakeRegistry?.longitude
    ])
  }
}
const createIcon = (index: number) =>
  L.icon({
    iconSize: index < 1 ? [32, 32] : [16, 16],
    iconUrl: index < 1 ? '/pin/red-star-marker.png' : '/pin/blue-circle-marker.png'
  })

onMounted(async () => {
  earthquakesRegistry.value = await getRealTimeEarthquakes()
  setInterval(async () => (earthquakesRegistry.value = await getRealTimeEarthquakes()), 10000)
})
</script>

<template>
  <div class="card my-3">
    <b class="text-black">Sismos en tiempo real</b>
    <div class="text-black py-3">Hora de actualización: {{ localDateTime }}</div>

    <div id="map">
      <LMap ref="map" :zoom="7" :center="[13.687, -88.883]" class="rounded">
        <LTileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
          layerType="base"
          name="OpenStreetMap"
        />
        <LLayerGroup ref="realTimeRegistry">
          <LPopup>
            <span>
              <i>Date:</i>&nbsp;
              <b>{{ formatDateTime(popUpContent?.datetime) }}</b>
              <br />
              <i>Latitude:</i>&nbsp;
              <b>{{ popUpContent?.latitude }}</b>
              <br />
              <i>Longitude:</i>&nbsp;
              <b>{{ popUpContent?.longitude }}</b>
              <br />
              <i>Depth:</i>&nbsp;
              <b>{{ popUpContent?.depth }}</b>
              <br />
              <i>Magnitude:</i>&nbsp;
              <b>{{ popUpContent?.magnitude }}</b>
              <br />
              <i>Localizaci&oacute;n:</i>&nbsp;
              <b>{{ toUpperCaseFirstLetter(popUpContent?.location) }}</b>
              <br />
              <i>Status:</i>&nbsp;
              <b>Reviewed {{ popUpContent?.status }}</b>
            </span>
          </LPopup>
        </LLayerGroup>
        <LMarker
          v-for="(earthquakeRegistry, index) in earthquakesRegistry"
          :key="index"
          :latLng="[earthquakeRegistry?.latitude, earthquakeRegistry?.longitude]"
          :icon="createIcon(index)"
          @click="changePopUpContent(earthquakeRegistry)"
        />
      </LMap>
    </div>

    <div class="row g-3 py-3">
      <div
        class="col-md-6 col-xl-4"
        v-for="(earthquakeRegistry, index) in earthquakesRegistry"
        :key="index"
      >
        <div class="card text-black bg-secondary bg-opacity-10 rounded-1 py-3 h-100">
          <div class="col-12 d-flex">
            <span class="col-4 fw-light text-end">Date:&nbsp;</span>
            <span class="col fw-bold p-0">{{ formatDateTime(earthquakeRegistry?.datetime) }}</span>
          </div>
          <div class="col-12 d-flex">
            <span class="col-4 fw-light text-end">Latitude:&nbsp;</span>
            <span class="col fw-bold p-0">{{ earthquakeRegistry?.latitude }}</span>
          </div>
          <div class="col-12 d-flex">
            <span class="col-4 fw-light text-end">Longitude:&nbsp;</span>
            <span class="col fw-bold p-0">{{ earthquakeRegistry?.longitude }}</span>
          </div>
          <div class="col-12 d-flex">
            <span class="col-4 fw-light text-end">Depth:&nbsp;</span>
            <span class="col fw-bold p-0">{{ earthquakeRegistry?.depth }}</span>
          </div>
          <div class="col-12 d-flex">
            <span class="col-4 fw-light text-end">Magnitude:&nbsp;</span>
            <span class="col fw-bold p-0">{{ earthquakeRegistry?.magnitude }}</span>
          </div>
          <div class="col-12 d-flex">
            <span class="col-4 fw-light text-end">Localización:&nbsp;</span>
            <span class="col fw-bold p-0">{{
              toUpperCaseFirstLetter(earthquakeRegistry?.location)
            }}</span>
          </div>
          <div class="col-12 d-flex">
            <span class="col-4 fw-light text-end">Status:&nbsp;</span>
            <span class="col fw-bold p-0 text-success"
              >Reviewed {{ earthquakeRegistry?.status }}</span
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
#map {
  width: 100%;
  height: 420px;
}
</style>
