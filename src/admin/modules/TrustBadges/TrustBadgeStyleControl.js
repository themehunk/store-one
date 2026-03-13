import { SelectControl, ToggleControl } from "@wordpress/components";
import { __ } from "@wordpress/i18n";

import UniversalRangeControl from "@storeone-global/UniversalRangeControl";
import THBackgroundControl from "@storeone-control/color";
import { S1Field } from "@storeone-global/S1Field";

export default function TrustBadgeStyleControl({ value = {}, onChange }) {

const update = (key, val) => {
onChange({
...value,
[key]: val,
});
};

return ( <div className="s1-badge-style-control">
  {/* Background Color */}
  <S1Field label={__("Badge Background Color", "store-one")}>
    <THBackgroundControl
      value={value.background || ""}
      onChange={(v) => update("background", v)}
    />
  </S1Field>

  {/* Opacity */}
  <S1Field label={__("Opacity (%)", "store-one")}>
    <UniversalRangeControl
      value={value.opacity}
      min={0}
      max={100}
      step={1}
      defaultValue="100"
      onChange={(v) => update("opacity", v)}
    />
  </S1Field>

  {/* Rotation */}
  <S1Field label={__("Rotation X", "store-one")}>
    <UniversalRangeControl
      value={value.rotateX}
      min={-360}
      max={360}
      step={1}
      defaultValue="0"
      onChange={(v) => update("rotateX", v)}
    />
  </S1Field>

  <S1Field label={__("Rotation Y", "store-one")}>
    <UniversalRangeControl
      value={value.rotateY}
      min={-360}
      max={360}
      step={1}
      defaultValue="0"
      onChange={(v) => update("rotateY", v)}
    />
  </S1Field>

  <S1Field label={__("Rotation Z", "store-one")}>
    <UniversalRangeControl
      value={value.rotateZ}
      min={-360}
      max={360}
      step={1}
      defaultValue="0"
      onChange={(v) => update("rotateZ", v)}
    />
  </S1Field>

  {/* Flip Text */}
  <S1Field label={__("Flip / Mirror Text", "store-one")}>
    <ToggleControl
      checked={value.flipText || false}
      onChange={(v) => update("flipText", v)}
    />
  </S1Field>

  {/* Position Mode */}
  <S1Field label={__("Position Mode", "store-one")}>
    <SelectControl
      value={value.positionMode || "fixed"}
      options={[
        { label: __("Fixed", "store-one"), value: "fixed" },
        { label: __("Custom (px)", "store-one"), value: "px" },
        { label: __("Custom (%)", "store-one"), value: "%" },
      ]}
      onChange={(v) => update("positionMode", v)}
    />
  </S1Field>

  {/* Position */}
  <S1Field label={__("Position", "store-one")}>
    <SelectControl
      value={value.position || "top"}
      options={[
        { label: __("Top", "store-one"), value: "top" },
        { label: __("Middle", "store-one"), value: "middle" },
        { label: __("Bottom", "store-one"), value: "bottom" },
      ]}
      onChange={(v) => update("position", v)}
    />
  </S1Field>

  {/* Alignment */}
  <S1Field label={__("Alignment", "store-one")}>
    <SelectControl
      value={value.align || "left"}
      options={[
        { label: __("Left", "store-one"), value: "left" },
        { label: __("Center", "store-one"), value: "center" },
        { label: __("Right", "store-one"), value: "right" },
      ]}
      onChange={(v) => update("align", v)}
    />
  </S1Field>

  {/* Margin Top */}
  <S1Field label={__("Margin Top", "store-one")}>
    <UniversalRangeControl
      value={value.marginTop}
      units={["px", "%"]}
      min={0}
      max={200}
      defaultValue="0px"
      onChange={(v) => update("marginTop", v)}
    />
  </S1Field>

  {/* Margin Left */}
  <S1Field label={__("Margin Left", "store-one")}>
    <UniversalRangeControl
      value={value.marginLeft}
      units={["px", "%"]}
      min={0}
      max={200}
      defaultValue="0px"
      onChange={(v) => update("marginLeft", v)}
    />
  </S1Field>

  {/* Mobile Scale */}
  <S1Field label={__("Scale on Mobile", "store-one")}>
    <UniversalRangeControl
      value={value.mobileScale}
      min={0.5}
      max={2}
      step={0.1}
      defaultValue="1"
      onChange={(v) => update("mobileScale", v)}
    />
  </S1Field>

</div>


);
}
