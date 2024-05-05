import { api } from '@/config/axios.config'
import type { EarthquakeRegistryAPI, EarthquakeRegistry } from '@/types/earthquake'

export const getRealTimeEarthquakes = async () => {
  return await api
    .get(`${import.meta.env.VITE_API_SCRAPPING}/api/marn`)
    .then(({ data: earthquakesRegistry }) => {
      const newEarthquakesRegistry: EarthquakeRegistry[] = earthquakesRegistry.map(
        (earthquakeRegistry: EarthquakeRegistryAPI) => ({
          id: earthquakeRegistry?.id,
          datetime: earthquakeRegistry?.gmtot,
          fases: earthquakeRegistry?.fases,
          latitude: earthquakeRegistry?.latitud,
          longitude: earthquakeRegistry?.longitud,
          magnitude: earthquakeRegistry?.m,
          location: earthquakeRegistry?.region,
          depth: earthquakeRegistry?.profundidad,
          rms: earthquakeRegistry?.rms,
          status: earthquakeRegistry?.estado
        })
      )
      return newEarthquakesRegistry
    })
    .catch(() => [])
}
