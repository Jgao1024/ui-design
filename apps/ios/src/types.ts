export interface Category {
  id: string
  label: string
}

export interface PageMeta {
  slug: string
  name: string
  cat: string
  kind: 'kit' | 'tokens'
  token?: string
  desc?: string
  hig: string[]
  nPub: number
  nSolo: number
  nVar: number
  nInt: number
  fams: { id: string; name: string }[]
}

export interface IndexData {
  higUrl: string
  categories: Category[]
  pages: PageMeta[]
}

export interface Kid {
  id: string
  name: string
  w: number | null
  h: number | null
  v: string[]
  svg?: string
}

export interface SetItem {
  kind: 'set'
  id: string
  name: string
  variants: number
  axes: [string, string[]][]
  kids: Kid[]
}

export interface SoloItem {
  kind: 'solo'
  id: string
  name: string
  w: number | null
  h: number | null
  svg?: string
}

export type Item = SetItem | SoloItem

export interface PageData {
  slug: string
  name: string
  cat: string
  sets: SetItem[]
  solo: SoloItem[]
  internal: Item[]
}

type Paint = [string, number | null]

export interface SpecNode {
  w?: number
  h?: number
  r?: number
  rc?: number[]
  dir?: 'H' | 'V'
  gap?: number
  pad?: number[]
  fill?: Paint[]
  stroke?: Paint[]
  sw?: number
  fx?: SpecEffect[]
  op?: number
  n?: string
  t?: string
}

export interface SpecEffect {
  t: string
  r?: number
  hex?: string
  a?: number
  x?: number
  y?: number
  s?: number
}

export interface SpecText {
  c: string
  f: string | null
  w: number | null
  s: number | null
  lh: number | null
  ls: number | null
}

export interface Spec {
  name: string
  kind: string
  root: SpecNode
  text?: SpecText[]
  colors?: [string, number, number][]
  fx?: SpecEffect[]
  nodes?: SpecNode[]
  more?: number
}

export type SpecMap = Record<string, Spec>

export type ThemePref = 'system' | 'light' | 'dark'
export type Device = 'all' | 'iphone' | 'ipad' | 'duo'
