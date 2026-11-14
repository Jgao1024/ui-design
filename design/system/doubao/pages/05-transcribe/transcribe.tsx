import type { Markup } from "@design/jsx/jsx-runtime";
import { DoubaoPage, ScreenSection } from "../../components/page.tsx";
import { TranscribeRate, TranscribeRecognizing, TranscribeResult, TranscribeStart, TranscribeSummarizing } from "../../components/transcribe.tsx";
import { Recording, RecordingDetail } from "../../components/recording.tsx";

export default function Transcribe(): Markup {
  return (
    <DoubaoPage title="豆包：录音转写" subtitle="从技能入口“录音转写”开始，到生成纪要。iPhone 15 Pro，393 x 852 pt。参考：豆包 iOS 15.6.0 真机截图（docs/device-capture.md）。地点已脱敏为“某某小区”，地图换成示意图。">
      <ScreenSection title="1. 正在开启" description="点“录音转写”：发出“开启录音转写”，豆包回复正在开启；技能入口变成“正在录音”。" dark="15-transcribe-start" render={(mode) => <TranscribeStart mode={mode} />} />
      <ScreenSection title="2. 录音中" description="进入录音页：标题、时间地点、文字记录 / 实时总结，底部音量条、计时、暂停和结束。" light="16-transcribe-recording" dark="16-transcribe-recording" render={(mode) => mode === "dark" ? <Recording mode={mode} title="新录音" date="11月14日 20:40" time="00:02" level={1} /> : <Recording mode={mode} title="新录音 2" date="11月14日 20:54" time="00:00" level={0} />} notes={["真机状态栏时间旁有蓝色定位箭头（App 正在用位置），原型状态栏没画。"]} />
      <ScreenSection title="3. 正在识别" description="回到对话：录音卡片显示计时和“正在识别...”，下面是红字“结束录音转写”。" dark="17-transcribe-recognizing" render={(mode) => <TranscribeRecognizing mode={mode} />} />
      <ScreenSection title="4. 录音详情" description="点录音卡片：地图头图、标题和时长地点；没说话时显示“未识别到文字内容”。" light="18-transcribe-detail" dark="18-transcribe-detail" render={(mode) => <RecordingDetail mode={mode} title={mode === "dark" ? "新录音" : "新录音 2"} length={mode === "dark" ? "10 秒" : "5 秒"} />} />
      <ScreenSection title="5. 生成纪要中" description="结束录音后：卡片显示“正在理解录音内容”，按钮变灰“录音纪要生成中”。" dark="19-transcribe-summarizing" render={(mode) => <TranscribeSummarizing mode={mode} />} />
      <ScreenSection title="6. 纪要结果" description="豆包发来纪要消息：时长、时间、地点，内嵌智能纪要卡片和文档预览。" light="22-transcribe-result" dark="22-transcribe-result" render={(mode) => <TranscribeResult mode={mode} />} notes={["浅色截图是第二次录音（5 秒，20:54），原型两种外观统一画成第一次的内容。"]} />
      <ScreenSection title="7. 满意度反馈" description="纪要出来后顶部弹出“是否满意本次通话?”，带点赞和点踩。" dark="21-transcribe-rate" render={(mode) => <TranscribeRate mode={mode} />} />
    </DoubaoPage>
  );
}
