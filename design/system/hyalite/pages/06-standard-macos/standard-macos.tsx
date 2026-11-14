import type { Markup } from "@design/jsx/jsx-runtime";
import { StandardPage } from "../../components/standard.tsx";

// Every macOS component with the standard glass, as one self-contained file.

export default function StandardMacos(): Markup {
  return <StandardPage title="Liquid Glass 标准参数 · macOS 27 组件" platforms={["macos"]} />;
}
