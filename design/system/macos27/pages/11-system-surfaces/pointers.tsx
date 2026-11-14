import type { Child, Markup } from "@design/jsx/jsx-runtime";
import { Page } from "@design/components/page.tsx";
import { Row, Variant } from "@design/components/row.tsx";
import { Section } from "@design/components/figure.tsx";
import { SurfacePair } from "../../components/stage.tsx";
import { POINTERS } from "../../components/pointers-data.ts";
import { PointerGlyph } from "../../components/system-surface.tsx";

const GROUPS: { title: string; description: string; slugs: string[] }[] = [
  {
    title: "Arrow and cursors",
    description: "The default arrow, the arrow with a menu badge, the text cursor, the cross and the beachball.",
    slugs: ["default", "default-with-menu-badge", "text-cursor", "cross", "beachball"],
  },
  {
    title: "Hands, move and zoom",
    description: "Pointing, open and grabbing hands, the move cursor and the two zoom cursors.",
    slugs: ["hand-pointing", "hand-open", "hand-grabbing", "move", "zoom-in", "zoom-out"],
  },
  {
    title: "Resize",
    description: "One-sided, two-sided and diagonal resize cursors.",
    slugs: [
      "resize-left", "resize-right", "resize-up", "resize-down",
      "resize-left-right", "resize-up-down", "resize-north-south", "resize-west-east",
      "resize-north-east-south-west", "resize-north-west-south-east",
    ],
  },
];

function chunks<T>(items: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let index = 0; index < items.length; index += size) out.push(items.slice(index, index + size));
  return out;
}

export default function Pointers(): Markup {
  return (
    <Page title="Pointers" subtitle="macOS 27 · Figma page Pointers. 21 cursors, 28 × 28, white outline and black fill. Paths are Figma's own.">
      {GROUPS.map((group) => (
        <Section title={group.title} description={`${group.description} Drawn at 2×; the same artwork is used in Light and Dark.`} gap={12}>
          {chunks(group.slugs, 4).map((slugs): Child => (
            <Row columns={4} width={268}>
              {slugs.map((slug) => {
                const pointer = POINTERS.find((item) => item.slug === slug)!;
                return (
                  <Variant title={pointer.title}>
                    <SurfacePair width={130} height={80} draw={() => <PointerGlyph x={pointer.x} y={pointer.y} svg={pointer.svg} scale={2} />} />
                  </Variant>
                );
              })}
            </Row>
          ))}
        </Section>
      ))}
    </Page>
  );
}
