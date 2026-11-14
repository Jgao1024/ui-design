import SwiftUI

/// 系统语义色实物：随明暗模式和强调色设置变化。Figma Colors 页只有色板模板（内部件），这里补上 SwiftUI 对应。
struct SemanticColorsSection: View {
    private let columns = [GridItem(.adaptive(minimum: 140), spacing: 12)]

    private var swatches: [(name: String, style: AnyShapeStyle)] {
        [
            (".primary", AnyShapeStyle(.primary)),
            (".secondary", AnyShapeStyle(.secondary)),
            (".tertiary", AnyShapeStyle(.tertiary)),
            (".quaternary", AnyShapeStyle(.quaternary)),
            (".quinary", AnyShapeStyle(.quinary)),
            ("Color.accentColor", AnyShapeStyle(Color.accentColor)),
            (".background", AnyShapeStyle(.background)),
            (".windowBackground", AnyShapeStyle(.windowBackground)),
            (".separator", AnyShapeStyle(.separator)),
            (".selection", AnyShapeStyle(.selection)),
            (".red", AnyShapeStyle(.red)),
            (".orange", AnyShapeStyle(.orange)),
            (".yellow", AnyShapeStyle(.yellow)),
            (".green", AnyShapeStyle(.green)),
            (".mint", AnyShapeStyle(.mint)),
            (".teal", AnyShapeStyle(.teal)),
            (".cyan", AnyShapeStyle(.cyan)),
            (".blue", AnyShapeStyle(.blue)),
            (".indigo", AnyShapeStyle(.indigo)),
            (".purple", AnyShapeStyle(.purple)),
            (".pink", AnyShapeStyle(.pink)),
            (".brown", AnyShapeStyle(.brown)),
            (".gray", AnyShapeStyle(.gray)),
        ]
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("系统语义色（SwiftUI 实物）")
                .font(.title2)
                .bold()
            Text("Figma 本页只有色板模板（见下方内部件）；颜色数值见令牌页「颜色」。")
                .foregroundStyle(.secondary)
            LazyVGrid(columns: columns, alignment: .leading, spacing: 12) {
                ForEach(swatches, id: \.name) { swatch in
                    VStack(alignment: .leading, spacing: 4) {
                        RoundedRectangle(cornerRadius: 8)
                            .fill(swatch.style)
                            .strokeBorder(.separator)
                            .frame(height: 44)
                        Text(swatch.name)
                            .font(.callout.monospaced())
                    }
                }
            }
        }
        .padding(16)
        .background(.fill.quinary, in: .rect(cornerRadius: 12))
    }
}
