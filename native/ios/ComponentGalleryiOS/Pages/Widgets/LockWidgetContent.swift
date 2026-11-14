import SwiftUI

/// 锁屏小组件的内容版式，按独立组件名称里的关键词选择。
struct LockWidgetContent: View {
    let name: String

    private func has(_ keyword: String) -> Bool {
        name.contains(keyword)
    }

    var body: some View {
        if has("Open Gauge 2") {
            Gauge(value: 21, in: 12...28) {
                Image(systemName: "thermometer.medium")
            } currentValueLabel: {
                Text("21")
            } minimumValueLabel: {
                Text("12")
            } maximumValueLabel: {
                Text("28")
            }
            .gaugeStyle(.accessoryCircular)
        } else if has("Open Gauge 3") {
            Gauge(value: 0.4) {
                Text("AQI")
            } currentValueLabel: {
                Image(systemName: "aqi.medium")
            }
            .gaugeStyle(.accessoryCircular)
        } else if has("Open Gauge") {
            Gauge(value: 0.7) {
                Text("UV")
            } currentValueLabel: {
                Text("7")
            }
            .gaugeStyle(.accessoryCircular)
        } else if has("Closed Gauge") {
            Gauge(value: 0.75) {
                Image(systemName: "battery.75percent")
            } currentValueLabel: {
                Text("75")
            }
            .gaugeStyle(.accessoryCircularCapacity)
        } else if has("Stack 3 Rows") {
            ZStack {
                LockWidgetCircleBackground()
                VStack(spacing: 0) {
                    Text("周一").font(.caption2)
                    Text("8").font(.headline)
                    Text("6月").font(.caption2)
                }
            }
        } else if has("Icon and Label") {
            ZStack {
                LockWidgetCircleBackground()
                VStack(spacing: 2) {
                    Image(systemName: "figure.walk")
                    Text("3.2k").font(.caption2)
                }
            }
        } else if has("Stack 2 Rows - Labels") {
            ZStack {
                LockWidgetCircleBackground()
                VStack(spacing: 0) {
                    Text("21°").font(.headline)
                    Text("多云").font(.caption2)
                }
            }
        } else if has("Circular / Icon") {
            ZStack {
                LockWidgetCircleBackground()
                Image(systemName: "alarm.fill")
                    .font(.title2)
            }
        } else if has("Clock Big") {
            Text("9:41")
                .font(.system(size: 54, weight: .bold, design: .rounded))
        } else if has("2x2/Date") {
            VStack {
                Text("周一").font(.headline)
                Text("8").font(.system(size: 72, weight: .bold, design: .rounded))
            }
        } else if has("Clock") {
            ZStack {
                LockWidgetCircleBackground()
                Image(systemName: "clock")
                    .font(.title)
            }
        } else if has("Inline") {
            Label("周一 8日 · 21° 多云", systemImage: "cloud.sun")
                .font(.headline)
        } else if has("Rectangular with Chart") {
            VStack(alignment: .leading, spacing: 4) {
                Text("步数").font(.caption).bold()
                HStack(alignment: .bottom, spacing: 4) {
                    ForEach([0.3, 0.6, 0.45, 0.8, 0.5, 0.9, 0.7], id: \.self) { value in
                        Capsule().frame(width: 10, height: 36 * value)
                    }
                }
            }
            .frame(maxWidth: .infinity, alignment: .leading)
        } else if has("Modular with Bar") {
            VStack(alignment: .leading, spacing: 4) {
                Text("电池").font(.caption).bold()
                Text("75%").font(.headline)
                Gauge(value: 0.75) { Text("电池") }
                    .gaugeStyle(.accessoryLinearCapacity)
            }
        } else if has("Rectangular Text Gauge") {
            VStack(alignment: .leading, spacing: 4) {
                Text("21° 多云").font(.headline)
                Gauge(value: 21, in: 12...28) {
                    Text("温度")
                } currentValueLabel: {
                    Text("21")
                } minimumValueLabel: {
                    Text("12")
                } maximumValueLabel: {
                    Text("28")
                }
                .gaugeStyle(.accessoryLinear)
            }
        } else if has("Tall Body with Icon") {
            HStack(alignment: .top) {
                Image(systemName: "calendar")
                Text("产品评审\n下午 2:00 · 会议室 A")
                    .font(.caption)
            }
            .frame(maxWidth: .infinity, alignment: .leading)
        } else if has("Tall Body") {
            Text("今天下午有雷阵雨，出门记得带伞。")
                .font(.caption)
                .frame(maxWidth: .infinity, alignment: .leading)
        } else if has("Modular Columns") {
            HStack {
                ForEach(["9:00", "12:00", "15:00"], id: \.self) { hour in
                    VStack {
                        Text(hour).font(.caption2)
                        Image(systemName: "sun.max")
                        Text("22°").font(.caption2)
                    }
                    .frame(maxWidth: .infinity)
                }
            }
        } else if has("Modular Table") {
            Grid(alignment: .leading) {
                GridRow { Text("AAPL"); Text("+1.2%") }
                GridRow { Text("MSFT"); Text("-0.4%") }
                GridRow { Text("GOOG"); Text("+0.8%") }
            }
            .font(.caption)
            .frame(maxWidth: .infinity, alignment: .leading)
        } else if has("Modular Standard") {
            VStack(alignment: .leading) {
                Text("提醒事项").font(.caption).bold()
                Text("买牛奶").font(.caption)
                Text("取快递").font(.caption)
            }
            .frame(maxWidth: .infinity, alignment: .leading)
        } else if has("Modular List") {
            VStack(alignment: .leading) {
                Label("买牛奶", systemImage: "circle")
                Label("取快递", systemImage: "circle")
                Label("交水费", systemImage: "circle")
            }
            .font(.caption)
            .frame(maxWidth: .infinity, alignment: .leading)
        } else {
            Text(name)
                .font(.caption)
        }
    }
}
