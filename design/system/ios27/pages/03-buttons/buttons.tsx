import type { Markup } from "@design/jsx/jsx-runtime";
import { Page } from "@design/components/page.tsx";
import { Section } from "@design/components/figure.tsx";
import { Row, Variant } from "@design/components/row.tsx";
import { type ButtonSize, GlassButton } from "../../components/buttons.tsx";
import { Wallpaper } from "../../components/wallpaper.tsx";
import { Surface } from "../../components/surface.tsx";
import { type Mode, tone } from "../../theme.ts";

const MODES: Mode[] = ["light", "dark"];
const name = (mode: Mode) => (mode === "light" ? "Light" : "Dark");
const SIZES: ButtonSize[] = ["small", "medium", "large"];
const CAP = (s: string) => s[0].toUpperCase() + s.slice(1);

const GLASS_VARIANTS = [
  { title: "Glass", prominent: false, destructive: false, enabled: true },
  { title: "Glass, disabled", prominent: false, destructive: false, enabled: false },
  { title: "Glass, destructive", prominent: false, destructive: true, enabled: true },
  { title: "Glass, destructive, disabled", prominent: false, destructive: true, enabled: false },
  { title: "Prominent", prominent: true, destructive: false, enabled: true },
  { title: "Prominent, disabled", prominent: true, destructive: false, enabled: false },
  { title: "Prominent, destructive", prominent: true, destructive: true, enabled: true },
  { title: "Prominent, destructive, disabled", prominent: true, destructive: true, enabled: false },
];

export default function Buttons(): Markup {
  return (
    <Page title="Buttons" subtitle="Liquid Glass buttons and button labels. Source: figma/reference/ios27/specs/03-controls/Buttons__Button---Liquid-Glass---*.json and Buttons___Label---*.json">
      <Section title="Glass buttons with text" description="Small 28, Medium 34 and Large 50 pt tall, label weight 510. Prominent fills with the tint (blue, or red when destructive)." gap={10}>
        {MODES.flatMap((mode) =>
          SIZES.flatMap((size) =>
            [GLASS_VARIANTS.slice(0, 4), GLASS_VARIANTS.slice(4)].map((variants) => (
              <Row columns={4} width={180}>
                {variants.map((v) => (
                  <Variant title={`${CAP(size)}, ${v.title}`} caption={`${name(mode)}, Style=${v.prominent ? "Glass Prominent" : "Glass"}, Is Enabled=${v.enabled}, Destructive=${v.destructive}`}>
                    <Wallpaper mode={mode} width={180} height={88} band={34}>
                      <GlassButton mode={mode} size={size} label="Label" prominent={v.prominent} destructive={v.destructive} enabled={v.enabled} />
                    </Wallpaper>
                  </Variant>
                ))}
              </Row>
            ))
          )
        )}
      </Section>

      <Section title="Glass buttons with a symbol" description="50 x 50 circle." gap={10}>
        {MODES.flatMap((mode) =>
          [GLASS_VARIANTS.slice(0, 4), GLASS_VARIANTS.slice(4)].map((variants) => (
            <Row columns={4} width={180}>
              {variants.map((v) => (
                <Variant title={v.title} caption={`${name(mode)}, Is Enabled=${v.enabled}, Destructive=${v.destructive}`}>
                  <Wallpaper mode={mode} width={180} height={88} band={34}>
                    <GlassButton mode={mode} symbol="star" prominent={v.prominent} destructive={v.destructive} enabled={v.enabled} />
                  </Wallpaper>
                </Variant>
              ))}
            </Row>
          ))
        )}
      </Section>

      <Section title="Button labels" description="The label inside a button: 17 pt (Large) or 15 pt (Small), weight 510. Default and preferred use the tint, destructive red; disabled is dimmed." gap={10}>
        {MODES.map((mode) => {
          const t = tone(mode);
          const colors: [string, string][] = [["Default", t.blue], ["Preferred", t.blue], ["Destructive", t.red]];
          return (
            <Row columns={3} width={240}>
              {colors.map(([type, color]) => (
                <Variant title={`${type}, ${name(mode)}`} caption="Size=Large and Small, Is Enabled=True and False">
                  <Surface mode={mode} level={2} width={240} class="flex flex-col gap-2 px-5 py-4">
                    {[17, 15].map((size) => (
                      <div class="flex gap-6" style={`font-size:${size}px;line-height:18px;font-weight:510`}>
                        <span style={`color:${color}`}>Label</span>
                        <span style={`color:${t.label3}`}>Label</span>
                      </div>
                    ))}
                  </Surface>
                </Variant>
              ))}
            </Row>
          );
        })}
      </Section>
    </Page>
  );
}
