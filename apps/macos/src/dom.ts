type Child = Node | string | number | null | undefined | false
type Attr = string | number | boolean | undefined | ((e: Event) => void)

/** 极简建 DOM 工具：on* 属性绑事件，其余写成 attribute。 */
export function h<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  attrs: Record<string, Attr> | null = null,
  ...kids: Child[]
): HTMLElementTagNameMap[K] {
  const el = document.createElement(tag)
  if (attrs) {
    for (const [k, v] of Object.entries(attrs)) {
      if (v === undefined || v === false) continue
      if (typeof v === 'function') el.addEventListener(k.slice(2), v)
      else if (k === 'class') el.className = String(v)
      else el.setAttribute(k, v === true ? '' : String(v))
    }
  }
  for (const c of kids) if (c !== null && c !== undefined && c !== false) el.append(typeof c === 'number' ? String(c) : c)
  return el
}

export const famHash = (id: string): string => id.replace(/:/g, '-')
