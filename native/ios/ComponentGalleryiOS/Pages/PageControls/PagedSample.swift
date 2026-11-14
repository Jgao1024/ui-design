import SwiftUI

/// 带系统页码指示器的分页视图。
struct PagedSample: View {
    let pageCount: Int

    var body: some View {
        TabView {
            ForEach(1...pageCount, id: \.self) { index in
                Text("第 \(index) 页")
                    .font(.title3)
                    .frame(maxWidth: .infinity, maxHeight: .infinity)
                    .background(.tint.quaternary)
            }
        }
        .tabViewStyle(.page)
        .indexViewStyle(.page(backgroundDisplayMode: .always))
        .frame(height: 150)
        .clipShape(.rect(cornerRadius: 16))
    }
}
