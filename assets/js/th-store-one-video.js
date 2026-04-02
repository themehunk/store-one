jQuery(function($){  

    let isInitialized = false;

    /* ================= YOUTUBE ID ================= */
    function getYouTubeId(url){
        try {
            let u = new URL(url);
            if (u.searchParams.get("v")) return u.searchParams.get("v");
            if (u.hostname.includes("youtu.be")) return u.pathname.replace("/", "");
            if (u.pathname.includes("/embed/")) return u.pathname.split("/embed/")[1];
        } catch(e){}
        return '';
    }

    /* ================= VIMEO ID ================= */
    function getVimeoId(url){
        return url.split('/').pop();
    }

    /* ================= BUILD VIDEO ================= */
    function buildVideo(video, type, autoplay){

        let auto = autoplay ? 1 : 0;
        let mute = autoplay ? 1 : 0;

        if(type === 'youtube'){
            let id = getYouTubeId(video);
            if(!id) return '';
            return `<iframe src="https://www.youtube.com/embed/${id}?autoplay=${auto}&mute=${mute}"
                     allow="autoplay; encrypted-media" allowfullscreen></iframe>`;
        }

        if(type === 'vimeo'){
            let id = getVimeoId(video);
            return `<iframe src="https://player.vimeo.com/video/${id}?autoplay=${auto}&muted=${mute}"
                     allow="autoplay; fullscreen" allowfullscreen></iframe>`;
        }

        return `<video src="${video}" ${autoplay ? 'autoplay muted' : 'controls'}></video>`;
    }

    /* ================= PLAY VIDEO ================= */
    function playVideo($slide){
        let video = $slide.data('video');
        let type  = $slide.data('type') || 'youtube';
        let autoplay = $slide.data('autoplay') == 1;

        let html  = buildVideo(video, type, autoplay);
        if(!html) return;

        $slide.html(html);
    }

    /* ================= INIT GALLERY ================= */
    function initGallery(){
        let $gallery = $('.woocommerce-product-gallery');
        if(!$gallery.length) return;

        $gallery.trigger('woocommerce_gallery_reset');

        $gallery.each(function(){
            $(this).wc_product_gallery();
        });

        isInitialized = true;
    }

    function safeInit(){
        if(isInitialized) return;
        initGallery();
    }

    setTimeout(safeInit, 400);

    /* ================= MODIFY VIDEO THUMBS ================= */
    function modifyVideoThumbs(){

        let thumbs = $('.flex-control-thumbs > li');
        let slides = $('.woocommerce-product-gallery__wrapper .woocommerce-product-gallery__image');

        if(!thumbs.length) return;

        slides.each(function(index){

            let slide = $(this);

            if(!slide.hasClass('th-video-slide')) return;

            let thumb = slide.data('thumb');
            let li = thumbs.eq(index);

            if(!li.length) return;

            // replace image
            li.find('img').attr('src', thumb);

            // remove old icon
            li.find('.th-video-thumb-icon').remove();

            // force position
            li.css('position','relative');

            // add icon
            li.append(`
                <span class="th-video-thumb-icon"><svg width="34" height="34" fill="#e3e3e3" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g><path d="M0 0h24v24H0z" fill="none"></path><path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM10.622 8.415l4.879 3.252a.4.4 0 0 1 0 .666l-4.88 3.252a.4.4 0 0 1-.621-.332V8.747a.4.4 0 0 1 .622-.332z"></path></g></svg></span>
            `);
        });
    }

    /* RUN AFTER FULL LOAD */
    $(window).on('load', function(){
        setTimeout(function(){
            modifyVideoThumbs();
        }, 300);
    });

    /* ================= CLICK VIDEO ================= */
    $(document).on('click', '.th-video-slide a:not(.th-video-trigger)', function(e){

        e.preventDefault();
        e.stopPropagation();

        let slide = $(this).closest('.th-video-slide');
        if(slide.find('iframe, video').length) return;

        playVideo(slide);
    });

    /* ================= LIGHTBOX ================= */
    $(document).on('click', '.th-video-trigger', function(e){

        e.preventDefault();

        let parent = $(this).closest('.th-video-slide');
        let video  = parent.data('video');
        let type   = parent.data('type');
        let autoplay = parent.data('autoplay') == 1;

        let html = buildVideo(video, type, autoplay);
        if(!html) return;

        $('#th-video-lightbox .th-video-content').html(html);
        $('#th-video-lightbox').addClass('active');
    });

    $(document).on('click', '.th-close', function(){
        $('#th-video-lightbox').removeClass('active');
        $('.th-video-content').html('');
    });

    /* ================= THUMB CLICK ================= */
    $(document).on('click', '.flex-control-thumbs li', function(){

        let index = $(this).index();

        $('.flex-control-thumbs li').removeClass('flex-active');
        $(this).addClass('flex-active');

        let slides = $('.woocommerce-product-gallery__wrapper .woocommerce-product-gallery__image');
        let targetSlide = slides.eq(index);

        if(targetSlide.hasClass('th-video-slide')){
            setTimeout(function(){
                playVideo(targetSlide);
            }, 200);
        }
    });

    /* ================= VARIATION ================= */
    $(document).ajaxComplete(function(){

        isInitialized = false;

        setTimeout(function(){
            safeInit();
        }, 500);

        setTimeout(function(){
            modifyVideoThumbs();
        }, 700);

    });


    $(document).on('click', '.th-video-play', function(e){

    e.preventDefault();
    e.stopPropagation();

    let wrap = $(this).closest('.th-video-wrap');
    let url = wrap.data('src');

    let video = `
        <video src="${url}" autoplay controls muted playsinline 
        style="width:100%;height:100%;object-fit:cover;"></video>
    `;

    wrap.replaceWith(video);
});

});


