import './src/style.css'
import { loadIndex, loadPage } from './src/data'
import { h } from './src/dom'
import { renderKitPage } from './src/page'
import { createPalette } from './src/palette'
import { hashFor, navigate, parseHash } from './src/router'
import { closeSpec, isSpecOpen, openSpec } from './src/spec'
import { effectiveTheme, initTheme, onThemeChange } from './src/theme'
import { renderTokenPage } from './src/tokens'
import type { Index, PageData, PageMeta } from './src/types'

async function boot(): Promise<void> {
  const app = document.getElementById('app')!
  initTheme()

  let index: Index
  try {
    index = await loadIndex()
  } catch {
    app.textContent = '没有找到 data/index.json。请先运行 pnpm data:macos。'
    return
  }
  // 面板和翻页都按这个顺序：分类顺序 → 分类内页面顺序
  const order: PageMeta[] = index.categories
    .flatMap((c) => c.pages)
    .map((s) => index.pages.find((p) => p.slug === s))
    .filter((p): p is PageMeta => !!p)
  if (!order.length) {
    app.textContent = '数据里没有页面。请重新运行 pnpm data:macos。'
    return
  }

  let current: PageData | null = null
  let currentSlug = ''
  let ticket = 0

  const bar = h('div', { class: 'bar' })
  const head = h('header', { class: 'head' })
  const main = h('main', { class: 'main' })
  app.append(bar, head, main)

  const palette = createPalette(index, (slug, fam) => navigate(slug, fam), () => currentSlug)

  function renderBody(): void {
    if (!current) return
    const p = current
    main.replaceChildren(p.kind === 'kit'
      ? renderKitPage(p, { theme: effectiveTheme(), pick: openSpec })
      : renderTokenPage(p))
  }

  function renderHead(p: PageData, m: PageMeta, pos: number): void {
    bar.replaceChildren(
      h('span', { class: 'pos' }, `${pos + 1} / ${order.length}`),
      h('span', { class: 'bar-name' }, p.name),
      h('span', { class: 'muted' }, '⌘K 切换 · ← → 翻页'))
    const higs = p.hig.map((l) => h('a', { href: l.url, target: '_blank', rel: 'noreferrer' }, l.slug))
    head.replaceChildren(
      h('h1', null, p.name),
      h('div', { class: 'meta' },
        h('span', { class: 'chip' }, `${p.bucket} ${p.label}`),
        p.kind === 'tokens'
          ? h('span', { class: 'muted' }, p.desc)
          : h('span', { class: 'muted' }, `公开族 ${m.pub} · 独立组件 ${m.solo} · 变体 ${m.variants} · 内部件 ${m.internal}`),
        p.kind === 'kit'
          ? h('span', { class: 'hig' }, 'HIG：', ...(higs.length ? higs.flatMap((a, i) => (i ? [' · ', a] : [a])) : ['无对应 HIG 页']))
          : null))
  }

  function scrollToFam(fam: string): void {
    if (!fam) { window.scrollTo(0, 0); return }
    const el = document.getElementById('fam-' + fam)
    if (!el) return
    el.scrollIntoView({ block: 'start' })
    el.classList.add('flash')
    setTimeout(() => el.classList.remove('flash'), 1600)
  }

  async function show(): Promise<void> {
    const { slug, fam } = parseHash()
    const pos = Math.max(0, order.findIndex((p) => p.slug === slug))
    const meta = order[pos]!
    if (meta.slug !== slug) { location.replace(hashFor(meta.slug)); return }

    if (meta.slug === currentSlug) { scrollToFam(fam); return }
    const mine = ++ticket
    let data: PageData
    try {
      data = await loadPage(meta.slug)
    } catch {
      main.textContent = `加载 data/pages/${meta.slug}.json 失败。请重新运行 pnpm data:macos。`
      return
    }
    if (mine !== ticket) return
    current = data
    currentSlug = meta.slug
    closeSpec()
    renderHead(data, meta, pos)
    renderBody()
    scrollToFam(fam)
  }

  function step(delta: number): void {
    const pos = order.findIndex((p) => p.slug === currentSlug)
    const next = order[(pos + delta + order.length) % order.length]!
    navigate(next.slug)
  }

  window.addEventListener('hashchange', () => { void show() })
  onThemeChange(() => { renderBody() })

  window.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault()
      palette.toggle()
      return
    }
    if (e.key === 'Escape') {
      if (palette.isOpen()) palette.close()
      else if (isSpecOpen()) closeSpec()
      return
    }
    const t = e.target as HTMLElement | null
    if (palette.isOpen() || e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) return
    if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return
    if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1) }
    else if (e.key === 'ArrowRight') { e.preventDefault(); step(1) }
  })

  await show()
}

void boot()
