import type { Markup } from "@design/jsx/jsx-runtime";
import { type Mode, tone } from "../theme.ts";
import { ChatTopBar, type ChipSpec, ChipRow, InputBar, Screen } from "./chrome.tsx";
import { Icon } from "./icons.tsx";

// A long answer in a conversation, measured from 10-chat-answer:
//   the answer card (#252525 / #F7F7F7) runs from under the top bar (y 112) to y 693, at x 12,
//   368 wide, radius 16, with 16 pt padding; body 16 pt on 25 pt lines
//   the glass top bar floats over the scrolled card, so the card shows through the glass
// The content is de-identified: the user's own question and answer are replaced with a neutral
// example that keeps the same building blocks (search line, heading, table, lists, checks).

const CHIPS: ChipSpec[] = [
  { icon: "bubble", label: "对话", more: true },
  { icon: "mic-text", label: "录音转写" },
  { icon: "phone", label: "打电话" },
  { icon: "sparkle", label: "AI 创作" },
  { icon: "compose", label: "帮我写作" },
];

const TABLE = [["项目", "周六", "周日"], ["出发时间", "8:30", "9:00"], ["车程", "1.5 小时", "1 小时"], ["预算合计", "620 元", "480 元"]];

export function ChatAnswer(props: { mode: Mode }): Markup {
  const t = tone(props.mode);
  const dark = props.mode === "dark";
  const line = dark ? "#383838" : "#e6e6e6";
  const check = <span class="mr-[6px] inline-grid size-[18px] place-items-center rounded-[4px] align-[-3px] text-white" style="background:#19b25b"><Icon name="check" size={13} weight={3} /></span>;
  return (
    <Screen mode={props.mode}>
      <div class="absolute left-3 top-[62px] h-[631px] w-[368px] overflow-hidden rounded-[16px] px-4" style={`background:${t.card};font-size:16px;line-height:25px`}>
        <p class="mt-[60px] flex items-center" style={`color:${t.label2};font-size:15px`}>搜索 3 个关键词，参考 11 篇资料<Icon name="chevron-right" size={12} weight={2.4} /></p>
        <p class="mt-[12px]" style="font-size:18px;font-weight:600">周末短途出游对比</p>
        <table class="mt-[10px] w-full border-collapse" style={`font-size:14px;line-height:20px`}>
          {TABLE.map((row, r) => (
            <tr>{row.map((cell) => <td class="px-3 py-[8px]" style={`border:1px solid ${line};${r === 0 ? `font-weight:600;background:${dark ? "#2c2c2c" : "#efefef"}` : ""}`}>{cell}</td>)}</tr>
          ))}
        </table>
        <p class="mt-[16px]" style="font-weight:600">1. 出发前准备</p>
        <ul class="mt-[4px] pl-[22px]" style="list-style:circle">
          <li class="mt-[4px]">提前一天查看天气，带好雨具和防晒用品；</li>
          <li class="mt-[4px]">景区门票在官方渠道预约，节假日需提前两天。</li>
        </ul>
        <p class="mt-[12px]" style="font-weight:600">2. 行程建议</p>
        <ul class="mt-[4px] pl-[22px]" style="list-style:circle">
          <li class="mt-[4px]">{check}上午游览，人少且光线好；</li>
          <li class="mt-[4px]">{check}午饭选景区外的餐馆，价格更实惠；</li>
          <li class="mt-[4px]">{check}返程避开 17:00-19:00 的高峰。</li>
        </ul>
      </div>
      <div class="absolute left-[178px] top-[640px] grid size-9 place-items-center rounded-full" style={`background:${dark ? "#383838" : "#ffffff"};box-shadow:0 2px 10px rgb(0 0 0 / ${dark ? 0.4 : 0.12})`}><Icon name="arrow-down" size={18} weight={2.4} /></div>
      <ChatTopBar mode={props.mode} title="豆包" />
      <ChipRow mode={props.mode} chips={CHIPS} />
      <InputBar mode={props.mode} />
    </Screen>
  );
}
