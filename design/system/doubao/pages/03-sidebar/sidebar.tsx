import type { Markup } from "@design/jsx/jsx-runtime";
import { DoubaoPage, ScreenSection } from "../../components/page.tsx";
import { HomeScreen } from "../../components/home.tsx";
import { AccountSheet, RECENTS, Search, Sidebar } from "../../components/sidebar.tsx";
import { SkillsScreen } from "../../components/skills.tsx";
import { TranscribeResult } from "../../components/transcribe.tsx";

// The sidebar lists one row per conversation; these follow the order in each device shot.
const SIDEBAR = [RECENTS[0], RECENTS[2], RECENTS[3], RECENTS[4], RECENTS[5], RECENTS[6], RECENTS[7]];
const PRESSED = [RECENTS[0], RECENTS[1], RECENTS[2], RECENTS[3], RECENTS[4], RECENTS[5], RECENTS[6]];

export default function SidebarPage(): Markup {
  return (
    <DoubaoPage title="豆包：侧边栏" subtitle="点左上角 ≡ 打开。iPhone 15 Pro，393 x 852 pt。参考：豆包 iOS 15.6.0 真机截图（docs/device-capture.md）。对话标题已脱敏，换成了中性的示例标题；“开启录音转写”“回复问候”是功能名，保留。">
      <ScreenSection title="侧边栏" description="面板 326 宽，原页面被推到右边、盖一层灰。上面是菜单，中间是置顶和最近对话，底部是账号栏；“回到主对话”浮在列表上。" light="02-sidebar" dark="02-sidebar" render={(mode) => <Sidebar mode={mode} recents={SIDEBAR} behind={<HomeScreen mode={mode} bare />} />} />
      <ScreenSection title="按下一条对话" description="按住最近对话的第一条：整行出现浅灰底；背后是这条对话（录音转写结果）。" light="24-sidebar-selected" render={(mode) => <Sidebar mode={mode} recents={PRESSED} selected="recent" behind={<TranscribeResult mode={mode} bare />} />} />
      <ScreenSection title="切换账号" description="点底部的头像和名字：底部弹出账号卡片，当前账号打勾，下面是“添加账号”。" light="13-account-switch" dark="13-account-switch" render={(mode) => <Sidebar mode={mode} recents={SIDEBAR} selected="plugins" behind={<SkillsScreen mode={mode} bare />} overlay={<AccountSheet mode={mode} />} />} notes={["头像换成了中性占位图，名字 Jgao 保留。"]} />
      <ScreenSection title="搜索" description="点侧边栏右上的放大镜：搜索框获得焦点，下面是分类筛选和最近对话，键盘回车键变成蓝色搜索键。" light="25-search" render={(mode) => <Search mode={mode} />} />
    </DoubaoPage>
  );
}
