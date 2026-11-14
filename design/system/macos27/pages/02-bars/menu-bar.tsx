import type { Markup } from "@design/jsx/jsx-runtime";
import { Page } from "@design/components/page.tsx";
import { Row, Variant } from "@design/components/row.tsx";
import { Section } from "@design/components/figure.tsx";
import { Backdrop } from "../../components/backdrop.tsx";
import { ModePair } from "../../components/stage.tsx";
import { AppleMenu, AppName, MenuBar, MenuItem } from "../../components/menu-bar.tsx";
import type { Mode } from "../../theme.ts";

function Strip(props: { mode: Mode; selected?: number }): Markup {
  return (
    <Backdrop mode={props.mode} width={1168} height={72}>
      <div class="absolute top-0 left-0"><MenuBar mode={props.mode} width={1168} selected={props.selected} /></div>
    </Backdrop>
  );
}

function Part(props: { title: string; caption: string; selected: boolean; kind: "apple" | "app" | "item" }): Markup {
  return (
    <Variant title={props.title} caption={props.caption}>
      <ModePair
        width={140}
        height={48}
        draw={(mode) =>
          props.kind === "apple"
            ? <AppleMenu mode={mode} selected={props.selected} />
            : props.kind === "app"
            ? <AppName mode={mode} selected={props.selected} />
            : <MenuItem mode={mode} selected={props.selected} />}
      />
    </Variant>
  );
}

export default function MenuBarPage(): Markup {
  return (
    <Page title="Menu Bar" subtitle="macOS 27 · Figma page Menu Bar and Dock. The menu bar has no fill; it draws over the wallpaper.">
      <Section
        title="Menu bar"
        description="45 px high, parts 24 px high, 10 px from the top and sides. Over Light uses black 85% text; Over Dark uses white. Figma's bar is 1008 px wide in the component and 1512 px on the desktop template; here it is 1168 px."
        gap={12}
      >
        <Row columns={1} width={1168}>
          <Variant title="Over Light" caption="Apple menu, app name, menu items; Wi-Fi, Spotlight, Control Center, date and time.">
            <Strip mode="light" />
          </Variant>
        </Row>
        <Row columns={1} width={1168}>
          <Variant title="Over Dark" caption="Same parts. Trailing symbols are stand-ins for the SF Symbols.">
            <Strip mode="dark" />
          </Variant>
        </Row>
      </Section>
      <Section title="Parts" description="Idle parts. Text is 13 pt." gap={12}>
        <Row columns={3} width={288}>
          <Part title="Apple menu" caption="33 × 24." selected={false} kind="apple" />
          <Part title="App name" caption={'90 × 24, text "App Name".'} selected={false} kind="app" />
          <Part title="Menu item" caption={'47 × 24, text "Item".'} selected={false} kind="item" />
        </Row>
      </Section>
      <Section
        title="Selection"
        description="The open menu's title gets a pill, 8 px wider and 1 px taller than the part: black 8% (Light) or white 8% (Dark) with a 60 blur."
        gap={12}
      >
        <Row columns={3} width={288}>
          <Part title="Apple menu" caption="33 × 24; pill 41 × 25." selected={true} kind="apple" />
          <Part title="App name" caption="90 × 24; pill 98 × 25. SF Pro Heavy." selected={true} kind="app" />
          <Part title="Menu item" caption="47 × 24; pill 55 × 25. SF Pro Semibold." selected={true} kind="item" />
        </Row>
      </Section>
    </Page>
  );
}
