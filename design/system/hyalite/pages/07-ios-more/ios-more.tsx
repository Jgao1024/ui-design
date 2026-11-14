import type { Markup } from "@design/jsx/jsx-runtime";
import { GalleryPage } from "../../components/gallery.tsx";
import { Glass } from "../../components/glass.tsx";

export default function IosMore(): Markup {
  return (
    <GalleryPage
      title="test"
      subtitle="test"
      sections={[{ title: "S", items: [
        { title: "a", note: "n", width: 420, height: 120, render: (m) => <Glass mode={m} width={200} height={60} radius={30} /> },
        { title: "b", note: "plain", width: 300, height: 120, bg: "plain", render: (m) => <Glass mode={m} width={200} height={60} radius={30} /> },
      ] }]}
    />
  );
}
