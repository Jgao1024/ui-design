import SwiftUI

/// Empty States：Large Symbol、Symbol in Circle、Title and Subtitle。
struct EmptyStatesDemo: View {
    var body: some View {
        DemoCase(title: "Large Symbol") {
            ContentUnavailableView("没有照片", systemImage: "photo.on.rectangle", description: Text("拍摄的照片会显示在这里。"))
                .frame(minHeight: 220)
        }
        DemoCase(title: "Symbol in Circle") {
            ContentUnavailableView {
                Label {
                    Text("没有收藏")
                } icon: {
                    Image(systemName: "star")
                        .padding(18)
                        .background(.fill.secondary, in: .circle)
                }
            } description: {
                Text("轻点星形按钮即可收藏。")
            }
            .frame(minHeight: 220)
        }
        DemoCase(title: "Title and Subtitle") {
            ContentUnavailableView {
                Text("没有结果")
                    .font(.title2)
                    .bold()
            } description: {
                Text("换个关键词再试试。")
            }
            .frame(minHeight: 160)
        }
    }
}
