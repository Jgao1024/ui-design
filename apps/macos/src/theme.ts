import type { Theme, ThemePref } from './types'

const KEY = 'macos27-theme'
const media = window.matchMedia('(prefers-color-scheme: dark)')
const listeners: Array<() => void> = []

function readPref(): ThemePref {
  const v = localStorage.getItem(KEY)
  return v === 'light' || v === 'dark' ? v : 'system'
}

let pref: ThemePref = readPref()

export const getPref = (): ThemePref => pref
export const effectiveTheme = (): Theme => (pref === 'system' ? (media.matches ? 'dark' : 'light') : pref)

function apply(): void {
  document.documentElement.dataset.theme = effectiveTheme()
  listeners.forEach((fn) => fn())
}

export function setPref(p: ThemePref): void {
  pref = p
  if (p === 'system') localStorage.removeItem(KEY)
  else localStorage.setItem(KEY, p)
  apply()
}

export function onThemeChange(fn: () => void): void {
  listeners.push(fn)
}

export function initTheme(): void {
  media.addEventListener('change', () => {
    if (pref === 'system') apply()
  })
  document.documentElement.dataset.theme = effectiveTheme()
}
