import type { Markup } from "@design/jsx/jsx-runtime";
import { DoubaoPage, ScreenSection } from "../../components/page.tsx";
import { Camera, PlusPanel, ProjectSheet, VoiceHold } from "../../components/input.tsx";

export default function Input(): Markup {
  return (
    <DoubaoPage title="豆包：输入" subtitle="加号面板、按住说话、选择项目、拍照。iPhone 15 Pro，393 x 852 pt。参考：豆包 iOS 15.6.0 真机截图（docs/device-capture.md）。">
      <ScreenSection title="加号面板" description="点输入栏右侧 ⊕：变成 ⊗，下面展开相机、相册、文件、打电话；相册没授权时提示去拍照。" light="03-plus" dark="03-plus" render={(mode) => <PlusPanel mode={mode} />} />
      <ScreenSection title="按住说话" description="按住输入栏：输入栏和技能入口让位给底部的蓝色光晕、提示和音量条。" light="04-voice" dark="04-voice" render={(mode) => <VoiceHold mode={mode} />} />
      <ScreenSection title="选择项目" description="点“选择项目 ›”：从输入栏长出一张玻璃卡片，列出项目和“创建新项目”。" light="08-project-sheet" dark="08-project-sheet" render={(mode) => <ProjectSheet mode={mode} />} notes={["深色截图时输入栏处在语音模式（按住说话），浅色是文字模式，原型照各自的截图画。"]} />
      <ScreenSection title="豆包 AI 相机" description="点输入栏左侧相机：全黑相机页，深浅色一样；取景框下的提示每次随机。" light="05-photo" dark="05-photo" render={(mode) => <Camera mode={mode} tip={mode === "dark" ? "自拍颜值打分" : "拍生僻字解析读音与释义"} />} notes={["取景框是黑的，因为截图时镜头被挡住了。"]} />
    </DoubaoPage>
  );
}
