import type { Markup } from "@design/jsx/jsx-runtime";
import { Page } from "@design/components/page.tsx";
import { Row, Variant } from "@design/components/row.tsx";
import { Section } from "@design/components/figure.tsx";
import { ModePair } from "../../components/stage.tsx";
import { Popover } from "../../components/overlay.tsx";
import type { Edge } from "../../components/overlay.tsx";

const GROUPS: { title: string; description: string; edges: { edge: Edge; title: string }[] }[] = [
  {
    title: "Top edge",
    description: "The arrow sits on the top edge, pointing up.",
    edges: [{ edge: "top-leading", title: "Top · Leading" }, { edge: "top-center", title: "Top · Center" }, { edge: "top-trailing", title: "Top · Trailing" }],
  },
  {
    title: "Bottom edge",
    description: "The arrow sits on the bottom edge, pointing down.",
    edges: [{ edge: "bottom-leading", title: "Bottom · Leading" }, { edge: "bottom-center", title: "Bottom · Center" }, { edge: "bottom-trailing", title: "Bottom · Trailing" }],
  },
  {
    title: "Leading edge",
    description: "The arrow sits on the left edge, pointing left.",
    edges: [{ edge: "leading-top", title: "Leading · Top" }, { edge: "leading-middle", title: "Leading · Middle" }, { edge: "leading-bottom", title: "Leading · Bottom" }],
  },
  {
    title: "Trailing edge",
    description: "The arrow sits on the right edge, pointing right.",
    edges: [{ edge: "trailing-top", title: "Trailing · Top" }, { edge: "trailing-middle", title: "Trailing · Middle" }, { edge: "trailing-bottom", title: "Trailing · Bottom" }],
  },
];

export default function Popovers(): Markup {
  return (
    <Page title="Popovers" subtitle="macOS 27 · Figma page Popovers. 200 × 200 glass, radius 20, with a 46 × 10.5 arrow on one of twelve positions.">
      {GROUPS.map((group) => (
        <Section title={group.title} description={`${group.description} The panel is empty in Figma; corner arrows are an approximation of Figma's 39 px corner-hugging shape.`} gap={12}>
          <Row columns={3} width={360}>
            {group.edges.map((item) => (
              <Variant title={item.title}>
                <ModePair width={176} height={256} draw={(mode) => <div style="transform:scale(0.7);flex:none"><Popover mode={mode} edge={item.edge} /></div>} />
              </Variant>
            ))}
          </Row>
        </Section>
      ))}
    </Page>
  );
}
