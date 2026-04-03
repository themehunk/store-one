<?php
if ( ! defined( 'ABSPATH' ) ) exit;

class TH_Store_One_Product_Video_Frontend {

    public function __construct() {


         $modules = get_option('th_store_one_module_option', []);

        if ( empty($modules['product-video']) ) {
                return;
        } 

        // TEMPLATE OVERRIDE
        add_filter( 'wc_get_template', [ $this, 'override_template' ], 10, 5 );

        // REMOVE DEFAULT THUMBNAIL
        remove_action( 'woocommerce_before_shop_loop_item_title', 'woocommerce_template_loop_product_thumbnail', 10 );

        // ADD VIDEO / IMAGE
        add_action( 'woocommerce_before_shop_loop_item_title', [ $this, 'add_video_loop_media' ], 10 );

        //REMOVE DEFAULT LINKS (GLOBAL)
        remove_action( 'woocommerce_before_shop_loop_item', 'woocommerce_template_loop_product_link_open', 10 );
        remove_action( 'woocommerce_after_shop_loop_item', 'woocommerce_template_loop_product_link_close', 5 );

        //ADD CONDITIONAL LINKS
        add_action( 'woocommerce_before_shop_loop_item', [ $this, 'custom_link_open' ], 10 );
        add_action( 'woocommerce_after_shop_loop_item', [ $this, 'custom_link_close' ], 5 );

        // TITLE LINK (ONLY VIDEO PRODUCTS)
        add_action( 'woocommerce_shop_loop_item_title', [ $this, 'wrap_title_link_open' ], 1 );
        add_action( 'woocommerce_shop_loop_item_title', [ $this, 'wrap_title_link_close' ], 20 );

        // ADD CLASS
        add_filter( 'post_class', [ $this, 'add_product_video_class' ], 10, 3 );

        // FRONTEND ASSETS
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

        if ( ! is_product() && ! is_shop() && ! is_product_category() ) return;

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
    /* ================= CUSTOM LINK CONTROL ================= */
    public function custom_link_open() {

        global $product;
        if ( ! $product ) return;

        //VIDEO PRODUCT → NO FULL LINK
        if ( $this->has_video( $product->get_id() ) ) {
            return;
        }

        //NORMAL PRODUCT → DEFAULT LINK
        woocommerce_template_loop_product_link_open();
    }

    public function custom_link_close() {

        global $product;
        if ( ! $product ) return;

        if ( $this->has_video( $product->get_id() ) ) {
            return;
        }

        woocommerce_template_loop_product_link_close();
    }

    /* ================= TITLE LINK (VIDEO PRODUCTS ONLY) ================= */
    public function wrap_title_link_open() {

        global $product;
        if ( ! $product ) return;

        if ( $this->has_video( $product->get_id() ) ) : ?>
            <a href="<?php echo esc_url( get_permalink( $product->get_id() ) ); ?>" class="th-title-link">
        <?php endif;
    }

    public function wrap_title_link_close() {

        global $product;
        if ( ! $product ) return;

        if ( $this->has_video( $product->get_id() ) ) : ?>
            </a>
        <?php endif;
    }

    /* ================= VIDEO / IMAGE ================= */
    public function add_video_loop_media() {

        global $product;
        if ( ! $product ) return;

        $product_id = $product->get_id();

        $enable = get_post_meta( $product_id, '_th_enable_video', true );
        $source = get_post_meta( $product_id, '_th_source', true );
        $url    = get_post_meta( $product_id, '_th_video_url', true );

        // NO VIDEO → DEFAULT IMAGE
        if ( $enable !== 'yes' || empty($url) ) {
            echo woocommerce_get_product_thumbnail();
            return;
        }
        ?>

        <div class="th-loop-video">

            <?php if ( $source === 'youtube' ) :

                parse_str( parse_url( $url, PHP_URL_QUERY ), $vars );
                $id = $vars['v'] ?? '';

                if ( empty($id) ) {
                    $id = trim( parse_url( $url, PHP_URL_PATH ), '/' );
                }

                if ( $id ) : ?>

                    <iframe 
                        src="https://www.youtube.com/embed/<?php echo esc_attr($id); ?>?mute=1&loop=1&playlist=<?php echo esc_attr($id); ?>" 
                        allow="autoplay">
                    </iframe>

                <?php endif; ?>

            <?php elseif ( $source === 'vimeo' ) :

                $id = trim( parse_url( $url, PHP_URL_PATH ), '/' );

                if ( $id ) : ?>

                    <iframe 
                        src="https://player.vimeo.com/video/<?php echo esc_attr($id); ?>?muted=1&loop=1" 
                        allow="autoplay">
                    </iframe>

                <?php endif; ?>

            <?php else : ?>

                <!-- SELF HOSTED VIDEO -->
                <div class="th-video-wrap" data-src="<?php echo esc_url($url); ?>">

                    <video 
                        src="<?php echo esc_url($url); ?>" 
                        muted 
                        playsinline
                        style="width:100%;height:100%;object-fit:cover;">
                    </video>

                    <span class="th-video-play">
                       <svg width="34" height="34" fill="#e3e3e3" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g><path d="M0 0h24v24H0z" fill="none"></path><path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM10.622 8.415l4.879 3.252a.4.4 0 0 1 0 .666l-4.88 3.252a.4.4 0 0 1-.621-.332V8.747a.4.4 0 0 1 .622-.332z"></path></g></svg>
                    </span>

                </div>

            <?php endif; ?>

        </div>

        <?php
    }

    /* ================= HELPER ================= */
    private function has_video( $product_id ) {

        $enable = get_post_meta( $product_id, '_th_enable_video', true );
        $url    = get_post_meta( $product_id, '_th_video_url', true );

        return ( $enable === 'yes' && ! empty($url) );
    }

    /* ================= ADD CLASS ================= */
    public function add_product_video_class( $classes, $class, $post_id ) {

        if ( get_post_type( $post_id ) !== 'product' ) {
            return $classes;
        }

        if ( $this->has_video( $post_id ) ) {
            $classes[] = 'th-has-video';
        }

        return $classes;
    }
}