import type { Child, Markup } from "@design/jsx/jsx-runtime";
import { Page } from "@design/components/page.tsx";
import { Section } from "@design/components/figure.tsx";
import { Row, Variant } from "@design/components/row.tsx";
import { EditButton, SearchField, SectionHeader, SidebarMaterial, SidebarRow, type RowState, type Trailing } from "../../components/sidebar.tsx";
import { Icon } from "../../components/icon.tsx";
import { type Mode, tone } from "../../theme.ts";

/// Light and Dark panels of the same content, one pair per row.
function Pair(props: { title: string; caption: string; width?: number; height: number; render: (mode: Mode) => Child }): Markup {
  const width = props.width ?? 320;
  return (
    <Row columns={2} width={width}>
      <Variant title={`${props.title}, Light`} caption={props.caption}>
        <SidebarMaterial mode="light" active width={width} height={props.height}>{props.render("light")}</SidebarMaterial>
      </Variant>
      <Variant title={`${props.title}, Dark`} caption={props.caption}>
        <SidebarMaterial mode="dark" active width={width} height={props.height}>{props.render("dark")}</SidebarMaterial>
      </Variant>
    </Row>
  );
}

const STATES: [RowState, string][] = [["default", "Default"], ["selected", "Selected"], ["disabled", "Disabled"], ["disclosable", "Disclosable"]];
const TRAILING: [Trailing, string][] = [["detail", "Detail"], ["disclosure", "Disclosure"], ["checkmark", "Checkmark"], ["info", "Info"], ["symbol", "Symbol"], ["toggle", "Toggle"]];

export default function SidebarRows(): Markup {
  return (
    <Page title="Sidebar rows" subtitle="Parts of a sidebar. Source: figma/reference/ios27/specs/01-navigation/Sidebars__Sidebar-Row.json and the _Sidebar, _Search Field and _Section Header components">
      <Section title="Row states and indent" description="320 x 44. Left padding 10, 30 or 50 for indent 0, 1, 2. Disabled is 50 % opacity. Disclosable adds a chevron." gap={10}>
        {STATES.map(([state, name]) => (
          <Pair
            title={name}
            caption={`State=${name}, Indent Level=0, 1, 2`}
            height={44 * 3 + 20}
            render={(mode) => (
              <div class="pt-2.5">
                {([0, 1, 2] as const).map((indent) => <SidebarRow mode={mode} title="Title" detail="Detail" state={state} indent={indent} />)}
              </div>
            )}
          />
        ))}
      </Section>

      <Section title="Leading image" description="Symbol, bitmap, collection of bitmaps, or hidden." gap={10}>
        <Pair
          title="Leading"
          caption="Image=Symbol, Bitmap, Collection, Hidden"
          height={44 * 4 + 20}
          render={(mode) => (
            <div class="pt-2.5">
              <SidebarRow mode={mode} title="Title" icon="star" image="symbol" />
              <SidebarRow mode={mode} title="Title" image="bitmap" />
              <SidebarRow mode={mode} title="Title" image="collection" />
              <SidebarRow mode={mode} title="Title" image="hidden" />
            </div>
          )}
        />
      </Section>

      <Section title="Trailing accessory" description="Detail, disclosure, checkmark, info, symbol and toggle." gap={10}>
        <Pair
          title="Trailing"
          caption="Type=Detail, Disclosure, Checkmark, Info, Symbol, Toggle"
          height={44 * 6 + 20}
          render={(mode) => (
            <div class="pt-2.5">
              {TRAILING.map(([type]) => <SidebarRow mode={mode} title="Title" detail="Detail" icon="star" trailing={type} />)}
            </div>
          )}
        />
      </Section>

      <Section title="Edit buttons" description="A 21 pt circle on the leading edge while editing: selectable, selected, delete." gap={10}>
        <Pair
          title="Edit"
          caption="Type=Selectable, Selected, Delete"
          height={44 * 3 + 20}
          render={(mode) => (
            <div class="pt-2.5">
              <SidebarRow mode={mode} title="Title" icon="star" edit="selectable" />
              <SidebarRow mode={mode} title="Title" icon="star" edit="selected" />
              <SidebarRow mode={mode} title="Title" icon="star" edit="delete" />
            </div>
          )}
        />
      </Section>

      <Section title="Section header" description="260 x 54, 17/22 at 60 % label. Optional detail and disclosure." gap={10}>
        <Pair
          title="Header"
          caption="Show Detail, Show Disclosure"
          width={260}
          height={54 * 3}
          render={(mode) => (
            <div>
              <SectionHeader mode={mode} />
              <SectionHeader mode={mode} detail="Detail" />
              <div class="relative"><SectionHeader mode={mode} detail="Detail" /><div class="absolute right-3 top-[21px]" style={`color:${tone(mode).label2}`}><Icon name="chevron-down" size={14} weight={2.6} /></div></div>
            </div>
          )}
        />
      </Section>

      <Section title="Search field" description="A 44 pt capsule: fill #787880 at 16 % Light, 32 % Dark." gap={10}>
        <Pair
          title="Search"
          caption="State=Placeholder, Typing, Value"
          width={240}
          height={44 * 3 + 40}
          render={(mode) => (
            <div class="flex flex-col gap-2.5 p-5">
              <SearchField mode={mode} state="placeholder" width={200} />
              <SearchField mode={mode} state="typing" width={200} term="Moun" />
              <SearchField mode={mode} state="value" width={200} />
            </div>
          )}
        />
      </Section>
    </Page>
  );
}
