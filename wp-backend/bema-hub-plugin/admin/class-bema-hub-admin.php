<?php
namespace Bema_Hub\Admin;

/**
 * The admin-specific functionality of the plugin.
 *
 * Defines the plugin name, version, and two examples hooks for how to
 * enqueue the admin-specific stylesheet and JavaScript.
 *
 * @since      1.0.0
 * @package    Bema_Hub
 * @subpackage Bema_Hub/admin
 */
class Bema_Hub_Admin {

	/**
	 * The ID of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $plugin_name    The ID of this plugin.
	 */
	private $plugin_name;

	/**
	 * The version of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $version    The current version of this plugin.
	 */
	private $version;

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    1.0.0
	 * @param      string    $plugin_name       The name of this plugin.
	 * @param      string    $version    The version of this plugin.
	 */
	public function __construct( $plugin_name, $version ) {
		$this->plugin_name = $plugin_name;
		$this->version = $version;
	}

	/**
	 * Register the stylesheets for the admin area.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_styles() {
		\wp_enqueue_style( $this->plugin_name, \plugin_dir_url( __FILE__ ) . 'css/bema-hub-admin.css', array(), $this->version, 'all' );
	}

	/**
	 * Register the JavaScript for the admin area.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_scripts() {
		\wp_enqueue_script( $this->plugin_name, \plugin_dir_url( __FILE__ ) . 'js/bema-hub-admin.js', array( 'jquery' ), $this->version, false );
	}

	/**
	 * Add admin menu page for route verification
	 *
	 * @since    1.0.0
	 */
	public function add_route_verification_menu() {
		\add_submenu_page(
			'tools.php',
			'Bema Hub Route Verification',
			'Bema Hub Routes',
			'manage_options',
			'bema-hub-route-verification',
			array($this, 'display_route_verification_page')
		);
	}

	/**
	 * Display the route verification page
	 *
	 * @since    1.0.0
	 */
	public function display_route_verification_page() {
		// Check user capabilities
		if (!\current_user_can('manage_options')) {
			return;
		}

		echo '<div class="wrap">';
		echo '<h1>Bema Hub JWT Authentication Route Verification</h1>';
		
		echo '<p>This page helps verify that the JWT authentication routes are properly registered in the WordPress REST API.</p>';
		
		echo '<h2>Expected Routes</h2>';
		echo '<ul>';
		echo '<li><code>POST /wp-json/bema-hub/v1/auth/login</code> - User login and token generation</li>';
		echo '<li><code>POST /wp-json/bema-hub/v1/auth/validate</code> - Token validation</li>';
		echo '<li><code>GET /wp-json/bema-hub/v1/profile</code> - Protected user profile endpoint</li>';
		echo '</ul>';
		
		echo '<h2>Verification Methods</h2>';
		echo '<ol>';
		echo '<li><strong>WP-CLI Command:</strong> Run <code>wp rest route list --match=bema-hub</code> in your terminal</li>';
		echo '<li><strong>Site Health Tool:</strong> Go to Tools > Site Health > Info tab > REST API section</li>';
		echo '<li><strong>Direct Testing:</strong> Use curl or Postman to test the endpoints</li>';
		echo '</ol>';
		
		echo '<h2>Testing Endpoints</h2>';
		echo '<p>You can test the endpoints directly:</p>';
		echo '<pre>';
		echo "curl -X POST " . \site_url() . "/wp-json/bema-hub/v1/auth/login\n";
		echo "curl -X POST " . \site_url() . "/wp-json/bema-hub/v1/auth/validate\n";
		echo "curl -X GET " . \site_url() . "/wp-json/bema-hub/v1/profile";
		echo '</pre>';
		
		echo '<h2>Troubleshooting</h2>';
		echo '<p>If routes are not found, check:</p>';
		echo '<ul>';
		echo '<li>That the Bema Hub plugin is activated</li>';
		echo '<li>That the WordPress REST API is enabled</li>';
		echo '<li>That there are no PHP errors in the plugin (check error logs)</li>';
		echo '<li>That the <code>JWT_SECRET</code> constant is defined in wp-config.php</li>';
		echo '</ul>';
		
		echo '</div>';
	}
}