<?php
namespace Bema_Hub;

/**
 * JWT Authentication class for Bema Hub plugin
 *
 * Provides JWT token generation and validation for API authentication
 *
 * @since      1.0.0
 * @package    Bema_Hub
 * @subpackage Bema_Hub/includes
 */
class Bema_Hub_JWT_Auth {

    /**
     * The logger instance.
     *
     * @since    1.0.0
     * @access   private
     * @var      Bema_Hub_Logger    $logger    Logger instance.
     */
    private $logger;

    /**
     * Initialize the class and set its properties.
     *
     * @since    1.0.0
     */
    public function __construct() {
        // Initialize logger
        if (class_exists('Bema_Hub\\Bema_Hub_Logger')) {
            $this->logger = Bema_Hub_Logger::create('jwt-auth');
        }
    }

    /**
     * Generate a JWT token for a user
     *
     * @since 1.0.0
     * @param int $user_id The WordPress user ID
     * @param array $additional_claims Additional claims to include in the token
     * @return string|\WP_Error The JWT token or WP_Error on failure
     */
    public function generate_token($user_id, $additional_claims = []) {
        // Get user data
        $user = \get_user_by('ID', $user_id);
        if (!$user) {
            if ($this->logger) {
                $this->logger->error('Failed to generate token: User not found', array('user_id' => $user_id));
            }
            return new \WP_Error('user_not_found', 'User not found', array('status' => 404));
        }

        // Check if JWT_SECRET is defined
        if (!defined('JWT_SECRET')) {
            if ($this->logger) {
                $this->logger->error('Failed to generate token: JWT_SECRET not defined');
            }
            // Return a more user-friendly error
            return new \WP_Error('jwt_secret_not_defined', 'JWT_SECRET constant not defined in wp-config.php', array('status' => 500));
        }

        // Get avatar URL
        $avatar_url = \get_avatar_url($user_id);

        // Get first_name and last_name from user meta (WordPress stores these as meta fields)
        $first_name = \get_user_meta($user_id, 'first_name', true);
        $last_name = \get_user_meta($user_id, 'last_name', true);
        
        // Get email verification status and ensure it's boolean
        $email_verified = (bool) \get_user_meta($user_id, 'bema_email_verified', true);
        
        // Get referred by field
        $referred_by = \get_user_meta($user_id, 'bema_referred_by', true);
        
        // Get user role (WordPress users have one primary role)
        $user_role = '';
        if (!empty($user->roles)) {
            $user_role = reset($user->roles); // Get the first (primary) role
        }

        // Create the token payload
        $issued_at = \time();
        $not_before = $issued_at;
        $expire = $issued_at + (\DAY_IN_SECONDS * 7); // Token valid for 7 days

        $payload = array(
            'iat' => $issued_at,
            'nbf' => $not_before,
            'exp' => $expire,
            'data' => array(
                'user_id' => $user_id,
                'user_login' => $user->user_login,
                'user_email' => $user->user_email,
                'first_name' => $first_name,
                'last_name' => $last_name,
                'avatar_url' => $avatar_url,
                'bema_email_verified' => $email_verified,
                'bema_referred_by' => $referred_by,
                'role' => $user_role
            )
        );

        // Add additional claims
        if (!empty($additional_claims)) {
            $payload['data'] = \array_merge($payload['data'], $additional_claims);
        }

        // Log the token generation
        if ($this->logger) {
            $this->logger->info('Generating JWT token for user', array(
                'user_id' => $user_id,
                'user_login' => $user->user_login,
                'user_email' => $user->user_email
            ));
        }

        // Generate and return the token
        $token = $this->encode_token($payload);
        
        if ($this->logger && !\is_wp_error($token)) {
            $this->logger->info('JWT token generated successfully', array(
                'user_id' => $user_id,
                'token_preview' => \substr($token, 0, 10) . '...'
            ));
        }
        
        return $token;
    }

    /**
     * Encode a JWT token
     *
     * @since 1.0.0
     * @param array $payload The token payload
     * @return string|\WP_Error The encoded token or WP_Error on failure
     */
    private function encode_token($payload) {
        // Check if JWT_SECRET is defined
        if (!defined('JWT_SECRET')) {
            if ($this->logger) {
                $this->logger->error('Failed to encode token: JWT_SECRET not defined');
            }
            return new \WP_Error('jwt_secret_not_defined', 'JWT_SECRET constant not defined in wp-config.php', array('status' => 500));
        }

        $header = $this->base64url_encode(\json_encode(array('typ' => 'JWT', 'alg' => 'HS256')));
        $payload_encoded = $this->base64url_encode(\json_encode($payload));
        
        $signature = \hash_hmac('sha256', "$header.$payload_encoded", \JWT_SECRET, true);
        $signature_encoded = $this->base64url_encode($signature);

        return "$header.$payload_encoded.$signature_encoded";
    }

    /**
     * Validate a JWT token
     *
     * @since 1.0.0
     * @param string $token The JWT token to validate
     * @return array|\WP_Error The decoded token data or WP_Error on failure
     */
    public function validate_token($token) {
        // Check if JWT_SECRET is defined
        if (!defined('JWT_SECRET')) {
            if ($this->logger) {
                $this->logger->error('Failed to validate token: JWT_SECRET not defined');
            }
            return new \WP_Error('jwt_secret_not_defined', 'JWT_SECRET constant not defined in wp-config.php', array('status' => 500));
        }

        // Split the token
        $token_parts = \explode('.', $token);
        if (\count($token_parts) != 3) {
            if ($this->logger) {
                $this->logger->warning('JWT token validation failed: Invalid token format', array(
                    'token_preview' => \substr($token, 0, 10) . '...'
                ));
            }
            return new \WP_Error('invalid_token', 'Invalid token format', array('status' => 401));
        }

        list($header_encoded, $payload_encoded, $signature_encoded) = $token_parts;

        // Verify signature
        $signature = \hash_hmac('sha256', "$header_encoded.$payload_encoded", \JWT_SECRET, true);
        $expected_signature_encoded = $this->base64url_encode($signature);

        if (!\hash_equals($expected_signature_encoded, $signature_encoded)) {
            if ($this->logger) {
                $this->logger->warning('JWT token validation failed: Invalid signature', array(
                    'token_preview' => \substr($token, 0, 10) . '...'
                ));
            }
            return new \WP_Error('invalid_token', 'Invalid token signature', array('status' => 401));
        }

        // Decode payload
        $payload_json = \base64_decode($payload_encoded);
        $payload = \json_decode($payload_json, true);

        if (\json_last_error() !== \JSON_ERROR_NONE) {
            if ($this->logger) {
                $this->logger->error('JWT token validation failed: Invalid payload JSON', array(
                    'error' => \json_last_error_msg(),
                    'token_preview' => \substr($token, 0, 10) . '...'
                ));
            }
            return new \WP_Error('invalid_token', 'Invalid token payload', array('status' => 401));
        }

        // Check expiration
        if (isset($payload['exp']) && \time() > $payload['exp']) {
            if ($this->logger) {
                $this->logger->info('JWT token validation failed: Token expired', array(
                    'exp' => $payload['exp'],
                    'current_time' => \time(),
                    'user_id' => isset($payload['data']['user_id']) ? $payload['data']['user_id'] : 'unknown'
                ));
            }
            return new \WP_Error('token_expired', 'Token has expired', array('status' => 401));
        }

        // Log successful validation
        if ($this->logger) {
            $this->logger->info('JWT token validated successfully', array(
                'user_id' => isset($payload['data']['user_id']) ? $payload['data']['user_id'] : 'unknown',
                'user_email' => isset($payload['data']['user_email']) ? $payload['data']['user_email'] : 'unknown',
                'token_preview' => \substr($token, 0, 10) . '...'
            ));
        }

        return $payload;
    }

    /**
     * Authenticate a user with username/email and password, then generate a token
     *
     * @since 1.0.0
     * @param string $username_or_email The username or email
     * @param string $password The password
     * @return array|\WP_Error The token and user data or WP_Error on failure
     */
    public function authenticate_and_generate_token($username_or_email, $password) {
        // Log authentication attempt
        if ($this->logger) {
            $this->logger->info('Authentication attempt', array(
                'username_or_email' => $username_or_email
            ));
        }
        
        // Authenticate user
        $user = \wp_authenticate($username_or_email, $password);
        
        if (\is_wp_error($user)) {
            if ($this->logger) {
                $this->logger->warning('Authentication failed', array(
                    'username_or_email' => $username_or_email,
                    'error_code' => $user->get_error_code(),
                    'error_message' => $user->get_error_message()
                ));
            }
            return $user;
        }

        // Generate token
        $token = $this->generate_token($user->ID);
        
        if (\is_wp_error($token)) {
            if ($this->logger) {
                $this->logger->error('Token generation failed after successful authentication', array(
                    'user_id' => $user->ID,
                    'user_email' => $user->user_email,
                    'error_code' => $token->get_error_code(),
                    'error_message' => $token->get_error_message()
                ));
            }
            return $token;
        }

        // Get avatar URL
        $avatar_url = \get_avatar_url($user->ID);

        // Get first_name and last_name from user meta (WordPress stores these as meta fields)
        $first_name = \get_user_meta($user->ID, 'first_name', true);
        $last_name = \get_user_meta($user->ID, 'last_name', true);
        
        // Get email verification status and ensure it's boolean
        $email_verified = (bool) \get_user_meta($user->ID, 'bema_email_verified', true);
        
        // Get referred by field
        $referred_by = \get_user_meta($user->ID, 'bema_referred_by', true);
        
        // Get user role (WordPress users have one primary role)
        $user_role = '';
        if (!empty($user->roles)) {
            $user_role = reset($user->roles); // Get the first (primary) role
        }

        // Log successful authentication and token generation
        if ($this->logger) {
            $this->logger->info('Authentication and token generation successful', array(
                'user_id' => $user->ID,
                'user_login' => $user->user_login,
                'user_email' => $user->user_email,
                'token_preview' => \substr($token, 0, 10) . '...'
            ));
        }

        // Return token and user data
        return array(
            'token' => $token,
            'user_id' => $user->ID,
            'user_login' => $user->user_login,
            'user_email' => $user->user_email,
            'user_display_name' => $user->display_name,
            'first_name' => $first_name,
            'last_name' => $last_name,
            'avatar_url' => $avatar_url,
            'bema_email_verified' => $email_verified,
            'bema_referred_by' => $referred_by,
            'role' => $user_role
        );
    }

    /**
     * Verify an OTP code against a stored hash
     *
     * @since 1.0.0
     * @param string $otp_code The OTP code to verify
     * @param string $stored_hash The stored hash to compare against
     * @return bool True if OTP is valid, false otherwise
     */
    public function wp_verify_otp($otp_code, $stored_hash) {
        // Use hash_equals for timing attack prevention
        $result = \hash_equals($stored_hash, \hash('sha256', $otp_code));
        
        if ($this->logger) {
            $this->logger->info('OTP verification attempt', array(
                'result' => $result ? 'success' : 'failure'
            ));
        }
        
        return $result;
    }

    /**
     * Base64 URL encode
     *
     * @since 1.0.0
     * @param string $data The data to encode
     * @return string The encoded data
     */
    private function base64url_encode($data) {
        return \rtrim(\strtr(\base64_encode($data), '+/', '-_'), '=');
    }

    /**
     * Base64 URL decode
     *
     * @since 1.0.0
     * @param string $data The data to decode
     * @return string The decoded data
     */
    private function base64url_decode($data) {
        return \base64_decode(\str_pad(\strtr($data, '-_', '+/'), \strlen($data) % 4, '=', \STR_PAD_RIGHT));
    }
}