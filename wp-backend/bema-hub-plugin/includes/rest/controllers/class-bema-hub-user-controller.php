<?php
namespace Bema_Hub\REST\Controllers;

/**
 * User Controller for Bema Hub plugin
 *
 * Handles user management endpoints
 *
 * @since      1.0.0
 * @package    Bema_Hub
 * @subpackage Bema_Hub/includes/rest/controllers
 */
class Bema_Hub_User_Controller {

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
     * Array to store invalidated tokens (in production, this should be stored in database)
     *
     * @since    1.0.0
     * @access   private
     * @var      array    $invalidated_tokens    List of invalidated tokens.
     */
    private $invalidated_tokens = array();

    /**
     * Initialize the controller and set its properties.
     *
     * @since    1.0.0
     * @param    Bema_Hub_Logger       $logger    Logger instance.
     * @param    Bema_Hub_JWT_Auth     $jwt_auth  JWT Auth instance.
     */
    public function __construct($logger, $jwt_auth) {
        $this->logger = $logger;
        $this->jwt_auth = $jwt_auth;
        
        // Load invalidated tokens from database
        $this->invalidated_tokens = \get_option('bema_hub_invalidated_tokens', array());
        
        // Register shutdown hook to save invalidated tokens
        \add_action('shutdown', array($this, 'save_invalidated_tokens'));
    }

    /**
     * Set invalidated tokens (injected from main REST API class)
     *
     * @since 1.0.0
     * @param array $tokens Invalidated tokens array
     */
    public function set_invalidated_tokens($tokens) {
        $this->invalidated_tokens = $tokens;
    }

    /**
     * Get invalidated tokens
     *
     * @since 1.0.0
     * @return array Invalidated tokens array
     */
    public function get_invalidated_tokens() {
        return $this->invalidated_tokens;
    }

    /**
     * Save invalidated tokens to database
     *
     * @since 1.0.0
     */
    public function save_invalidated_tokens() {
        \update_option('bema_hub_invalidated_tokens', $this->invalidated_tokens, false);
        
        if ($this->logger) {
            $this->logger->info('Invalidated tokens saved to database', array('count' => count($this->invalidated_tokens)));
        }
    }

    /**
     * Handle user signout
     *
     * @since 1.0.0
     * @param \WP_REST_Request $request The request object
     * @return \WP_REST_Response|\WP_Error The response or error
     */
    public function signout($request) {
        // The user ID is added to the request by the permission callback
        $user_id = $request->get_param('user_id');

        // Get user data for logging
        $user = \get_user_by('ID', $user_id);
        if (!$user) {
            if ($this->logger) {
                $this->logger->warning('Signout attempt for non-existent user', array('user_id' => $user_id));
            }
            return new \WP_Error('user_not_found', 'User not found', array('status' => 404));
        }

        // Get the token from the authorization header
        $auth_header = $request->get_header('authorization');
        $token = \substr($auth_header, 7); // Remove 'Bearer ' prefix

        // Add token to invalidated tokens list
        $this->invalidated_tokens[] = $token;
        
        if ($this->logger) {
            $this->logger->info('Token invalidated during signout', array('user_id' => $user_id, 'token' => substr($token, 0, 10) . '...'));
        }

        // Update last signout time
        \update_user_meta($user_id, 'bema_last_signout', \time());

        if ($this->logger) {
            $this->logger->info('User signout successful', array('user_id' => $user_id, 'user_email' => $user->user_email));
        }

        return new \WP_REST_Response(array(
            'success' => true,
            'message' => 'Successfully signed out'
        ), 200);
    }

    /**
     * Validate a JWT token
     *
     * @since 1.0.0
     * @param \WP_REST_Request $request The request object
     * @return \WP_REST_Response|\WP_Error The response or error
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
                $this->logger->warning('Token validation failed', array(
                    'error_code' => $result->get_error_code(),
                    'error_message' => $result->get_error_message()
                ));
            }
            return $result;
        }

        if ($this->logger) {
            $this->logger->info('Token validation successful', array('user_id' => $result['data']['user_id']));
        }

        return new \WP_REST_Response(array(
            'valid' => true,
            'data' => $result['data']
        ), 200);
    }

    /**
     * Get user profile (protected endpoint example)
     *
     * @since 1.0.0
     * @param \WP_REST_Request $request The request object
     * @return \WP_REST_Response|\WP_Error The response or error
     */
    public function get_profile($request) {
        // The user ID is added to the request by the permission callback
        $user_id = $request->get_param('user_id');

        $user = \get_user_by('ID', $user_id);
        if (!$user) {
            return new \WP_Error('user_not_found', 'User not found', array('status' => 404));
        }

        $profile = array(
            'id' => $user->ID,
            'username' => $user->user_login,
            'email' => $user->user_email,
            'display_name' => $user->display_name,
            'first_name' => $user->first_name,
            'last_name' => $user->last_name,
        );

        return new \WP_REST_Response($profile, 200);
    }

    /**
     * Validate JWT token for protected endpoints
     *
     * @since 1.0.0
     * @param \WP_REST_Request $request The request object
     * @return bool|\WP_Error True if valid, WP_Error if not
     */
    public function validate_jwt_permission($request, $invalidated_tokens) {
        $auth_header = $request->get_header('authorization');
        
        if (!$auth_header) {
            return new \WP_Error('missing_auth_header', 'Authorization header is required', array('status' => 401));
        }

        // Check if it's a Bearer token
        if (\strpos($auth_header, 'Bearer ') !== 0) {
            return new \WP_Error('invalid_auth_header', 'Invalid authorization header format', array('status' => 401));
        }

        $token = \substr($auth_header, 7); // Remove 'Bearer ' prefix

        // Check if token is in invalidated list
        if (in_array($token, $invalidated_tokens)) {
            if ($this->logger) {
                $this->logger->warning('Token validation failed: Token has been invalidated', array('token' => substr($token, 0, 10) . '...'));
            }
            return new \WP_Error('token_invalidated', 'Token has been invalidated', array('status' => 401));
        }

        $result = $this->jwt_auth->validate_token($token);

        if (\is_wp_error($result)) {
            return $result;
        }

        // Add user ID to request for use in callback
        $request->set_param('user_id', $result['data']['user_id']);

        return true;
    }
}