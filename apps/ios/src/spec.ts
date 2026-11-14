import { getSpecs } from './data'
import { esc } from './dom'
import type { Spec, SpecEffect, SpecNode } from './types'

let drawer: HTMLElement | null = null
let ticket = 0

function ensure(): HTMLElement {
  if (drawer) return drawer
  drawer = document.createElement('aside')
  drawer.id = 'spec'
  drawer.hidden = true
  drawer.setAttribute('aria-label', '规格面板')
  drawer.addEventListener('click', (e) => {
    if ((e.target as HTMLElement).closest('.spec-x')) closeSpec()
  })
  document.body.appendChild(drawer)
  return drawer
}

export const isSpecOpen = () => !!drawer && !drawer.hidden

export function closeSpec(): void {
  ticket++
  if (drawer) drawer.hidden = true
  document.body.classList.remove('spec-open')
  document.querySelectorAll('.cell.sel').forEach((c) => c.classList.remove('sel'))
}

function rgba(hex: string, a: number): string {
  const n = parseInt(hex.replace('#', '').slice(0, 6), 16)
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`
}

function paint([hex, a]: [string, number | null]): string {
  if (a === null) return `<li><span class="sw-s sw-none"></span>${esc(hex)}</li>`
  return `<li><span class="sw-s" style="--c:${rgba(hex, a)}"></span><code>${esc(hex)}</code> α ${a}</li>`
}

function fxLine(e: SpecEffect): string {
  const p: string[] = []
  if (e.x !== undefined) p.push(`x ${e.x} y ${e.y}`)
  if (e.r !== undefined) p.push(`模糊 ${e.r}`)
  if (e.s) p.push(`扩展 ${e.s}`)
  if (e.hex) p.push(`${e.hex} α ${e.a}`)
  return `<li><code>${esc(e.t)}</code> ${esc(p.join(' · '))}</li>`
}

function rowsOf(n: SpecNode): string {
  const rows: [string, string][] = []
  if (n.w !== undefined) rows.push(['尺寸', `${n.w} × ${n.h}`])
  if (n.rc) rows.push(['圆角', n.rc.join(' / ')])
  else if (n.r !== undefined) rows.push(['圆角', String(n.r)])
  if (n.dir) rows.push(['布局', `${n.dir === 'H' ? '水平' : '垂直'}${n.gap !== undefined ? `，间距 ${n.gap}` : ''}`])
  if (n.pad) rows.push(['内边距', `上 ${n.pad[0]} 右 ${n.pad[1]} 下 ${n.pad[2]} 左 ${n.pad[3]}`])
  if (n.stroke) rows.push(['描边宽度', String(n.sw ?? 0)])
  if (n.op !== undefined) rows.push(['不透明度', String(n.op)])
  return rows.map(([k, v]) => `<div class="kv"><span>${k}</span><b>${esc(v)}</b></div>`).join('')
}

function section(title: string, body: string): string {
  return body ? `<section><h4>${title}</h4>${body}</section>` : ''
}

function nodeLine(n: SpecNode): string {
  const bits: string[] = []
  if (n.w !== undefined) bits.push(`${n.w}×${n.h}`)
  if (n.r !== undefined) bits.push(`r ${n.r}`)
  if (n.fill?.length) bits.push(n.fill.map(([h, a]) => (a === null ? h : `${h}${a < 1 ? ' α' + a : ''}`)).join(', '))
  if (n.fx?.length) bits.push(n.fx.map((e) => e.t).join(', '))
  return `<li><b>${esc(n.n ?? '')}</b> <small>${esc(n.t ?? '')}</small><br><small>${esc(bits.join(' · '))}</small></li>`
}

function body(spec: Spec, hasSvg: boolean): string {
  const r = spec.root
  const out: string[] = [section('尺寸与布局', rowsOf(r))]
  if (r.fill?.length) out.push(section('填充', `<ul class="plain">${r.fill.map(paint).join('')}</ul>`))
  if (r.stroke?.length) out.push(section('描边', `<ul class="plain">${r.stroke.map(paint).join('')}</ul>`))
  if (spec.colors?.length) {
    out.push(
      section(
        '颜色（含子图层，hex）',
        `<ul class="plain">${spec.colors
          .map(([h, a, c]) => `<li><span class="sw-s" style="--c:${rgba(h, a)}"></span><code>${esc(h)}</code> α ${a} <small>×${c}</small></li>`)
          .join('')}</ul>`,
      ),
    )
  }
  if (spec.text?.length) {
    out.push(
      section(
        '字体',
        `<ul class="plain">${spec.text
          .map(
            (t) =>
              `<li>“${esc(t.c)}”<br><small>${esc(t.f ?? '')} · 字重 ${t.w} · 字号 ${t.s} · 行高 ${t.lh ?? '—'} · 字距 ${t.ls ?? 0}</small></li>`,
          )
          .join('')}</ul>`,
      ),
    )
  }
  if (spec.fx?.length) out.push(section('效果', `<ul class="plain">${spec.fx.map(fxLine).join('')}</ul>`))
  if (spec.nodes?.length) {
    out.push(
      `<section><details><summary>子图层 ${spec.nodes.length}${spec.more ? ` + ${spec.more}` : ''}</summary>` +
        `<ul class="plain nodes">${spec.nodes.map(nodeLine).join('')}</ul></details></section>`,
    )
  }
  out.push(`<section class="foot"><small>${hasSvg ? 'SVG 已接入' : 'SVG 未导出，显示占位矩形'}</small></section>`)
  return out.join('')
}

export async function openSpec(slug: string, id: string, name: string, cell?: HTMLElement): Promise<void> {
  const el = ensure()
  const my = ++ticket
  document.querySelectorAll('.cell.sel').forEach((c) => c.classList.remove('sel'))
  cell?.classList.add('sel')
  const head = `<header><div><h3>${esc(name)}</h3><code>${esc(id)}</code></div><button type="button" class="spec-x" aria-label="关闭">✕</button></header>`
  el.innerHTML = head + '<div class="spec-body muted">加载中…</div>'
  el.hidden = false
  document.body.classList.add('spec-open')
  let html: string
  try {
    const spec = (await getSpecs(slug))[id]
    html = spec ? body(spec, !!cell?.querySelector('img')) : '<div class="muted">没有这个节点的规格数据。</div>'
  } catch (e) {
    html = `<div class="muted">规格数据加载失败：${esc((e as Error).message)}</div>`
  }
  if (my !== ticket) return
  el.innerHTML = head + `<div class="spec-body">${html}</div>`
}
