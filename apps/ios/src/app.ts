import { getIndex, getPage } from './data'
import { hashToId, idToHash, esc } from './dom'
import { renderKitPage, renderPageHeader } from './page'
import { createShell, type Shell } from './shell'
import { closeSpec, isSpecOpen } from './spec'
import { applyTheme, onSettingsChange } from './state'
import { renderTokenPage } from './tokens'
import type { IndexData } from './types'

interface Route {
  slug: string
  famId: string | null
}

let index: IndexData
let shell: Shell
let route: Route
let token = 0
const main = document.createElement('main')

function parseRoute(): Route {
  const m = location.hash.match(/^#\/([^/]+)(?:\/(.+))?$/)
  const slug = m && index.pages.some((p) => p.slug === m[1]) ? m[1] : index.pages[0].slug
  return { slug, famId: m && m[2] && slug === m[1] ? hashToId(m[2]) : null }
}

function navigate(slug: string, famId?: string): void {
  const hash = `#/${slug}${famId ? '/' + idToHash(famId) : ''}`
  if (location.hash === hash) void render(true)
  else location.hash = hash
}

function step(d: number): void {
  const n = index.pages.length
  const i = index.pages.findIndex((p) => p.slug === route.slug)
  navigate(index.pages[(i + d + n) % n].slug)
}

async function render(resetScroll: boolean): Promise<void> {
  const my = ++token
  route = parseRoute()
  const i = index.pages.findIndex((p) => p.slug === route.slug)
  const meta = index.pages[i]
  shell.setCurrent(meta.slug)
  document.title = `${meta.name} · iOS 27 组件`

  let body: HTMLElement
  try {
    body = meta.kind === 'tokens' ? await renderTokenPage(meta) : renderKitPage(await getPage(meta.slug), meta, route.famId)
  } catch (e) {
    body = document.createElement('div')
    body.className = 'err'
    body.textContent = `页面数据加载失败：${(e as Error).message}。请先运行 pnpm data:ios。`
  }
  if (my !== token) return

  const y = window.scrollY
  closeSpec()
  main.replaceChildren(renderPageHeader(index, meta, i), body)
  if (!resetScroll) {
    window.scrollTo(0, y)
  } else if (route.famId) {
    document.getElementById('fam-' + idToHash(route.famId))?.scrollIntoView()
  } else {
    window.scrollTo(0, 0)
  }
}

function isTyping(t: EventTarget | null): boolean {
  const el = t as HTMLElement | null
  return !!el && (el.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(el.tagName))
}

export async function start(root: HTMLElement): Promise<void> {
  applyTheme()
  try {
    index = await getIndex()
  } catch (e) {
    root.innerHTML = `<div class="err">数据未就绪：${esc((e as Error).message)}。请先运行 <code>pnpm data:ios</code>。</div>`
    return
  }
  root.appendChild(main)
  shell = createShell(root, index, navigate)

  window.addEventListener('hashchange', () => void render(true))
  onSettingsChange(() => void render(false))

  window.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault()
      shell.toggle()
      return
    }
    if (e.key === 'Escape') {
      if (shell.isOpen()) shell.close()
      else if (isSpecOpen()) closeSpec()
      return
    }
    if (shell.isOpen() || isTyping(e.target) || e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) return
    if (e.key === 'ArrowLeft') {
      e.preventDefault()
      step(-1)
    } else if (e.key === 'ArrowRight') {
      e.preventDefault()
      step(1)
    }
  })

  if (!location.hash) history.replaceState(null, '', `#/${index.pages[0].slug}`)
  await render(true)
}
