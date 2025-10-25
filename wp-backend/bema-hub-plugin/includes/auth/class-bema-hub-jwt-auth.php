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
        if (class_exists('Bema_Hub\Bema_Hub_Logger')) {
            $this->logger = Bema_Hub_Logger::create('jwt-auth');
        }
    }

    /**
     * Generate a JWT token for a user
     *
     * @since 1.0.0
     * @param int $user_id The WordPress user ID
     * @param array $additional_claims Additional claims to include in the token
     * @return string|WP_Error The JWT token or WP_Error on failure
     */
    public function generate_token($user_id, $additional_claims = []) {
        // Get user data
        $user = \get_user_by('ID', $user_id);
        if (!$user) {
            if ($this->logger) {
                $this->logger->error('Failed to generate token: User not found', ['user_id' => $user_id]);
            }
            return new \WP_Error('user_not_found', 'User not found', ['status' => 404]);
        }

        // Check if JWT_SECRET is defined
        if (!defined('JWT_SECRET')) {
            if ($this->logger) {
                $this->logger->error('Failed to generate token: JWT_SECRET not defined');
            }
            // Return a more user-friendly error
            return new \WP_Error('jwt_secret_not_defined', 'JWT_SECRET constant not defined in wp-config.php', ['status' => 500]);
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
            )
        );

        // Add additional claims
        if (!empty($additional_claims)) {
            $payload['data'] = array_merge($payload['data'], $additional_claims);
        }

        // Log the token generation
        if ($this->logger) {
            $this->logger->info('Generating JWT token for user', [
                'user_id' => $user_id,
                'user_login' => $user->user_login
            ]);
        }

        // Generate and return the token
        return $this->encode_token($payload);
    }

    /**
     * Encode a JWT token
     *
     * @since 1.0.0
     * @param array $payload The token payload
     * @return string|WP_Error The encoded token or WP_Error on failure
     */
    private function encode_token($payload) {
        // Check if JWT_SECRET is defined
        if (!defined('JWT_SECRET')) {
            return new \WP_Error('jwt_secret_not_defined', 'JWT_SECRET constant not defined in wp-config.php', ['status' => 500]);
        }

        $header = $this->base64url_encode(json_encode(['typ' => 'JWT', 'alg' => 'HS256']));
        $payload_encoded = $this->base64url_encode(json_encode($payload));
        
        $signature = \hash_hmac('sha256', "$header.$payload_encoded", \JWT_SECRET, true);
        $signature_encoded = $this->base64url_encode($signature);

        return "$header.$payload_encoded.$signature_encoded";
    }

    /**
     * Validate a JWT token
     *
     * @since 1.0.0
     * @param string $token The JWT token to validate
     * @return array|WP_Error The decoded token data or WP_Error on failure
     */
    public function validate_token($token) {
        // Check if JWT_SECRET is defined
        if (!defined('JWT_SECRET')) {
            return new \WP_Error('jwt_secret_not_defined', 'JWT_SECRET constant not defined in wp-config.php', ['status' => 500]);
        }

        // Split the token
        $token_parts = explode('.', $token);
        if (count($token_parts) != 3) {
            return new \WP_Error('invalid_token', 'Invalid token format', ['status' => 401]);
        }

        list($header_encoded, $payload_encoded, $signature_encoded) = $token_parts;

        // Verify signature
        $signature = \hash_hmac('sha256', "$header_encoded.$payload_encoded", \JWT_SECRET, true);
        $expected_signature_encoded = $this->base64url_encode($signature);

        if (!\hash_equals($expected_signature_encoded, $signature_encoded)) {
            if ($this->logger) {
                $this->logger->warning('JWT token validation failed: Invalid signature');
            }
            return new \WP_Error('invalid_token', 'Invalid token signature', ['status' => 401]);
        }

        // Decode payload
        $payload_json = \base64_decode($payload_encoded);
        $payload = \json_decode($payload_json, true);

        if (\json_last_error() !== JSON_ERROR_NONE) {
            if ($this->logger) {
                $this->logger->error('JWT token validation failed: Invalid payload JSON', [
                    'error' => \json_last_error_msg()
                ]);
            }
            return new \WP_Error('invalid_token', 'Invalid token payload', ['status' => 401]);
        }

        // Check expiration
        if (isset($payload['exp']) && \time() > $payload['exp']) {
            if ($this->logger) {
                $this->logger->info('JWT token validation failed: Token expired', [
                    'exp' => $payload['exp'],
                    'current_time' => \time()
                ]);
            }
            return new \WP_Error('token_expired', 'Token has expired', ['status' => 401]);
        }

        // Log successful validation
        if ($this->logger) {
            $this->logger->info('JWT token validated successfully', [
                'user_id' => $payload['data']['user_id'] ?? 'unknown'
            ]);
        }

        return $payload;
    }

    /**
     * Authenticate a user with username/email and password, then generate a token
     *
     * @since 1.0.0
     * @param string $username_or_email The username or email
     * @param string $password The password
     * @return array|WP_Error The token and user data or WP_Error on failure
     */
    public function authenticate_and_generate_token($username_or_email, $password) {
        // Authenticate user
        $user = \wp_authenticate($username_or_email, $password);
        
        if (\is_wp_error($user)) {
            if ($this->logger) {
                $this->logger->warning('Authentication failed', [
                    'username_or_email' => $username_or_email,
                    'error_code' => $user->get_error_code(),
                    'error_message' => $user->get_error_message()
                ]);
            }
            return $user;
        }

        // Generate token
        $token = $this->generate_token($user->ID);
        
        if (\is_wp_error($token)) {
            return $token;
        }

        // Return token and user data
        return [
            'token' => $token,
            'user_id' => $user->ID,
            'user_login' => $user->user_login,
            'user_email' => $user->user_email,
            'user_display_name' => $user->display_name
        ];
    }

    /**
     * Base64 URL encode
     *
     * @since 1.0.0
     * @param string $data The data to encode
     * @return string The encoded data
     */
    private function base64url_encode($data) {
        return rtrim(strtr(\base64_encode($data), '+/', '-_'), '=');
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