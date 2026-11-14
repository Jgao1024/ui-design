import SwiftUI

/// 模拟 Face ID 认证提示：Authenticating（脉动）与 Success（对勾）。
struct SimFaceID: View {
    let isSuccess: Bool

    var body: some View {
        Image(systemName: isSuccess ? "checkmark.circle" : "faceid")
            .font(.system(size: 64))
            .symbolEffect(.pulse, isActive: isSuccess == false)
            .foregroundStyle(isSuccess ? AnyShapeStyle(.green) : AnyShapeStyle(.primary))
            .frame(width: 150, height: 150)
            .glassEffect(.regular, in: .rect(cornerRadius: 32))
            .accessibilityLabel(isSuccess ? "Face ID 认证成功" : "Face ID 正在认证")
    }
}
