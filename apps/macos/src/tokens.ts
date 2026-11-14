import { h } from './dom'
import type { CountItem, TokenPage } from './types'

const SAMPLE = 'Aa 敏捷的棕色狐狸 0123456789'

const section = (title: string, ...kids: Array<Node | string>): HTMLElement =>
  h('section', { class: 'fam' }, h('h3', null, title), ...kids)

function colors(p: TokenPage): HTMLElement {
  const { colors = [], gradients = [] } = p.tokens
  const swatches = colors.map((c) => h('div', { class: 'tk-color', title: c.ex.join('\n') },
    h('div', { class: 'tk-sw' }, h('i', { style: `background:${c.hex};opacity:${c.a}` })),
    h('div', { class: 'mono' }, c.hex),
    h('div', { class: 'muted' }, `alpha ${c.a} · ×${c.uses}`)))
  const bars = gradients.map((g) => {
    const css = g.stops.map((s) => `${hexToRgba(s.hex, s.a)} ${Math.round(s.pos * 100)}%`).join(', ')
    return h('div', { class: 'tk-grad' },
      h('div', { class: 'tk-sw wide' }, h('i', { style: `background:linear-gradient(90deg, ${css})` })),
      h('div', { class: 'muted' }, `${g.stops.map((s) => `${s.hex}@${s.a}`).join(' → ')} · ×${g.uses}`))
  })
  return h('div', { class: 'content' },
    section(`纯色 ${colors.length}`, h('div', { class: 'tk-grid' }, ...swatches)),
    section(`渐变 ${gradients.length}`, h('div', { class: 'tk-grads' }, ...bars)))
}

function hexToRgba(hex: string, a: number): string {
  const n = parseInt(hex.slice(1, 7), 16)
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`
}

function typography(p: TokenPage): HTMLElement {
  const styles = p.tokens.styles ?? []
  return h('div', { class: 'content' }, section(`文字样式 ${styles.length}`,
    ...styles.map((s) => h('div', { class: 'tk-type' },
      h('div', { class: 'tk-sample', style: `font-family:-apple-system,'SF Pro',system-ui,sans-serif;font-weight:${s.w};font-size:${s.s}px;line-height:${s.lh}px;letter-spacing:${s.ls}px` }, SAMPLE),
      h('div', { class: 'muted' }, `${s.f}${s.ps ? ` (${s.ps})` : ''} · 字重 ${s.w} · ${s.s}px · 行高 ${s.lh} · 字距 ${s.ls} · ×${s.uses}`)))))
}

function effects(p: TokenPage): HTMLElement {
  const list = p.tokens.effects ?? []
  return h('div', { class: 'content' }, section(`效果 ${list.length}`,
    h('table', { class: 'tk-table' },
      h('thead', null, h('tr', null, h('th', null, '类型'), h('th', null, '定义摘要'), h('th', null, '使用次数'))),
      h('tbody', null, ...list.map((e) => h('tr', null, h('td', null, e.t), h('td', { class: 'mono' }, e.sum), h('td', null, e.uses)))))))
}

function chips(title: string, items: CountItem[] = [], fmt: (k: string) => string = (k) => k): HTMLElement {
  return section(`${title} ${items.length}`, h('div', { class: 'chips' },
    ...items.map((i) => h('span', { class: 'tk-chip' }, fmt(i.k), h('small', null, `×${i.uses}`)))))
}

function geometry(p: TokenPage): HTMLElement {
  const t = p.tokens
  return h('div', { class: 'content' },
    chips('圆角', t.cornerRadii, (k) => `r ${Number(k)}`),
    chips('间距', t.itemSpacing, (k) => `${Number(k)}`),
    chips('组件尺寸', t.componentSizes))
}

export function renderTokenPage(p: TokenPage): HTMLElement {
  switch (p.file) {
    case 'colors': return colors(p)
    case 'typography': return typography(p)
    case 'effects': return effects(p)
    default: return geometry(p)
  }
}
