import type { Child, Markup } from "@design/jsx/jsx-runtime";
import { Page } from "@design/components/page.tsx";
import { Row, Variant } from "@design/components/row.tsx";
import { Section } from "@design/components/figure.tsx";
import { ModePair, SurfacePair } from "../../components/stage.tsx";
import { Sidebar, SectionHeader, SidebarItem, SIDEBAR_BG } from "../../components/sidebar.tsx";
import type { SidebarSize } from "../../components/sidebar.tsx";
import { TrafficLights } from "../../components/traffic-lights.tsx";
import { ToolbarButton } from "../../components/toolbar.tsx";
import type { Mode } from "../../theme.ts";

function Items(props: { mode: Mode; size: SidebarSize }): Markup {
  const { mode, size } = props;
  return (
    <>
      <SectionHeader mode={mode} size={size} first title="Favorites" />
      <SidebarItem mode={mode} size={size} icon="house" label="Home" state="selected" />
      <SidebarItem mode={mode} size={size} icon="clock" label="Recents" />
      <SidebarItem mode={mode} size={size} icon="folder" label="Documents" />
      <SectionHeader mode={mode} size={size} first={false} title="Locations" />
      <SidebarItem mode={mode} size={size} icon="folder" label="Desktop" />
      <SidebarItem mode={mode} size={size} icon="photo" label="Photos" />
      <SidebarItem mode={mode} size={size} icon="tag" label="Tags" />
      <SidebarItem mode={mode} size={size} icon="trash" label="Trash" state="disabled" />
    </>
  );
}

const SIZES: { size: SidebarSize; title: string; caption: string }[] = [
  { size: "small", title: "Small", caption: "Rows 24, section header 19." },
  { size: "medium", title: "Medium", caption: "Rows 32, section header 22." },
  { size: "large", title: "Large", caption: "Rows 36, section header 25." },
];

function Composed(props: { size: SidebarSize; title: string; caption: string }): Markup {
  return (
    <Variant title={props.title} caption={props.caption}>
      <ModePair width={280} height={480} draw={(mode) => (
        <Sidebar mode={mode} height={440}><Items mode={mode} size={props.size} /></Sidebar>
      )} />
    </Variant>
  );
}

function Bg(props: { active: boolean }): Markup {
  return (
    <ModePair width={140} height={140} draw={(mode: Mode): Child => (
      <div
        class="rounded-[5px]"
        style={`width:100px;height:100px;background:${SIDEBAR_BG[mode][props.active ? "active" : "inactive"]};backdrop-filter:blur(40px) saturate(1.4)`}
      />
    )} />
  );
}

function Controls(props: { compact: boolean }): Markup {
  return (
    <SurfacePair width={230} height={80} draw={(mode: Mode) => (
      <div class="flex w-[200px] items-center justify-between pl-[18px]" style="height:52px">
        <TrafficLights mode={mode} active />
        <ToolbarButton mode={mode} size={props.compact ? "medium" : "xl"} />
      </div>
    )} />
  );
}

export default function Sidebars(): Markup {
  return (
    <Page title="Sidebars" subtitle="macOS 27 · Figma page Sidebars, Sidebars - Composed. Rows and headers are on Sidebar Items and Sidebar Headers.">
      <Section title="Sidebar" description="A 240 px pane with a 52 px stoplights row on top. The size sets row height and type." gap={12}>
        <Row columns={2} width={568}>
          <Composed {...SIZES[0]} />
          <Composed {...SIZES[1]} />
        </Row>
        <Row columns={2} width={568}>
          <Composed {...SIZES[2]} />
        </Row>
      </Section>

      <Section title="Sidebar background" description="Blur 80 plus a luminosity tint (#DAE6F2 92% active, #EDF4FA 97% inactive) and a saturation layer." gap={12}>
        <Row columns={2} width={288}>
          <Variant title="Active"><Bg active /></Variant>
          <Variant title="Inactive"><Bg active={false} /></Variant>
        </Row>
      </Section>

      <Section title="Window controls" description="The stoplights row of a sidebar. The toolbar style sets the size of the button beside it: 36 px Default, 24 px Compact." gap={12}>
        <Row columns={2} width={468}>
          <Variant title="Default"><Controls compact={false} /></Variant>
          <Variant title="Compact"><Controls compact /></Variant>
        </Row>
      </Section>
    </Page>
  );
}
