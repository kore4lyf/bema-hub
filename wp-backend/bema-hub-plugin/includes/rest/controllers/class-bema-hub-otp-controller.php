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

        // Generate and send OTP for password reset (reusing existing OTP fields)
        $otp_code = \rand(100000, 999999);
        $otp_expiry = \time() + 600; // 10 minutes expiry (as per existing specification)

        // Hash OTP before storing using SHA256
        $hashed_otp = \hash('sha256', $otp_code);
        \update_user_meta($user->ID, 'bema_otp_code', $hashed_otp);
        \update_user_meta($user->ID, 'bema_otp_expiry', $otp_expiry);
        \update_user_meta($user->ID, 'bema_otp_purpose', 'password_reset'); // Track purpose

        // Log the OTP generation
        if ($this->logger) {
            $this->logger->info('Password reset OTP generated for user', array(
                'user_id' => $user->ID,
                'user_email' => $email
            ));
        }

        // In a real implementation, you would send the OTP via email
        // For now, we'll just log it
        if ($this->logger) {
            $this->logger->info('Password reset OTP code (for development only)', array(
                'user_id' => $user->ID,
                'otp_code' => $otp_code // In production, never log OTP codes
            ));
        }

        return new \WP_REST_Response(array(
            'success' => true,
            'message' => 'If an account exists with this email, a password reset code has been sent.'
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
                $this->logger->warning('Resend OTP request with missing email');
            }
            return new \WP_Error('missing_email', 'Email is required', array('status' => 400));
        }

        // Validate email format
        if (!\is_email($email)) {
            if ($this->logger) {
                $this->logger->warning('Resend OTP request with invalid email format');
            }
            return new \WP_Error('invalid_email', 'Please provide a valid email address', array('status' => 400));
        }

        // Get user by email
        $user = \get_user_by('email', $email);
        if (!$user) {
            if ($this->logger) {
                $this->logger->warning('Resend OTP request for non-existent email', array('email' => $email));
            }
            return new \WP_Error('user_not_found', 'User not found', array('status' => 404));
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
                    $this->logger->warning('Resend OTP request for user with no active OTP', array('user_id' => $user->ID));
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

        // Log the OTP generation
        if ($this->logger) {
            $this->logger->info('OTP resent for user', array(
                'user_id' => $user->ID,
                'user_email' => $email,
                'purpose' => $otp_purpose
            ));
        }

        // In a real implementation, you would send the OTP via email
        // For now, we'll just log it
        if ($this->logger) {
            $this->logger->info('Resent OTP code (for development only)', array(
                'user_id' => $user->ID,
                'otp_code' => $otp_code // In production, never log OTP codes
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
        $otp_purpose = \get_user_meta($user->ID, 'bema_otp_purpose', true);
        
        // Check if OTP has expired
        if (\time() > $otp_expiry) {
            // Clear OTP data
            \delete_user_meta($user->ID, 'bema_otp_code');
            \delete_user_meta($user->ID, 'bema_otp_expiry');
            \delete_user_meta($user->ID, 'bema_otp_purpose');
            
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
}