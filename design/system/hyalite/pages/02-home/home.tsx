import type { Markup } from "@design/jsx/jsx-runtime";
import { DoubaoPage, ScreenSection } from "../../../doubao/components/page.tsx";
import { GLASS_CSS } from "../../components/glass.tsx";
import { HomeScreen } from "../../components/home.tsx";
import { HUD_CSS, Sliders } from "../../components/hud.tsx";
import { Scripts, Style } from "../../components/script.tsx";

// The Doubao home screen with hyalite glass, and a live panel for every engine parameter plus the
// two glass fills. The panel sits fixed on the left; the page is pushed right to make room for it.

const CSS = `
#hud{position:fixed;left:14px;top:12px}
.hl-page{padding-left:226px}
`;

const FILLS: Parameters<typeof Sliders>[0]["extra"] = [
  ["填充", [
    { id: "fillLight", label: "浅色", min: 0, max: 1, step: 0.01 },
    { id: "fillDark", label: "深色", min: 0, max: 1, step: 0.01 },
  ]],
];

export default function Home(): Markup {
  return (
    <>
      <Style css={HUD_CSS + GLASS_CSS + CSS} />
      <div id="hud">
        <h1 id="fold">玻璃参数</h1>
        <div class="sec">剖面</div>
        <label>形状<select id="shape"><option value="squircle">squircle</option><option value="circle">circle</option><option value="lip">lip</option></select><span /></label>
        <Sliders extra={FILLS} />
        <div class="sec">底图</div>
        <div class="btns">
          <button id="bg_flat" class="on">真机纯色</button><button id="bg_test">测试底</button><button id="bg_stripe">条纹</button><button id="bg_grid">网格</button>
          <label class="file">拖/选图<input type="file" id="pick" accept="image/*" /></label>
        </div>
        <div class="btns"><button id="reset">复位</button><button id="p_copy">复制参数</button></div>
        <div class="note" id="note">所有玻璃共用一组参数，刷新后保留。纯色底上只看得到边缘，换个底图才看得出折射。</div>
      </div>
      <div class="hl-page">
        <DoubaoPage
          title="豆包：首页 · hyalite 玻璃"
          subtitle="同一张首页，顶部按钮和输入栏换成 hyalite 的实时折射玻璃（VII-Cae/hyalite--liquid-glass v0.5.0，MIT）。只有 Chromium 内核会真的弯，Safari / Firefox 退回模糊。"
        >
          <ScreenSection title="首页（新对话）" description="顶部玻璃按钮、标题、问候、对话 / 工作切换、技能入口、玻璃输入栏。" light="01-home" dark="01-home" render={(mode) => <HomeScreen mode={mode} />} />
        </DoubaoPage>
      </div>
      <Scripts driver="home.js" />
    </>
  );
}
