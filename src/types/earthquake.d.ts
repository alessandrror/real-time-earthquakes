export type EarthquakeRegistryAPI = {
  oid: number
  id: string
  region: string
  latitud: number
  longitud: number
  profundidad: number
  gmtot: string
  mecanismoFocal: string
  m: number
  mLv: number
  mjma: number
  mw: null
  mwp: null
  fases: number
  rms: number
  estado: string
}

export type EarthquakeRegistry = {
  id: string
  datetime: string
  fases: number
  latitude: number
  longitude: number
  magnitude: number
  location: string
  depth: number
  rms: number
  status: string
}
