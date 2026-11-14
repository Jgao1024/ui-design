export type Theme = 'light' | 'dark'
export type ThemePref = Theme | 'system'

export interface Fill { t: string; hex?: string; a?: number }
export interface Effect { t: string; r?: number }
export interface TextStyle { f: string; w: number; s: number; lh: number | null; ls: number | null; t: string; n: number }
export interface Spec {
  w: number | null
  h: number | null
  r?: number | number[]
  dir?: 'H' | 'V'
  gap?: number
  fills: Fill[]
  effects: Effect[]
  texts: TextStyle[]
  src: 'own' | 'set'
}

export interface Axis { name: string; values: string[] }
export interface Variant {
  id: string
  name: string
  v: Record<string, string>
  w: number | null
  h: number | null
  svg?: string
  spec?: Spec
}
export interface FamilySet { id: string; name: string; axes: Axis[]; variants: Variant[]; svg?: string }
export interface Solo { id: string; name: string; w: number | null; h: number | null; svg?: string; spec?: Spec }

export interface HigLink { slug: string; url: string }
export interface Family { id: string; name: string }
export interface PageMeta {
  slug: string
  name: string
  bucket: string
  label: string
  hig: HigLink[]
  pub: number
  solo: number
  variants: number
  internal: number
  families: Family[]
}
export interface Category { id: string; label: string; pages: string[] }
export interface Index { categories: Category[]; pages: PageMeta[] }

export interface KitPage extends Omit<PageMeta, 'solo'> {
  kind: 'kit'
  sets: FamilySet[]
  solo: Solo[]
  internalSets: FamilySet[]
  internalSolo: Solo[]
}

export interface ColorToken { hex: string; a: number; uses: number; ex: string[] }
export interface GradientToken { stops: { hex: string; a: number; pos: number }[]; uses: number }
export interface TypeToken { f: string; ps: string | null; w: number; s: number; lh: number; ls: number; uses: number }
export interface EffectToken { t: string; sum: string; uses: number }
export interface CountItem { k: string; uses: number }

export interface TokenPage extends PageMeta {
  kind: 'tokens'
  file: 'colors' | 'typography' | 'effects' | 'geometry'
  desc: string
  tokens: {
    colors?: ColorToken[]
    gradients?: GradientToken[]
    styles?: TypeToken[]
    effects?: EffectToken[]
    cornerRadii?: CountItem[]
    itemSpacing?: CountItem[]
    componentSizes?: CountItem[]
  }
}

export type PageData = KitPage | TokenPage

/** 点击变体或独立组件后交给规格面板的内容 */
export interface Pick {
  title: string
  sub: string
  id: string
  spec?: Spec
}
