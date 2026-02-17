import './live-style.css';

const PreviewQuickSocial = ({ settings = {} }) => {

    const {
        social_style = 'style1',
        icon_size = '20px',
        icon_color = '#111',
        bg_color = '#fff',
        social_visiblity = 'show-all'
    } = settings;

    console.log(settings.social_style);

    return (
        <div className="s1-product-preview social_link">

            <div className="s1-main-product">

                {/* ================= QUICK SOCIAL SKELETON ================= */}

                <div
                    className={`s1-quick-social s1-quick-social--${social_style}`}
                    data-visibility={social_visiblity}
                    style={{
                        "--s1-icon-size": icon_size,
                        "--s1-icon-color": icon_color,
                        "--s1-icon-bg": bg_color,
                    }}
                >
                    <div className="s1-quick-social__inner">

                        {/* 3 Skeleton Icons */}
                        {[1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className="s1-quick-social__item s1-quick-social__skeleton"
                            >
                                <div className="s1-quick-social__icon">
                                    <div className="s1-icon-placeholder" />
                                </div>
                            </div>
                        ))}

                    </div>
                </div>

                {/* ================= END QUICK SOCIAL ================= */}


                {/* LEFT IMAGE */}
                <div className="s1-main-thumb">
                    <div className="static-skeleton static-main-img"></div>
                </div>

                {/* RIGHT CONTENT */}
                <div className="s1-main-info">

                    <div className="static-skeleton static-title"></div>
                    <div className="static-skeleton static-price"></div>

                    {/* BUY TO LIST */}
                    <div className="s1-btl-preview">
                        <div className="static-skeleton static-btl-title"></div>
                        <ul className="s1-btl-list">
                            <li className="static-skeleton static-btl-title"></li>
                            <li className="static-skeleton static-btl-title"></li>
                        </ul>
                    </div>

                    <div className="s1-main-cart">
                        <div className="static-skeleton static-qty"></div>
                        <div className="static-skeleton static-btn"></div>
                    </div>

                </div>
            </div>

        </div>
    );
};

export default PreviewQuickSocial;
