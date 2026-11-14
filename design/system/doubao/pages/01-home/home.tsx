import type { Markup } from "@design/jsx/jsx-runtime";
import { DoubaoPage, ScreenSection } from "../../components/page.tsx";
import { HomeKeyboard, HomeScreen, ModeMenu, SkillCreate } from "../../components/home.tsx";

export default function Home(): Markup {
  return (
    <DoubaoPage title="豆包：首页" subtitle="新对话和它的各种状态。iPhone 15 Pro，393 x 852 pt。参考：豆包 iOS 15.6.0 真机截图（docs/device-capture.md）。状态栏统一画成 9:41；真机右边缘的绿色竖条是系统浮窗，没有画。">
      <ScreenSection title="首页（新对话）" description="顶部玻璃按钮、标题、问候、对话 / 工作切换、技能入口、玻璃输入栏。" light="01-home" dark="01-home" render={(mode) => <HomeScreen mode={mode} />} />
      <ScreenSection title="输入框获得焦点" description="点输入框：键盘升起，输入栏上移到键盘上方，问候和技能入口隐藏。" dark="06-home-keyboard" render={(mode) => <HomeKeyboard mode={mode} />} />
      <ScreenSection title="提示：未识别到文字" description="按住说话但没出声：顶部弹出提示，输入栏切到“按住说话”。" dark="07-toast-no-text" render={(mode) => <HomeScreen mode={mode} input="hold" toast={{ text: "未识别到文字", warning: true }} />} />
      <ScreenSection title="提示：已开启自动朗读" description="点右上角喇叭：按钮变成蓝色喇叭，顶部弹出提示。" dark="09-toast-autoread" render={(mode) => <HomeScreen mode={mode} input="hold" speakerOn toast={{ text: "已开启自动朗读" }} />} />
      <ScreenSection title="模式菜单" description="点“对话 ›”：玻璃菜单列出对话、工作任务、模型、豆包订阅。" light="23-mode-menu" render={(mode) => <ModeMenu mode={mode} />} notes={["真机这张同时停着“未识别到文字”的提示，是上一步操作留下的，原型没画。"]} />
      <ScreenSection title="帮我创建技能" description="从技能页点创建：输入栏预填“帮我创建技能：”，右侧出现蓝色发送按钮，键盘回车键变蓝。" dark="14-skill-create" render={(mode) => <SkillCreate mode={mode} />} />
    </DoubaoPage>
  );
}
