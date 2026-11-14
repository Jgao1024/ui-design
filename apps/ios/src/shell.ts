import { esc } from './dom'
import { setDevice, setTheme, state, onSettingsChange, visibleByDevice } from './state'
import type { Device, IndexData, ThemePref } from './types'

const THEMES: [ThemePref, string][] = [['light', 'Light'], ['dark', 'Dark'], ['system', '跟随系统']]
const DEVICES: [Device, string][] = [['all', '全部'], ['iphone', 'iPhone'], ['ipad', 'iPad'], ['duo', 'iPhone Duo']]

interface Row {
  el: HTMLElement
  slug: string
  famId: string | null
}

export interface Shell {
  isOpen(): boolean
  open(): void
  close(): void
  toggle(): void
  setCurrent(slug: string): void
}

function seg<T extends string>(label: string, key: string, opts: [T, string][], cur: T): string {
  const btns = opts
    .map(([v, t]) => `<button type="button" data-${key}="${v}" aria-pressed="${v === cur}">${esc(t)}</button>`)
    .join('')
  return `<div class="opt"><span class="opt-l">${esc(label)}</span><div class="seg">${btns}</div></div>`
}

export function createShell(
  root: HTMLElement,
  index: IndexData,
  go: (slug: string, famId?: string) => void,
): Shell {
  const catLabel = new Map(index.categories.map((c) => [c.id, c.label]))
  let current = ''
  let rows: Row[] = []
  let active = 0

  root.insertAdjacentHTML(
    'beforeend',
    `<button id="fab" type="button" aria-label="打开导航面板（⌘K）" title="⌘K">⌘K</button>
     <div id="overlay" hidden>
       <div class="panel" role="dialog" aria-modal="true" aria-label="导航面板">
         <input id="q" type="search" placeholder="搜索页面或组件族…" autocomplete="off" spellcheck="false" />
         <div id="opts"></div>
         <div id="list" role="listbox"></div>
         <div class="p-foot">↑ ↓ 选择 · Enter 跳转 · Esc 关闭 · 面板外 ← → 翻页</div>
       </div>
     </div>`,
  )
  const fab = root.querySelector<HTMLButtonElement>('#fab')!
  const overlay = root.querySelector<HTMLElement>('#overlay')!
  const input = root.querySelector<HTMLInputElement>('#q')!
  const opts = root.querySelector<HTMLElement>('#opts')!
  const list = root.querySelector<HTMLElement>('#list')!

  function renderOpts(): void {
    opts.innerHTML =
      seg('明暗', 'theme', THEMES, state.theme) + seg('设备', 'device', DEVICES, state.device)
  }

  function setActive(i: number): void {
    if (!rows.length) return
    active = (i + rows.length) % rows.length
    rows.forEach((r, k) => r.el.classList.toggle('on', k === active))
    rows[active].el.scrollIntoView({ block: 'nearest' })
  }

  function renderList(): void {
    const terms = input.value.trim().toLowerCase().split(/\s+/).filter(Boolean)
    const hit = (s: string) => terms.every((t) => s.toLowerCase().includes(t))
    const parts: string[] = []
    const meta: { slug: string; famId: string | null }[] = []
    for (const cat of index.categories) {
      const body: string[] = []
      for (const p of index.pages) {
        if (p.cat !== cat.id) continue
        const pageHit = !terms.length || hit(p.name)
        const fams = terms.length ? p.fams.filter((f) => visibleByDevice(f.name) && hit(f.name)) : []
        if (!pageHit && !fams.length) continue
        const i = meta.push({ slug: p.slug, famId: null }) - 1
        body.push(
          `<div class="row${p.slug === current ? ' cur' : ''}" role="option" data-i="${i}">` +
            `<span class="nm">${esc(p.name)}</span><span class="ct">${p.nPub ? p.nPub + ' 族' : ''}</span></div>`,
        )
        for (const f of fams) {
          const j = meta.push({ slug: p.slug, famId: f.id }) - 1
          body.push(
            `<div class="row sub" role="option" data-i="${j}"><span class="nm">↳ ${esc(f.name)}</span>` +
              `<span class="ct">${esc(p.name)}</span></div>`,
          )
        }
      }
      if (body.length) parts.push(`<div class="grp">${esc(cat.label)} <small>${esc(cat.id)}</small></div>${body.join('')}`)
    }
    list.innerHTML = parts.join('') || '<div class="empty">没有匹配项</div>'
    rows = Array.from(list.querySelectorAll<HTMLElement>('.row')).map((el, k) => ({
      el,
      slug: meta[k].slug,
      famId: meta[k].famId,
    }))
    active = 0
    if (!terms.length) {
      const k = rows.findIndex((r) => r.slug === current && !r.famId)
      if (k >= 0) active = k
    }
    setActive(active)
  }

  function pick(i: number): void {
    const r = rows[i]
    if (!r) return
    close()
    go(r.slug, r.famId ?? undefined)
  }

  function open(): void {
    overlay.hidden = false
    input.value = ''
    renderOpts()
    renderList()
    input.focus()
  }
  function close(): void {
    overlay.hidden = true
    input.blur()
  }
  const isOpen = () => !overlay.hidden

  fab.addEventListener('click', open)
  overlay.addEventListener('mousedown', (e) => {
    if (e.target === overlay) close()
  })
  input.addEventListener('input', renderList)
  input.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive(active + 1)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive(active - 1)
    } else if (e.key === 'Enter') {
      e.preventDefault()
      pick(active)
    }
  })
  list.addEventListener('click', (e) => {
    const row = (e.target as HTMLElement).closest<HTMLElement>('.row')
    if (row) pick(Number(row.dataset.i))
  })
  opts.addEventListener('click', (e) => {
    const b = (e.target as HTMLElement).closest<HTMLButtonElement>('button')
    if (!b) return
    if (b.dataset.theme) setTheme(b.dataset.theme as ThemePref)
    if (b.dataset.device) setDevice(b.dataset.device as Device)
  })
  onSettingsChange(() => {
    if (!isOpen()) return
    renderOpts()
    renderList()
  })

  return {
    isOpen,
    open,
    close,
    toggle: () => (isOpen() ? close() : open()),
    setCurrent(slug) {
      current = slug
    },
  }
}
