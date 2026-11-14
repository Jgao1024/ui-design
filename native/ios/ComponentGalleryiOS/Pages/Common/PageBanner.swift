import SwiftUI

/// 页面顶部固定提示条（自绘页、不做页）。
struct PageBanner: View {
    let text: LocalizedStringResource
    let systemImage: String
    let tint: Color

    var body: some View {
        Label {
            Text(text)
        } icon: {
            Image(systemName: systemImage)
        }
        .font(.subheadline)
        .foregroundStyle(tint)
        .padding(.horizontal, 12)
        .padding(.vertical, 8)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(tint.quaternary, in: .rect(cornerRadius: 12))
    }
}
