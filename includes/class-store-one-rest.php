<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Store_One_REST {

	/**
	 * Namespace.
	 *
	 * @var string
	 */
	private $namespace = 'store-one/v1';

	/**
	 * Constructor.
	 */
	public function __construct() {
		add_action( 'rest_api_init', array( $this, 'register_routes' ) );
	}

	/**
	 * Register REST routes.
	 */
	public function register_routes() {
		register_rest_route(
			$this->namespace,
			'/settings',
			array(
				array(
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => array( $this, 'get_settings' ),
					'permission_callback' => array( $this, 'permissions_check' ),
				),
				array(
					'methods'             => WP_REST_Server::CREATABLE,
					'callback'            => array( $this, 'update_settings' ),
					'permission_callback' => array( $this, 'permissions_check' ),
					'args'                => array(
						'settings' => array(
							'required'          => true,
							'validate_callback' => array( $this, 'validate_settings_param' ),
						),
					),
				),
			)
		);
	}

	/**
	 * Permission check: only admins.
	 *
	 * @param WP_REST_Request $request Request.
	 * @return true|WP_Error
	 */
	public function permissions_check( $request ) {
		if ( ! current_user_can( 'manage_options' ) ) {
			return new WP_Error(
				'store_one_forbidden',
				__( 'You do not have permission to manage Store One settings.', 'store-one' ),
				array( 'status' => rest_authorization_required_code() )
			);
		}

		return true;
	}

	/**
	 * Validate `settings` param basic structure.
	 *
	 * @param mixed           $value   Value.
	 * @param WP_REST_Request $request Request.
	 * @param string          $param   Param name.
	 * @return bool|WP_Error
	 */
	public function validate_settings_param( $value, $request, $param ) {
		if ( ! is_array( $value ) ) {
			return new WP_Error(
				'store_one_invalid_param',
				__( 'Settings must be an array.', 'store-one' ),
				array( 'status' => 400 )
			);
		}

		return true;
	}

	/**
	 * Get settings.
	 *
	 * @param WP_REST_Request $request Request.
	 * @return WP_REST_Response
	 */
	public function get_settings( $request ) {
		$core     = Store_One::get_instance();
		$settings = $core->get_settings();

		return rest_ensure_response(
			array(
				'settings' => $settings,
			)
		);
	}

	/**
	 * Update settings.
	 *
	 * @param WP_REST_Request $request Request.
	 * @return WP_REST_Response|WP_Error
	 */
	public function update_settings( $request ) {
		$params   = $request->get_json_params();
		$settings = isset( $params['settings'] ) ? $params['settings'] : array();

		$core    = Store_One::get_instance();
		$sanized = $core->sanitize_settings( $settings );

		$updated = update_option( Store_One::OPTION_NAME, $sanized );

		if ( ! $updated && $sanized !== get_option( Store_One::OPTION_NAME ) ) {
			return new WP_Error(
				'store_one_update_failed',
				__( 'Could not update settings.', 'store-one' ),
				array( 'status' => 500 )
			);
		}

		return rest_ensure_response(
			array(
				'settings' => $core->get_settings(),
				'updated'  => (bool) $updated,
			)
		);
	}
}