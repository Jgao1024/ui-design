import type { Child, Markup } from "@design/jsx/jsx-runtime";
import { Page } from "@design/components/page.tsx";
import { Row, Variant } from "@design/components/row.tsx";
import { Section } from "@design/components/figure.tsx";
import { Backdrop } from "../../components/backdrop.tsx";
import { Glass } from "../../components/glass.tsx";
import { COLOR } from "../../theme.ts";

type Mode = "light" | "dark";
const MODES: Mode[] = ["light", "dark"];

/// Light and Dark tiles side by side, 8px apart. `draw` receives the mode.
function Pair(props: { size: number; draw: (mode: Mode) => Child }): Markup {
  return (
    <div class="flex gap-2">
      {MODES.map((mode) => (
        <Backdrop mode={mode} width={props.size} height={props.size}>{props.draw(mode)}</Backdrop>
      ))}
    </div>
  );
}

/// Small control, Active=False: flat capsule, no glass (Materials__Liquid-Glass---Small.json, "Fill" and "Shadow").
function FlatCapsule(props: { mode: Mode }): Markup {
  const fill = props.mode === "light" ? "#fbfbfb" : "#0d0d0d";
  const rim = props.mode === "light" ? "#ebebeb" : "#e6e6e6";
  return <div class="size-12 rounded-full" style={`background:${fill};box-shadow:0 0 0 0.5px ${rim}`} />;
}

/// Small control, Active=True: glass capsule; Primary adds the accent tint.
function GlassCapsule(props: { mode: Mode; primary: boolean }): Markup {
  return (
    <Glass width={48} height={48} radius={1000} mode={props.mode} size="small" tint={props.primary ? COLOR.accent : undefined} />
  );
}

/// Scroll-edge sample: bars standing in for scrolled content, under an overlay that covers the tile.
function Content(props: { mode: Mode }): Markup {
  const bar = props.mode === "light" ? "bg-black/70" : "bg-white/80";
  return (
    <div class="absolute inset-0 flex flex-col justify-between px-4 py-4">
      {[70, 90, 55, 80, 65, 85, 50, 75].map((w) => <div class={`h-2 rounded-full ${bar}`} style={`width:${w}%`} />)}
    </div>
  );
}

function SoftEdge(props: { edge: "top" | "bottom" }): Markup {
  const direction = props.edge === "top" ? "to bottom" : "to top";
  const mask = `linear-gradient(${direction},#000,transparent)`;
  return (
    <Pair
      size={200}
      draw={(mode) => (
        <>
          <Content mode={mode} />
          <div
            class="absolute inset-0"
            style={`backdrop-filter:blur(10px);-webkit-mask-image:${mask};mask-image:${mask}`}
          />
        </>
      )}
    />
  );
}

function HardEdge() {
  const fill = { light: "rgb(255 255 255 / 0.85)", dark: "rgb(31 31 31 / 0.55)" } as const;
  return (
    <Pair
      size={200}
      draw={(mode) => (
        <>
          <Content mode={mode} />
          <div class="absolute inset-0" style={`background:${fill[mode]};backdrop-filter:blur(6px)`} />
        </>
      )}
    />
  );
}

const THICKNESS = [
  { name: "Ultra Thick", light: "rgb(236 236 236 / 0.88)", dark: "rgb(0 0 0 / 0.5)" },
  { name: "Thick", light: "rgb(246 246 246 / 0.72)", dark: "rgb(0 0 0 / 0.4)" },
  { name: "Medium", light: "rgb(246 246 246 / 0.6)", dark: "rgb(0 0 0 / 0.29)" },
  { name: "Thin", light: "rgb(246 246 246 / 0.48)", dark: "rgb(0 0 0 / 0.2)" },
  { name: "Ultra Thin", light: "rgb(246 246 246 / 0.36)", dark: "rgb(0 0 0 / 0.1)" },
];

export default function LiquidGlass(): Markup {
  return (
    <Page title="Liquid Glass" subtitle="macOS 27 · Figma page Materials">
      <Section title="Liquid Glass · Small" description="48 × 48 capsule for toolbar and window controls. Active and Primary are separate variants." gap={12}>
        <Row columns={4} width={208}>
          <Variant title="Active · Default">
            <Pair size={100} draw={(mode) => <GlassCapsule mode={mode} primary={false} />} />
          </Variant>
          <Variant title="Active · Primary">
            <Pair size={100} draw={(mode) => <GlassCapsule mode={mode} primary />} />
          </Variant>
          <Variant title="Inactive · Default" caption="Flat fill, no glass.">
            <Pair size={100} draw={(mode) => <FlatCapsule mode={mode} />} />
          </Variant>
          <Variant title="Inactive · Primary" caption="Same layers as Default in Figma.">
            <Pair size={100} draw={(mode) => <FlatCapsule mode={mode} />} />
          </Variant>
        </Row>
      </Section>

      <Section title="Liquid Glass · Medium and Large" description="160 × 160, radius 34. Figma uses the same fill, rim and shadow layers for both sizes." gap={12}>
        <Row columns={2} width={408}>
          <Variant title="Medium">
            <Pair size={200} draw={(mode) => <Glass width={160} height={160} radius={34} mode={mode} />} />
          </Variant>
          <Variant title="Large">
            <Pair size={200} draw={(mode) => <Glass width={160} height={160} radius={34} mode={mode} />} />
          </Variant>
        </Row>
      </Section>

      <Section title="Scroll Edge Effect" description="Blur laid over scrolling content where it meets a bar. Soft fades out; Hard is a uniform veil." gap={12}>
        <Row columns={2} width={408}>
          <Variant title="Soft · Top" caption="Progressive blur 10, mask fades from the top edge.">
            <SoftEdge edge="top" />
          </Variant>
          <Variant title="Soft · Bottom" caption="Progressive blur 10, mask fades from the bottom edge.">
            <SoftEdge edge="bottom" />
          </Variant>
        </Row>
        <Row columns={2} width={408}>
          <Variant title="Hard · Top / Bottom" caption="Light: white 85%, blur 6. Dark: #1F1F1F 55%, blur 6. Top and Bottom are identical in Figma.">
            <HardEdge />
          </Variant>
        </Row>
      </Section>

      <Section title="Materials" description="Five thicknesses, each with background blur 60." gap={12}>
        <Row columns={5} width={208}>
          {THICKNESS.map((type) => (
            <Variant title={type.name}>
              <Pair
                size={100}
                draw={(mode) => <div class="absolute inset-0" style={`background:${type[mode]};backdrop-filter:blur(60px)`} />}
              />
            </Variant>
          ))}
        </Row>
      </Section>
    </Page>
  );
}
