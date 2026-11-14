import type { Markup } from "@design/jsx/jsx-runtime";
import { DoubaoPage, ScreenSection } from "../../components/page.tsx";
import { Call } from "../../components/call.tsx";

export default function CallPage(): Markup {
  return (
    <DoubaoPage title="豆包：打电话" subtitle="和豆包语音通话。iPhone 15 Pro，393 x 852 pt。参考：豆包 iOS 15.6.0 真机截图（docs/device-capture.md）。">
      <ScreenSection title="通话中" description="顶部选择情景和字幕开关，中间是柔光球，底部麦克风、免提、摄像头、挂断。" dark="20-call" render={(mode) => <Call mode={mode} />} notes={["只截到深色。浅色是把深色的底和按钮颜色对调推出来的，需要补一张浅色截图核对。"]} />
    </DoubaoPage>
  );
}
