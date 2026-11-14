import type { Device, ThemePref } from './types'

const K_THEME = 'ios27.theme'
const K_DEVICE = 'ios27.device'

function read<T extends string>(key: string, allowed: readonly T[], fallback: T): T {
  try {
    const v = localStorage.getItem(key)
    return allowed.includes(v as T) ? (v as T) : fallback
  } catch {
    return fallback
  }
}

function write(key: string, value: string): void {
  try {
    localStorage.setItem(key, value)
  } catch {
    /* 隐私模式下忽略 */
  }
}

export const state = {
  theme: read<ThemePref>(K_THEME, ['system', 'light', 'dark'], 'system'),
  device: read<Device>(K_DEVICE, ['all', 'iphone', 'ipad', 'duo'], 'iphone'),
}

const listeners: (() => void)[] = []
export function onSettingsChange(fn: () => void): void {
  listeners.push(fn)
}

const dark = window.matchMedia('(prefers-color-scheme: dark)')

export function resolvedTheme(): 'light' | 'dark' {
  if (state.theme === 'system') return dark.matches ? 'dark' : 'light'
  return state.theme
}

export function applyTheme(): void {
  document.documentElement.dataset.theme = resolvedTheme()
}

export function setTheme(t: ThemePref): void {
  if (state.theme === t) return
  state.theme = t
  write(K_THEME, t)
  applyTheme()
  listeners.forEach((f) => f())
}

export function setDevice(d: Device): void {
  if (state.device === d) return
  state.device = d
  write(K_DEVICE, d)
  listeners.forEach((f) => f())
}

dark.addEventListener('change', () => {
  if (state.theme !== 'system') return
  applyTheme()
  listeners.forEach((f) => f())
})

/** 先判断 iPhone Duo，再 iPad，最后 iPhone；不含设备词返回 null。 */
export function deviceOf(name: string): Exclude<Device, 'all'> | null {
  if (name.includes('iPhone Duo')) return 'duo'
  if (name.includes('iPad')) return 'ipad'
  if (name.includes('iPhone')) return 'iphone'
  return null
}

export function visibleByDevice(name: string): boolean {
  if (state.device === 'all') return true
  const d = deviceOf(name)
  return d === null || d === state.device
}
