<?php
defined( 'ABSPATH' ) || exit;

global $product;

if ( ! function_exists( 'wc_get_gallery_image_html' ) ) {
    return;
}

$post_thumbnail_id = $product->get_image_id();
$attachment_ids    = $product->get_gallery_image_ids();
$product_id        = $product->get_id();

/* ================= SETTINGS ================= */
$enable = get_post_meta( $product_id, '_th_enable_gallery', true );
$videos = get_post_meta( $product_id, '_th_gallery', true );
$gallery_types = get_post_meta($product_id, '_th_gallery_type', true);
if (!is_array($gallery_types)) $gallery_types = [];

$position = get_post_meta( $product_id, '_th_position', true );
$aspect   = get_post_meta( $product_id, '_th_aspect', true );

if ( empty($position) ) $position = 'before';
if ( empty($aspect) )   $aspect   = 'default';

/* ================= ASPECT CLASS ================= */
$aspect_class = 'th-aspect-default';
if ( $aspect === '16:9' ) $aspect_class = 'th-aspect-16-9';
elseif ( $aspect === '4:3' ) $aspect_class = 'th-aspect-4-3';
elseif ( $aspect === 'auto' ) $aspect_class = 'th-aspect-auto';

/* ================= BUILD VIDEO HTML ================= */
$video_html = '';

if ( $enable === 'yes' && ! empty( $videos ) && is_array( $videos ) ) {

    foreach ( $videos as $index => $video ) {

        if ( empty( $video ) ) continue;

        $thumb = wc_placeholder_img_src();
        $type  = $gallery_types[$index] ?? 'youtube';

        /* YOUTUBE */
        /* YOUTUBE */
if ( $type === 'youtube' ) {

    $id = '';

    // youtube.com/watch?v=
    parse_str( parse_url( $video, PHP_URL_QUERY ), $vars );
    if ( ! empty( $vars['v'] ) ) {
        $id = $vars['v'];
    }

    // youtu.be/
    if ( empty( $id ) ) {
        $path = trim( parse_url( $video, PHP_URL_PATH ), '/' );
        if ( strpos($video, 'youtu.be') !== false ) {
            $id = $path;
        }
    }

    // embed URL
    if ( empty( $id ) && strpos($video, '/embed/') !== false ) {
        $parts = explode('/embed/', $video);
        $id = $parts[1] ?? '';
    }

    if ( ! empty( $id ) ) {
        $thumb = 'https://img.youtube.com/vi/' . $id . '/hqdefault.jpg';
    }
}

        /* VIMEO */
        elseif ( $type === 'vimeo' ) {

            $id = trim( parse_url( $video, PHP_URL_PATH ), '/' );

            if ( ! empty( $id ) ) {
                $thumb = 'https://vumbnail.com/' . $id . '.jpg';
            }
        }

        $full = esc_url( $thumb );

        ob_start(); ?>

        <div class="woocommerce-product-gallery__image th-video-slide <?php echo esc_attr($aspect_class); ?>"
        data-autoplay="<?php echo esc_attr( get_post_meta($product_id, '_th_enable_video_auto_play', true) === 'yes' ? '1' : '0' ); ?>"
             data-type="<?php echo esc_attr( $type ); ?>"
             data-video="<?php echo esc_url( $video ); ?>"
             data-thumb="<?php echo esc_url( $thumb ); ?>"
             data-src="<?php echo esc_url( $full ); ?>"
             data-large_image="<?php echo esc_url( $full ); ?>"
             data-large_image_width="800"
             data-large_image_height="800">
             <div class="th-video-inner">
            <a href="#" class="th-video-trigger">
                <img src="<?php echo esc_url( $thumb ); ?>" class="wp-post-image" />
                <span class="th-video-thumb-icon"><svg width="34" height="34" fill="#e3e3e3" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g><path d="M0 0h24v24H0z" fill="none"></path><path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM10.622 8.415l4.879 3.252a.4.4 0 0 1 0 .666l-4.88 3.252a.4.4 0 0 1-.621-.332V8.747a.4.4 0 0 1 .622-.332z"></path></g></svg></span>
            </a>
          </div>
          

        </div>

        <?php
        $video_html .= ob_get_clean();
    }
}
?>

<div class="woocommerce-product-gallery woocommerce-product-gallery--with-images woocommerce-product-gallery--columns-4 images"
     data-columns="4"
     style="opacity:0; transition:opacity .25s ease;">

    <div class="woocommerce-product-gallery__wrapper">

        <?php
        /* ================= BEFORE ================= */
        if ( $position === 'before' ) {
            echo $video_html;
        }

        /* FEATURED */
        if ( $post_thumbnail_id ) {
            echo wc_get_gallery_image_html( $post_thumbnail_id, true );
        }

        /* GALLERY */
        if ( $attachment_ids ) {
            foreach ( $attachment_ids as $attachment_id ) {
                echo wc_get_gallery_image_html( $attachment_id );
            }
        }

        /* ================= AFTER ================= */
        if ( $position === 'after' ) {
            echo $video_html;
        }
        ?>

    </div>

</div>