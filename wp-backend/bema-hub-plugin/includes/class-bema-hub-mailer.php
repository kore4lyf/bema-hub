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
        
        // Set email subject based on purpose
        $subject = 'Your Verification Code';
        if ($purpose === 'password_reset') {
            $subject = 'Password Reset Verification Code';
        } else if ($purpose === 'email_verification') {
            $subject = 'Email Verification Code';
        }
        
        // Set email message
        $message = "Your verification code is: {$otp_code}\n\n";
        $message .= "This code will expire in 10 minutes.\n\n";
        $message .= "If you didn't request this code, please ignore this email.\n\n";
        $message .= "Thank you,\n";
        $message .= "Bema Hub Team";
        
        // Set headers
        $headers = array(
            'Content-Type: text/plain; charset=UTF-8',
        );
        
        // Add from name if set in SMTP settings
        if (!empty($smtp_settings['name'])) {
            $headers[] = 'From: ' . $smtp_settings['name'] . ' <' . $smtp_settings['user'] . '>';
        } else if (!empty($smtp_settings['user'])) {
            $headers[] = 'From: ' . $smtp_settings['user'];
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