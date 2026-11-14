import type { Markup } from "@design/jsx/jsx-runtime";
import { DoubaoPage, ScreenSection } from "../../components/page.tsx";
import { ChatAnswer } from "../../components/chat.tsx";

export default function Chat(): Markup {
  return (
    <DoubaoPage title="豆包：对话" subtitle="一条长回答。iPhone 15 Pro，393 x 852 pt。参考：豆包 iOS 15.6.0 真机截图（docs/device-capture.md）。">
      <ScreenSection title="长回答" description="回答卡片滚到顶部玻璃栏下面；栏标题下有“AI 生成可能有误 注意核实”；右下角有回到底部按钮。" light="10-chat-answer" dark="10-chat-answer" render={(mode) => <ChatAnswer mode={mode} />} notes={["内容已脱敏：两张截图是两段不同的个人对话，原型换成同一段中性示例，保留了搜索行、标题、表格、列表和勾选项这些元素。", "回到底部的圆按钮只在浅色截图里出现，原型两种外观都画了。"]} />
    </DoubaoPage>
  );
}
