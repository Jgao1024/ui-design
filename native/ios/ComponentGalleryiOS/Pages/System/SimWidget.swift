import SwiftUI

/// 模拟主屏幕小组件：玻璃底 + 天气 / 日历样例内容。
struct SimWidget: View {
    let size: SimWidgetSize

    var body: some View {
        VStack(alignment: .leading, spacing: 6) {
            Label("库比蒂诺", systemImage: "location.fill")
                .font(.caption)
                .bold()
            Text("21°")
                .font(.system(size: 40))
            if size != .small {
                HStack {
                    ForEach(["10时", "11时", "12时", "13时", "14时"], id: \.self) { hour in
                        VStack {
                            Text(hour)
                            Image(systemName: "sun.max.fill")
                                .symbolRenderingMode(.multicolor)
                            Text("22°")
                        }
                        .font(.caption2)
                        .frame(maxWidth: .infinity)
                    }
                }
            }
            if size == .large || size == .extraLarge {
                Divider()
                ForEach(["周二", "周三", "周四"], id: \.self) { day in
                    LabeledContent(day) {
                        Text("18° – 25°")
                    }
                    .font(.caption)
                }
            }
            Spacer(minLength: 0)
        }
        .padding(14)
        .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
        .glassEffect(.regular, in: .rect(cornerRadius: 22))
    }
}
