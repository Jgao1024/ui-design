import type { Markup } from "@design/jsx/jsx-runtime";
import { Page } from "@design/components/page.tsx";
import { Section } from "@design/components/figure.tsx";
import { TextStyleList } from "../../components/text-style-list.tsx";
import { TEXT_STYLES } from "../../text-styles.ts";

export default function Typography(): Markup {
  const display = TEXT_STYLES.filter((style) => style.size >= 22);
  const body = TEXT_STYLES.filter((style) => style.size >= 13 && style.size < 22);
  return (
    <Page title="Typography" subtitle="macOS 27 · text styles 13 pt and larger. Smaller styles are on Typography Small.">
      <Section title="22 pt and larger" description="Titles and large numerals." gap={10}>
        <TextStyleList styles={display} />
      </Section>
      <Section title="13 to 17 pt" description="Body, labels and controls. Inter 17 Bold is the only non-SF style; it falls back to the system font if Inter is not installed." gap={10}>
        <TextStyleList styles={body} />
      </Section>
    </Page>
  );
}
