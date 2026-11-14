import { esc, idToHash } from './dom'
import { openSpec } from './spec'
import { resolvedTheme, state, visibleByDevice } from './state'
import type { IndexData, Item, Kid, PageData, PageMeta, SetItem, SoloItem } from './types'

const DEVICE_LABEL = { all: '全部设备', iphone: 'iPhone', ipad: 'iPad', duo: 'iPhone Duo' } as const
const MIN_TRACK = 72
const FALLBACK = { w: 120, h: 60 }

// ───────────────────────── 头部 ─────────────────────────

export function renderPageHeader(index: IndexData, meta: PageMeta, i: number): HTMLElement {
  const el = document.createElement('header')
  el.className = 'ph-head'
  const cat = index.categories.find((c) => c.id === meta.cat)
  const hig = meta.hig.length
    ? meta.hig.map((s) => `<a href="${esc(index.higUrl + s)}" target="_blank" rel="noopener">HIG：${esc(s)}</a>`).join(' · ')
    : '<span class="muted">无对应 HIG 页</span>'
  const stats =
    meta.kind === 'tokens'
      ? esc(meta.desc ?? '')
      : `公开族 ${meta.nPub} · 独立组件 ${meta.nSolo} · 变体 ${meta.nVar} · 内部件 ${meta.nInt}`
  const device = meta.kind === 'kit' ? `<span class="pill">设备：${DEVICE_LABEL[state.device]}</span>` : ''
  el.innerHTML =
    `<div class="seq" title="当前页 / 总页数">${i + 1} / ${index.pages.length}</div>` +
    `<h1>${esc(meta.name)}</h1>` +
    `<div class="meta"><span>${esc(cat?.label ?? '')} <small>${esc(meta.cat)}</small></span><span>${hig}</span>${device}</div>` +
    `<div class="stats">${stats}</div>`
  return el
}

// ───────────────────────── 单元格 ─────────────────────────

interface Cellable {
  id: string
  name: string
  w: number | null
  h: number | null
  svg?: string
}

function cell(it: Cellable, label: string, flat: boolean): string {
  const w = it.w || FALLBACK.w
  const h = it.h || FALLBACK.h
  const art = it.svg
    ? `<img src="${esc(it.svg)}" alt="${esc(it.name)}" loading="lazy" decoding="async">`
    : '<span class="ph"></span>'
  const style = flat ? ` style="width:min(100%,max(${MIN_TRACK + 24}px,${w}px))"` : ''
  return (
    `<button type="button" class="cell" data-id="${esc(it.id)}" data-name="${esc(it.name)}" title="${esc(it.name)}"${style}>` +
    `<span class="art" style="width:min(100%,${w}px);aspect-ratio:${w}/${h}">${art}</span>` +
    `<span class="lab">${esc(label)}</span></button>`
  )
}

// ───────────────────────── 族网格 ─────────────────────────

function orderBy(axisVals: string[], vals: string[]): string[] {
  const rank = (v: string) => (axisVals.indexOf(v) < 0 ? 1e6 : axisVals.indexOf(v))
  return [...new Set(vals)].sort((a, b) => rank(a) - rank(b))
}

function gridTable(s: SetItem, ks: Kid[], ci: number, ri: number | undefined, labelIdx: number[]): string {
  const cols = orderBy(s.axes[ci][1], ks.map((k) => k.v[ci]))
  const rows = ri === undefined ? [null] : orderBy(s.axes[ri][1], ks.map((k) => k.v[ri]))
  const tracks = cols.map((c) => {
    const maxW = Math.max(...ks.filter((k) => k.v[ci] === c).map((k) => k.w || FALLBACK.w))
    return `minmax(0,${Math.max(maxW, MIN_TRACK)}px)`
  })
  const head = ri === undefined ? '' : '96px '
  let html = `<div class="tbl" style="grid-template-columns:${head}${tracks.join(' ')}">`
  if (ri !== undefined) html += `<div class="corner">${esc(s.axes[ri][0])} ↓<br>${esc(s.axes[ci][0])} →</div>`
  html += cols.map((c) => `<div class="colh">${esc(c || '—')}</div>`).join('')
  for (const r of rows) {
    if (ri !== undefined) html += `<div class="rowh">${esc(r || '—')}</div>`
    for (const c of cols) {
      const hit = ks.filter((k) => k.v[ci] === c && (ri === undefined || k.v[ri] === r))
      html += `<div class="slot">${hit.map((k) => cell(k, labelIdx.map((i) => k.v[i]).filter(Boolean).join(' · ') || k.name, false)).join('')}</div>`
    }
  }
  return html + '</div>'
}

function familyBody(s: SetItem): string {
  if (!s.kids.length) return '<div class="muted">无变体</div>'
  const modeIdx = s.axes.findIndex(([, vals]) => vals.includes('Light') && vals.includes('Dark'))
  const want = resolvedTheme() === 'dark' ? 'Dark' : 'Light'
  const kids = modeIdx >= 0 ? s.kids.filter((k) => k.v[modeIdx] === want) : s.kids
  const idxs = s.axes.map((_, i) => i).filter((i) => i !== modeIdx)
  if (!idxs.length) return `<div class="flat">${kids.map((k) => cell(k, k.name, true)).join('')}</div>`

  const [ci, ri, ...subs] = idxs
  const groups = new Map<string, Kid[]>()
  for (const k of kids) {
    const key = subs.map((i) => k.v[i]).join('\u0001')
    const g = groups.get(key)
    if (g) g.push(k)
    else groups.set(key, [k])
  }
  const rank = (k: Kid) => subs.map((i) => String(Math.max(0, s.axes[i][1].indexOf(k.v[i]))).padStart(4, '0')).join('.')
  const ordered = [...groups.values()].sort((a, b) => rank(a[0]).localeCompare(rank(b[0])))
  return ordered
    .map((ks) => {
      const title = subs.map((i) => `${s.axes[i][0]}: ${ks[0].v[i] || '—'}`).join(' · ')
      return `<div class="subgrid">${title ? `<h3>${esc(title)}</h3>` : ''}${gridTable(s, ks, ci, ri, idxs)}</div>`
    })
    .join('')
}

function familySection(s: SetItem, level: 'h2' | 'h3' = 'h2'): string {
  const modeIdx = s.axes.findIndex(([, vals]) => vals.includes('Light') && vals.includes('Dark'))
  const axes = s.axes.map(([a]) => a).join(' · ')
  const note = modeIdx >= 0 ? `<span class="pill">${esc(s.axes[modeIdx][0])} 跟随明暗开关</span>` : ''
  return (
    `<section class="fam" id="fam-${esc(idToHash(s.id))}">` +
    `<div class="fam-h"><${level}>${esc(s.name)}</${level}><span class="n">${s.variants} 变体</span>` +
    `<span class="axes">${esc(axes)}</span>${note}</div>${familyBody(s)}</section>`
  )
}

function soloGrid(items: SoloItem[]): string {
  return `<div class="flat">${items.map((s) => cell(s, s.name, true)).join('')}</div>`
}

function itemsHtml(items: Item[], forceId: string | null): string {
  const shown = items.filter((it) => it.id === forceId || visibleByDevice(it.name))
  const sets = shown.filter((it): it is SetItem => it.kind === 'set')
  const solos = shown.filter((it): it is SoloItem => it.kind === 'solo')
  return sets.map((s) => familySection(s, 'h3')).join('') + (solos.length ? soloGrid(solos) : '')
}

// ───────────────────────── 页面 ─────────────────────────

export function renderKitPage(data: PageData, meta: PageMeta, forceId: string | null): HTMLElement {
  const root = document.createElement('div')
  root.className = 'kit'
  const sets = data.sets.filter((s) => s.id === forceId || visibleByDevice(s.name))
  const solos = data.solo.filter((s) => visibleByDevice(s.name))
  const internal = data.internal.filter((s) => visibleByDevice(s.name))

  let html = sets.map((s) => familySection(s)).join('')
  if (solos.length) html += `<section class="block"><h2>独立组件 <span class="n">${solos.length}</span></h2>${soloGrid(solos)}</section>`
  if (!sets.length && !solos.length) {
    html += `<div class="empty-note">${
      meta.nPub + meta.nSolo > 0 ? '当前设备筛选下没有内容，在 ⌘K 面板里切换到“全部”可查看。' : '此页没有公开组件。'
    }</div>`
  }
  if (internal.length) {
    html +=
      `<section class="block"><button type="button" class="toggle" aria-expanded="false">▸ 内部件 ${internal.length} 个（默认折叠）</button>` +
      `<div class="internal" hidden></div></section>`
  }
  root.innerHTML = html

  const toggle = root.querySelector<HTMLButtonElement>('.toggle')
  const box = root.querySelector<HTMLElement>('.internal')
  toggle?.addEventListener('click', () => {
    if (!box) return
    const open = box.hidden
    if (open && !box.dataset.ready) {
      box.innerHTML = itemsHtml(internal, null)
      box.dataset.ready = '1'
    }
    box.hidden = !open
    toggle.setAttribute('aria-expanded', String(open))
    toggle.textContent = `${open ? '▾' : '▸'} 内部件 ${internal.length} 个${open ? '' : '（默认折叠）'}`
  })

  root.addEventListener('click', (e) => {
    const c = (e.target as HTMLElement).closest<HTMLElement>('.cell')
    if (c) openSpec(meta.slug, c.dataset.id ?? '', c.dataset.name ?? '', c)
  })
  return root
}
