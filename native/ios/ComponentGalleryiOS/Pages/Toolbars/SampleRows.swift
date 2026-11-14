import SwiftUI

/// 工具栏演示用的占位列表。
struct SampleRows: View {
    var body: some View {
        List(1...20, id: \.self) { row in
            Text("第 \(row) 行")
        }
    }
}
