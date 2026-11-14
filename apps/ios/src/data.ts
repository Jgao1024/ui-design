import type { IndexData, PageData, SpecMap } from './types'

const cache = new Map<string, Promise<unknown>>()

function load<T>(path: string): Promise<T> {
  let p = cache.get(path)
  if (!p) {
    p = fetch(path).then((r) => {
      if (!r.ok) throw new Error(`${path}: HTTP ${r.status}`)
      return r.json()
    })
    p.catch(() => cache.delete(path))
    cache.set(path, p)
  }
  return p as Promise<T>
}

export const getIndex = () => load<IndexData>('data/index.json')
export const getPage = (slug: string) => load<PageData>(`data/pages/${slug}.json`)
export const getSpecs = (slug: string) => load<SpecMap>(`data/specs/${slug}.json`)
export const getToken = <T>(name: string) => load<T>(`data/tokens/${name}.json`)
