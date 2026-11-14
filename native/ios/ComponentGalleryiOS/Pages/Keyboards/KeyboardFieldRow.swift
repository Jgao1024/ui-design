import SwiftUI

struct KeyboardFieldRow: View {
    let field: KeyboardField
    var focus: FocusState<KeyboardField?>.Binding

    @State private var text = ""

    var body: some View {
        DemoCase(title: "\(field.caseTitle)") {
            TextField(field.prompt, text: $text)
                .textFieldStyle(.roundedBorder)
                .keyboardType(field.keyboardType)
                .submitLabel(field.submitLabel)
                .textInputAutocapitalization(field.keyboardType == .default ? .sentences : .never)
                .focused(focus, equals: field)
        }
    }
}
