import { useRef } from "@wordpress/element";

export default function TrustBadgeSelector({
  rule,
  index,
  updateField,
  presetBadges = [],
  allowUpload = true
}) {

  const frameRef = useRef(null);
  const uploaded = rule.uploaded_badges || [];

  const openUploader = () => {

    if (!frameRef.current) {

      frameRef.current = wp.media({
        title: "Upload Badges",
        button: { text: "Add Badges" },
        multiple: true,
        library: { type: "image" },
      });

      frameRef.current.on("select", () => {

        const attachments = frameRef.current
          .state()
          .get("selection")
          .toJSON();

        const urls = attachments.map((a) => a.url);

        const newList = [...urls, ...uploaded];

        updateField(index, "uploaded_badges", newList);
      });
    }

    frameRef.current.open();
  };

  const selectBadge = (url) => {
    updateField(index, "badge_image", url);
  };

  const removeBadge = (url) => {

    const filtered = uploaded.filter((u) => u !== url);

    updateField(index, "uploaded_badges", filtered);

    if (rule.badge_image === url) {
      updateField(index, "badge_image", "");
    }
  };

  /* IMPORTANT CHANGE */
  const allBadges = allowUpload
    ? [...uploaded, ...presetBadges]
    : presetBadges;

  return (
    <div className="s1-badge-wrapper-group">
      <div className="s1-badge-grid">

        {/* Upload Tile */}
        {allowUpload && (
          <div
            className="s1-badge-upload"
            onClick={openUploader}
          >
            <span className="s1-plus">+</span>
            <span className="s1-tooltip">Upload Image</span>
          </div>
        )}

        {allBadges.map((url) => {

          const isUploaded = uploaded.includes(url);

          return (
            <div
              key={url}
              className={`s1-badge-item ${
                rule.badge_image === url ? "is-active" : ""
              }`}
              onClick={() => selectBadge(url)}
            >

              <img src={url} />

              {allowUpload && isUploaded && (
                <button
                  className="s1-badge-remove"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeBadge(url);
                  }}
                >
                  ×
                </button>
              )}

            </div>
          );
        })}

      </div>
    </div>
  );
}