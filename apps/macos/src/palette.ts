import { famHash, h } from './dom'
import { getPref, setPref } from './theme'
import type { Index, PageMeta, ThemePref } from './types'

interface Item {
  slug: string
  fam: string
  title: string
  sub: string
}

export interface Palette {
  toggle(): void
  close(): void
  isOpen(): boolean
}

const THEME_OPTIONS: Array<[ThemePref, string]> = [['light', 'Light'], ['dark', 'Dark'], ['system', '跟随系统']]

export function createPalette(
  index: Index,
  go: (slug: string, fam: string) => void,
  currentSlug: () => string,
): Palette {
  const pageBySlug = new Map(index.pages.map((p) => [p.slug, p]))
  let items: Item[] = []
  let sel = 0
  let open = false

  const input = h('input', { class: 'pal-input', type: 'text', placeholder: '搜索页面或组件族…', spellcheck: false })
  const list = h('ul', { class: 'pal-list' })
  const themeBox = h('div', { class: 'seg' })
  const panel = h('div', { class: 'pal-panel', role: 'dialog', 'aria-label': '页面切换' }, input, list,
    h('div', { class: 'pal-foot' }, h('span', { class: 'muted' }, '↑↓ 选择 · Enter 跳转 · Esc 关闭'), themeBox))
  const overlay = h('div', { class: 'pal-overlay', hidden: true, onmousedown: (e) => { if (e.target === overlay) close() } }, panel)
  const fab = h('button', { class: 'fab', type: 'button', title: '切换页面 (⌘K)', onclick: () => toggle() }, '⌘K')
  document.body.append(overlay, fab)

  function renderTheme(): void {
    themeBox.replaceChildren(...THEME_OPTIONS.map(([v, label]) =>
      h('button', { type: 'button', class: getPref() === v ? 'on' : '', onclick: () => { setPref(v); renderTheme() } }, label)))
  }

  function pageItem(p: PageMeta): Item {
    return { slug: p.slug, fam: '', title: p.name, sub: `${p.label} · ${p.pub} 个族` }
  }

  function compute(): Array<Item | string> {
    const q = input.value.trim().toLowerCase()
    const out: Array<Item | string> = []
    if (!q) {
      for (const c of index.categories) {
        out.push(`${c.id} ${c.label}`)
        for (const s of c.pages) {
          const p = pageBySlug.get(s)
          if (p) out.push(pageItem(p))
        }
      }
      return out
    }
    const pages = index.pages.filter((p) => p.name.toLowerCase().includes(q)).map(pageItem)
    const fams: Item[] = []
    for (const p of index.pages) {
      for (const f of p.families) {
        if (f.name.toLowerCase().includes(q)) fams.push({ slug: p.slug, fam: famHash(f.id), title: f.name, sub: `族 · ${p.name}` })
      }
    }
    return [...pages, ...fams].slice(0, 80)
  }

  function render(): void {
    const rows = compute()
    items = rows.filter((r): r is Item => typeof r !== 'string')
    if (sel >= items.length) sel = 0
    let i = 0
    const cur = currentSlug()
    list.replaceChildren(...rows.map((r) => {
      if (typeof r === 'string') return h('li', { class: 'hd' }, r)
      const idx = i++
      return h('li', {
        class: 'it' + (idx === sel ? ' sel' : ''),
        'data-i': idx,
        onclick: () => choose(idx),
        onmousemove: () => { if (sel !== idx) { sel = idx; mark() } },
      }, h('span', { class: 'ttl' }, r.title, r.slug === cur && !r.fam ? h('span', { class: 'cur' }, '当前') : null),
      h('span', { class: 'muted' }, r.sub))
    }))
    mark(true)
  }

  function mark(scroll = false): void {
    list.querySelectorAll('.it').forEach((el) => el.classList.toggle('sel', Number(el.getAttribute('data-i')) === sel))
    if (scroll) list.querySelector('.it.sel')?.scrollIntoView({ block: 'nearest' })
  }

  function choose(i: number): void {
    const it = items[i]
    if (!it) return
    close()
    go(it.slug, it.fam)
  }

  function openPanel(): void {
    open = true
    overlay.hidden = false
    input.value = ''
    const cur = currentSlug()
    renderTheme()
    sel = 0
    render()
    const at = items.findIndex((it) => it.slug === cur && !it.fam)
    if (at >= 0) { sel = at; mark(true) }
    input.focus()
  }

  function close(): void {
    open = false
    overlay.hidden = true
  }

  function toggle(): void {
    if (open) close()
    else openPanel()
  }

  input.addEventListener('input', () => { sel = 0; render() })
  input.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault()
      if (!items.length) return
      sel = (sel + (e.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length
      mark(true)
    } else if (e.key === 'Enter') {
      e.preventDefault()
      choose(sel)
    } else if (e.key === 'Escape') {
      e.preventDefault()
      close()
    }
  })

  return { toggle, close, isOpen: () => open }
}
