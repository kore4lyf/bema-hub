<?php
namespace Bema_Hub\REST\Controllers;

/**
 * Authentication Controller for Bema Hub plugin
 *
 * Handles user authentication endpoints
 *
 * @since      1.0.0
 * @package    Bema_Hub
 * @subpackage Bema_Hub/includes/rest/controllers
 */
class Bema_Hub_Auth_Controller {

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
     * Initialize the controller and set its properties.
     *
     * @since    1.0.0
     * @param    Bema_Hub_Logger       $logger    Logger instance.
     * @param    Bema_Hub_JWT_Auth     $jwt_auth  JWT Auth instance.
     */
    public function __construct($logger, $jwt_auth) {
        $this->logger = $logger;
        $this->jwt_auth = $jwt_auth;
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
        $state = $request->get_param('state');
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
        
        if ($state) {
            \update_user_meta($user_id, 'bema_state', $state);
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
        
        // Generate and send OTP for email verification (reusing existing OTP fields)
        $otp_code = \rand(100000, 999999);
        $otp_expiry = \time() + 600; // 10 minutes expiry (increased from 5 minutes)
        
        // Hash OTP before storing using SHA256
        $hashed_otp = \hash('sha256', $otp_code);
        \update_user_meta($user_id, 'bema_otp_code', $hashed_otp);
        \update_user_meta($user_id, 'bema_otp_expiry', $otp_expiry);
        \update_user_meta($user_id, 'bema_otp_purpose', 'email_verification'); // Track purpose
        
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
        $state = $request->get_param('state');

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
                
                if ($state) {
                    \update_user_meta($user_id, 'bema_state', $state);
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
}