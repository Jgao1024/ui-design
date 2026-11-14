import SwiftUI

/// SwiftUI 对应级别的小标签：原生、桥接、部分、自绘、不做。
struct LevelBadge: View {
    let level: String

    var body: some View {
        Text(level)
            .font(.callout)
            .bold()
            .padding(.horizontal, 8)
            .padding(.vertical, 2)
            .foregroundStyle(.white)
            .background(color, in: .capsule)
    }

    private var color: Color {
        switch level {
        case "原生": .green
        case "桥接": .blue
        case "部分": .orange
        case "自绘": .purple
        default: .gray
        }
    }
}
