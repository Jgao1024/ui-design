import type { Child, Markup } from "@design/jsx/jsx-runtime";
import { Page } from "@design/components/page.tsx";
import { Row, Variant } from "@design/components/row.tsx";
import { Section } from "@design/components/figure.tsx";
import { ModePair } from "../../components/stage.tsx";
import { ToolbarButton, ToolbarGroup } from "../../components/toolbar.tsx";
import type { ToolbarSize } from "../../components/toolbar.tsx";
import type { Mode } from "../../theme.ts";

const HEIGHT: Record<ToolbarSize, number> = { medium: 56, xl: 72 };

/// One Variant: Light and Dark wallpaper tiles with the parts drawn by `draw`.
function Tile(props: { title: string; caption: string; size: ToolbarSize; draw: (mode: Mode) => Child }): Markup {
  return (
    <Variant title={props.title} caption={props.caption}>
      <ModePair width={280} height={HEIGHT[props.size]} draw={(mode) => <div class="flex items-center gap-2">{props.draw(mode)}</div>} />
    </Variant>
  );
}

function Buttons(props: { size: ToolbarSize }): Markup {
  const size = props.size;
  return (
    <Row columns={2} width={568}>
      <Tile
        title="Idle"
        caption="Symbol #1A1A1A (Light) or #F5F5F5 (Dark)."
        size={size}
        draw={(mode) => (
          <>
            <ToolbarButton mode={mode} size={size} icon="sidebar.left" />
            <ToolbarButton mode={mode} size={size} icon="share" />
            <ToolbarButton mode={mode} size={size} icon="plus" />
          </>
        )}
      />
      <Tile
        title="Disabled"
        caption="Symbol #BFBFBF (Light) or #404040 (Dark)."
        size={size}
        draw={(mode) => (
          <>
            <ToolbarButton mode={mode} size={size} icon="sidebar.left" disabled />
            <ToolbarButton mode={mode} size={size} icon="share" disabled />
            <ToolbarButton mode={mode} size={size} icon="plus" disabled />
          </>
        )}
      />
    </Row>
  );
}

function Groups(props: { size: ToolbarSize }): Markup {
  const size = props.size;
  return (
    <>
      <Row columns={2} width={568}>
        <Tile
          title="Idle"
          caption="Buttons share one glass capsule."
          size={size}
          draw={(mode) => <ToolbarGroup mode={mode} size={size} icons={["house", "star", "clock"]} />}
        />
        <Tile
          title="Selected"
          caption="The selected button gets a pill: #E6E6E6 (Light) or #141414 (Dark)."
          size={size}
          draw={(mode) => <ToolbarGroup mode={mode} size={size} icons={["house", "star", "clock"]} selected={1} />}
        />
      </Row>
      <Row columns={2} width={568}>
        <Tile
          title="Disabled"
          caption="All symbols dim."
          size={size}
          draw={(mode) => <ToolbarGroup mode={mode} size={size} icons={["house", "star", "clock"]} disabled />}
        />
        <Tile
          title="With separators"
          caption="Separator: 3 px cell, 1 px line #D9D9D9 (Light) or #262626 (Dark)."
          size={size}
          draw={(mode) => <ToolbarGroup mode={mode} size={size} icons={["house", "star", "clock"]} separated />}
        />
      </Row>
    </>
  );
}

export default function Toolbars(): Markup {
  return (
    <Page title="Toolbars" subtitle="macOS 27 · Figma page Toolbars. Buttons and button groups.">
      <Section
        title="Button · XL"
        description="36 px glass circle with an 18 pt symbol. XL parts sit in unified and expanded toolbars. Active = False (inactive window) uses the same colours in Figma."
        gap={12}
      >
        <Buttons size="xl" />
      </Section>
      <Section title="Button · Medium" description="24 px glass circle with a 14 pt symbol. Medium parts sit in compact toolbars." gap={12}>
        <Buttons size="medium" />
      </Section>
      <Section
        title="Button Group · XL"
        description="Buttons are 32 × 28 inside a 36 px capsule with 4 px padding. The button count sets the width."
        gap={12}
      >
        <Groups size="xl" />
      </Section>
      <Section
        title="Button Group · Medium"
        description="Buttons are 24 × 20 inside a 24 px capsule with 2 px padding."
        gap={12}
      >
        <Groups size="medium" />
      </Section>
    </Page>
  );
}
