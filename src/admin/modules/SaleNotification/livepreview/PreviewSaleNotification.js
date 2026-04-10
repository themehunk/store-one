import './live-style.css';
import { __ } from '@wordpress/i18n';

const PreviewSaleNotification = ({ settings = {} }) => {

    const style = settings?.noti_style || 'style1';

    const changeStyle = (value) => {
        window.dispatchEvent(
            new CustomEvent('storeone:changeNotifyStyle', {
                detail: { style: value }
            })
        );
    };

    return (
        <div className="s1-ntf-preview-wrap">

            <div className="s1-style-tabs">
  {[
    { id: "style1", label: "Classic" },
    { id: "style2", label: "Modern" },
    { id: "style3", label: "Minimal" },
    { id: "style4", label: "Elegant" },
  ].map((s) => (
    <div
      key={s.id}
      className={`s1-style-tab ${style === s.id ? "active" : ""}`}
      onClick={() => changeStyle(s.id)}
    >
      <div className="s1-style-preview-box">{s.label}</div>
    </div>
  ))}
</div>
   <div className="s1-preview-area">
    <div className={`s1-sale-popup ${style}`}>
        <span className="s1-close-btn">×</span>
    <img
    src={
        th_StoreOneAdmin.homeUrl +
        "wp-content/plugins/th-store-one/assets/images/prd1.png"
    }
    className="s1-sale-img"
    />

    <div className="s1-sale-content">
      <strong>Amit from Bangalore</strong>
      <p>purchased Sony WH-1000XM5</p>
      <span>7 minutes ago</span>
    </div>

  </div>
</div> 
        </div>
    );
};

export default PreviewSaleNotification;