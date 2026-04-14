import { useState, useEffect } from "@wordpress/element";
import apiFetch from "@wordpress/api-fetch";
import { __ } from "@wordpress/i18n";
import { S1Field, S1FieldGroup } from "@th-storeone-global/S1Field";
import { Spinner, ToggleControl, SelectControl } from "@wordpress/components";
import ResetModuleButton from "@th-storeone-global/ResetModuleButton";
import TabSwitcher from "@th-storeone-global/TabSwitcher";
import { ICONS } from "@th-storeone-global/icons";
const MODULE_ID = "bundle-product";

/* ---------------------------------
 * DEFAULT SETTINGS
 * --------------------------------- */
const DEFAULT_SETTINGS = {
  general: {
    status: true,
    style: "cta", // classic | floating | cta | expandable
    position: "bottom", // bottom | left | right
    show_on: ["product"],
    scroll_trigger: 20,
    delay: 1,
    hide_when: {
      atc_visible: true,
      footer_visible: true,
      cart_open: true,
    },
    ajax_add_to_cart: true,
    sync_variation: true,
  },

  content: {
    show_image: true,
    show_title: true,
    show_price: true,
    show_rating: false,
    show_qty: true,
    show_variation: true,
    show_stock: true,
    show_discount: false,
    button_text: "Add to Cart",
    button_action: "cart", // cart | buy_now
    offer_text: "",
    countdown: false,
  },

  visibility: {
    devices: ["mobile"],
    user_roles: ["guest", "logged"],
    products: [],
    categories: [],
    exclude_products: false,
  },

  style: {
    layout: "full",
    bg_color: "#ffffff",
    text_color: "#000000",
    button_color: "#facc15",
    button_style: "solid",
    radius: 8,
    shadow: "soft",
    animation: "slide",
  },
};
export default function StickyCartSettings({
  onSettingsChange,
  onRegisterSave,
}) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [hideToast, setHideToast] = useState(false);

  const [settings, setSettings] = useState(DEFAULT_SETTINGS);

  /* ---------------------------------
   * LOAD SETTINGS
   * --------------------------------- */
  useEffect(() => {
    apiFetch.use(apiFetch.createNonceMiddleware(th_StoreOneAdmin.nonce));

    apiFetch({
      path: `${th_StoreOneAdmin.restUrl}module/${MODULE_ID}`,
      method: "GET",
    })
      .then((res) => {
        const s = res?.settings || {};
        setSettings({
          ...DEFAULT_SETTINGS,
          ...s,
          product_page: {
            ...DEFAULT_SETTINGS.product_page,
            ...(s.product_page || {}),
          },
          cart_page: {
            ...DEFAULT_SETTINGS.cart_page,
            ...(s.cart_page || {}),
          },
        });
      })
      .catch(() => setError(__("Failed to load settings.", "th-store-one")))
      .finally(() => setLoading(false));
  }, []);

  /* ---------------------------------
   * SAVE HANDLER
   * --------------------------------- */
  const handleSave = () => {
    if (saving) return;

    setSaving(true);
    setSuccess("");
    setError("");

    apiFetch({
      path: `${th_StoreOneAdmin.restUrl}module/${MODULE_ID}`,
      method: "POST",
      data: { settings },
    })
      .then(() => setSuccess(__("Saved successfully!", "th-store-one")))
      .catch(() => setError(__("Failed to save.", "th-store-one")))
      .finally(() => setSaving(false));
  };

  /* ---------------------------------
   * NOTIFY PARENT ON CHANGE
   * --------------------------------- */
  useEffect(() => {
    onSettingsChange?.(settings);
  }, [settings]);

  /* ---------------------------------
   * REGISTER SAVE WITH ADMIN MAIN
   * --------------------------------- */
  useEffect(() => {
    onRegisterSave?.(() => handleSave);
  }, [settings]);

  /* ---------------------------------
   * AUTO HIDE TOAST
   * --------------------------------- */
  useEffect(() => {
    if (success || error) {
      setHideToast(false);

      const t1 = setTimeout(() => setHideToast(true), 2500);
      const t2 = setTimeout(() => {
        setSuccess("");
        setError("");
      }, 3000);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
  }, [success, error]);

  /* ---------------------------------
   * RENDER
   * --------------------------------- */
  return (
    <div className="storeone-module-settings">
      {loading && (
        <div className="store-one-loader">
          <Spinner /> {__("Loading…", "th-store-one")}
        </div>
      )}

      {!loading && (
        <>
          {/* NOTICES */}
          {error && (
            <div
              className={`s1-toast s1-toast--error ${hideToast ? "hide" : ""}`}
            >
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div
              className={`s1-toast s1-toast--success ${
                hideToast ? "hide" : ""
              }`}
            >
              <span>{success}</span>
            </div>
          )}

          {/* ---------------------------------
           * PRODUCT PAGE SETTINGS
           * --------------------------------- */}
          <h3 className="store-one-section-title">
            {__("Sticky Cart", "th-store-one")}
          </h3>
          <div className="store-one-rule-item">
          <TabSwitcher
            defaultTab="settings"
            tabs={[
              {
                id: "settings",
                label: "Settings",
                icon: ICONS.SETTINGS,
                content: (
                  <>
                    <S1FieldGroup title={__("Settings", "th-store-one")}>
                      <S1Field label="Enable Sticky Cart">
                        <ToggleControl
                          checked={settings.general.status}
                          onChange={(v) =>
                            setSettings({
                              ...settings,
                              general: { ...settings.general, status: v },
                            })
                          }
                        />
                      </S1Field>

                      <S1Field label="Style">
                        <SelectControl
                          value={settings.general.style}
                          options={[
                            { label: "Classic", value: "classic" },
                            { label: "Floating", value: "floating" },
                            { label: "CTA", value: "cta" },
                            { label: "Expandable", value: "expandable" },
                          ]}
                          onChange={(v) =>
                            setSettings({
                              ...settings,
                              general: { ...settings.general, style: v },
                            })
                          }
                        />
                      </S1Field>

                      <S1Field label="Position">
                        <SelectControl
                          value={settings.general.position}
                          options={[
                            { label: "Bottom Bar", value: "bottom" },
                            { label: "Floating Left", value: "left" },
                            { label: "Floating Right", value: "right" },
                          ]}
                          onChange={(v) =>
                            setSettings({
                              ...settings,
                              general: { ...settings.general, position: v },
                            })
                          }
                        />
                      </S1Field>

                      <S1Field label="Show After Scroll (%)">
                        <SelectControl
                          value={settings.general.scroll_trigger}
                          options={[
                            { label: "10%", value: 10 },
                            { label: "20%", value: 20 },
                            { label: "50%", value: 50 },
                          ]}
                          onChange={(v) =>
                            setSettings({
                              ...settings,
                              general: {
                                ...settings.general,
                                scroll_trigger: parseInt(v),
                              },
                            })
                          }
                        />
                      </S1Field>
                    </S1FieldGroup>
                    <S1FieldGroup title="Content">
                      <S1Field label="Show Product Image">
                        <ToggleControl
                          checked={settings.content.show_image}
                          onChange={(v) =>
                            setSettings({
                              ...settings,
                              content: { ...settings.content, show_image: v },
                            })
                          }
                        />
                      </S1Field>

                      <S1Field label="Show Price">
                        <ToggleControl
                          checked={settings.content.show_price}
                          onChange={(v) =>
                            setSettings({
                              ...settings,
                              content: { ...settings.content, show_price: v },
                            })
                          }
                        />
                      </S1Field>

                      <S1Field label="Enable Quantity Selector">
                        <ToggleControl
                          checked={settings.content.show_qty}
                          onChange={(v) =>
                            setSettings({
                              ...settings,
                              content: { ...settings.content, show_qty: v },
                            })
                          }
                        />
                      </S1Field>

                      <S1Field label="Button Text">
                        <input
                          type="text"
                          value={settings.content.button_text}
                          onChange={(e) =>
                            setSettings({
                              ...settings,
                              content: {
                                ...settings.content,
                                button_text: e.target.value,
                              },
                            })
                          }
                        />
                      </S1Field>
                    </S1FieldGroup>
                  </>
                ),
              },
              {
                    id: "visibility",
                    label: "Visibility",
                    icon: ICONS.DISPLAY,
                    content: (
                       <>
                       <S1FieldGroup title="Visibility">

                    <S1Field label="Enable for Mobile">
                    <ToggleControl
                         checked={settings.visibility.devices.includes("mobile")}
                         onChange={(v) =>
                         setSettings({
                              ...settings,
                              visibility: {
                              ...settings.visibility,
                              devices: v ? ["mobile"] : [],
                              },
                         })
                         }
                    />
                    </S1Field>

                    <S1Field label="Exclude Products">
                    <ToggleControl
                         checked={settings.visibility.exclude_products}
                         onChange={(v) =>
                         setSettings({
                              ...settings,
                              visibility: {
                              ...settings.visibility,
                              exclude_products: v,
                              },
                         })
                         }
                    />
                    </S1Field>

                    </S1FieldGroup>
                       </>
                    )
               },
                {
                     id: "style",
                    label: "Style",
                    icon: ICONS.DESIGN,
                    content: (
                       <>
                      <S1FieldGroup title="Style">

  <S1Field label="Background Color">
    <input
      type="color"
      value={settings.style.bg_color}
      onChange={(e) =>
        setSettings({
          ...settings,
          style: { ...settings.style, bg_color: e.target.value },
        })
      }
    />
  </S1Field>

  <S1Field label="Button Color">
    <input
      type="color"
      value={settings.style.button_color}
      onChange={(e) =>
        setSettings({
          ...settings,
          style: { ...settings.style, button_color: e.target.value },
        })
      }
    />
  </S1Field>

  <S1Field label="Animation">
    <SelectControl
      value={settings.style.animation}
      options={[
        { label: "Slide", value: "slide" },
        { label: "Fade", value: "fade" },
        { label: "Bounce", value: "bounce" },
      ]}
      onChange={(v) =>
        setSettings({
          ...settings,
          style: { ...settings.style, animation: v },
        })
      }
    />
  </S1Field>

</S1FieldGroup>
                       </>
                    )
               }
            ]}
          >

          </TabSwitcher>
          </div>
        </>
      )}
      <div className="store-one-rules-footer bundle-footer">
        <ResetModuleButton
          moduleId={MODULE_ID}
          label="Reset"
          onReset={(newSettings) =>
            setSettings({
              ...DEFAULT_SETTINGS,
              ...newSettings,
              product_page: {
                ...DEFAULT_SETTINGS.product_page,
                ...(newSettings?.product_page || {}),
              },
              cart_page: {
                ...DEFAULT_SETTINGS.cart_page,
                ...(newSettings?.cart_page || {}),
              },
            })
          }
        />
      </div>
    </div>
  );
}
