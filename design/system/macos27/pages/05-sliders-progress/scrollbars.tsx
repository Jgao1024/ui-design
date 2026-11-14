import type { Markup } from "@design/jsx/jsx-runtime";
import { Page } from "@design/components/page.tsx";
import { Row, Variant } from "@design/components/row.tsx";
import { Section } from "@design/components/figure.tsx";
import { SurfacePair } from "../../components/stage.tsx";
import { Scrollbar } from "../../components/progress.tsx";

const POSITIONS = [
  { title: "Top", value: 0 },
  { title: "Middle", value: 0.5 },
  { title: "Bottom", value: 1 },
];
const PAGES = [2, 4, 8];

function Bars(props: { horizontal: boolean; pages: number }): Markup {
  return (
    <Row columns={3} width={360}>
      {POSITIONS.map((item) => (
        <Variant
          title={props.horizontal ? ["Leading", "Center", "Trailing"][POSITIONS.indexOf(item)] : item.title}
          caption={`Page ${props.pages * 100}%: thumb ${58 / props.pages} px of 58.`}
        >
          <SurfacePair
            width={176}
            height={props.horizontal ? 48 : 88}
            draw={(mode) => <Scrollbar mode={mode} horizontal={props.horizontal} pages={props.pages} position={item.value} />}
          />
        </Variant>
      ))}
    </Row>
  );
}

export default function Scrollbars(): Markup {
  return (
    <Page title="Scrollbars" subtitle="macOS 27 · Figma page Scrollbar. A 12 px track holds a 6 px thumb, black 50%, inset 3 px. Dark is inferred: white 50%.">
      {PAGES.map((pages) => (
        <Section
          title={`Vertical · Page height × ${pages}`}
          description={pages === 2 ? "Content twice the view height: the thumb is half the 58 px track." : `Thumb ${58 / pages} px.`}
          gap={12}
        >
          <Bars horizontal={false} pages={pages} />
        </Section>
      ))}
      {PAGES.map((pages) => (
        <Section
          title={`Horizontal · Page ${pages * 100}%`}
          description="The same bar on its side: 64 × 12 with the thumb inset 3 px."
          gap={12}
        >
          <Bars horizontal pages={pages} />
        </Section>
      ))}
    </Page>
  );
}
