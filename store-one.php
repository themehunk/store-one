<?php
/**
 * Plugin Name:       Store One
 * Description:       Central dashboard for Store One modules (Woo Search, Cart, Frequently Bought, etc.)
 * Version:           1.0.0
 * Author:            themehunk
 * Author URI:        https://www.themehunk.com
 * License:           GPLv2 or later
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain:       store-one
 * Requires at least: 6.0
 * Requires PHP:      7.4
 * WC requires at least: 3.0
 * WC tested up to:   8.9
 */

if ( ! defined( 'ABSPATH' ) ) exit;

define( 'STORE_ONE_VERSION', '1.0.1' );
define( 'STORE_ONE_PLUGIN_FILE', __FILE__ );
define( 'STORE_ONE_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
define( 'STORE_ONE_PLUGIN_URL', plugin_dir_url( __FILE__ ) );

require_once STORE_ONE_PLUGIN_DIR . 'includes/class-store-one.php';

function store_one_run() {
    Store_One::get_instance();
}
add_action( 'plugins_loaded', 'store_one_run' );

/**
 * Declare WooCommerce HPOS (Custom Order Tables) compatibility.
 */
add_action( 'before_woocommerce_init', function() {
    if ( class_exists( \Automattic\WooCommerce\Utilities\FeaturesUtil::class ) ) {
        \Automattic\WooCommerce\Utilities\FeaturesUtil::declare_compatibility(
            'custom_order_tables',
            __FILE__,
            true
        );
    }
} );