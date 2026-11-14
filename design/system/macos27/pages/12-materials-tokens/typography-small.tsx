import type { Markup } from "@design/jsx/jsx-runtime";
import { Page } from "@design/components/page.tsx";
import { Section } from "@design/components/figure.tsx";
import { TextStyleList } from "../../components/text-style-list.tsx";
import { TEXT_STYLES } from "../../text-styles.ts";

export default function TypographySmall(): Markup {
  const caption = TEXT_STYLES.filter((style) => style.size >= 10 && style.size < 13);
  const micro = TEXT_STYLES.filter((style) => style.size < 10);
  return (
    <Page title="Typography Small" subtitle="macOS 27 · text styles below 13 pt. Larger styles are on Typography.">
      <Section title="10 to 12.5 pt" description="Captions, secondary labels and menu text." gap={10}>
        <TextStyleList styles={caption} />
      </Section>
      <Section title="Below 10 pt" description="Badges and symbol labels." gap={10}>
        <TextStyleList styles={micro} />
      </Section>
    </Page>
  );
}
