import './live-style.css';

const PreviewBuyToList = ({ settings = {} }) => {

    const hasBrands = settings.brand_list && settings.brand_list.length > 0;
    const getBorderStyle = (border = {}) => ({
  borderStyle: border.style || "solid",
  borderColor: border.color || "#eee",

  borderTopWidth: border?.width?.top || "1px",
  borderRightWidth: border?.width?.right || "1px",
  borderBottomWidth: border?.width?.bottom || "1px",
  borderLeftWidth: border?.width?.left || "1px",

  borderTopLeftRadius: border?.radius?.top || "4px",
  borderTopRightRadius: border?.radius?.right || "4px",
  borderBottomRightRadius: border?.radius?.bottom || "4px",
  borderBottomLeftRadius: border?.radius?.left || "4px",
});

    return (
        <div
            className="s1-product-preview product-brand"
            
        >

            <div className="s1-main-product">

                <div className="s1-main-thumb">
                    <div className="static-skeleton static-main-img"></div>
                </div>

                <div className="s1-main-info">

                    <div className="static-skeleton static-title"></div>
                    <div className="static-skeleton static-price"></div>

                    {/* ================= BRAND SECTION ================= */}
                    <div
                        className="s1-btl-preview"
                       
                        style={{
                            background: settings.btl_bg_clr || "#fff",
                marginTop: settings.margin_top
                    ? `${settings.margin_top}px`
                    : '10px',
                marginBottom: settings.margin_bottom
                    ? `${settings.margin_bottom}px`
                    : '10px',
            }}
                    >

                        {settings.list_title && settings.list_title.trim() !== '' && (
    <div
        className="s1-btl-title"
        style={{
            color: settings.btl_title_clr || "#111"
        }}
    >
        {settings.list_title}
    </div>
)}

                        <ul
                            className="s1-btl-list"
                            style={{
                                gap: settings.image_gap
                                    ? `${settings.image_gap}px`
                                    : '15px',
                                   
                            }}
                        >

                            {hasBrands ? (

    settings.brand_list.map((item, index) => {

        const ImageElement = item.image_url ? (
            <img
                src={item.image_url}
                alt=""
                style={{
                    maxWidth: settings.max_width
                        ? `${settings.max_width}px`
                        : '100px',
                    width: '100%',
                    height: 'auto',
                    objectFit: 'contain'
                }}
            />
        ) : (
            <div
                className="static-skeleton static-brand-img"
                style={{
                    width: settings.max_width
                        ? `${settings.max_width}px`
                        : '100px',
                    height: '60px'
                }}
            />
        );

        return (
            <li key={index} className="s1-btl-item" style={getBorderStyle(settings.border)}>

                {item.link_enabled && item.link_url ? (
                    <a
                        href={item.link_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="s1-brand-link"
                    >
                        {ImageElement}
                    </a>
                ) : (
                    ImageElement
                )}

            </li>
        );

    })

) : (

    [1,2,3].map((_, i) => (
        <li key={i} className="s1-btl-item">
            <div
                className="static-skeleton static-brand-img"
                style={{
                    width: settings.max_width
                        ? `${settings.max_width}px`
                        : '100px',
                    height: '60px',
                    ...getBorderStyle(settings.border)
                }}
            />
        </li>
    ))

)}

                        </ul>

                    </div>
                    {/* ================= END BRAND SECTION ================= */}

                    <div className="s1-main-cart">
                        <div className="static-skeleton static-qty"></div>
                        <div className="static-skeleton static-btn"></div>
                    </div>

                </div>
            </div>

        </div>
    );
};

export default PreviewBuyToList;
