import { __ } from '@wordpress/i18n';
import './live-style.css';

const PreviewProductVideo = () => {

    return (
        <div className="s1-preview-wrap">

            <div className="s1-product-preview s1-video-preview"> 
                <div className="s1-main-product">

                    {/* SIMPLE SOCIAL ICON */}
                    
                    {/* STATIC PRODUCT SKELETON */}
                    <div className="s1-main-thumb"> 
                        <div className="static-skeleton static-main-img"></div> 
                        <span class="th-video-thumb-icon">
                            <svg width="34" height="34" fill="#e3e3e3" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g><path d="M0 0h24v24H0z" fill="none"></path><path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM10.622 8.415l4.879 3.252a.4.4 0 0 1 0 .666l-4.88 3.252a.4.4 0 0 1-.621-.332V8.747a.4.4 0 0 1 .622-.332z"></path></g></svg></span>
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
    );
};

export default PreviewProductVideo;