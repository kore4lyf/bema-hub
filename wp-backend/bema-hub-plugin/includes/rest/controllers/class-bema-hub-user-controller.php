<?php
namespace Bema_Hub\REST\Controllers;

/**
 * User Controller for Bema Hub plugin
 *
 * Handles user-related endpoints
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
     * Invalidated tokens array.
     *
     * @since    1.0.0
     * @access   private
     * @var      array    $invalidated_tokens    Invalidated tokens.
     */
    private $invalidated_tokens;

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
        $this->invalidated_tokens = array();
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

        // Get email verification status
        $email_verified = (bool) \get_user_meta($result['data']['user_id'], 'bema_email_verified', true);
        
        // Get referred by field
        $referred_by = \get_user_meta($result['data']['user_id'], 'bema_referred_by', true);
        
        // Add email verification status and referred by to the response data
        $result['data']['bema_email_verified'] = $email_verified;
        $result['data']['bema_referred_by'] = $referred_by;
        
        // Get user roles
        $user = \get_user_by('ID', $result['data']['user_id']);
        if ($user) {
            $result['data']['roles'] = $user->roles;
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

        // Get user avatar HTML
        $avatar_html = \get_avatar($user_id, 96);
        
        // Extract avatar URL from the HTML
        $avatar_url = '';
        if (preg_match('/src=["\']([^"\']+)["\']/', $avatar_html, $matches)) {
            $avatar_url = $matches[1];
        }

        // Get all custom user meta fields
        $profile = array(
            'id' => $user->ID,
            'username' => $user->user_login,
            'email' => $user->user_email,
            'display_name' => $user->display_name,
            'first_name' => $user->first_name,
            'last_name' => $user->last_name,
            'avatar_url' => $avatar_url,
            // Custom user meta fields
            'bema_phone_number' => \get_user_meta($user_id, 'bema_phone_number', true),
            'bema_country' => \get_user_meta($user_id, 'bema_country', true),
            'bema_state' => \get_user_meta($user_id, 'bema_state', true),
            'bema_referred_by' => \get_user_meta($user_id, 'bema_referred_by', true),
            'bema_tier_level' => \get_user_meta($user_id, 'bema_tier_level', true),
            'bema_account_type' => \get_user_meta($user_id, 'bema_account_type', true),
            'bema_email_verified' => (bool) \get_user_meta($user_id, 'bema_email_verified', true),
            'bema_phone_verified' => (bool) \get_user_meta($user_id, 'bema_phone_verified', true),
            'bema_fraud_flag' => (bool) \get_user_meta($user_id, 'bema_fraud_flag', true),
            'bema_device_id' => \get_user_meta($user_id, 'bema_device_id', true),
            'bema_last_signin' => (int) \get_user_meta($user_id, 'bema_last_signin', true),
            'bema_last_signout' => (int) \get_user_meta($user_id, 'bema_last_signout', true),
            'bema_google_id' => \get_user_meta($user_id, 'bema_google_id', true),
            'bema_facebook_id' => \get_user_meta($user_id, 'bema_facebook_id', true),
            'bema_twitter_id' => \get_user_meta($user_id, 'bema_twitter_id', true),
            // User roles (not updateable)
            'roles' => $user->roles
        );

        return new \WP_REST_Response($profile, 200);
    }

    /**
     * Update user profile
     *
     * @since 1.0.0
     * @param \WP_REST_Request $request The request object
     * @return \WP_REST_Response|\WP_Error The response or error
     */
    public function update_profile($request) {
        // The user ID is added to the request by the permission callback
        $user_id = $request->get_param('user_id');

        $user = \get_user_by('ID', $user_id);
        if (!$user) {
            return new \WP_Error('user_not_found', 'User not found', array('status' => 404));
        }

        // Update user meta fields if provided (excluding bema_referred_by and roles which are immutable)
        $updatable_fields = array(
            'bema_phone_number',
            'bema_country',
            'bema_state',
            'bema_tier_level',
            'bema_account_type',
            'bema_email_verified',
            'bema_phone_verified',
            'bema_fraud_flag',
            'bema_device_id',
            'bema_last_signin',
            'bema_last_signout',
            'bema_google_id',
            'bema_facebook_id',
            'bema_twitter_id'
        );

        foreach ($updatable_fields as $field) {
            $value = $request->get_param($field);
            if ($value !== null) {
                \update_user_meta($user_id, $field, $value);
            }
        }

        // Update WordPress user fields if provided
        $wp_fields = array(
            'first_name',
            'last_name',
            'display_name'
        );

        $userdata = array('ID' => $user_id);
        $updated = false;

        foreach ($wp_fields as $field) {
            $value = $request->get_param($field);
            if ($value !== null) {
                $userdata[$field] = $value;
                $updated = true;
            }
        }

        if ($updated) {
            $result = \wp_update_user($userdata);
            if (\is_wp_error($result)) {
                return $result;
            }
        }

        // Return updated profile
        return $this->get_profile($request);
    }

    /**
     * Validate JWT token for protected endpoints
     *
     * @since 1.0.0
     * @param \WP_REST_Request $request The request object
     * @return bool|\WP_Error True if valid, WP_Error if not
     */
    public function validate_jwt_permission($request) {
        // Get invalidated tokens from the main REST API class
        // This is a workaround since we can't directly access the main class here
        $invalidated_tokens = \get_option('bema_hub_invalidated_tokens', array());

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
    
    /**
     * Get invalidated tokens
     *
     * @since 1.0.0
     * @return array The invalidated tokens
     */
    public function get_invalidated_tokens() {
        return $this->invalidated_tokens;
    }
    
    /**
     * Set invalidated tokens
     *
     * @since 1.0.0
     * @param array $tokens The invalidated tokens
     */
    public function set_invalidated_tokens($tokens) {
        $this->invalidated_tokens = $tokens;
    }
}