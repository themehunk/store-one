<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Store_One {

	/**
	 * Single instance.
	 *
	 * @var Store_One|null
	 */
	private static $instance = null;

	/**
	 * Option name.
	 *
	 * @var string
	 */
	const OPTION_NAME = 'store_one_settings';

	/**
	 * Get single instance.
	 *
	 * @return Store_One
	 */
	public static function get_instance() {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}

		return self::$instance;
	}

	/**
	 * Constructor.
	 */
	private function __construct() {
		// Admin UI.
		if ( is_admin() ) {
			require_once STORE_ONE_PLUGIN_DIR . 'includes/class-store-one-admin.php';
			new Store_One_Admin();
		}

		// REST API.
		require_once STORE_ONE_PLUGIN_DIR . 'includes/class-store-one-rest.php';
		new Store_One_REST();

		// Register option with sanitization.
		add_action( 'admin_init', array( $this, 'register_settings' ) );
	}

	/**
	 * Register plugin settings.
	 */
	public function register_settings() {
		register_setting(
			'store_one_settings_group',
			self::OPTION_NAME,
			array(
				'type'              => 'array',
				'description'       => __( 'Store One settings', 'store-one' ),
				'sanitize_callback' => array( $this, 'sanitize_settings' ),
				'show_in_rest'      => false,
				'default'           => $this->get_default_settings(),
			)
		);
	}

	/**
	 * Default settings.
	 *
	 * @return array
	 */
	public function get_default_settings() {
		return array(
			'modules' => array(
				'woo-search'        => array(
					'enabled' => true,
				),
				'cart'              => array(
					'enabled' => true,
				),
				'frequently-bought' => array(
					'enabled' => true,
				),
			),
		);
	}

	/**
	 * Get merged settings (DB + default).
	 *
	 * @return array
	 */
	public function get_settings() {
		$defaults = $this->get_default_settings();
		$stored   = get_option( self::OPTION_NAME, array() );

		if ( ! is_array( $stored ) ) {
			$stored = array();
		}

		// Deep merge.
		$settings = wp_parse_args( $stored, $defaults );

		// Ensure modules keys exist.
		if ( ! isset( $settings['modules'] ) || ! is_array( $settings['modules'] ) ) {
			$settings['modules'] = $defaults['modules'];
		}

		foreach ( $defaults['modules'] as $module_id => $module_defaults ) {
			if ( ! isset( $settings['modules'][ $module_id ] ) || ! is_array( $settings['modules'][ $module_id ] ) ) {
				$settings['modules'][ $module_id ] = $module_defaults;
			}
		}

		return $settings;
	}

	/**
	 * Sanitize settings before saving.
	 *
	 * @param mixed $value Raw value from request.
	 * @return array
	 */
	public function sanitize_settings( $value ) {
		$defaults = $this->get_default_settings();
		$clean    = $defaults;

		if ( ! is_array( $value ) ) {
			return $clean;
		}

		if ( isset( $value['modules'] ) && is_array( $value['modules'] ) ) {
			foreach ( $defaults['modules'] as $module_id => $module_defaults ) {
				if ( isset( $value['modules'][ $module_id ] ) && is_array( $value['modules'][ $module_id ] ) ) {
					$module = $value['modules'][ $module_id ];

					$clean['modules'][ $module_id ]['enabled'] = ! empty( $module['enabled'] ) ? true : false;
				}
			}
		}

		return $clean;
	}
}