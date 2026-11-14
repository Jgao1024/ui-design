import SwiftUI

/// Row：Height Regular / Tall。
struct RowDemo: View {
    var body: some View {
        List {
            Section("Height: Regular") {
                LabeledContent("Wi-Fi", value: "Home")
                Label("通用", systemImage: "gear")
            }
            Section("Height: Tall") {
                Label {
                    Text("Apple 账户")
                    Text("iCloud、媒体与购买项目")
                } icon: {
                    Image(systemName: "person.crop.circle.fill")
                        .font(.largeTitle)
                }
                .padding(.vertical, 6)
            }
        }
        .listStyle(.insetGrouped)
        .scrollDisabled(true)
        .frame(height: 330)
    }
}
