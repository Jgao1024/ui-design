import type { Markup } from "@design/jsx/jsx-runtime";
import { Page } from "@design/components/page.tsx";
import { Row, Variant } from "@design/components/row.tsx";
import { Section } from "@design/components/figure.tsx";
import { SurfacePair } from "../../components/stage.tsx";
import { Switch } from "../../components/toggle.tsx";
import type { SwitchSize, ToggleState } from "../../components/toggle.tsx";

const STATES: ToggleState[] = ["idle", "clicked", "disabled"];
const TITLES = { idle: "Idle", clicked: "Clicked", disabled: "Disabled" };
const SIZES: { size: SwitchSize; title: string; caption: string }[] = [
  { size: "mini", title: "Mini", caption: "36 × 16, knob 21 × 13." },
  { size: "small", title: "Small", caption: "44 × 20, knob 26 × 16." },
  { size: "medium", title: "Medium", caption: "54 × 24, knob 32 × 20." },
  { size: "large", title: "Large", caption: "64 × 28, knob 38 × 24." },
  { size: "xl", title: "XL", caption: "80 × 36, knob 47 × 30." },
];

function States(props: { on: boolean; captions: [string, string, string] }): Markup {
  return (
    <Row columns={3} width={360}>
      {STATES.map((state, index) => (
        <Variant title={TITLES[state]} caption={props.captions[index]}>
          <SurfacePair width={176} height={56} draw={(mode) => <Switch mode={mode} on={props.on} state={state} />} />
        </Variant>
      ))}
    </Row>
  );
}

function Sizes(props: { on: boolean }): Markup {
  return (
    <>
      <Row columns={3} width={360}>
        {SIZES.slice(0, 3).map((item) => (
          <Variant title={item.title} caption={item.caption}>
            <SurfacePair width={176} height={64} draw={(mode) => <Switch mode={mode} size={item.size} on={props.on} />} />
          </Variant>
        ))}
      </Row>
      <Row columns={3} width={360}>
        {SIZES.slice(3).map((item) => (
          <Variant title={item.title} caption={item.caption}>
            <SurfacePair width={176} height={64} draw={(mode) => <Switch mode={mode} size={item.size} on={props.on} />} />
          </Variant>
        ))}
      </Row>
    </>
  );
}

export default function Switches(): Markup {
  return (
    <Page title="Switches" subtitle="macOS 27 · Figma page Toggles, Switches. Medium (54 × 24) states, then five sizes.">
      <Section
        title="Off · Medium"
        description="Track radius 100, knob inset 2 px. The off track is grey: black 10% / 19% / 5% (inferred from the checkbox fills; Figma keeps it inside an instance). Dark uses white."
        gap={12}
      >
        <States on={false} captions={["Knob at the left.", "The knob becomes a Liquid Glass pill, 23% larger.", "Track 5%, knob 70%."]} />
      </Section>
      <Section title="On · Medium" description="Track accent #0088FF; knob white with a soft shadow (Figma: drop shadow, no values)." gap={12}>
        <States on captions={["Knob at the right.", "Glass knob.", "Track 50% (inferred)."]} />
      </Section>
      <Section title="Sizes · Off" description="Idle, Selection = False. Size sets the track and knob; the inset is 2 px (3 px XL, 1.5 px Mini)." gap={12}>
        <Sizes on={false} />
      </Section>
      <Section title="Sizes · On" description="Idle, Selection = True." gap={12}>
        <Sizes on />
      </Section>
    </Page>
  );
}
