import type { Markup } from "@design/jsx/jsx-runtime";
import { Page } from "@design/components/page.tsx";
import { Section } from "@design/components/figure.tsx";
import { Row, Variant } from "@design/components/row.tsx";

// Product bezels are bitmaps in Figma, so they cannot be redrawn from the specs. These are schematic frames at the
// screen sizes the specs give, shown at 40 %; the colours are approximations of the finish names.
type Device = { name: string; screen: [number, number]; inset: number; colors: [string, string][]; island?: boolean };

const DEVICES: Device[] = [
  { name: "iPhone 17", screen: [402, 874], inset: 24, island: true, colors: [["Lavender", "#c8b6e0"], ["Black", "#2a2a2c"], ["Mist Blue", "#b4c7d9"], ["Sage", "#b7c4a8"], ["White", "#f0f0f2"]] },
  { name: "iPhone 17 Pro", screen: [402, 874], inset: 24, island: true, colors: [["Silver", "#e3e4e6"], ["Cosmic Orange", "#e8803a"], ["Deep Blue", "#27374d"]] },
  { name: "iPhone 17 Pro Max", screen: [440, 956], inset: 24, island: true, colors: [["Silver", "#e3e4e6"], ["Cosmic Orange", "#e8803a"], ["Deep Blue", "#27374d"]] },
  { name: "iPhone Air", screen: [420, 912], inset: 20, island: true, colors: [["Sky Blue", "#a9c4dc"], ["Cloud White", "#f0f0f2"], ["Space Black", "#2a2a2c"], ["Light Gold", "#e6d6b0"]] },
  { name: "iPad Pro 11", screen: [834, 1194], inset: 28, colors: [["Silver", "#e3e4e6"], ["Space Black", "#2a2a2c"]] },
];

function Bezel(props: { device: Device; color: string }): Markup {
  const [w, h] = props.device.screen;
  const i = props.device.inset;
  const scale = 0.4;
  return (
    <div style={`width:${(w + 2 * i) * scale}px;height:${(h + 2 * i) * scale}px`}>
      <div class="relative origin-top-left" style={`width:${w + 2 * i}px;height:${h + 2 * i}px;transform:scale(${scale});border-radius:${i * 2.6}px;background:${props.color};box-shadow:inset 0 0 0 2px rgb(0 0 0 / 0.2)`}>
        <div class="absolute bg-black" style={`left:${i * 0.4}px;top:${i * 0.4}px;right:${i * 0.4}px;bottom:${i * 0.4}px;border-radius:${i * 2.2}px`} />
        <div class="absolute" style={`left:${i}px;top:${i}px;width:${w}px;height:${h}px;border-radius:${i * 1.9}px;background:linear-gradient(160deg,#7ec8ff,#b79cff 55%,#ff9ad5)`} />
        {props.device.island && <div class="absolute rounded-full bg-black" style={`left:${i + w / 2 - 62}px;top:${i + 14}px;width:125px;height:37px`} />}
      </div>
    </div>
  );
}

export default function Bezels(): Markup {
  return (
    <Page title="Product bezels" subtitle="Device frames. Source: figma/reference/ios27/specs/07-system/Product-Bezels__*.json (bitmaps in Figma, drawn schematically here)">
      {DEVICES.map((device) => (
        <Section title={device.name} description={`Screen ${device.screen[0]} x ${device.screen[1]}, frame ${device.inset} pt around it. Shown at 40 %.`} gap={10}>
          <Row columns={device.colors.length} width={Math.round((device.screen[0] + 2 * device.inset) * 0.4)}>
            {device.colors.map(([colorName, color]) => (
              <Variant title={colorName} caption={`Color=${colorName}`}><Bezel device={device} color={color} /></Variant>
            ))}
          </Row>
        </Section>
      ))}
    </Page>
  );
}
