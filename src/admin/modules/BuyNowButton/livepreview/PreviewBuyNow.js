import "./live-style.css";
import { __ } from "@wordpress/i18n";
import { useState } from "@wordpress/element";

const PreviewBuyNow = ({ settings = {} }) => {
  const s = settings || {};

  // devices
  const devices = s?.visibility?.devices || [];

  //preview switcher state
  const [previewDevice, setPreviewDevice] = useState(devices[0] || "desktop");

  // only mobile auto mode
  const isOnlyMobile =
    devices.length === 1 && devices.includes("mobile");

  //active device (FIXED LOGIC)
  const activeDevice = isOnlyMobile
    ? "mobile"
    : devices.includes(previewDevice)
    ? previewDevice
    : devices[0] || "desktop";

  //content override (mobile settings)
  const content =
    activeDevice === "mobile" && s?.content?.mobile?.enabled
      ? { ...s.content, ...s.content.mobile }
      : s.content || {};

  //button text
  const getButtonText = () => {
    if (content?.button_text) return content.button_text;

    if (content?.button_action === "buynow") {
      return __("Buy Now", "th-store-one");
    }

    return __("Add to Cart", "th-store-one");
  };

  // width control
  const getPreviewWidth = () => {
    if (activeDevice === "mobile") return "375px";
    if (activeDevice === "tablet") return "768px";
    return "100%";
  };

  return (
    <div className="s1-preview-wrap">

      {/*DEVICE SWITCHER (only when multiple devices) */}
      {devices.length > 1 && (
        <div className="s1-device-switcher s1-style-tabs">

          <button
  className={`s1-style-tab ${activeDevice === "desktop" ? "active" : ""}`}
  onClick={() => setPreviewDevice("desktop")}
  disabled={!devices.includes("desktop")}
>
  Desktop
</button>

<button
  className={`s1-style-tab ${activeDevice === "tablet" ? "active" : ""}`}
  onClick={() => setPreviewDevice("tablet")}
  disabled={!devices.includes("tablet")}
>
  Tablet
</button>

<button
  className={`s1-style-tab ${activeDevice === "mobile" ? "active" : ""}`}
  onClick={() => setPreviewDevice("mobile")}
  disabled={!devices.includes("mobile")}
>
  Mobile
</button>

        </div>
      )}

      {/* PREVIEW WRAPPER */}
      <div
        className={`s1-preview-device ${activeDevice}`}
        style={{
          maxWidth: getPreviewWidth(),
          margin: "0 auto",
          borderRadius: "12px",
          overflow: "hidden",
        }}
      >
        <div className="s1-product-preview s1-preview-stickybar">
    
          {/* MAIN PRODUCT */}
          <div className="s1-main-product">
            <div className="s1-main-thumb">
              <div className="static-skeleton static-main-img"></div>
            </div>

            <div className="s1-main-info">
              <div className="static-skeleton static-title"></div>
              <div className="static-skeleton static-price"></div>

              <div className="s1-main-cart">
                <div className="static-skeleton static-qty"></div>
                <div className="static-skeleton static-btn"></div>
              </div>
            </div>
          </div>

        
        </div>
      </div>
    </div>
  );
};

export default PreviewBuyNow;