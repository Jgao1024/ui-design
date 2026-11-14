import type { Markup } from "@design/jsx/jsx-runtime";
import { ComponentRow, ComponentRows, LabPage, LabSection, Matrix } from "../../components/lab.tsx";
import { Alert, Buttons, Fields, Menu, Popover, Sample, Segmented, SliderRows, Toggles, WindowWithSidebar } from "../../components/macos.tsx";

// macOS 27 controls with hyalite glass, a live parameter panel and the background matrix.

const W = 480;

export default function MacosComponents(): Markup {
  return (
    <LabPage
      platform="macos"
      title="macOS 27 组件 · hyalite 玻璃实验台"
      subtitle="macOS 控件的玻璃层换成 hyalite 实时折射，尺寸取自 Figma（figma/reference/macos27/specs）。左侧面板分浅色、深色两套参数，和 iOS 页各存一份；先选一个预设，再微调。只有 Chromium 内核能看到折射。"
    >
      <LabSection title="组件" description="每种组件左边是浅色模式，右边是深色模式；面板里的“组件区底图”统一切换这一区的背景，窗口内容区也跟着换。">
        <ComponentRows width={W}>
          <ComponentRow title="窗口与侧边栏" note="圆角 16 的窗口；侧边栏是内缩 8 pt 的浮动玻璃，工具栏的分段和搜索是玻璃胶囊。" width={W} height={340} render={(mode) => <WindowWithSidebar mode={mode} />} />
          <ComponentRow title="按钮" note="上：36 高的工具栏按钮和文字胶囊。下：67 x 24 的按钮，右边是 Prominent。" width={W} height={140} render={(mode) => <Buttons mode={mode} />} />
          <ComponentRow title="分段切换" note="上：工具栏里的玻璃分段。下：内容区的分段控件（Figma 里是实色，作对照）。" width={W} height={120} render={(mode) => <Segmented mode={mode} />} />
          <ComponentRow title="搜索与文本框" note="上：工具栏玻璃搜索框。下：内容区文本框（实色，作对照）。" width={W} height={120} render={(mode) => <Fields mode={mode} />} />
          <ComponentRow title="下拉菜单" note="244 宽，圆角 12，24 pt 一行；“最近使用”是键盘高亮行。" width={W} height={200} render={(mode) => <Menu mode={mode} />} />
          <ComponentRow title="开关与复选框" note="关、开、按住：按住时滑块变成大 23% 的玻璃胶囊。" width={W} height={90} render={(mode) => <Toggles mode={mode} />} />
          <ComponentRow title="滑块" note="上：常态。下：拖动中，滑块变成玻璃透镜。" width={W} height={110} render={(mode) => <SliderRows mode={mode} />} />
          <ComponentRow title="Popover" note="200 x 200，圆角 20（没画指向箭头）。" width={W} height={250} render={(mode) => <Popover mode={mode} />} />
          <ComponentRow title="Alert" note="260 宽，圆角 34，64 pt 图标，两个 32 pt 按钮并排。" width={W} height={290} render={(mode) => <Alert mode={mode} />} />
        </ComponentRows>
      </LabSection>
      <LabSection title="底色矩阵" description="同一组工具栏按钮、分段和搜索框放在 8 种底上：一套参数要在每一格里都好看，才能定为标准。这一区不跟着面板换底。">
        <Matrix width={170} height={120} render={(mode) => <Sample mode={mode} />} />
      </LabSection>
    </LabPage>
  );
}
