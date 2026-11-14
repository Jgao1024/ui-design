import type { Markup } from "@design/jsx/jsx-runtime";
import { ComponentRow, ComponentRows, LabPage, LabSection, Matrix } from "../../components/lab.tsx";
import { Alert, Buttons, Menu, Sample, SearchAndInput, SegmentedControl, Sheet, Sliders, Switches, TabBar, Toolbar } from "../../components/ios.tsx";

// iOS 27 controls with hyalite glass, a live parameter panel and the background matrix.

const W = 420;

export default function IosComponents(): Markup {
  return (
    <LabPage
      platform="ios"
      title="iOS 27 组件 · hyalite 玻璃实验台"
      subtitle="iOS 控件的玻璃层换成 hyalite 实时折射，尺寸取自 Figma（figma/reference/ios27/specs）。左侧面板分浅色、深色两套参数；先选一个预设，再微调。轨道、填充这类本来就不是玻璃的部分照 iOS 画成实色。只有 Chromium 内核能看到折射。"
    >
      <LabSection title="组件" description="每种组件左边是浅色模式，右边是深色模式；面板里的“组件区底图”统一切换这一区的背景。">
        <ComponentRows width={W}>
          <ComponentRow title="玻璃按钮" note="44 / 50 符号按钮，Medium 34 和 Large 50 文字按钮，Prominent 蓝色玻璃。" width={W} height={170} render={(mode) => <Buttons mode={mode} />} />
          <ComponentRow title="工具栏" note="402 x 54，返回按钮和两个符号的按钮组。" width={W} height={110} render={(mode) => <Toolbar mode={mode} />} />
          <ComponentRow title="Tab Bar" note="290 x 62 的标签栏加 54 的搜索圆钮（Search Role）。" width={W} height={120} render={(mode) => <TabBar mode={mode} />} />
          <ComponentRow title="分段切换" note="上：常态（实色滑块）。下：拖动中，滑块变成玻璃透镜。" width={W} height={140} render={(mode) => <SegmentedControl mode={mode} />} />
          <ComponentRow title="开关" note="关、开、按住：按住时白色滑块变成 58 x 38 的玻璃透镜。" width={W} height={100} render={(mode) => <Switches mode={mode} />} />
          <ComponentRow title="滑块" note="上：常态。下：拖动中，滑块变成玻璃透镜。" width={W} height={130} render={(mode) => <Sliders mode={mode} />} />
          <ComponentRow title="搜索与输入框" note="底部搜索栏，和“加号 + 输入框”的发消息栏。" width={W} height={160} render={(mode) => <SearchAndInput mode={mode} />} />
          <ComponentRow title="下拉菜单" note="238 宽的玻璃菜单，40 pt 一行，删除用红色。" width={W} height={250} render={(mode) => <Menu mode={mode} />} />
          <ComponentRow title="Alert" note="300 宽，圆角 34，两个 48 pt 胶囊按钮。" width={W} height={230} render={(mode) => <Alert mode={mode} />} />
          <ComponentRow title="Sheet" note="Medium Sheet，四边内缩 6 pt 的浮动玻璃。" width={W} height={300} render={(mode) => <Sheet mode={mode} />} />
        </ComponentRows>
      </LabSection>
      <LabSection title="底色矩阵" description="同一组按钮和搜索框放在 8 种底上：一套参数要在每一格里都好看，才能定为标准。这一区不跟着面板换底。">
        <Matrix width={170} height={130} render={(mode) => <Sample mode={mode} />} />
      </LabSection>
    </LabPage>
  );
}
