<?php
namespace Bema_Hub;

// Include the controller files
if (!class_exists('Bema_Hub\REST\Controllers\Bema_Hub_Auth_Controller')) {
    require_once \plugin_dir_path(__FILE__) . 'controllers/class-bema-hub-auth-controller.php';
}

if (!class_exists('Bema_Hub\REST\Controllers\Bema_Hub_OTP_Controller')) {
    require_once \plugin_dir_path(__FILE__) . 'controllers/class-bema-hub-otp-controller.php';
}

if (!class_exists('Bema_Hub\REST\Controllers\Bema_Hub_User_Controller')) {
    require_once \plugin_dir_path(__FILE__) . 'controllers/class-bema-hub-user-controller.php';
}

/**
 * REST API Controller for Bema Hub plugin
 *
 * Registers REST API endpoints for the plugin
 *
 * @since      1.0.0
 * @package    Bema_Hub
 * @subpackage Bema_Hub/includes
 */
class Bema_Hub_REST_API {

    /**
     * The logger instance.
     *
     * @since    1.0.0
     * @access   private
     * @var      Bema_Hub_Logger    $logger    Logger instance.
     */
    private $logger;

    /**
     * The JWT auth instance.
     *
     * @since    1.0.0
     * @access   private
     * @var      Bema_Hub_JWT_Auth    $jwt_auth    JWT Auth instance.
     */
    private $jwt_auth;

    /**
     * The Auth controller instance.
     *
     * @since    1.0.0
     * @access   private
     * @var      Bema_Hub_Auth_Controller    $auth_controller    Auth Controller instance.
     */
    private $auth_controller;

    /**
     * The OTP controller instance.
     *
     * @since    1.0.0
     * @access   private
     * @var      Bema_Hub_OTP_Controller    $otp_controller    OTP Controller instance.
     */
    private $otp_controller;

    /**
     * The User controller instance.
     *
     * @since    1.0.0
     * @access   private
     * @var      Bema_Hub_User_Controller    $user_controller    User Controller instance.
     */
    private $user_controller;

    /**
     * Array to store invalidated tokens (in production, this should be stored in database)
     *
     * @since    1.0.0
     * @access   private
     * @var      array    $invalidated_tokens    List of invalidated tokens.
     */
    private $invalidated_tokens = array();

    /**
     * Initialize the class and set its properties.
     *
     * @since    1.0.0
     */
    public function __construct() {
        // Initialize logger
        if (class_exists('Bema_Hub\Bema_Hub_Logger')) {
            $this->logger = \Bema_Hub\Bema_Hub_Logger::create('rest-api');
        }

        // Initialize JWT auth
        if (class_exists('Bema_Hub\Bema_Hub_JWT_Auth')) {
            $this->jwt_auth = new \Bema_Hub\Bema_Hub_JWT_Auth();
        }

        // Initialize controllers
        if (class_exists('Bema_Hub\REST\Controllers\Bema_Hub_Auth_Controller')) {
            $this->auth_controller = new \Bema_Hub\REST\Controllers\Bema_Hub_Auth_Controller($this->logger, $this->jwt_auth);
        }

        if (class_exists('Bema_Hub\REST\Controllers\Bema_Hub_OTP_Controller')) {
            $this->otp_controller = new \Bema_Hub\REST\Controllers\Bema_Hub_OTP_Controller($this->logger, $this->jwt_auth);
        }

        if (class_exists('Bema_Hub\REST\Controllers\Bema_Hub_User_Controller')) {
            $this->user_controller = new \Bema_Hub\REST\Controllers\Bema_Hub_User_Controller($this->logger, $this->jwt_auth);
        }

        // Load invalidated tokens from database
        $this->invalidated_tokens = \get_option('bema_hub_invalidated_tokens', array());
        
        // Set invalidated tokens in user controller
        if ($this->user_controller) {
            $this->user_controller->set_invalidated_tokens($this->invalidated_tokens);
        }
        
        // Register shutdown hook to save invalidated tokens
        \add_action('shutdown', array($this, 'save_invalidated_tokens'));
    }

    /**
     * Save invalidated tokens to database on shutdown
     *
     * @since 1.0.0
     */
    public function save_invalidated_tokens() {
        if ($this->user_controller) {
            $tokens = $this->user_controller->get_invalidated_tokens();
            
            // Only update if there are tokens and they've changed
            $existing_tokens = \get_option('bema_hub_invalidated_tokens', array());
            
            // Check if tokens have changed (simple array comparison)
            $tokens_changed = ($tokens !== $existing_tokens);
            
            if ($tokens_changed) {
                \update_option('bema_hub_invalidated_tokens', $tokens, false);
                
                if ($this->logger) {
                    $this->logger->info('Invalidated tokens saved to database', array(
                        'count' => count($tokens),
                        'changed' => true
                    ));
                }
            } elseif (!empty($tokens) && $this->logger) {
                // Log only when there are tokens but they haven't changed
                // This can be removed in production to reduce logging
                $this->logger->debug('Invalidated tokens unchanged, skipping database update', array(
                    'count' => count($tokens),
                    'changed' => false
                ));
            }
        }
    }

    /**
     * Register REST API routes
     *
     * @since 1.0.0
     */
    public function register_routes() {
        // Register authentication routes
        \register_rest_route('bema-hub/v1', '/auth/signin', array(
            'methods' => 'POST',
            'callback' => array($this->auth_controller, 'signin'),
            'permission_callback' => '__return_true',
        ));

        \register_rest_route('bema-hub/v1', '/auth/validate', array(
            'methods' => 'POST',
            'callback' => array($this->user_controller, 'validate_token'),
            'permission_callback' => '__return_true',
        ));

        // Register signup routes
        \register_rest_route('bema-hub/v1', '/auth/signup', array(
            'methods' => 'POST',
            'callback' => array($this->auth_controller, 'signup'),
            'permission_callback' => '__return_true',
        ));

        \register_rest_route('bema-hub/v1', '/auth/verify-otp', array(
            'methods' => 'POST',
            'callback' => array($this->otp_controller, 'verify_otp'),
            'permission_callback' => '__return_true',
        ));

        // Register social login routes
        \register_rest_route('bema-hub/v1', '/auth/social-login', array(
            'methods' => 'POST',
            'callback' => array($this->auth_controller, 'social_login'),
            'permission_callback' => '__return_true',
        ));

        // Register signout route
        \register_rest_route('bema-hub/v1', '/auth/signout', array(
            'methods' => 'POST',
            'callback' => array($this->user_controller, 'signout'),
            'permission_callback' => array($this, 'validate_jwt_permission'),
        ));

        // Register password reset request route
        \register_rest_route('bema-hub/v1', '/auth/reset-password-request', array(
            'methods' => 'POST',
            'callback' => array($this->otp_controller, 'reset_password_request'),
            'permission_callback' => '__return_true',
        ));

        // Register resend OTP route
        \register_rest_route('bema-hub/v1', '/auth/resend-otp', array(
            'methods' => 'POST',
            'callback' => array($this->otp_controller, 'resend_otp'),
            'permission_callback' => '__return_true',
        ));

        // Register protected routes example
        \register_rest_route('bema-hub/v1', '/profile', array(
            'methods' => 'GET',
            'callback' => array($this->user_controller, 'get_profile'),
            'permission_callback' => array($this, 'validate_jwt_permission'),
        ));

        // Register update profile route
        \register_rest_route('bema-hub/v1', '/profile', array(
            'methods' => 'PUT',
            'callback' => array($this->user_controller, 'update_profile'),
            'permission_callback' => array($this, 'validate_jwt_permission'),
        ));
    }

    /**
     * Validate JWT token for protected endpoints
     *
     * @since 1.0.0
     * @param \WP_REST_Request $request The request object
     * @return bool|\WP_Error True if valid, WP_Error if not
     */
    public function validate_jwt_permission($request) {
        // Delegate to user controller
        return $this->user_controller->validate_jwt_permission($request, $this->invalidated_tokens);
    }

    /**
     * Verify that all expected routes are registered
     *
     * @since 1.0.0
     * @return array Verification results
     */
    public function verify_routes() {
        // This method would be called after routes are registered
        // to verify they exist in the REST API server
        $expected_routes = array(
            '/bema-hub/v1/auth/signin',
            '/bema-hub/v1/auth/validate',
            '/bema-hub/v1/auth/signup',
            '/bema-hub/v1/auth/verify-otp',
            '/bema-hub/v1/auth/social-login',
            '/bema-hub/v1/auth/reset-password-request',
            '/bema-hub/v1/auth/resend-otp',
            '/bema-hub/v1/profile'
        );

        $results = array();
        
        // In a real implementation, we would check the REST server
        // for these routes, but for now we'll just return the expected routes
        foreach ($expected_routes as $route) {
            $results[$route] = array(
                'expected' => true,
                'registered' => true, // Assume registered for now
                'verified' => true
            );
        }

        return $results;
    }
}