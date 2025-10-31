<?php
namespace Bema_Hub\REST\Controllers;

/**
 * OTP Controller for Bema Hub plugin
 *
 * Handles OTP-related endpoints
 *
 * @since      1.0.0
 * @package    Bema_Hub
 * @subpackage Bema_Hub/includes/rest/controllers
 */
class Bema_Hub_OTP_Controller {

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
     * Maximum OTP requests allowed per 24 hours
     *
     * @since    1.0.0
     * @access   private
     * @var      int    $max_otp_requests    Maximum OTP requests per 24 hours.
     */
    private $max_otp_requests = 10;

    /**
     * Maximum password reset requests allowed per 24 hours
     *
     * @since    1.0.0
     * @access   private
     * @var      int    $max_password_reset_requests    Maximum password reset requests per 24 hours.
     */
    private $max_password_reset_requests = 5;

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
     * Check if user can request OTP based on rate limiting
     *
     * @since 1.0.0
     * @param int $user_id The user ID
     * @return bool|\WP_Error True if user can request OTP, WP_Error if rate limited
     */
    private function can_request_otp($user_id) {
        // Get the email OTP daily limit from settings
        $settings = \get_option('bema_hub_otp_settings', array());
        $max_requests = isset($settings['email_otp_daily_limit']) ? (int) $settings['email_otp_daily_limit'] : $this->max_otp_requests;
        
        // Get OTP request count and last successful request timestamp
        $request_count = (int) \get_user_meta($user_id, 'bema_email_otp_request_count', true);
        $last_request_timestamp = (int) \get_user_meta($user_id, 'bema_last_successful_email_otp_request', true);
        
        // Check if 24 hours have passed since last successful request
        $time_since_last_request = \time() - $last_request_timestamp;
        $twenty_four_hours = 24 * 60 * 60; // 86400 seconds
        
        if ($time_since_last_request >= $twenty_four_hours) {
            // Reset count if 24 hours have passed
            $request_count = 0;
            \update_user_meta($user_id, 'bema_email_otp_request_count', $request_count);
        }
        
        // Check if user has reached the maximum request limit
        if ($request_count >= $max_requests) {
            $seconds_remaining = $twenty_four_hours - $time_since_last_request;
            
            // Format time remaining in a human-readable way
            $hours = floor($seconds_remaining / 3600);
            $minutes = floor(($seconds_remaining % 3600) / 60);
            $seconds = $seconds_remaining % 60;
            
            // Create a human-readable time string
            $time_string = '';
            if ($hours > 0) {
                $time_string .= $hours . ' hour' . ($hours > 1 ? 's' : '');
                if ($minutes > 0 || $seconds > 0) {
                    $time_string .= ', ';
                }
            }
            if ($minutes > 0) {
                $time_string .= $minutes . ' minute' . ($minutes > 1 ? 's' : '');
                if ($seconds > 0) {
                    $time_string .= ', ';
                }
            }
            if ($seconds > 0 && $hours == 0) { // Only show seconds if less than 1 hour remaining
                $time_string .= $seconds . ' second' . ($seconds > 1 ? 's' : '');
            }
            
            // Fallback if all values are 0 (shouldn't happen but just in case)
            if (empty($time_string)) {
                $time_string = '1 second';
            }
            
            return new \WP_Error(
                'otp_request_limit_exceeded', 
                "You have exceeded the maximum OTP request limit. Please try again in {$time_string}.", 
                array('status' => 429)
            );
        }
        
        return true;
    }

    /**
     * Increment OTP request count for user
     *
     * @since 1.0.0
     * @param int $user_id The user ID
     */
    private function increment_otp_request_count($user_id) {
        // Get current count
        $request_count = (int) \get_user_meta($user_id, 'bema_email_otp_request_count', true);
        
        // Increment count
        $request_count++;
        
        // Update count and timestamp
        \update_user_meta($user_id, 'bema_email_otp_request_count', $request_count);
        \update_user_meta($user_id, 'bema_last_successful_email_otp_request', \time());
        
        if ($this->logger) {
            $this->logger->info('OTP request count incremented', array(
                'user_id' => $user_id,
                'request_count' => $request_count
            ));
        }
    }

    /**
     * Check if user can request password reset based on rate limiting
     *
     * @since 1.0.0
     * @param int $user_id The user ID
     * @return bool|\WP_Error True if user can request password reset, WP_Error if rate limited
     */
    private function can_request_password_reset($user_id) {
        // Get password reset request count and last successful request timestamp
        $request_count = (int) \get_user_meta($user_id, 'bema_password_reset_request_count', true);
        $last_request_timestamp = (int) \get_user_meta($user_id, 'bema_last_password_reset_request', true);
        
        // Check if 24 hours have passed since last successful request
        $time_since_last_request = \time() - $last_request_timestamp;
        $twenty_four_hours = 24 * 60 * 60; // 86400 seconds
        
        if ($time_since_last_request >= $twenty_four_hours) {
            // Reset count if 24 hours have passed
            $request_count = 0;
            \update_user_meta($user_id, 'bema_password_reset_request_count', $request_count);
        }
        
        // Get the password reset limit from settings
        $settings = \get_option('bema_hub_otp_settings', array());
        $max_requests = isset($settings['password_reset_daily_limit']) ? (int) $settings['password_reset_daily_limit'] : $this->max_password_reset_requests;
        
        // Check if user has reached the maximum request limit
        if ($request_count >= $max_requests) {
            $seconds_remaining = $twenty_four_hours - $time_since_last_request;
            
            // Format time remaining in a human-readable way
            $hours = floor($seconds_remaining / 3600);
            $minutes = floor(($seconds_remaining % 3600) / 60);
            $seconds = $seconds_remaining % 60;
            
            // Create a human-readable time string
            $time_string = '';
            if ($hours > 0) {
                $time_string .= $hours . ' hour' . ($hours > 1 ? 's' : '');
                if ($minutes > 0 || $seconds > 0) {
                    $time_string .= ', ';
                }
            }
            if ($minutes > 0) {
                $time_string .= $minutes . ' minute' . ($minutes > 1 ? 's' : '');
                if ($seconds > 0) {
                    $time_string .= ', ';
                }
            }
            if ($seconds > 0 && $hours == 0) { // Only show seconds if less than 1 hour remaining
                $time_string .= $seconds . ' second' . ($seconds > 1 ? 's' : '');
            }
            
            // Fallback if all values are 0 (shouldn't happen but just in case)
            if (empty($time_string)) {
                $time_string = '1 second';
            }
            
            return new \WP_Error(
                'password_reset_request_limit_exceeded', 
                "You have exceeded the maximum password reset request limit. Please try again in {$time_string}.", 
                array('status' => 429)
            );
        }
        
        return true;
    }

    /**
     * Increment password reset request count for user
     *
     * @since 1.0.0
     * @param int $user_id The user ID
     */
    private function increment_password_reset_request_count($user_id) {
        // Get current count
        $request_count = (int) \get_user_meta($user_id, 'bema_password_reset_request_count', true);
        
        // Increment count
        $request_count++;
        
        // Update count and timestamp
        \update_user_meta($user_id, 'bema_password_reset_request_count', $request_count);
        \update_user_meta($user_id, 'bema_last_password_reset_request', \time());
        
        if ($this->logger) {
            $this->logger->info('Password reset request count incremented', array(
                'user_id' => $user_id,
                'request_count' => $request_count
            ));
        }
    }

    /**
     * Handle password reset request
     *
     * @since 1.0.0
     * @param \WP_REST_Request $request The request object
     * @return \WP_REST_Response|\WP_Error The response or error
     */
    public function reset_password_request($request) {
        $email = $request->get_param('email');

        // Validate required parameters
        if (empty($email)) {
            if ($this->logger) {
                $this->logger->warning('Password reset request with missing email');
            }
            return new \WP_Error('missing_email', 'Email is required', array('status' => 400));
        }

        // Validate email format
        if (!\is_email($email)) {
            if ($this->logger) {
                $this->logger->warning('Password reset request with invalid email format');
            }
            return new \WP_Error('invalid_email', 'Please provide a valid email address', array('status' => 400));
        }

        // Check if user exists with this email
        $user = \get_user_by('email', $email);
        if (!$user) {
            // For security reasons, we don't reveal if the email exists or not
            // We still return a success response to prevent email enumeration
            if ($this->logger) {
                $this->logger->info('Password reset requested for non-existent email (security response)', array('email' => $email));
            }
            return new \WP_REST_Response(array(
                'success' => true,
                'message' => 'If an account exists with this email, a password reset code has been sent.'
            ), 200);
        }

        // Check if user can request password reset (rate limiting)
        $can_request = $this->can_request_password_reset($user->ID);
        if (\is_wp_error($can_request)) {
            if ($this->logger) {
                $this->logger->warning('Password reset request denied due to rate limiting', array(
                    'user_id' => $user->ID,
                    'email' => $email,
                    'error_code' => $can_request->get_error_code(),
                    'error_message' => $can_request->get_error_message()
                ));
            }
            return $can_request;
        }

        // Generate and send OTP for password reset (reusing existing OTP fields)
        $otp_code = \rand(100000, 999999);
        $otp_expiry = \time() + 600; // 10 minutes expiry (as per existing specification)

        // Hash OTP before storing using SHA256
        $hashed_otp = \hash('sha256', $otp_code);
        \update_user_meta($user->ID, 'bema_otp_code', $hashed_otp);
        \update_user_meta($user->ID, 'bema_otp_expiry', $otp_expiry);
        \update_user_meta($user->ID, 'bema_otp_purpose', 'password_reset'); // Track purpose

        // Send OTP via email using the new mailer class
        $mailer_result = \Bema_Hub\Bema_Hub_Mailer::send_otp_email($email, $otp_code, 'password_reset');
        
        if (\is_wp_error($mailer_result)) {
            if ($this->logger) {
                $this->logger->error('Failed to send password reset OTP email', array(
                    'user_id' => $user->ID,
                    'user_email' => $email,
                    'error_code' => $mailer_result->get_error_code(),
                    'error_message' => $mailer_result->get_error_message()
                ));
            }
            // Still return success to prevent email enumeration, but log the error
        } else {
            // Increment password reset request count only on successful email send
            $this->increment_password_reset_request_count($user->ID);
            
            if ($this->logger) {
                $this->logger->info('Password reset OTP email sent successfully', array(
                    'user_id' => $user->ID,
                    'user_email' => $email
                ));
            }
        }

        // Log the OTP generation
        if ($this->logger) {
            $this->logger->info('Password reset OTP generated for user', array(
                'user_id' => $user->ID,
                'user_email' => $email
            ));
        }

        return new \WP_REST_Response(array(
            'success' => true,
            'message' => 'If an account exists with this email, a password reset code has been sent.'
        ), 200);
    }

    /**
     * Handle password reset
     *
     * @since 1.0.0
     * @param \WP_REST_Request $request The request object
     * @return \WP_REST_Response|\WP_Error The response or error
     */
    public function reset_password($request) {
        $email = $request->get_param('email');
        $otp_code = $request->get_param('otp_code');
        $new_password = $request->get_param('new_password');

        // Validate required parameters
        if (empty($email) || empty($otp_code) || empty($new_password)) {
            if ($this->logger) {
                $this->logger->warning('Password reset attempt with missing parameters');
            }
            return new \WP_Error('missing_fields', 'Email, OTP code, and new password are required', array('status' => 400));
        }

        // Validate email format
        if (!\is_email($email)) {
            if ($this->logger) {
                $this->logger->warning('Password reset attempt with invalid email format');
            }
            return new \WP_Error('invalid_email', 'Please provide a valid email address', array('status' => 400));
        }

        // Validate password strength (at least 6 characters)
        if (strlen($new_password) < 6) {
            if ($this->logger) {
                $this->logger->warning('Password reset attempt with weak password');
            }
            return new \WP_Error('weak_password', 'Password must be at least 6 characters long', array('status' => 400));
        }

        // Get user by email
        $user = \get_user_by('email', $email);
        if (!$user) {
            if ($this->logger) {
                $this->logger->info('Password reset attempt for non-existent email', array('email' => $email));
            }
            return new \WP_Error('user_not_found', 'User not found', array('status' => 404));
        }

        // Get OTP data from user meta
        $stored_otp = \get_user_meta($user->ID, 'bema_otp_code', true);
        $otp_expiry = \get_user_meta($user->ID, 'bema_otp_expiry', true);
        $otp_purpose = \get_user_meta($user->ID, 'bema_otp_purpose', true);
        
        // Check if this is for password reset
        if ($otp_purpose !== 'password_reset') {
            if ($this->logger) {
                $this->logger->info('Password reset attempt for non-password-reset OTP', array('user_id' => $user->ID));
            }
            return new \WP_Error('invalid_otp_purpose', 'Invalid OTP purpose', array('status' => 400));
        }

        // Check if OTP has expired
        if (\time() > $otp_expiry) {
            // Clear OTP data
            \delete_user_meta($user->ID, 'bema_otp_code');
            \delete_user_meta($user->ID, 'bema_otp_expiry');
            \delete_user_meta($user->ID, 'bema_otp_purpose');
            
            if ($this->logger) {
                $this->logger->info('Password reset failed: OTP expired', array('user_id' => $user->ID));
            }
            return new \WP_Error('otp_expired', 'OTP code has expired. Please request a new one.', array('status' => 400));
        }

        // Verify OTP using JWT auth helper function
        if (!$this->jwt_auth->wp_verify_otp($otp_code, $stored_otp)) {
            if ($this->logger) {
                $this->logger->info('Password reset failed: Invalid OTP', array('user_id' => $user->ID));
            }
            return new \WP_Error('invalid_otp', 'Invalid OTP code', array('status' => 400));
        }

        // OTP is valid, proceed with password reset
        // Clear OTP data as it's no longer needed
        \delete_user_meta($user->ID, 'bema_otp_code');
        \delete_user_meta($user->ID, 'bema_otp_expiry');
        \delete_user_meta($user->ID, 'bema_otp_purpose');

        // Update user password
        $password_update_result = \wp_set_password($new_password, $user->ID);
        
        if ($password_update_result === false) {
            if ($this->logger) {
                $this->logger->error('Password reset failed: Could not update password', array(
                    'user_id' => $user->ID,
                    'user_email' => $email
                ));
            }
            return new \WP_Error('password_update_failed', 'Failed to update password', array('status' => 500));
        }

        // Log successful password reset
        if ($this->logger) {
            $this->logger->info('Password reset successful', array(
                'user_id' => $user->ID,
                'user_email' => $email
            ));
        }

        return new \WP_REST_Response(array(
            'success' => true,
            'message' => 'Password reset successfully. You can now sign in with your new password.'
        ), 200);
    }

    /**
     * Resend OTP code for email verification or password reset
     *
     * @since 1.0.0
     * @param \WP_REST_Request $request The request object
     * @return \WP_REST_Response|\WP_Error The response or error
     */
    public function resend_otp($request) {
        $email = $request->get_param('email');

        // Validate required parameters
        if (empty($email)) {
            if ($this->logger) {
                $this->logger->info('Resend OTP request with missing email');
            }
            return new \WP_Error('missing_email', 'Email is required', array('status' => 400));
        }

        // Validate email format
        if (!\is_email($email)) {
            if ($this->logger) {
                $this->logger->info('Resend OTP request with invalid email format');
            }
            return new \WP_Error('invalid_email', 'Please provide a valid email address', array('status' => 400));
        }

        // Get user by email
        $user = \get_user_by('email', $email);
        if (!$user) {
            if ($this->logger) {
                $this->logger->info('Resend OTP request for non-existent email', array('email' => $email));
            }
            return new \WP_Error('user_not_found', 'User not found', array('status' => 404));
        }

        // Check if user can request OTP (rate limiting)
        $can_request = $this->can_request_otp($user->ID);
        if (\is_wp_error($can_request)) {
            if ($this->logger) {
                $this->logger->warning('Resend OTP request denied due to rate limiting', array(
                    'user_id' => $user->ID,
                    'email' => $email,
                    'error_code' => $can_request->get_error_code(),
                    'error_message' => $can_request->get_error_message()
                ));
            }
            return $can_request;
        }

        // Check if user has an existing OTP
        $existing_otp = \get_user_meta($user->ID, 'bema_otp_code', true);
        $otp_purpose = \get_user_meta($user->ID, 'bema_otp_purpose', true);
        
        // If no existing OTP, check if this is for email verification during signup
        if (empty($existing_otp)) {
            // Check if user's email is not verified (signup case)
            $email_verified = \get_user_meta($user->ID, 'bema_email_verified', true);
            if ($email_verified !== '1' && $email_verified !== true) {
                $otp_purpose = 'email_verification';
            } else {
                // User is already verified and has no active OTP
                if ($this->logger) {
                    $this->logger->info('Resend OTP request for user with no active OTP', array('user_id' => $user->ID));
                }
                return new \WP_Error('no_active_otp', 'No active OTP found for this user. Please initiate the appropriate process first.', array('status' => 400));
            }
        }

        // Generate and send new OTP (reusing existing OTP fields)
        $otp_code = \rand(100000, 999999);
        $otp_expiry = \time() + 600; // 10 minutes expiry (as per existing specification)

        // Hash OTP before storing using SHA256
        $hashed_otp = \hash('sha256', $otp_code);
        \update_user_meta($user->ID, 'bema_otp_code', $hashed_otp);
        \update_user_meta($user->ID, 'bema_otp_expiry', $otp_expiry);
        \update_user_meta($user->ID, 'bema_otp_purpose', $otp_purpose); // Maintain the same purpose

        // Send OTP via email using the new mailer class
        $mailer_result = \Bema_Hub\Bema_Hub_Mailer::send_otp_email($email, $otp_code, $otp_purpose);
        
        if (\is_wp_error($mailer_result)) {
            if ($this->logger) {
                $this->logger->error('Failed to send resend OTP email', array(
                    'user_id' => $user->ID,
                    'user_email' => $email,
                    'otp_purpose' => $otp_purpose,
                    'error_code' => $mailer_result->get_error_code(),
                    'error_message' => $mailer_result->get_error_message()
                ));
            }
            // Still return success but log the error
        } else {
            // Increment OTP request count only on successful email send
            $this->increment_otp_request_count($user->ID);
            
            if ($this->logger) {
                $this->logger->info('Resend OTP email sent successfully', array(
                    'user_id' => $user->ID,
                    'user_email' => $email,
                    'otp_purpose' => $otp_purpose
                ));
            }
        }

        // Log the OTP generation (without sensitive data)
        if ($this->logger) {
            $this->logger->info('OTP resent for user', array(
                'user_id' => $user->ID,
                'purpose' => $otp_purpose
            ));
        }

        $message = 'A new verification code has been sent to your email.';
        if ($otp_purpose === 'password_reset') {
            $message = 'A new password reset code has been sent to your email.';
        } else if ($otp_purpose === 'email_verification') {
            $message = 'A new email verification code has been sent to your email.';
        }

        return new \WP_REST_Response(array(
            'success' => true,
            'message' => $message
        ), 200);
    }

    /**
     * Verify OTP for email verification or password reset
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
                $this->logger->info('OTP verification attempt with missing parameters');
            }
            return new \WP_Error('missing_fields', 'Email and OTP code are required', array('status' => 400));
        }

        // Validate email format
        if (!\is_email($email)) {
            if ($this->logger) {
                $this->logger->info('OTP verification attempt with invalid email format');
            }
            return new \WP_Error('invalid_email', 'Please provide a valid email address', array('status' => 400));
        }

        // Get user by email
        $user = \get_user_by('email', $email);
        if (!$user) {
            if ($this->logger) {
                $this->logger->info('OTP verification attempt for non-existent email', array('email' => $email));
            }
            return new \WP_Error('user_not_found', 'User not found', array('status' => 404));
        }

        // Get OTP data from user meta
        $stored_otp = \get_user_meta($user->ID, 'bema_otp_code', true);
        $otp_expiry = \get_user_meta($user->ID, 'bema_otp_expiry', true);
        $otp_purpose = \get_user_meta($user->ID, 'bema_otp_purpose', true);
        
        // Check if OTP has expired
        if (\time() > $otp_expiry) {
            // Clear OTP data
            \delete_user_meta($user->ID, 'bema_otp_code');
            \delete_user_meta($user->ID, 'bema_otp_expiry');
            \delete_user_meta($user->ID, 'bema_otp_purpose');
            
            if ($this->logger) {
                $this->logger->info('OTP verification failed: OTP expired', array('user_id' => $user->ID));
            }
            return new \WP_Error('otp_expired', 'OTP code has expired. Please request a new one.', array('status' => 400));
        }

        // Verify OTP using JWT auth helper function
        if (!$this->jwt_auth->wp_verify_otp($otp_code, $stored_otp)) {
            if ($this->logger) {
                $this->logger->info('OTP verification failed: Invalid OTP', array('user_id' => $user->ID));
            }
            return new \WP_Error('invalid_otp', 'Invalid OTP code', array('status' => 400));
        }

        // Handle based on OTP purpose
        if ($otp_purpose === 'password_reset') {
            // For password reset, generate a temporary token and clear OTP
            \delete_user_meta($user->ID, 'bema_otp_code');
            \delete_user_meta($user->ID, 'bema_otp_expiry');
            \delete_user_meta($user->ID, 'bema_otp_purpose');
            
            // Generate a temporary token for password reset (valid for 1 hour)
            $reset_token_payload = array(
                'user_id' => $user->ID,
                'email' => $user->user_email,
                'exp' => \time() + 3600, // 1 hour
                'purpose' => 'password_reset'
            );

            $reset_token = $this->jwt_auth->encode_token($reset_token_payload);

            if (\is_wp_error($reset_token)) {
                if ($this->logger) {
                    $this->logger->error('Failed to generate password reset token', array(
                        'user_id' => $user->ID,
                        'error_code' => $reset_token->get_error_code(),
                        'error_message' => $reset_token->get_error_message()
                    ));
                }
                return $reset_token;
            }

            if ($this->logger) {
                $this->logger->info('Password reset OTP verification successful', array('user_id' => $user->ID));
            }

            return new \WP_REST_Response(array(
                'success' => true,
                'message' => 'Password reset code verified successfully',
                'reset_token' => $reset_token
            ), 200);
        } else {
            // For email verification
            // Update email verification status
            \update_user_meta($user->ID, 'bema_email_verified', true);
            
            // Clear OTP data
            \delete_user_meta($user->ID, 'bema_otp_code');
            \delete_user_meta($user->ID, 'bema_otp_expiry');
            \delete_user_meta($user->ID, 'bema_otp_purpose');

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
    }

    /**
     * Verify OTP for password reset before allowing new password input
     *
     * @since 1.0.0
     * @param \WP_REST_Request $request The request object
     * @return \WP_REST_Response|\WP_Error The response or error
     */
    public function verify_password_reset_otp($request) {
        $email = $request->get_param('email');
        $otp_code = $request->get_param('otp_code');

        // Validate required parameters
        if (empty($email) || empty($otp_code)) {
            if ($this->logger) {
                $this->logger->info('Password reset OTP verification attempt with missing parameters');
            }
            return new \WP_Error('missing_fields', 'Email and OTP code are required', array('status' => 400));
        }

        // Validate email format
        if (!\is_email($email)) {
            if ($this->logger) {
                $this->logger->info('Password reset OTP verification attempt with invalid email format');
            }
            return new \WP_Error('invalid_email', 'Please provide a valid email address', array('status' => 400));
        }

        // Get user by email
        $user = \get_user_by('email', $email);
        if (!$user) {
            if ($this->logger) {
                $this->logger->info('Password reset OTP verification attempt for non-existent email', array('email' => $email));
            }
            return new \WP_Error('user_not_found', 'User not found', array('status' => 404));
        }

        // Get OTP data from user meta
        $stored_otp = \get_user_meta($user->ID, 'bema_otp_code', true);
        $otp_expiry = \get_user_meta($user->ID, 'bema_otp_expiry', true);
        $otp_purpose = \get_user_meta($user->ID, 'bema_otp_purpose', true);
        
        // Check if this is for password reset
        if ($otp_purpose !== 'password_reset') {
            if ($this->logger) {
                $this->logger->info('Password reset OTP verification attempt for non-password-reset OTP', array('user_id' => $user->ID));
            }
            return new \WP_Error('invalid_otp_purpose', 'Invalid OTP purpose', array('status' => 400));
        }

        // Check if OTP has expired
        if (\time() > $otp_expiry) {
            // Clear OTP data
            \delete_user_meta($user->ID, 'bema_otp_code');
            \delete_user_meta($user->ID, 'bema_otp_expiry');
            \delete_user_meta($user->ID, 'bema_otp_purpose');
            
            if ($this->logger) {
                $this->logger->info('Password reset OTP verification failed: OTP expired', array('user_id' => $user->ID));
            }
            return new \WP_Error('otp_expired', 'OTP code has expired. Please request a new one.', array('status' => 400));
        }

        // Verify OTP using JWT auth helper function
        if (!$this->jwt_auth->wp_verify_otp($otp_code, $stored_otp)) {
            if ($this->logger) {
                $this->logger->info('Password reset OTP verification failed: Invalid OTP', array('user_id' => $user->ID));
            }
            return new \WP_Error('invalid_otp', 'Invalid OTP code', array('status' => 400));
        }

        // OTP is valid - user can proceed to new password input
        // Don't clear OTP data yet as it will be needed for the actual password reset
        if ($this->logger) {
            $this->logger->info('Password reset OTP verification successful', array('user_id' => $user->ID));
        }

        return new \WP_REST_Response(array(
            'success' => true,
            'message' => 'OTP verified successfully. You can now enter your new password.',
            'user_id' => $user->ID
        ), 200);
    }
}