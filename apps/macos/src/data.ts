import type { Index, PageData } from './types'

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`${url}: ${res.status}`)
  return (await res.json()) as T
}

export const loadIndex = (): Promise<Index> => fetchJson<Index>('data/index.json')

const pages = new Map<string, Promise<PageData>>()
export function loadPage(slug: string): Promise<PageData> {
  let p = pages.get(slug)
  if (!p) {
    p = fetchJson<PageData>(`data/pages/${slug}.json`)
    p.catch(() => pages.delete(slug))
    pages.set(slug, p)
  }
  return p
}
