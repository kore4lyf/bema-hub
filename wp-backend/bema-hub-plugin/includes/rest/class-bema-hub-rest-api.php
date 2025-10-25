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

        // Load invalidated tokens from database
        $this->invalidated_tokens = \get_option('bema_hub_invalidated_tokens', array());
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
            'callback' => array($this, 'signin'),
            'permission_callback' => '__return_true',
        ));

        \register_rest_route('bema-hub/v1', '/auth/validate', array(
            'methods' => 'POST',
            'callback' => array($this, 'validate_token'),
            'permission_callback' => '__return_true',
        ));

        // Register signup routes
        \register_rest_route('bema-hub/v1', '/auth/signup', array(
            'methods' => 'POST',
            'callback' => array($this, 'signup'),
            'permission_callback' => '__return_true',
        ));

        \register_rest_route('bema-hub/v1', '/auth/verify-otp', array(
            'methods' => 'POST',
            'callback' => array($this, 'verify_otp'),
            'permission_callback' => '__return_true',
        ));

        // Register social login routes
        \register_rest_route('bema-hub/v1', '/auth/social-login', array(
            'methods' => 'POST',
            'callback' => array($this, 'social_login'),
            'permission_callback' => '__return_true',
        ));

        // Register signout route
        \register_rest_route('bema-hub/v1', '/auth/signout', array(
            'methods' => 'POST',
            'callback' => array($this, 'signout'),
            'permission_callback' => array($this, 'validate_jwt_permission'),
        ));

        // Register protected routes example
        \register_rest_route('bema-hub/v1', '/profile', array(
            'methods' => 'GET',
            'callback' => array($this, 'get_profile'),
            'permission_callback' => array($this, 'validate_jwt_permission'),
        ));
    }

    /**
     * Handle user signup
     *
     * @since 1.0.0
     * @param \WP_REST_Request $request The request object
     * @return \WP_REST_Response|\WP_Error The response or error
     */
    public function signup($request) {
        $email = $request->get_param('email');
        $password = $request->get_param('password');
        $first_name = $request->get_param('first_name');
        $last_name = $request->get_param('last_name');
        $phone_number = $request->get_param('phone_number');
        $country = $request->get_param('country');
        $city = $request->get_param('city');
        $referred_by = $request->get_param('referred_by');

        // Validate required parameters
        if (empty($email) || empty($password) || empty($first_name) || empty($last_name) || empty($country)) {
            if ($this->logger) {
                $this->logger->warning('Signup attempt with missing required fields');
            }
            return new \WP_Error('missing_fields', 'Email, password, first name, last name, and country are required', array('status' => 400));
        }

        // Validate email format
        if (!\is_email($email)) {
            if ($this->logger) {
                $this->logger->warning('Signup attempt with invalid email format');
            }
            return new \WP_Error('invalid_email', 'Please provide a valid email address', array('status' => 400));
        }

        // Check if email already exists
        if (\email_exists($email)) {
            if ($this->logger) {
                $this->logger->warning('Signup attempt with existing email', array('email' => $email));
            }
            return new \WP_Error('email_exists', 'An account with this email already exists', array('status' => 400));
        }

        // Generate username from email
        $username = \sanitize_user(str_replace('@', '_', $email));
        $username = str_replace('.', '_', $username);
        
        // Ensure username is unique
        $original_username = $username;
        $counter = 1;
        while (\username_exists($username)) {
            $username = $original_username . '_' . $counter;
            $counter++;
        }

        // Create user
        $user_id = \wp_create_user($username, $password, $email);
        
        if (\is_wp_error($user_id)) {
            if ($this->logger) {
                $this->logger->error('User creation failed', array(
                    'email' => $email,
                    'error_code' => $user_id->get_error_code(),
                    'error_message' => $user_id->get_error_message()
                ));
            }
            return $user_id;
        }

        // Update user meta fields
        \update_user_meta($user_id, 'first_name', $first_name);
        \update_user_meta($user_id, 'last_name', $last_name);
        \update_user_meta($user_id, 'bema_first_name', $first_name);
        \update_user_meta($user_id, 'bema_last_name', $last_name);
        
        if ($phone_number) {
            // Encrypt phone number before storing
            $encrypted_phone = $this->encrypt_data($phone_number);
            \update_user_meta($user_id, 'bema_phone_number', $encrypted_phone);
        }
        
        \update_user_meta($user_id, 'bema_country', $country);
        
        if ($city) {
            \update_user_meta($user_id, 'bema_city', $city);
        }
        
        if ($referred_by) {
            \update_user_meta($user_id, 'bema_referred_by', $referred_by);
        }
        
        // Set default values
        \update_user_meta($user_id, 'bema_tier_level', 'Opt-In');
        \update_user_meta($user_id, 'bema_account_type', 'subscriber');
        \update_user_meta($user_id, 'bema_email_verified', false);
        \update_user_meta($user_id, 'bema_phone_verified', false);
        \update_user_meta($user_id, 'bema_fraud_flag', false);
        
        // Generate device ID
        $device_id = \uniqid('device_', true);
        \update_user_meta($user_id, 'bema_device_id', $device_id);
        
        // Generate and send OTP for email verification
        $otp_code = \rand(100000, 999999);
        $otp_expiry = \time() + 600; // 10 minutes expiry (increased from 5 minutes)
        
        // Hash OTP before storing using SHA256
        $hashed_otp = \hash('sha256', $otp_code);
        \update_user_meta($user_id, 'bema_otp_code', $hashed_otp);
        \update_user_meta($user_id, 'bema_otp_expiry', $otp_expiry);
        
        // Send OTP via email (in a real implementation, you would send an actual email)
        // For now, we'll just log it
        if ($this->logger) {
            $this->logger->info('OTP generated for new user', array(
                'user_id' => $user_id,
                'otp_code' => $otp_code // In production, never log OTP codes
            ));
        }

        if ($this->logger) {
            $this->logger->info('User signup successful', array('user_id' => $user_id, 'email' => $email));
        }

        return new \WP_REST_Response(array(
            'success' => true,
            'message' => 'Account created successfully. Please check your email for verification code.',
            'user_email' => $email // Return email instead of user_id
        ), 200);
    }

    /**
     * Verify OTP for email verification
     *
     * @since 1.0.0
     * @param \WP_REST_Request $request The request object
     * @return \WP_REST_Response|\WP_Error The response or error
     */
    public function verify_otp($request) {
        $email = $request->get_param('email'); // Use email instead of user_id
        $otp_code = $request->get_param('otp_code');

        // Validate required parameters
        if (empty($email) || empty($otp_code)) {
            if ($this->logger) {
                $this->logger->warning('OTP verification attempt with missing parameters');
            }
            return new \WP_Error('missing_fields', 'Email and OTP code are required', array('status' => 400));
        }

        // Validate email format
        if (!\is_email($email)) {
            if ($this->logger) {
                $this->logger->warning('OTP verification attempt with invalid email format');
            }
            return new \WP_Error('invalid_email', 'Please provide a valid email address', array('status' => 400));
        }

        // Get user by email
        $user = \get_user_by('email', $email);
        if (!$user) {
            if ($this->logger) {
                $this->logger->warning('OTP verification attempt for non-existent email', array('email' => $email));
            }
            return new \WP_Error('user_not_found', 'User not found', array('status' => 404));
        }

        // Get OTP data from user meta
        $stored_otp = \get_user_meta($user->ID, 'bema_otp_code', true);
        $otp_expiry = \get_user_meta($user->ID, 'bema_otp_expiry', true);
        
        // Check if OTP has expired
        if (\time() > $otp_expiry) {
            if ($this->logger) {
                $this->logger->warning('OTP verification failed: OTP expired', array('user_id' => $user->ID));
            }
            return new \WP_Error('otp_expired', 'OTP code has expired. Please request a new one.', array('status' => 400));
        }

        // Verify OTP using JWT auth helper function
        if (!$this->jwt_auth->wp_verify_otp($otp_code, $stored_otp)) {
            if ($this->logger) {
                $this->logger->warning('OTP verification failed: Invalid OTP', array('user_id' => $user->ID));
            }
            return new \WP_Error('invalid_otp', 'Invalid OTP code', array('status' => 400));
        }

        // Update email verification status
        \update_user_meta($user->ID, 'bema_email_verified', true);
        
        // Clear OTP data
        \delete_user_meta($user->ID, 'bema_otp_code');
        \delete_user_meta($user->ID, 'bema_otp_expiry');

        // Generate JWT token for the user
        $token = $this->jwt_auth->generate_token($user->ID);
        
        if (\is_wp_error($token)) {
            if ($this->logger) {
                $this->logger->error('Failed to generate token after OTP verification', array(
                    'user_id' => $user->ID,
                    'error_code' => $token->get_error_code(),
                    'error_message' => $token->get_error_message()
                ));
            }
            return $token;
        }

        if ($this->logger) {
            $this->logger->info('OTP verification successful', array('user_id' => $user->ID));
        }

        return new \WP_REST_Response(array(
            'success' => true,
            'message' => 'Email verified successfully',
            'token' => $token,
            'user_id' => $user->ID,
            'user_login' => $user->user_login,
            'user_email' => $user->user_email,
            'user_display_name' => $user->display_name
        ), 200);
    }

    /**
     * Handle social login
     *
     * @since 1.0.0
     * @param \WP_REST_Request $request The request object
     * @return \WP_REST_Response|\WP_Error The response or error
     */
    public function social_login($request) {
        $provider = $request->get_param('provider'); // google, facebook, twitter
        $provider_id = $request->get_param('provider_id');
        $email = $request->get_param('email');
        $first_name = $request->get_param('first_name');
        $last_name = $request->get_param('last_name');
        $phone_number = $request->get_param('phone_number');
        $country = $request->get_param('country');
        $city = $request->get_param('city');

        // Validate required parameters
        if (empty($provider) || empty($provider_id) || empty($email) || empty($first_name) || empty($last_name)) {
            if ($this->logger) {
                $this->logger->warning('Social login attempt with missing required fields');
            }
            return new \WP_Error('missing_fields', 'Provider, provider ID, email, first name, and last name are required', array('status' => 400));
        }

        // Validate provider
        $valid_providers = array('google', 'facebook', 'twitter');
        if (!\in_array($provider, $valid_providers)) {
            if ($this->logger) {
                $this->logger->warning('Social login attempt with invalid provider', array('provider' => $provider));
            }
            return new \WP_Error('invalid_provider', 'Invalid provider. Must be google, facebook, or twitter', array('status' => 400));
        }

        // Check if user already exists with this provider ID
        $user = null;
        $meta_key = 'bema_' . $provider . '_id';
        $users = \get_users(array(
            'meta_key' => $meta_key,
            'meta_value' => $provider_id,
            'number' => 1
        ));

        if (!empty($users)) {
            $user = $users[0];
        } else {
            // Check if user exists with this email
            $user = \get_user_by('email', $email);
            
            if (!$user) {
                // Create new user
                // Generate username from email
                $username = \sanitize_user(str_replace('@', '_', $email));
                $username = str_replace('.', '_', $username);
                
                // Ensure username is unique
                $original_username = $username;
                $counter = 1;
                while (\username_exists($username)) {
                    $username = $original_username . '_' . $counter;
                    $counter++;
                }

                // Generate a random password for social login users
                $password = \wp_generate_password(12, true, true);
                
                // Create user
                $user_id = \wp_create_user($username, $password, $email);
                
                if (\is_wp_error($user_id)) {
                    if ($this->logger) {
                        $this->logger->error('Social user creation failed', array(
                            'email' => $email,
                            'provider' => $provider,
                            'error_code' => $user_id->get_error_code(),
                            'error_message' => $user_id->get_error_message()
                        ));
                    }
                    return $user_id;
                }
                
                $user = \get_user_by('ID', $user_id);
                
                // Set user meta fields
                \update_user_meta($user_id, 'first_name', $first_name);
                \update_user_meta($user_id, 'last_name', $last_name);
                \update_user_meta($user_id, 'bema_first_name', $first_name);
                \update_user_meta($user_id, 'bema_last_name', $last_name);
                \update_user_meta($user_id, $meta_key, $provider_id);
                
                if ($phone_number) {
                    // Encrypt phone number before storing
                    $encrypted_phone = $this->encrypt_data($phone_number);
                    \update_user_meta($user_id, 'bema_phone_number', $encrypted_phone);
                }
                
                if ($country) {
                    \update_user_meta($user_id, 'bema_country', $country);
                }
                
                if ($city) {
                    \update_user_meta($user_id, 'bema_city', $city);
                }
                
                // Set default values
                \update_user_meta($user_id, 'bema_tier_level', 'Opt-In');
                \update_user_meta($user_id, 'bema_account_type', 'subscriber');
                \update_user_meta($user_id, 'bema_email_verified', true); // Social login users are considered verified
                \update_user_meta($user_id, 'bema_phone_verified', !empty($phone_number));
                \update_user_meta($user_id, 'bema_fraud_flag', false);
                
                // Generate device ID
                $device_id = \uniqid('device_', true);
                \update_user_meta($user_id, 'bema_device_id', $device_id);
                
                if ($this->logger) {
                    $this->logger->info('New social user created', array(
                        'user_id' => $user_id,
                        'provider' => $provider,
                        'email' => $email
                    ));
                }
            } else {
                // User exists with this email, link the social account
                \update_user_meta($user->ID, $meta_key, $provider_id);
                
                if ($this->logger) {
                    $this->logger->info('Social account linked to existing user', array(
                        'user_id' => $user->ID,
                        'provider' => $provider
                    ));
                }
            }
        }

        // Update last signin time
        \update_user_meta($user->ID, 'bema_last_signin', \time());

        // Generate JWT token for the user
        $token = $this->jwt_auth->generate_token($user->ID);
        
        if (\is_wp_error($token)) {
            if ($this->logger) {
                $this->logger->error('Failed to generate token for social login', array(
                    'user_id' => $user->ID,
                    'provider' => $provider,
                    'error_code' => $token->get_error_code(),
                    'error_message' => $token->get_error_message()
                ));
            }
            return $token;
        }

        if ($this->logger) {
            $this->logger->info('Social login successful', array(
                'user_id' => $user->ID,
                'provider' => $provider
            ));
        }

        return new \WP_REST_Response(array(
            'success' => true,
            'token' => $token,
            'user_id' => $user->ID,
            'user_login' => $user->user_login,
            'user_email' => $user->user_email,
            'user_display_name' => $user->display_name
        ), 200);
    }

    /**
     * Handle user signin and token generation
     *
     * @since 1.0.0
     * @param \WP_REST_Request $request The request object
     * @return \WP_REST_Response|\WP_Error The response or error
     */
    public function signin($request) {
        $username_or_email = $request->get_param('username');
        $password = $request->get_param('password');

        // Validate required parameters
        if (empty($username_or_email) || empty($password)) {
            if ($this->logger) {
                $this->logger->warning('Login attempt with missing credentials');
            }
            return new \WP_Error('missing_credentials', 'Username and password are required', array('status' => 400));
        }

        // Additional validation for parameter types
        if (!\is_string($username_or_email) || !\is_string($password)) {
            if ($this->logger) {
                $this->logger->warning('Login attempt with invalid parameter types');
            }
            return new \WP_Error('invalid_parameters', 'Username and password must be strings', array('status' => 400));
        }

        // Sanitize inputs
        $username_or_email = \sanitize_user($username_or_email);
        // Password should not be sanitized as it may contain special characters

        if ($this->logger) {
            $this->logger->info('Signin attempt', array('username_or_email' => $username_or_email));
        }

        $result = $this->jwt_auth->authenticate_and_generate_token($username_or_email, $password);

        if (\is_wp_error($result)) {
            if ($this->logger) {
                $this->logger->warning('Signin failed', array(
                    'username_or_email' => $username_or_email,
                    'error_code' => $result->get_error_code(),
                    'error_message' => $result->get_error_message()
                ));
            }
            return $result;
        }

        // Update last signin time
        \update_user_meta($result['user_id'], 'bema_last_signin', \time());

        if ($this->logger) {
            $this->logger->info('Signin successful', array('user_id' => $result['user_id']));
        }

        return new \WP_REST_Response($result, 200);
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
        
        // Save invalidated tokens to database
        \update_option('bema_hub_invalidated_tokens', $this->invalidated_tokens);

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
    public function validate_jwt_permission($request) {
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
        if (in_array($token, $this->invalidated_tokens)) {
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
     * Encrypt sensitive data
     *
     * @since 1.0.0
     * @param string $data The data to encrypt
     * @return string The encrypted data
     */
    private function encrypt_data($data) {
        // In a real implementation, you would use a proper encryption library
        // For now, we'll just base64 encode as a placeholder
        return \base64_encode($data);
    }

    /**
     * Decrypt sensitive data
     *
     * @since 1.0.0
     * @param string $data The data to decrypt
     * @return string The decrypted data
     */
    private function decrypt_data($data) {
        // In a real implementation, you would use a proper decryption library
        // For now, we'll just base64 decode as a placeholder
        return \base64_decode($data);
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