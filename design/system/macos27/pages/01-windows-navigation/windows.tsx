import type { Markup } from "@design/jsx/jsx-runtime";
import { Page } from "@design/components/page.tsx";
import { Row, Variant } from "@design/components/row.tsx";
import { Section } from "@design/components/figure.tsx";
import { ModePair, SurfacePair } from "../../components/stage.tsx";
import { TrafficLights } from "../../components/traffic-lights.tsx";
import { Window, WindowTitle } from "../../components/window.tsx";
import { UI } from "../../theme.ts";

export default function Windows(): Markup {
  return (
    <Page title="Windows" subtitle="macOS 27 · Figma page Windows">
      <Section
        title="Window shell"
        description="300 × 200, radius 16. An active window casts a deep shadow; an inactive one a shallow shadow. Dark adds a 1 px white 20% edge."
        gap={12}
      >
        <Row columns={1} width={688}>
          <Variant title="Active" caption="Shadow 0 18 54, black 30% (Light) or 57% (Dark).">
            <ModePair width={340} height={260} draw={(mode) => <Window mode={mode} width={300} height={200} type="default" title={null} />} />
          </Variant>
        </Row>
        <Row columns={1} width={688}>
          <Variant title="Inactive" caption="Shadow 0 7 21, black 20% (Light) or 35% (Dark).">
            <ModePair
              width={340}
              height={260}
              draw={(mode) => <Window mode={mode} active={false} width={300} height={200} type="default" title={null} />}
            />
          </Variant>
        </Row>
      </Section>

      <Section
        title="Window controls"
        description="Close, Minimize and Zoom. Standard windows use 14 px lights 9 px apart; utility panels use 10 px lights 7 px apart."
        gap={12}
      >
        <Row columns={4} width={208}>
          <Variant title="Standard · Active">
            <SurfacePair width={100} height={48} draw={(mode) => <TrafficLights mode={mode} active />} />
          </Variant>
          <Variant title="Standard · Inactive">
            <SurfacePair width={100} height={48} draw={(mode) => <TrafficLights mode={mode} active={false} />} />
          </Variant>
          <Variant title="Utility · Active">
            <SurfacePair width={100} height={48} draw={(mode) => <TrafficLights mode={mode} active size={10} />} />
          </Variant>
          <Variant title="Utility · Inactive">
            <SurfacePair width={100} height={48} draw={(mode) => <TrafficLights mode={mode} active={false} size={10} />} />
          </Variant>
        </Row>
      </Section>

      <Section title="Window titles" description="A title with an optional symbol and subtitle. The title is 13 pt semibold; an inactive window dims it." gap={12}>
        <Row columns={3} width={208}>
          <Variant title="Title">
            <SurfacePair width={100} height={48} draw={(mode) => <WindowTitle mode={mode} title="Title" />} />
          </Variant>
          <Variant title="Symbol + Title">
            <SurfacePair width={100} height={48} draw={(mode) => <WindowTitle mode={mode} title="Title" symbol />} />
          </Variant>
          <Variant title="Title + Subtitle">
            <SurfacePair
              width={100}
              height={48}
              draw={(mode) => (
                <div class="text-center">
                  <WindowTitle mode={mode} title="Title" />
                  <p class="text-[11px] leading-[13px]" style={`color:${UI[mode].secondary}`}>Subtitle</p>
                </div>
              )}
            />
          </Variant>
        </Row>
      </Section>
    </Page>
  );
}
