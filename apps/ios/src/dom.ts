const ESC: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }

export function esc(s: unknown): string {
  return String(s ?? '').replace(/[&<>"']/g, (c) => ESC[c])
}

export function $<T extends HTMLElement = HTMLElement>(sel: string, root: ParentNode = document): T | null {
  return root.querySelector<T>(sel)
}

/** nodeId 放进 URL 与 DOM id 时，`:` 换成 `-`。 */
export const idToHash = (id: string) => id.replace(/:/g, '-')
export const hashToId = (h: string) => h.replace(/-/g, ':')
