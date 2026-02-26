import { SelectControl, TextControl } from "@wordpress/components";
import { S1Field } from "@storeone-global/S1Field";
import { ICONS } from "@storeone-global/icons";
import { useSocialUrl } from "./useSocialUrl";

export default function SocialItemEditor({
  item,
  ruleIndex,
  itemIndex,
  updateBuyItemField,
  ICON_OPTIONS,
  openMediaLibrary,
}) {
  const { generateUrl } = useSocialUrl();

  const handlePlatformSelect = (platformId) => {
    const url = generateUrl(
      platformId,
      item.social_choose || "share"
    );

    updateBuyItemField(ruleIndex, itemIndex, "selected_icon", platformId);
    updateBuyItemField(ruleIndex, itemIndex, "url", url);
  };

  return (
    <>
      {/* PLATFORM SELECT */}
      <S1Field label="Choose Platform">
        <div className="s1-platform-grid">
          {ICON_OPTIONS.map(({ id, icon }) => (
            <div
              key={id}
              className={`s1-icon-option ${
                item.selected_icon === id ? "active" : ""
              }`}
              onClick={() => handlePlatformSelect(id)}
            >
              {icon}
            </div>
          ))}
        </div>
      </S1Field>

      {/* ICON TYPE */}
      <S1Field label="Icon Type">
        <SelectControl
          value={item.icontype || "icon"}
          options={[
            { label: "Default Icon", value: "icon" },
            { label: "Upload Image", value: "image" },
            { label: "Custom SVG", value: "custom_svg" },
          ]}
          onChange={(v) =>
            updateBuyItemField(ruleIndex, itemIndex, "icontype", v)
          }
        />
      </S1Field>

      {/* DEFAULT ICON SHOW */}
      {(item.icontype || "icon") === "icon" && (
        <S1Field>
          {ICONS[item.selected_icon]}
        </S1Field>
      )}

      {/* IMAGE UPLOAD (MEDIA LIBRARY LIKE BEFORE) */}
      {item.icontype === "image" && (
        <S1Field label="Upload Image">
          <div className="s1-image-upload-wrapper">
            {item.image_url ? (
              <div className="s1-image-card">
                <div className="s1-image-preview">
                  <img src={item.image_url} alt="" />
                </div>

                <div className="s1-image-actions">
                  <button
                    type="button"
                    onClick={() =>
                      openMediaLibrary((media) =>
                        updateBuyItemField(
                          ruleIndex,
                          itemIndex,
                          "image_url",
                          media.url
                        )
                      )
                    }
                  >
                    Change
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      updateBuyItemField(
                        ruleIndex,
                        itemIndex,
                        "image_url",
                        ""
                      )
                    }
                  >
                    Remove
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() =>
                  openMediaLibrary((media) =>
                    updateBuyItemField(
                      ruleIndex,
                      itemIndex,
                      "image_url",
                      media.url
                    )
                  )
                }
              >
                Upload Image
              </button>
            )}
          </div>
        </S1Field>
      )}

      {/* CUSTOM SVG */}
      {item.icontype === "custom_svg" && (
        <S1Field label="SVG Code">
          <TextControl
            value={item.custom_svg || ""}
            onChange={(v) =>
              updateBuyItemField(ruleIndex, itemIndex, "custom_svg", v)
            }
          />
        </S1Field>
      )}

      {/* MODE */}
      <S1Field label="Mode">
        <SelectControl
          value={item.social_choose || "share"}
          options={[
            { label: "Share", value: "share" },
            { label: "Profile", value: "profile" },
          ]}
          onChange={(v) => {
            const url = generateUrl(item.selected_icon, v);

            updateBuyItemField(ruleIndex, itemIndex, "social_choose", v);
            updateBuyItemField(ruleIndex, itemIndex, "url", url);
          }}
        />
      </S1Field>

      {/* URL */}
      <S1Field label="URL">
        <TextControl
          value={item.url || ""}
          onChange={(v) =>
            updateBuyItemField(ruleIndex, itemIndex, "url", v)
          }
        />
      </S1Field>
    </>
  );
}