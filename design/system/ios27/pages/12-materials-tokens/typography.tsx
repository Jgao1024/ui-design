import type { Markup } from "@design/jsx/jsx-runtime";
import { Page } from "@design/components/page.tsx";
import { Section } from "@design/components/figure.tsx";
import { Row, Variant } from "@design/components/row.tsx";
import { Surface } from "../../components/surface.tsx";
import { TEXT_STYLES, type TextStyle, Txt } from "../../components/text.tsx";
import { tone } from "../../theme.ts";

const NAMES: Record<TextStyle, string> = {
  "large-title": "Large Title",
  "title-1": "Title 1",
  "title-2": "Title 2",
  "title-3": "Title 3",
  "headline": "Headline",
  "body": "Body",
  "callout": "Callout",
  "subheadline": "Subheadline",
  "footnote": "Footnote",
  "caption-1": "Caption 1",
  "caption-2": "Caption 2",
};

const GROUPS: { title: string; description: string; styles: TextStyle[] }[] = [
  {
    title: "Titles",
    description: "Large Title and Title 1 to 3. Emphasized is bold (700) for the first three and semibold (590) for Title 3.",
    styles: ["large-title", "title-1", "title-2", "title-3"],
  },
  {
    title: "Body text",
    description: "Headline, Body, Callout and Subheadline. Emphasized is semibold (590); Headline is semibold in both.",
    styles: ["headline", "body", "callout", "subheadline"],
  },
  {
    title: "Small text",
    description: "Footnote, Caption 1 and Caption 2. Emphasized is semibold (590).",
    styles: ["footnote", "caption-1", "caption-2"],
  },
];

export default function Typography(): Markup {
  return (
    <Page
      title="Typography"
      subtitle="iOS 27 text styles, SF Pro. Source: figma/reference/ios27/tokens/typography.json"
    >
      {GROUPS.map((group) => (
        <Section title={group.title} description={group.description} gap={10}>
          {group.styles.map((style) => {
            const [size, leading, tracking, regular, emphasized] = TEXT_STYLES[style];
            return (
              <Row columns={2} width={520}>
                <Variant
                  title={`${NAMES[style]}, Light`}
                  caption={`${size} / ${leading}, tracking ${tracking}, weight ${regular} and ${emphasized}`}
                >
                  <Surface mode="light" width={520} class="px-5 py-4">
                    <Txt style={style} color={tone("light").label}>Regular. Pack my box with five dozen jugs.</Txt>
                    <Txt style={style} emphasized color={tone("light").label} class="mt-2">Emphasized. Pack my box with five.</Txt>
                    <Txt style={style} color={tone("light").label2} class="mt-2">Secondary label colour.</Txt>
                  </Surface>
                </Variant>
                <Variant title={`${NAMES[style]}, Dark`} caption={`${size} / ${leading}, tracking ${tracking}, weight ${regular} and ${emphasized}`}>
                  <Surface mode="dark" width={520} class="px-5 py-4">
                    <Txt style={style} color={tone("dark").label}>Regular. Pack my box with five dozen jugs.</Txt>
                    <Txt style={style} emphasized color={tone("dark").label} class="mt-2">Emphasized. Pack my box with five.</Txt>
                    <Txt style={style} color={tone("dark").label2} class="mt-2">Secondary label colour.</Txt>
                  </Surface>
                </Variant>
              </Row>
            );
          })}
        </Section>
      ))}
    </Page>
  );
}
