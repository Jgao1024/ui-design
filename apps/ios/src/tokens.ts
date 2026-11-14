import { getToken } from './data'
import { esc } from './dom'
import type { PageMeta } from './types'

interface ColorsData {
  colors: { hex: string; a: number; uses: number }[]
  gradients: { stops: { hex: string; a: number; p: number }[]; uses: number }[]
}
interface TypographyData {
  styles: { f: string | null; w: number | null; s: number | null; lh: number | null; ls: number | null; uses: number }[]
}
interface EffectDef {
  type: string
  radius?: number
  hex?: string
  alpha?: number
  spread?: number
  offset?: { x: number; y: number }
}
interface EffectsData {
  effects: { def: EffectDef; uses: number }[]
}
interface GeometryData {
  cornerRadii: Record<string, number>
  itemSpacing: Record<string, number>
  componentSizes: Record<string, number>
}

const SAMPLE = 'The quick brown fox 敏捷的棕色狐狸 0123'

function rgba(hex: string, a: number): string {
  const h = hex.replace('#', '')
  const n = parseInt(h.length === 3 ? h.replace(/./g, '$&$&') : h.slice(0, 6), 16)
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`
}

const num = (s: string) => String(Number(s))

function colors(d: ColorsData): string {
  const sw = d.colors
    .map(
      (c) =>
        `<div class="sw"><span class="sw-c" style="--c:${rgba(c.hex, c.a)}"></span>` +
        `<b>${esc(c.hex)}</b><small>α ${c.a} · ${c.uses} 次</small></div>`,
    )
    .join('')
  const gr = d.gradients
    .map((g) => {
      const stops = g.stops.map((s) => `${rgba(s.hex, s.a)} ${Math.round(s.p * 100)}%`).join(', ')
      const label = g.stops.map((s) => `${s.hex}${s.a < 1 ? ' α' + s.a : ''}`).join(' → ')
      return `<div class="grad"><span class="grad-bar" style="--g:linear-gradient(90deg,${stops})"></span><small>${esc(label)} · ${g.uses} 次</small></div>`
    })
    .join('')
  return `<section class="block"><h2>渐变 <span class="n">${d.gradients.length}</span></h2><div class="grads">${gr}</div></section>` +
    `<section class="block"><h2>纯色 <span class="n">${d.colors.length}</span></h2><div class="sws">${sw}</div></section>`
}

function typography(d: TypographyData): string {
  const rows = d.styles
    .map((s) => {
      const fam = esc(s.f ?? 'SF Pro')
      const css =
        `font-family:'${fam}',-apple-system,'SF Pro Text',system-ui,sans-serif;font-weight:${s.w ?? 400};` +
        `font-size:${s.s ?? 14}px;${s.lh ? `line-height:${s.lh}px;` : ''}letter-spacing:${s.ls ?? 0}px`
      return (
        `<div class="ty"><div class="ty-s" style="${css}">${SAMPLE}</div>` +
        `<div class="ty-m">${fam} · 字重 ${s.w} · 字号 ${s.s} · 行高 ${s.lh ?? '—'} · 字距 ${s.ls ?? 0} · ${s.uses} 次</div></div>`
      )
    })
    .join('')
  return `<section class="block"><h2>文字样式 <span class="n">${d.styles.length}</span></h2>${rows}</section>`
}

function fxSummary(d: EffectDef): string {
  if (d.type === 'GLASS') return 'Liquid Glass 材质'
  const parts: string[] = []
  if (d.offset) parts.push(`x ${d.offset.x} · y ${d.offset.y}`)
  if (d.radius !== undefined) parts.push(`模糊 ${d.radius}`)
  if (d.spread) parts.push(`扩展 ${d.spread}`)
  if (d.hex) parts.push(`${d.hex} α ${d.alpha ?? 1}`)
  return parts.join(' · ') || '—'
}

function effects(d: EffectsData): string {
  const rows = d.effects
    .map(
      (e) =>
        `<tr><td><code>${esc(e.def.type)}</code></td><td>${esc(fxSummary(e.def))}</td><td class="r">${e.uses}</td></tr>`,
    )
    .join('')
  return `<section class="block"><h2>效果 <span class="n">${d.effects.length}</span></h2>` +
    `<table class="data"><thead><tr><th>类型</th><th>定义摘要</th><th class="r">使用次数</th></tr></thead><tbody>${rows}</tbody></table></section>`
}

function chips(title: string, map: Record<string, number>, sort: 'key' | 'uses', fmt: (k: string) => string): string {
  const entries = Object.entries(map)
  entries.sort(sort === 'key' ? (a, b) => Number(a[0]) - Number(b[0]) : (a, b) => b[1] - a[1])
  const body = entries.map(([k, v]) => `<span class="chip"><b>${esc(fmt(k))}</b><small>${v}</small></span>`).join('')
  return `<section class="block"><h2>${esc(title)} <span class="n">${entries.length}</span></h2><div class="chips">${body}</div></section>`
}

function geometry(d: GeometryData): string {
  return (
    chips('圆角', d.cornerRadii, 'key', num) +
    chips('间距', d.itemSpacing, 'key', num) +
    chips('组件尺寸', d.componentSizes, 'uses', (k) => k.replace('x', ' × '))
  )
}

export async function renderTokenPage(meta: PageMeta): Promise<HTMLElement> {
  const el = document.createElement('div')
  el.className = 'tokens'
  switch (meta.token) {
    case 'colors':
      el.innerHTML = colors(await getToken<ColorsData>('colors'))
      break
    case 'typography':
      el.innerHTML = typography(await getToken<TypographyData>('typography'))
      break
    case 'effects':
      el.innerHTML = effects(await getToken<EffectsData>('effects'))
      break
    case 'geometry':
      el.innerHTML = geometry(await getToken<GeometryData>('geometry'))
      break
    default:
      el.textContent = '未知令牌页'
  }
  return el
}
