import type { Child, Markup } from "@design/jsx/jsx-runtime";
import { Page } from "@design/components/page.tsx";
import { Row, Variant } from "@design/components/row.tsx";
import { Section } from "@design/components/figure.tsx";
import { MODES } from "../../components/stage.tsx";
import { Button } from "../../components/button.tsx";
import { Icon } from "../../components/icons.tsx";
import type { IconName } from "../../components/icons.tsx";
import { Checkbox, RadioButton, Switch } from "../../components/toggle.tsx";
import { FieldStub, Stepper } from "../../components/stepper.tsx";
import { ComboBox, TextField } from "../../components/text-field.tsx";
import { Form, Mute, Title } from "../../components/form.tsx";
import { COLOR, UI } from "../../theme.ts";
import type { Mode } from "../../theme.ts";

function Tile(props: { mode: Mode; icon: IconName; color: string }): Markup {
  return (
    <span class="flex size-5 items-center justify-center rounded-[5px] text-white" style={`background:${props.color}`}>
      <Icon name={props.icon} size={13} />
    </span>
  );
}

function Pair(props: { height: number; draw: (mode: Mode) => Markup }): Markup {
  return (
    <div class="flex gap-2">
      {MODES.map((mode) => (
        <div
          class="rounded-[5px] p-[10px]"
          style={`width:420px;height:${props.height}px;background:${UI[mode].window};box-shadow:inset 0 0 0 1px ${UI[mode].separator}`}
        >
          {props.draw(mode)}
        </div>
      ))}
    </div>
  );
}

export default function Forms(): Markup {
  return (
    <Page title="Forms" subtitle="macOS 27 · Figma page Forms. A 400 px group of 42 px rows; dark values are inferred: white 3% and 5%.">
      <Section
        title="Trailing accessories"
        description="Right-hand parts of a row: label, label with info button, more button, detail disclosure, pop-up button, switch, text field, stepper, combo box and button."
        gap={12}
      >
        <Row columns={1} width={848}>
          <Variant title="Row types" caption="Title, then the accessory 16 px away. Default texts are Title, Label and Value.">
            <Pair
              height={42 * 10 + 20}
              draw={(mode) => (
                <Form
                  mode={mode}
                  rows={[
                    [<Title mode={mode} />, <Mute mode={mode}>Label</Mute>],
                    [<Title mode={mode} />, <Mute mode={mode}>Label<Icon name="info.circle" size={16} /></Mute>],
                    [<Title mode={mode} />, <Mute mode={mode}>Label<Icon name="ellipsis.circle" size={16} /></Mute>],
                    [<Title mode={mode} />, <Mute mode={mode}>Label<Icon name="chevron.right" size={9} weight={2} /></Mute>],
                    [<Title mode={mode} />, <Mute mode={mode}>Label<Icon name="chevron.up.chevron.down" size={12} weight={1.8} /></Mute>],
                    [<Title mode={mode} />, <Switch mode={mode} size="mini" on />],
                    [<Title mode={mode} />, <TextField mode={mode} />],
                    [
                      <Title mode={mode} />,
                      <div class="flex items-center gap-[6px]">
                        <div class="relative">
                          <FieldStub mode={mode} width={62} />
                          <div class="absolute top-0 right-0"><Stepper mode={mode} /></div>
                        </div>
                        <Mute mode={mode}>Label</Mute>
                      </div>,
                    ],
                    [<Title mode={mode} />, <ComboBox mode={mode} />],
                    [<Title mode={mode} />, <Button mode={mode} />],
                  ]}
                />
              )}
            />
          </Variant>
        </Row>
      </Section>
      <Section
        title="Leading accessories"
        description="Left-hand parts: title and subtitle, symbol and title, checkbox with an icon, disclosure with an icon, radio group. Icons are 20 px tiles (26 px for the large icon); the symbols are stand-ins."
        gap={12}
      >
        <Row columns={1} width={848}>
          <Variant title="Row contents" caption="Title + subtitle is 42 × 32. Chevron is 8 × 16.">
            <Pair
              height={42 * 5 + 20}
              draw={(mode) => (
                <Form
                  mode={mode}
                  rows={[
                    [<Title mode={mode} subtitle />, <Mute mode={mode}>Label</Mute>],
                    [
                      <div class="flex items-center gap-[6px]"><Icon name="star" size={15} /><Title mode={mode} /></div>,
                      <Mute mode={mode}>Label</Mute>,
                    ],
                    [
                      <div class="flex items-center gap-2">
                        <Checkbox mode={mode} selection="on" label="" />
                        <Tile mode={mode} icon="star" color={UI[mode].red} />
                        <Title mode={mode} subtitle />
                      </div>,
                      <Switch mode={mode} size="mini" />,
                    ],
                    [
                      <div class="flex items-center gap-2">
                        <span class="flex w-2 justify-center" style={`color:${UI[mode].secondary}`}><Icon name="chevron.right" size={9} weight={2} /></span>
                        <Tile mode={mode} icon="photo" color={COLOR.green} />
                        <Title mode={mode} subtitle />
                      </div>,
                      <Mute mode={mode}>Label</Mute>,
                    ],
                    [
                      <div class="flex flex-col gap-[6px] py-2">
                        <RadioButton mode={mode} selection="on" />
                        <RadioButton mode={mode} />
                      </div>,
                      <Mute mode={mode}>Label</Mute>,
                    ],
                  ]}
                />
              )}
            />
          </Variant>
        </Row>
      </Section>
    </Page>
  );
}
