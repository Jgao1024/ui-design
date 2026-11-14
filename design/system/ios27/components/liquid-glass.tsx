import type { Child, Markup } from "@design/jsx/jsx-runtime";
import { Glass } from "@design/components/glass.tsx";

// iOS 27 glass presets. Numbers: figma/reference/ios27/specs/08-tokens/Materials__Liquid-Glass---*.json.

type Mode = "light" | "dark";

/// Regular - Medium and Large: 160 x 160, radius 34. The two share every number in Figma.
export function RegularGlass(props: { mode: Mode; width?: number; height?: number; radius?: number; children?: Child }): Markup {
  return (
    <Glass
      mode={props.mode}
      width={props.width ?? 160}
      height={props.height ?? 160}
      radius={props.radius ?? 34}
      fill={props.mode === "light" ? "rgb(255 255 255 / 0.55)" : "rgb(26 26 26 / 0.62)"}
      blur={8}
    >
      {props.children}
    </Glass>
  );
}

/// Clear: 160 x 160, radius 23. Figma has one set of numbers for both modes: no tint, a rim of
/// #CCCCCC / #D0D0D0 and a faint 0.02 shadow.
export function ClearGlass(props: { width?: number; height?: number }): Markup {
  return (
    <Glass
      mode="light"
      width={props.width ?? 160}
      height={props.height ?? 160}
      radius={23}
      fill="rgb(255 255 255 / 0.08)"
      rim="#cccccc"
      shadowAlpha={0.02}
      shadowBlur={15}
      blur={1}
      refraction={14}
    />
  );
}

/// Regular - Small: a 48 pt circle. `active` and `prominent` follow Figma's variant properties.
/// Inactive is a flat fill with a hairline rim and no glass. Active is glass; Active + Prominent
/// is glass over a blue (#0088FF) tint on a 94% white backing.
export function SmallGlass(props: { mode: Mode; active: boolean; prominent: boolean }): Markup {
  const dark = props.mode === "dark";
  if (!props.active) {
    const fill = dark ? "rgb(118 118 128 / 0.24)" : "rgb(116 116 128 / 0.08)";
    const rim = dark ? "#e6e6e6" : "#ebebeb";
    return <div class="size-12 rounded-full" style={`background:${fill};box-shadow:0 0 0 0.5px ${rim}`} />;
  }
  if (props.prominent) {
    return (
      <Glass
        mode={props.mode}
        width={48}
        height={48}
        radius={1000}
        fill="rgb(0 136 255 / 0.94)"
        rim="#e6e6e6"
        ring={false}
        shadowAlpha={dark ? 0.04 : 0.02}
        shadowBlur={15}
      />
    );
  }
  return (
    <Glass
      mode={props.mode}
      width={48}
      height={48}
      radius={1000}
      fill={dark ? "rgb(153 153 153 / 0.17)" : "rgb(255 255 255 / 0.53)"}
      rim={dark ? "#a6a6a6" : "#e8e8e8"}
      shadowAlpha={dark ? 0.04 : 0.02}
      shadowBlur={15}
    />
  );
}

/// A Liquid Glass control of any size (toolbar buttons, tab bar, bars): the Small look stretched to
/// `width` x `height`. `tint` fills it with a colour instead (Active + Prominent).
export function GlassControl(props: {
  mode: Mode;
  width: number;
  height: number;
  radius?: number;
  tint?: string;
  children?: Child;
  class?: string;
}): Markup {
  const dark = props.mode === "dark";
  const radius = props.radius ?? 1000;
  return (
    <Glass
      mode={props.mode}
      width={props.width}
      height={props.height}
      radius={radius}
      fill={props.tint ?? (dark ? "rgb(153 153 153 / 0.17)" : "rgb(255 255 255 / 0.53)")}
      rim={props.tint ? "#e6e6e6" : dark ? "#a6a6a6" : "#e8e8e8"}
      ring={!props.tint}
      shadowAlpha={dark ? 0.04 : 0.02}
      shadowBlur={15}
      blur={props.tint ? 3 : 6}
      refraction={Math.min(12, props.height / 4)}
      class={props.class}
    >
      {props.children}
    </Glass>
  );
}
