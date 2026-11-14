import type { Child, Markup } from "@design/jsx/jsx-runtime";
import { Page } from "@design/components/page.tsx";
import { Row, Variant } from "@design/components/row.tsx";
import { Section } from "@design/components/figure.tsx";
import { MODES } from "../../components/stage.tsx";
import { SectionHeader, SidebarItem, SidebarTile, Disclosure } from "../../components/sidebar.tsx";
import type { SidebarSize } from "../../components/sidebar.tsx";
import type { Mode } from "../../theme.ts";

function Pair(props: { height: number; active?: boolean; draw: (mode: Mode) => Child }): Markup {
  return (
    <div class="flex gap-2">
      {MODES.map((mode) => (
        <SidebarTile mode={mode} active={props.active} width={250} height={props.height}>{props.draw(mode)}</SidebarTile>
      ))}
    </div>
  );
}

const SIZES: { size: SidebarSize; title: string; heights: string }[] = [
  { size: "large", title: "Large", heights: "25 first, 43 later" },
  { size: "medium", title: "Medium", heights: "22 first, 39 later" },
  { size: "small", title: "Small", heights: "19 first, 34 later" },
];
const ROW = { large: 36, medium: 32, small: 24 } as const;

function Headers(props: { size: SidebarSize; title: string; heights: string; active?: boolean }): Markup {
  return (
    <Variant title={props.title} caption={`Section header ${props.heights}.`}>
      <Pair
        height={160}
        active={props.active}
        draw={(mode) => (
          <>
            <SectionHeader mode={mode} size={props.size} first active={props.active} detail="Detail" />
            <SidebarItem mode={mode} size={props.size} active={props.active} icon="folder" label="Label" />
            <SectionHeader mode={mode} size={props.size} first={false} active={props.active} detail="Detail" expanded={false} />
          </>
        )}
      />
    </Variant>
  );
}

export default function SidebarHeaders(): Markup {
  return (
    <Page title="Sidebar Headers" subtitle="macOS 27 · Figma page Sidebars, Section Header, _Disclosure">
      <Section title="Section header" description="Title, optional detail and a disclosure triangle. A header that is not the first adds space above it." gap={12}>
        <Row columns={2} width={508}>
          <Headers {...SIZES[0]} />
          <Headers {...SIZES[1]} />
        </Row>
        <Row columns={2} width={508}>
          <Headers {...SIZES[2]} />
          <Headers {...SIZES[1]} title="Medium · inactive window" active={false} />
        </Row>
      </Section>

      <Section title="Disclosure" description="The triangle on an item (Folder) and on a section header (Header). Expanded points down, collapsed points right." gap={12}>
        <Row columns={2} width={508}>
          <Variant title="Expanded">
            <Pair height={56} draw={(mode) => <Disclosure mode={mode} expanded />} />
          </Variant>
          <Variant title="Collapsed">
            <Pair height={56} draw={(mode) => <Disclosure mode={mode} expanded={false} />} />
          </Variant>
        </Row>
      </Section>
    </Page>
  );
}
