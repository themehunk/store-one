import './live-style.css';
import { __ } from '@wordpress/i18n';

const PreviewStickyCart = ({ settings = {} }) => {

    const changeStyle = (value) => {
        window.dispatchEvent(
            new CustomEvent('storeone:changeStickyCartStyle', {
                detail: { style: value }
            })
        );
    };


    return (
        <div className="s1-stickycart-preview-wrap">

            <div className="s1-style-tabs">
  
            </div> 
        </div>
    );
};

export default PreviewStickyCart;