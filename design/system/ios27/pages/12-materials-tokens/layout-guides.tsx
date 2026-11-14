import type { Markup } from "@design/jsx/jsx-runtime";
import { Page } from "@design/components/page.tsx";
import { Section } from "@design/components/figure.tsx";
import { Row, Variant } from "@design/components/row.tsx";
import { Surface } from "../../components/surface.tsx";

// Overlays: Layout Margin red, Safe Area Inset cyan, Reserved Region purple, each at 40 % (Layout-Guides___Layout-Overlays.json).
const RED = "rgb(255 56 60 / 0.4)";
const CYAN = "rgb(0 192 232 / 0.4)";
const PURPLE = "rgb(203 48 224 / 0.4)";

function Guides(props: { width: number; height: number; margin: number; top: number; bottom: number; reserved?: { left: number; top: number; width: number; height: number } }): Markup {
  return (
    <Surface mode="light" level={2} width={props.width} height={props.height} radius={20}>
      <div class="absolute inset-x-0 top-0" style={`height:${props.top}px;background:${CYAN}`} />
      <div class="absolute inset-x-0 bottom-0" style={`height:${props.bottom}px;background:${CYAN}`} />
      <div class="absolute inset-y-0 left-0" style={`width:${props.margin}px;background:${RED}`} />
      <div class="absolute inset-y-0 right-0" style={`width:${props.margin}px;background:${RED}`} />
      {props.reserved && <div class="absolute" style={`left:${props.reserved.left}px;top:${props.reserved.top}px;width:${props.reserved.width}px;height:${props.reserved.height}px;background:${PURPLE}`} />}
    </Surface>
  );
}

export default function LayoutGuides(): Markup {
  return (
    <Page title="Layout guides" subtitle="Margins and safe areas. Source: figma/reference/ios27/specs/08-tokens/Layout-Guides__*.json">
      <Section title="Overlay colours" description="Layout Margin is red, Safe Area Inset cyan and Reserved Region purple, each at 40 % opacity." gap={10}>
        <Row columns={3} width={200}>
          {[["Layout Margin", RED], ["Safe Area Inset", CYAN], ["Reserved Region", PURPLE]].map(([title, color]) => (
            <Variant title={title} caption={`Type=${title}`}><div class="h-[100px] w-[100px] rounded-lg" style={`background:${color}`} /></Variant>
          ))}
        </Row>
      </Section>
      <Section title="iPhone" description="402 x 874. Layout margins 16 pt at the sides; the safe area is 62 pt at the top (status bar and Dynamic Island, reserved) and 34 pt at the bottom (home indicator)." gap={10}>
        <Row columns={1} width={402}>
          <Variant title="iPhone, portrait" caption="Standard">
            <Guides width={402} height={874} margin={16} top={62} bottom={34} reserved={{ left: 138, top: 14, width: 125, height: 37 }} />
          </Variant>
        </Row>
      </Section>
      <Section title="iPhone Duo" description="Inner display 669 x 951 with 20 pt layout margins; outer display 466 x 678 with a camera punch-out (48 x 42) reserved in the 84 pt vertical bar." gap={10}>
        <Row columns={2} width={669}>
          <Variant title="Inner, portrait" caption="iPhone Duo/Standard/Inner - Portrait">
            <Guides width={669} height={951} margin={20} top={84} bottom={34} reserved={{ left: 532, top: 24, width: 44, height: 48 }} />
          </Variant>
          <Variant title="Outer, portrait" caption="iPhone Duo/Standard/Outer - Portrait">
            <Guides width={466} height={678} margin={20} top={84} bottom={24} reserved={{ left: 394, top: 24, width: 48, height: 42 }} />
          </Variant>
        </Row>
      </Section>
    </Page>
  );
}
