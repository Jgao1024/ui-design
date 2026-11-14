export interface Route { slug: string; fam: string }

/** #/<slug> 或 #/<slug>/<族nodeId，冒号换成连字符> */
export function parseHash(): Route {
  const [slug = '', fam = ''] = location.hash.replace(/^#\/?/, '').split('/')
  return { slug: decodeURIComponent(slug), fam: decodeURIComponent(fam) }
}

export function hashFor(slug: string, famHash = ''): string {
  return '#/' + slug + (famHash ? '/' + famHash : '')
}

export function navigate(slug: string, famHash = ''): void {
  const next = hashFor(slug, famHash)
  if (location.hash === next) window.dispatchEvent(new HashChangeEvent('hashchange'))
  else location.hash = next
}
