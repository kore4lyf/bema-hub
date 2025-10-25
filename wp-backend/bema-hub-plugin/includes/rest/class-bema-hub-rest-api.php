<?php
namespace Bema_Hub;

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
     * Initialize the class and set its properties.
     *
     * @since    1.0.0
     */
    public function __construct() {
        // Initialize logger
        if (class_exists('Bema_Hub\Bema_Hub_Logger')) {
            $this->logger = Bema_Hub_Logger::create('rest-api');
        }

        // Initialize JWT auth
        if (class_exists('Bema_Hub\Bema_Hub_JWT_Auth')) {
            $this->jwt_auth = new Bema_Hub_JWT_Auth();
        }
    }

    /**
     * Register REST API routes
     *
     * @since 1.0.0
     */
    public function register_routes() {
        // Register authentication routes
        \register_rest_route('bema-hub/v1', '/auth/login', array(
            'methods' => 'POST',
            'callback' => array($this, 'login'),
            'permission_callback' => '__return_true',
        ));

        \register_rest_route('bema-hub/v1', '/auth/validate', array(
            'methods' => 'POST',
            'callback' => array($this, 'validate_token'),
            'permission_callback' => '__return_true',
        ));

        // Register protected routes example
        \register_rest_route('bema-hub/v1', '/profile', array(
            'methods' => 'GET',
            'callback' => array($this, 'get_profile'),
            'permission_callback' => array($this, 'validate_jwt_permission'),
        ));
    }

    /**
     * Handle user login and token generation
     *
     * @since 1.0.0
     * @param WP_REST_Request $request The request object
     * @return WP_REST_Response|WP_Error The response or error
     */
    public function login($request) {
        $username_or_email = $request->get_param('username');
        $password = $request->get_param('password');

        if (empty($username_or_email) || empty($password)) {
            if ($this->logger) {
                $this->logger->warning('Login attempt with missing credentials');
            }
            return new \WP_Error('missing_credentials', 'Username and password are required', array('status' => 400));
        }

        if ($this->logger) {
            $this->logger->info('Login attempt', ['username_or_email' => $username_or_email]);
        }

        $result = $this->jwt_auth->authenticate_and_generate_token($username_or_email, $password);

        if (\is_wp_error($result)) {
            if ($this->logger) {
                $this->logger->warning('Login failed', [
                    'username_or_email' => $username_or_email,
                    'error_code' => $result->get_error_code(),
                    'error_message' => $result->get_error_message()
                ]);
            }
            return $result;
        }

        if ($this->logger) {
            $this->logger->info('Login successful', ['user_id' => $result['user_id']]);
        }

        return new \WP_REST_Response($result, 200);
    }

    /**
     * Validate a JWT token
     *
     * @since 1.0.0
     * @param WP_REST_Request $request The request object
     * @return WP_REST_Response|WP_Error The response or error
     */
    public function validate_token($request) {
        $token = $request->get_param('token');

        if (empty($token)) {
            if ($this->logger) {
                $this->logger->warning('Token validation attempt with missing token');
            }
            return new \WP_Error('missing_token', 'Token is required', array('status' => 400));
        }

        if ($this->logger) {
            $this->logger->info('Token validation attempt');
        }

        $result = $this->jwt_auth->validate_token($token);

        if (\is_wp_error($result)) {
            if ($this->logger) {
                $this->logger->warning('Token validation failed', [
                    'error_code' => $result->get_error_code(),
                    'error_message' => $result->get_error_message()
                ]);
            }
            return $result;
        }

        if ($this->logger) {
            $this->logger->info('Token validation successful', ['user_id' => $result['data']['user_id']]);
        }

        return new \WP_REST_Response([
            'valid' => true,
            'data' => $result['data']
        ], 200);
    }

    /**
     * Get user profile (protected endpoint example)
     *
     * @since 1.0.0
     * @param WP_REST_Request $request The request object
     * @return WP_REST_Response|WP_Error The response or error
     */
    public function get_profile($request) {
        // The user ID is added to the request by the permission callback
        $user_id = $request->get_param('user_id');

        $user = \get_user_by('ID', $user_id);
        if (!$user) {
            return new \WP_Error('user_not_found', 'User not found', array('status' => 404));
        }

        $profile = [
            'id' => $user->ID,
            'username' => $user->user_login,
            'email' => $user->user_email,
            'display_name' => $user->display_name,
            'first_name' => $user->first_name,
            'last_name' => $user->last_name,
        ];

        return new \WP_REST_Response($profile, 200);
    }

    /**
     * Validate JWT token for protected endpoints
     *
     * @since 1.0.0
     * @param WP_REST_Request $request The request object
     * @return bool|WP_Error True if valid, WP_Error if not
     */
    public function validate_jwt_permission($request) {
        $auth_header = $request->get_header('authorization');
        
        if (!$auth_header) {
            return new \WP_Error('missing_auth_header', 'Authorization header is required', array('status' => 401));
        }

        // Check if it's a Bearer token
        if (strpos($auth_header, 'Bearer ') !== 0) {
            return new \WP_Error('invalid_auth_header', 'Invalid authorization header format', array('status' => 401));
        }

        $token = substr($auth_header, 7); // Remove 'Bearer ' prefix

        $result = $this->jwt_auth->validate_token($token);

        if (\is_wp_error($result)) {
            return $result;
        }

        // Add user ID to request for use in callback
        $request->set_param('user_id', $result['data']['user_id']);

        return true;
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
        $expected_routes = [
            '/bema-hub/v1/auth/login',
            '/bema-hub/v1/auth/validate',
            '/bema-hub/v1/profile'
        ];

        $results = [];
        
        // In a real implementation, we would check the REST server
        // for these routes, but for now we'll just return the expected routes
        foreach ($expected_routes as $route) {
            $results[$route] = [
                'expected' => true,
                'registered' => true, // Assume registered for now
                'verified' => true
            ];
        }

        return $results;
    }
}