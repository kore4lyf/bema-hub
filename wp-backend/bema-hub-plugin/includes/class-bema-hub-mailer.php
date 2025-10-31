<?php
namespace Bema_Hub;

/**
 * Mailer class for Bema Hub plugin
 *
 * Provides a static interface for sending emails throughout the plugin
 *
 * @since      1.0.0
 * @package    Bema_Hub
 * @subpackage Bema_Hub/includes
 */
class Bema_Hub_Mailer {

    /**
     * Load an email template and replace placeholders
     *
     * @since 1.0.0
     * @param string $template_name Template file name
     * @param array $replacements Array of placeholder => value pairs
     * @return string Processed email HTML
     */
    private static function load_email_template($template_name, $replacements = []) {
        $template_path = plugin_dir_path(__FILE__) . '../templates/' . $template_name . '.html';
        
        if (!file_exists($template_path)) {
            return false;
        }
        
        $template = file_get_contents($template_path);
        
        // Replace all placeholders
        foreach ($replacements as $placeholder => $value) {
            $template = str_replace('{{' . $placeholder . '}}', $value, $template);
        }
        
        return $template;
    }

    /**
     * Send an OTP email
     *
     * @since 1.0.0
     * @param string $to_email Recipient email address
     * @param string $otp_code The OTP code to send
     * @param string $purpose Purpose of the OTP (email_verification, password_reset, etc.)
     * @return bool|\WP_Error True on success, WP_Error on failure
     */
    public static function send_otp_email($to_email, $otp_code, $purpose = 'general') {
        // Get email settings
        $smtp_settings = \get_option('bema_hub_smtp_settings', array());
        
        // Get email template settings
        $template_settings = \get_option('bema_hub_email_template_settings', array());
        
        // Get general settings for frontend URL
        $general_settings = \get_option('bema_hub_general_settings', array());
        $frontend_base_url = isset($general_settings['frontend_base_url']) ? rtrim($general_settings['frontend_base_url'], '/') : home_url();
        
        // Set email subject based on purpose
        $subject = 'Your Verification Code';
        if ($purpose === 'password_reset') {
            $subject = 'Password Reset Request';
        } else if ($purpose === 'email_verification') {
            $subject = 'Email Verification Code';
        }
        
        // Prepare shared template replacements
        $user_info = get_user_by('email', $to_email);
        $user_name = $user_info ? $user_info->display_name : 'User';
        $user_id = $user_info ? $user_info->ID : 0;
        
        // Store OTP for verification (reusing existing OTP fields)
        if ($user_id) {
            $otp_expiry = time() + 600; // 10 minutes expiry (as per existing specification)
            
            // Hash OTP before storing using SHA256
            $hashed_otp = hash('sha256', $otp_code);
            update_user_meta($user_id, 'bema_otp_code', $hashed_otp);
            update_user_meta($user_id, 'bema_otp_expiry', $otp_expiry);
            update_user_meta($user_id, 'bema_otp_purpose', $purpose);
        }
        
        // Generate reset link for password reset (Next.js path-based routing)
        $reset_link = '';
        if ($purpose === 'password_reset' && $user_id) {
            // Get password reset page URL from settings or use default
            $password_reset_page = isset($template_settings['password_reset_page_url']) ? ltrim($template_settings['password_reset_page_url'], '/') : 'reset-password';
            
            // Generate reset link with OTP in the path for Next.js
            $reset_link = $frontend_base_url . '/' . $password_reset_page . '/' . $otp_code;
        }
        
        // Shared variables for all templates
        $shared_replacements = array(
            'LOGO_URL' => isset($template_settings['logo_url']) ? $template_settings['logo_url'] : '',
            'WEBSITE_NAME' => isset($template_settings['website_name']) ? $template_settings['website_name'] : get_bloginfo('name'),
            'COMPANY_EMAIL' => isset($template_settings['company_email']) ? $template_settings['company_email'] : get_bloginfo('admin_email'),
            'COMPANY_PHONE' => isset($template_settings['company_phone']) ? $template_settings['company_phone'] : '',
            'FACEBOOK_URL' => isset($template_settings['facebook_url']) ? $template_settings['facebook_url'] : '',
            'TWITTER_URL' => isset($template_settings['twitter_url']) ? $template_settings['twitter_url'] : '',
            'INSTAGRAM_URL' => isset($template_settings['instagram_url']) ? $template_settings['instagram_url'] : '',
            'USER_NAME' => $user_name,
            'OTP_CODE' => $otp_code,
            'EXPIRY_TIME' => '10',
            'RESET_LINK' => $reset_link
        );
        
        // Set headers for HTML email
        $headers = array(
            'Content-Type: text/html; charset=UTF-8',
        );
        
        // Add from name if set in SMTP settings
        if (!empty($smtp_settings['name'])) {
            $headers[] = 'From: ' . $smtp_settings['name'] . ' <' . $smtp_settings['user'] . '>';
        } else if (!empty($smtp_settings['user'])) {
            $headers[] = 'From: ' . $smtp_settings['user'];
        }
        
        // Load appropriate template based on purpose
        $message = '';
        if ($purpose === 'password_reset') {
            // Password reset template
            $message = self::load_email_template('password-reset', $shared_replacements);
        } else {
            // General OTP template
            $message = self::load_email_template('otp', $shared_replacements);
        }
        
        // Fallback to plain text if template loading failed
        if ($message === false) {
            if ($purpose === 'password_reset') {
                $message = "Hello {$user_name},\n\n";
                $message .= "We have sent you this email in response to your request to reset your password on " . get_bloginfo('name') . ".\n\n";
                $message .= "To reset your password, please visit the following link:\n";
                $message .= "{$reset_link}\n\n";
                $message .= "This link will expire in 10 minutes.\n\n";
                $message .= "Please ignore this email if you did not request a password change.\n\n";
                $message .= "Thank you,\n";
                $message .= get_bloginfo('name') . " Team";
            } else {
                $message = "Your verification code is: {$otp_code}\n\n";
                $message .= "This code will expire in 10 minutes.\n\n";
                $message .= "If you didn't request this code, please ignore this email.\n\n";
                $message .= "Thank you,\n";
                $message .= "Bema Hub Team";
            }
            
            // Reset headers to plain text
            $headers = array(
                'Content-Type: text/plain; charset=UTF-8',
            );
            
            // Add from name if set in SMTP settings
            if (!empty($smtp_settings['name'])) {
                $headers[] = 'From: ' . $smtp_settings['name'] . ' <' . $smtp_settings['user'] . '>';
            } else if (!empty($smtp_settings['user'])) {
                $headers[] = 'From: ' . $smtp_settings['user'];
            }
        }
        
        // Log email sending attempt
        if (class_exists('Bema_Hub\Bema_Hub_Logger')) {
            $logger = \Bema_Hub\Bema_Hub_Logger::create('mailer');
            $logger->info('Sending OTP email', array(
                'to_email' => $to_email,
                'purpose' => $purpose,
                'subject' => $subject,
                'has_smtp_settings' => !empty($smtp_settings),
                'smtp_host' => !empty($smtp_settings['host']) ? $smtp_settings['host'] : 'Not set',
                'smtp_port' => !empty($smtp_settings['port']) ? $smtp_settings['port'] : 'Not set',
                'smtp_user' => !empty($smtp_settings['user']) ? 'Set' : 'Not set'
            ));
        }
        
        // Send email using WordPress wp_mail function
        $sent = \wp_mail($to_email, $subject, $message, $headers);
        
        // Log result
        if (class_exists('Bema_Hub\Bema_Hub_Logger')) {
            $logger = \Bema_Hub\Bema_Hub_Logger::create('mailer');
            if ($sent) {
                $logger->info('OTP email sent successfully', array('to_email' => $to_email, 'purpose' => $purpose));
            } else {
                $logger->error('Failed to send OTP email', array(
                    'to_email' => $to_email,
                    'purpose' => $purpose,
                    'smtp_settings' => $smtp_settings,
                    'phpmailer_debug' => self::get_phpmailer_debug_info()
                ));
            }
        }
        
        if ($sent) {
            return true;
        } else {
            return new \WP_Error('email_send_failed', 'Failed to send email');
        }
    }
    
    /**
     * Send a generic email
     *
     * @since 1.0.0
     * @param string $to_email Recipient email address
     * @param string $subject Email subject
     * @param string $message Email message
     * @param array $headers Additional headers
     * @return bool|\WP_Error True on success, WP_Error on failure
     */
    public static function send_email($to_email, $subject, $message, $headers = array()) {
        // Get email settings
        $smtp_settings = \get_option('bema_hub_smtp_settings', array());
        
        // Add default headers if not provided
        if (empty($headers)) {
            $headers = array(
                'Content-Type: text/plain; charset=UTF-8',
            );
            
            // Add from name if set in SMTP settings
            if (!empty($smtp_settings['name'])) {
                $headers[] = 'From: ' . $smtp_settings['name'] . ' <' . $smtp_settings['user'] . '>';
            } else if (!empty($smtp_settings['user'])) {
                $headers[] = 'From: ' . $smtp_settings['user'];
            }
        }
        
        // Log email sending attempt
        if (class_exists('Bema_Hub\Bema_Hub_Logger')) {
            $logger = \Bema_Hub\Bema_Hub_Logger::create('mailer');
            $logger->info('Sending generic email', array(
                'to_email' => $to_email,
                'subject' => $subject,
                'has_smtp_settings' => !empty($smtp_settings),
                'smtp_host' => !empty($smtp_settings['host']) ? $smtp_settings['host'] : 'Not set',
                'smtp_port' => !empty($smtp_settings['port']) ? $smtp_settings['port'] : 'Not set',
                'smtp_user' => !empty($smtp_settings['user']) ? 'Set' : 'Not set'
            ));
        }
        
        // Send email using WordPress wp_mail function
        $sent = \wp_mail($to_email, $subject, $message, $headers);
        
        $log_smtp_settings = [...$smtp_settings, 'pass' => "" ];
        // Log result
        if (class_exists('Bema_Hub\Bema_Hub_Logger')) {
            $logger = \Bema_Hub\Bema_Hub_Logger::create('mailer');
            if ($sent) {
                $logger->info('Generic email sent successfully', array('to_email' => $to_email, 'subject' => $subject));
            } else {
                $logger->error('Failed to send generic email', array(
                    'to_email' => $to_email,
                    'subject' => $subject,
                    'smtp_settings' => $log_smtp_settings,
                    'headers' => $headers,
                    'phpmailer_debug' => self::get_phpmailer_debug_info()
                ));
            }
        }
        
        if ($sent) {
            return true;
        } else {
            return new \WP_Error('email_send_failed', 'Failed to send email');
        }
    }
    
    /**
     * Test email configuration
     *
     * @since 1.0.0
     * @param string $to_email Recipient email address for test
     * @return bool|\WP_Error True on success, WP_Error on failure
     */
    public static function test_email_configuration($to_email) {
        // Log test email attempt
        if (class_exists('Bema_Hub\Bema_Hub_Logger')) {
            $logger = \Bema_Hub\Bema_Hub_Logger::create('mailer');
            $logger->info('Starting SMTP test email', array('to_email' => $to_email));
        }
        
        $subject = 'Bema Hub SMTP Test';
        $message = "This is a test email from Bema Hub to verify your SMTP configuration is working correctly.\n\n";
        $message .= "If you received this email, your SMTP settings are configured correctly.\n\n";
        $message .= "Thank you,\n";
        $message .= "Bema Hub Team";
        
        $result = self::send_email($to_email, $subject, $message);
        
        // Log test result
        if (class_exists('Bema_Hub\Bema_Hub_Logger')) {
            $logger = \Bema_Hub\Bema_Hub_Logger::create('mailer');
            if ($result === true) {
                $logger->info('SMTP test email sent successfully', array('to_email' => $to_email));
            } else {
                $logger->error('SMTP test email failed', array(
                    'to_email' => $to_email,
                    'error' => \is_wp_error($result) ? $result->get_error_message() : 'Unknown error'
                ));
            }
        }
        
        return $result;
    }
    
    /**
     * Get PHPMailer debug information
     *
     * @since 1.0.0
     * @return array Debug information
     */
    private static function get_phpmailer_debug_info() {
        // This is a simplified version - in a real implementation you might want to capture
        // more detailed information from the PHPMailer instance
        $debug_info = array(
            'php_version' => phpversion(),
            'wp_mail_function_exists' => function_exists('wp_mail'),
            'openssl_extension_loaded' => extension_loaded('openssl'),
            'sockets_extension_loaded' => extension_loaded('sockets') || extension_loaded('socket'),
        );
        
        // Check if we can get more detailed information
        if (function_exists('ini_get')) {
            $debug_info['allow_url_fopen'] = ini_get('allow_url_fopen');
            $debug_info['openssl_default_cert_file'] = ini_get('openssl.cafile');
        }
        
        return $debug_info;
    }
}