import { famHash, h } from './dom'
import type { Axis, FamilySet, KitPage, Pick, Solo, Spec, Theme, Variant } from './types'

export interface Ctx {
  theme: Theme
  pick: (p: Pick) => void
}

interface Cellish { id: string; name: string; w: number | null; h: number | null; svg?: string; spec?: Spec }

const isModeAxis = (a: Axis): boolean => a.values.some((v) => v === 'Light' || v === 'Dark')

/** 全局明暗开关选出的 Light / Dark 值；轴里没有该值时退回轴里已有的那个。 */
function chosenMode(a: Axis, theme: Theme): string {
  const want = theme === 'dark' ? 'Dark' : 'Light'
  if (a.values.includes(want)) return want
  return a.values.find((v) => v === 'Light' || v === 'Dark') ?? a.values[0] ?? ''
}

/** SVG 命中就显示图（加载失败退回占位），否则灰色占位矩形。宽度取 bbox，超出单元格时等比缩小。 */
function art(item: Cellish): HTMLElement {
  const w = item.w && item.w > 0 ? item.w : 120
  const hh = item.h && item.h > 0 ? item.h : 40
  const box = h('div', { class: 'art', style: `width:${w}px;aspect-ratio:${w}/${hh}` })
  if (item.svg) {
    const img = h('img', { src: item.svg, alt: item.name, loading: 'lazy', decoding: 'async' })
    img.addEventListener('error', () => { img.remove(); box.classList.add('ph') })
    box.append(img)
  } else {
    box.classList.add('ph')
  }
  return box
}

function cell(item: Cellish, label: string, sub: string, ctx: Ctx): HTMLElement {
  const b = h('button', {
    class: 'cell',
    type: 'button',
    title: item.name,
    onclick: () => {
      document.querySelectorAll('.cell.sel').forEach((el) => el.classList.remove('sel'))
      b.classList.add('sel')
      ctx.pick({ title: item.name, sub, id: item.id, spec: item.spec })
    },
  }, art(item), h('span', { class: 'lbl' }, label))
  return b
}

function cartesian(lists: string[][]): string[][] {
  return lists.reduce<string[][]>((acc, vals) => acc.flatMap((p) => vals.map((v) => [...p, v])), [[]])
}

function grid(vs: Variant[], colAxis: Axis | undefined, rowAxis: Axis | undefined, others: Axis[], setName: string, ctx: Ctx): HTMLElement {
  const cols = colAxis ? colAxis.values.filter((c) => vs.some((v) => v.v[colAxis.name] === c)) : ['']
  const rows = rowAxis ? rowAxis.values.filter((r) => vs.some((v) => v.v[rowAxis.name] === r)) : ['']
  const at = (c: string, r: string): Variant[] => vs.filter((v) =>
    (!colAxis || v.v[colAxis.name] === c) && (!rowAxis || v.v[rowAxis.name] === r))
  const widths = cols.map((c) => Math.max(48, ...rows.flatMap((r) => at(c, r).map((v) => v.w ?? 120))))
  const g = h('div', {
    class: 'grid',
    style: `grid-template-columns:${rowAxis ? '110px ' : ''}${widths.map((w) => `minmax(0,${w}fr)`).join(' ')}`,
  })
  if (colAxis) {
    if (rowAxis) g.append(h('div', { class: 'gh corner' }, `${rowAxis.name} ＼ ${colAxis.name}`))
    for (const c of cols) g.append(h('div', { class: 'gh' }, c))
  }
  for (const r of rows) {
    if (rowAxis) g.append(h('div', { class: 'gh rowh' }, r))
    for (const c of cols) {
      g.append(h('div', { class: 'gc' }, ...at(c, r).map((v) => {
        const label = others.map((a) => v.v[a.name]).filter(Boolean).join(' · ') || v.name
        return cell(v, label, setName, ctx)
      })))
    }
  }
  return g
}

function family(set: FamilySet, ctx: Ctx): HTMLElement {
  const modeAxes = set.axes.filter(isModeAxis)
  const others = set.axes.filter((a) => !isModeAxis(a))
  const mode = new Map(modeAxes.map((a) => [a.name, chosenMode(a, ctx.theme)]))
  const vis = set.variants.filter((v) => modeAxes.every((a) => (v.v[a.name] ?? mode.get(a.name)) === mode.get(a.name)))

  const sec = h('section', { class: 'fam', id: 'fam-' + famHash(set.id), 'data-fam': famHash(set.id) },
    h('h3', null, set.name,
      h('small', null, `${set.variants.length} 个变体`),
      ...modeAxes.map((a) => h('span', { class: 'chip' }, `${a.name}=${mode.get(a.name)}`))))

  if (!set.variants.length) {
    sec.append(h('p', { class: 'muted' }, '没有变体。'))
    return sec
  }
  const [colAxis, rowAxis, ...rest] = others
  if (!colAxis) {
    sec.append(h('div', { class: 'flat' }, ...vis.map((v) => cell(v, v.name, set.name, ctx))))
    return sec
  }
  for (const combo of cartesian(rest.map((a) => a.values))) {
    const sub = vis.filter((v) => rest.every((a, i) => v.v[a.name] === combo[i]))
    if (!sub.length) continue
    const block = h('div', { class: 'sub' })
    if (rest.length) block.append(h('div', { class: 'sub-title' }, rest.map((a, i) => `${a.name}=${combo[i]}`).join(' · ')))
    block.append(grid(sub, colAxis, rowAxis, others, set.name, ctx))
    sec.append(block)
  }
  return sec
}

function soloList(items: Solo[], ctx: Ctx, pageName: string): HTMLElement {
  return h('div', { class: 'flat' }, ...items.map((s) => cell(s, s.name, pageName, ctx)))
}

export function renderKitPage(p: KitPage, ctx: Ctx): HTMLElement {
  const root = h('div', { class: 'content' })
  if (p.sets.length) root.append(...p.sets.map((s) => family(s, ctx)))
  if (p.solo.length) {
    root.append(h('section', { class: 'fam', id: 'solo' }, h('h3', null, '独立组件', h('small', null, `${p.solo.length} 个`)), soloList(p.solo, ctx, p.name)))
  }
  if (!p.sets.length && !p.solo.length) root.append(h('p', { class: 'muted' }, '这一页没有公开组件，只有内部件。'))

  const nInternal = p.internalSets.length + p.internalSolo.length
  if (nInternal) {
    const inner = h('div', { class: 'internal-body' })
    const det = h('details', { class: 'internal' }, h('summary', null, `内部件 ${nInternal} 个（默认折叠）`), inner)
    det.addEventListener('toggle', () => {
      if (det.open && !inner.hasChildNodes()) {
        inner.append(...p.internalSets.map((s) => family(s, ctx)))
        if (p.internalSolo.length) inner.append(soloList(p.internalSolo, ctx, p.name))
      }
    })
    root.append(det)
  }
  return root
}
