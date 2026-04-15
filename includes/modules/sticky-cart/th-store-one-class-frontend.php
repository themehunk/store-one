<?php
if (!defined('ABSPATH')) exit;

class Th_Store_One_Sticky_Cart_Frontend {

    private $settings = [];

    public function __construct() {

        $modules = get_option('th_store_one_module_option', []);
        if (empty($modules['sticky-cart'])) return;

        $all = get_option('th_store_one_module_set', []);
        $this->settings = $all['sticky-cart'] ?? [];

        if (empty($this->settings)) return;

        add_action('wp_footer', [$this, 'render']);
        add_action('wp_enqueue_scripts', [$this, 'assets']);
    }

    /* -------------------------
     * DEVICE
     * ------------------------- */
    private function device_allowed($vis) {

        $devices = $vis['devices'] ?? ['desktop','mobile'];
        $is_mobile = wp_is_mobile();

        if ($is_mobile && !in_array('mobile', $devices, true)) return false;
        if (!$is_mobile && !in_array('desktop', $devices, true)) return false;

        return true;
    }

    /* -------------------------
     * USER + VISIBILITY
     * ------------------------- */
    private function check_visibility($vis, $product) {

        /* Product include */
        if (($vis['trigger_type'] ?? '') === 'specific_products') {
            if (!in_array($product->get_id(), $vis['productsInclude'] ?? [])) return false;
        }

        /* Category include */
        if (($vis['trigger_type'] ?? '') === 'specific_categories') {
            $cats = wc_get_product_term_ids($product->get_id(), 'product_cat');
            if (!array_intersect($cats, $vis['categoriesInclude'] ?? [])) return false;
        }

        /* Exclude products */
        if (!empty($vis['exclude_productsInclude_enabled'])) {
            if (in_array($product->get_id(), $vis['exclude_productsInclude'] ?? [])) return false;
        }

        /* Exclude categories */
        if (!empty($vis['exclude_categoriesInclude_enabled'])) {
            $cats = wc_get_product_term_ids($product->get_id(), 'product_cat');
            if (array_intersect($cats, $vis['exclude_categoriesInclude'] ?? [])) return false;
        }

        /* USER CONDITION */
        $user = wp_get_current_user();

        if (($vis['user_condition'] ?? 'all') === 'logged_in' && !is_user_logged_in()) return false;
        if (($vis['user_condition'] ?? 'all') === 'guest' && is_user_logged_in()) return false;

        if (!empty($vis['allowed_roles']) && !array_intersect($vis['allowed_roles'], $user->roles)) return false;
        if (!empty($vis['allowed_users']) && !in_array($user->ID, $vis['allowed_users'])) return false;
        if (!empty($vis['exclude_roles']) && array_intersect($vis['exclude_roles'], $user->roles)) return false;
        if (!empty($vis['exclude_users_enabled']) && in_array($user->ID, $vis['exclude_users'])) return false;

        return true;
    }

    /* -------------------------
     * CONTENT (MOBILE)
     * ------------------------- */
    private function get_content() {

        $content = $this->settings['content'] ?? [];

        if (wp_is_mobile() && !empty($content['mobile']['enabled'])) {
            $content = array_merge($content, $content['mobile']);
        }

        return $content;
    }

    /* -------------------------
     * RENDER
     * ------------------------- */
    public function render() {

        if (!is_product()) return;

        global $product;
        if (!$product) return;

        $g = $this->settings['general'] ?? [];
        $c = $this->get_content();
        $s = $this->settings['style'] ?? [];
        $v = $this->settings['visibility'] ?? [];

        if (empty($g['status'])) return;

        if (!$this->device_allowed($v)) return;
        if (!$this->check_visibility($v, $product)) return;

        $position = $this->settings['general']['position'] ?? 'bottom';

        ?>

        <div class="th-sticky-cart th-<?php echo esc_attr($position); ?>"
             data-animation="<?php echo esc_attr($g['animation'] ?? 'slide'); ?>"
             data-scroll="<?php echo esc_attr($g['scroll_trigger'] ?? 20); ?>"
             style="background:<?php echo esc_attr($s['bg_color']); ?>;color:<?php echo esc_attr($s['text_color']); ?>">

            <div class="th-left">

                <?php if (!empty($c['show_image'])): ?>
                    <div class="th-thumb"><?php echo $product->get_image('thumbnail'); ?></div>
                <?php endif; ?>

                <div class="th-info">

                    <?php if (!empty($c['show_title'])): ?>
                        <div class="th-title"><?php echo esc_html($product->get_name()); ?></div>
                    <?php endif; ?>

                    <?php if (!empty($c['show_price'])): ?>
                        <div class="th-price" style="color:<?php echo esc_attr($s['price_color']); ?>">
                            <?php echo $product->get_price_html(); ?>
                        </div>
                    <?php endif; ?>

                </div>
            </div>

            <form class="th-sticky-form variations_form cart"
                  method="post"
                  enctype="multipart/form-data"
                  data-product_id="<?php echo esc_attr($product->get_id()); ?>">

                <div class="th-right">

                    <?php if ($product->is_type('variable') && !empty($c['show_variation'])): ?>
                        <?php woocommerce_variable_add_to_cart(); ?>
                    <?php else: ?>

                        <?php if (!empty($c['show_qty'])): ?>
                            <input type="number" name="quantity" value="1" min="1" class="th-qty" />
                        <?php endif; ?>

                        <button type="submit"
                            name="add-to-cart"
                            value="<?php echo esc_attr($product->get_id()); ?>"
                            class="th-btn"
                            data-action="<?php echo esc_attr($c['button_action']); ?>"
                            style="background:<?php echo esc_attr($s['btn_bg_color']); ?>;color:<?php echo esc_attr($s['btn_text_color']); ?>">

                            <?php echo esc_html(
                                !empty($c['button_text'])
                                ? $c['button_text']
                                : (($c['button_action'] ?? '') === 'buynow' ? 'Buy Now' : 'Add to Cart')
                            ); ?>
                        </button>

                    <?php endif; ?>

                </div>

            </form>

        </div>

        <?php
    }

    public function assets() {

    wp_enqueue_style(
        'th-sticky-bar',
        TH_STORE_ONE_PLUGIN_URL . 'assets/css/sticky-bar.css',
        [],
        TH_STORE_ONE_VERSION
    );

    wp_enqueue_script('jquery');

    wp_enqueue_script(
        'th-sticky-cart-js',
        TH_STORE_ONE_PLUGIN_URL . 'assets/js/sticky-bar.js',
        ['jquery'],
        TH_STORE_ONE_VERSION,
        true
    );

    wp_enqueue_script('wc-add-to-cart-variation');
}
}