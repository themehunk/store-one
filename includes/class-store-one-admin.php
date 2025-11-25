<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Store_One_Admin {

	/**
	 * Constructor.
	 */
	public function __construct() {
		add_action( 'admin_menu', array( $this, 'register_menu' ) );
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_assets' ) );
	}

	/**
	 * Register admin menu.
	 */
	public function register_menu() {
		// Top-level Menu
		add_menu_page(
			__( 'Store One', 'store-one' ),
			__( 'Store One', 'store-one' ),
			'manage_options',
			'store-one',
			array( $this, 'render_admin_page' ),
			'dashicons-store',
			56
		);

		// Submenu: Dashboard (points to same page)
		add_submenu_page(
			'store-one',
			__( 'Dashboard', 'store-one' ),
			__( 'Dashboard', 'store-one' ),
			'manage_options',
			'store-one',
			array( $this, 'render_admin_page' )
		);
	}

	/**
	 * Render admin page (React root div only).
	 */
	public function render_admin_page() {
		if ( ! current_user_can( 'manage_options' ) ) {
			wp_die( esc_html__( 'You do not have permission to access this page.', 'store-one' ) );
		}
		?>
		<div class="wrap store-one-wrap">
			<h1 class="screen-reader-text">
				<?php echo esc_html__( 'Store One Dashboard', 'store-one' ); ?>
			</h1>
			<div id="store-one-admin-app" aria-label="<?php echo esc_attr__( 'Store One Dashboard', 'store-one' ); ?>"></div>
		</div>
		<?php
	}

	/**
	 * Enqueue admin assets.
	 *
	 * @param string $hook Current admin page hook.
	 */
	public function enqueue_assets( $hook ) {
		// Allow both Top Menu & Dashboard submenu.
			if ( ! in_array( $hook, array( 'toplevel_page_store-one', 'store-one_page_store-one' ), true ) ) {
				return;
			}

		$js_path  = 'build/admin/index.js';
		$css_path = 'build/admin/index.css';

		$js_ver  = file_exists( STORE_ONE_PLUGIN_DIR . $js_path ) ? filemtime( STORE_ONE_PLUGIN_DIR . $js_path ) : STORE_ONE_VERSION;
		$css_ver = file_exists( STORE_ONE_PLUGIN_DIR . $css_path ) ? filemtime( STORE_ONE_PLUGIN_DIR . $css_path ) : STORE_ONE_VERSION;

		wp_register_script(
			'store-one-admin',
			STORE_ONE_PLUGIN_URL . $js_path,
			array( 'wp-element', 'wp-components', 'wp-api-fetch', 'wp-i18n' ),
			$js_ver,
			true
		);

		wp_register_style(
			'store-one-admin',
			STORE_ONE_PLUGIN_URL . $css_path,
			array( 'wp-components' ),
			$css_ver
		);

		// Localized data (safe, escaped).
		wp_localize_script(
			'store-one-admin',
			'StoreOneAdmin',
			array(
				'restUrl' => esc_url_raw( rest_url( 'store-one/v1/' ) ),
				'nonce'   => wp_create_nonce( 'wp_rest' ),
				'i18n'    => array(
					'saveSuccess' => esc_html__( 'Settings saved successfully.', 'store-one' ),
					'saveError'   => esc_html__( 'Failed to save settings. Please try again.', 'store-one' ),
				),
			)
		);

		wp_enqueue_script( 'store-one-admin' );
		wp_enqueue_style( 'store-one-admin' );

		// If you add translations later.
		// wp_set_script_translations( 'store-one-admin', 'store-one' );
	}
}
