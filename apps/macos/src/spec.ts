import { h } from './dom'
import type { Pick, Spec } from './types'

const body = h('div', { class: 'spec-body' })
const panel = h('aside', { class: 'spec', hidden: true, 'aria-label': '规格' },
  h('button', { class: 'spec-close', type: 'button', title: '关闭 (Esc)', onclick: () => closeSpec() }, '×'),
  body)
document.body.append(panel)

export const isSpecOpen = (): boolean => !panel.hidden

export function closeSpec(): void {
  panel.hidden = true
  document.body.classList.remove('spec-open')
  document.querySelectorAll('.cell.sel').forEach((el) => el.classList.remove('sel'))
}

const fmt = (n: number | null | undefined): string => (n === null || n === undefined ? '—' : String(n))

function row(label: string, ...value: Array<Node | string>): HTMLElement {
  return h('div', { class: 'srow' }, h('div', { class: 'slabel' }, label), h('div', { class: 'sval' }, ...value))
}

function swatch(hex: string, a: number): HTMLElement {
  return h('span', { class: 'sw' }, h('i', { style: `background:${hex};opacity:${a}` }))
}

function specRows(s: Spec): HTMLElement[] {
  const rows: HTMLElement[] = [row('尺寸', `${fmt(s.w)} × ${fmt(s.h)}`)]
  if (s.r !== undefined) rows.push(row('圆角', Array.isArray(s.r) ? s.r.join(' / ') : String(s.r)))
  if (s.dir) rows.push(row('布局', `${s.dir === 'H' ? '横向' : '纵向'}${s.gap !== undefined ? `，间距 ${s.gap}` : ''}`))
  rows.push(row('填充', ...(s.fills.length
    ? s.fills.map((f) => (f.t === 'SOLID' && f.hex
      ? h('div', null, swatch(f.hex, f.a ?? 1), `${f.hex}  alpha ${f.a ?? 1}`)
      : h('div', null, f.t)))
    : ['无'])))
  rows.push(row('效果', ...(s.effects.length
    ? s.effects.map((e) => h('div', null, e.r !== undefined ? `${e.t}  radius ${e.r}` : e.t))
    : ['无'])))
  rows.push(row('文字', ...(s.texts.length
    ? s.texts.map((t) => h('div', { class: 'stext' },
      h('div', null, `${t.f} · ${t.w} · ${t.s}px / ${fmt(t.lh)} · 字距 ${fmt(t.ls)}`),
      h('div', { class: 'muted' }, `“${t.t}”${t.n > 1 ? ` ×${t.n}` : ''}`)))
    : [s.src === 'set' ? '无（该变体没有独立规格文件）' : '无'])))
  rows.push(row('来源', s.src === 'own' ? '变体规格文件' : '族规格文件 variants[]'))
  return rows
}

export function openSpec(p: Pick): void {
  body.replaceChildren(
    h('h3', null, p.title),
    h('div', { class: 'muted' }, p.sub),
    h('div', { class: 'mono' }, p.id),
    ...(p.spec ? specRows(p.spec) : [h('p', { class: 'muted' }, '没有规格数据。')]),
  )
  panel.hidden = false
  document.body.classList.add('spec-open')
}
