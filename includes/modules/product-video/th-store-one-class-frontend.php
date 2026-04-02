<?php
if ( ! defined( 'ABSPATH' ) ) exit;

class TH_Store_One_Product_Video_Frontend {

    public function __construct() {

        // TEMPLATE OVERRIDE
        add_filter( 'wc_get_template', [ $this, 'override_template' ], 10, 5 );
        remove_action( 'woocommerce_before_shop_loop_item_title', 'woocommerce_template_loop_product_thumbnail', 10 );
        add_action( 'woocommerce_before_shop_loop_item_title', [ $this, 'add_video_loop_media' ], 10 );
        add_filter( 'post_class', [ $this, 'add_product_video_class' ], 10, 3 );
        // FRONT SCRIPT
        add_action( 'wp_enqueue_scripts', [ $this, 'enqueue' ] );
    }

    /* ================= TEMPLATE OVERRIDE ================= */
    public function override_template( $located, $template_name, $args, $template_path, $default_path ) {

        if ( $template_name === 'single-product/product-image.php' ) {

            $plugin_template = plugin_dir_path( __FILE__ ) . 'templates/product-image.php';

            if ( file_exists( $plugin_template ) ) {
                return $plugin_template;
            }
        }

        return $located;
    }
    

    /* ================= ENQUEUE ================= */
    public function enqueue() {

        if ( ! is_product() ) return;

        wp_enqueue_script(
            'th-store-onevideo-gallery',
            TH_STORE_ONE_PLUGIN_URL . 'assets/js/th-store-one-video.js',
            ['jquery'],
            TH_STORE_ONE_VERSION,
            true
        );

        wp_enqueue_style(
            'th-store-onevideo-gallery',
            TH_STORE_ONE_PLUGIN_URL . 'assets/css/th-store-one-video.css',
            [],
            TH_STORE_ONE_VERSION
        );
    }

    public function add_video_loop_media() {

    global $product;

    if ( ! $product ) return;

    $product_id = $product->get_id();

    $enable = get_post_meta( $product_id, '_th_enable_video', true );
    $source = get_post_meta( $product_id, '_th_source', true );
    $url    = get_post_meta( $product_id, '_th_video_url', true );

    if ( $enable !== 'yes' || empty($url) ) {
        echo woocommerce_get_product_thumbnail();
        return;
    }
    $video_html = '';

    if ( $source === 'youtube' ) {

        parse_str( parse_url( $url, PHP_URL_QUERY ), $vars );
        $id = $vars['v'] ?? '';

        if ( empty($id) ) {
            $id = trim( parse_url( $url, PHP_URL_PATH ), '/' );
        }

        if ( $id ) {
            $video_html = '<iframe src="https://www.youtube.com/embed/' . esc_attr($id) . '?mute=1&loop=1&playlist='.$id.'" allow="autoplay"></iframe>';
        }

    } elseif ( $source === 'vimeo' ) {

        $id = trim( parse_url( $url, PHP_URL_PATH ), '/' );

        if ( $id ) {
            $video_html = '<iframe src="https://player.vimeo.com/video/' . esc_attr($id) . '?muted=1&loop=1" allow="autoplay"></iframe>';
        }

    } else {
        $video_html = '<video src="' . esc_url($url) . '" muted loop playsinline></video>';
    }

    if ( empty($video_html) ) {
        echo woocommerce_get_product_thumbnail();
        return;
    }?>

   <div class="th-loop-video">'<?php echo $video_html; ?></div>

    <?php
}

public function add_product_video_class( $classes, $class, $post_id ) {

    if ( get_post_type( $post_id ) !== 'product' ) {
        return $classes;
    }

    $enable = get_post_meta( $post_id, '_th_enable_video', true );
    $url    = get_post_meta( $post_id, '_th_video_url', true );

    if ( $enable === 'yes' && ! empty($url) ) {
        $classes[] = 'th-has-video';
    }

    return $classes;
}
}