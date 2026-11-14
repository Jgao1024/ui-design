import SwiftUI

/// 所有 kit 页面共用的骨架：页头、公开族区块、独立组件、内部件折叠区。
/// 每个页面只需提供「族 → 演示视图」和「独立组件 → 演示视图」两个映射。
struct PageScaffold<FamilyDemo: View, SoloDemo: View>: View {
    let page: RegistryPage
    @ContentBuilder let familyDemo: (ComponentSet) -> FamilyDemo
    @ContentBuilder let soloDemo: (SoloComponent) -> SoloDemo

    @AppStorage(AppScene.deviceFilterKey) private var device: DeviceFilter = .iPhone

    var body: some View {
        let sets = page.sets.filter { device.allows($0.name) }
        let solos = page.solo.filter { device.allows($0.name) }
        let hidden = page.sets.count - sets.count + page.solo.count - solos.count

        ScrollView {
            LazyVStack(alignment: .leading, spacing: 32) {
                PageHeader(page: page)

                ForEach(sets) { family in
                    FamilyBlock(family: family) {
                        familyDemo(family)
                    }
                }

                if solos.isEmpty == false {
                    Text("独立组件")
                        .font(.title2)
                        .bold()
                    ForEach(solos) { solo in
                        SoloBlock(solo: solo) {
                            soloDemo(solo)
                        }
                    }
                }

                if hidden > 0 {
                    FilteredNote(hiddenCount: hidden, device: device)
                }

                if page.internal.isEmpty == false {
                    InternalPartsSection(parts: page.internal)
                }
            }
            .padding()
            // 给右下角浮窗按钮留出位置，避免最后一个区块被挡住。
            .padding(.bottom, 64)
        }
        .navigationTitle(page.name)
        .navigationBarTitleDisplayMode(.inline)
    }
}
