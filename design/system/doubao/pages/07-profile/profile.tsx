import type { Markup } from "@design/jsx/jsx-runtime";
import { DoubaoPage, ScreenSection } from "../../components/page.tsx";
import { Profile } from "../../components/profile.tsx";

export default function ProfilePage(): Markup {
  return (
    <DoubaoPage title="豆包：我的" subtitle="个人页和设置入口。iPhone 15 Pro，393 x 852 pt。参考：豆包 iOS 15.6.0 真机截图（docs/device-capture.md）。">
      <ScreenSection title="个人页" description="头像、名字和豆包号，账号管理按钮，下面三组设置：订阅、形象与偏好、开启新话题。" light="11-profile" dark="11-profile" render={(mode) => <Profile mode={mode} />} notes={["头像换成了中性占位图，名字和豆包号 Jgao 保留；豆包形象也是占位图。"]} />
    </DoubaoPage>
  );
}
