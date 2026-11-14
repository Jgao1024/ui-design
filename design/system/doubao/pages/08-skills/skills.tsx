import type { Markup } from "@design/jsx/jsx-runtime";
import { DoubaoPage, ScreenSection } from "../../components/page.tsx";
import { SkillsScreen } from "../../components/skills.tsx";

export default function Skills(): Markup {
  return (
    <DoubaoPage title="豆包：插件 · 技能" subtitle="从侧边栏进入。iPhone 15 Pro，393 x 852 pt。参考：豆包 iOS 15.6.0 真机截图（docs/device-capture.md）。“帮我创建技能”在首页那一页。">
      <ScreenSection title="插件列表" description="插件 / 技能两个标签，分类筛选，“大家都在用”的插件列表，每行一个“连接”按钮。" light="12-skills" dark="12-skills" render={(mode) => <SkillsScreen mode={mode} />} notes={["各服务的图标是简化的示意图，不是官方标志；名称保留。最后一行“即梦短剧创作”在截图里只露出标题，描述和人数是补的。"]} />
    </DoubaoPage>
  );
}
