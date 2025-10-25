<?php
namespace Bema_Hub;

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Bema Hub Notification System
 * 
 * A comprehensive notification system for the Bema Hub plugin with support for
 * multiple notification types and delivery mechanisms.
 *
 * @since      1.0.0
 * @package    Bema_Hub
 * @subpackage Bema_Hub/includes/notification
 */
class Bema_CRM_Notifier {
    
    /**
     * Notification types
     */
    const TYPE_SUCCESS = 'success';
    const TYPE_ERROR = 'error';
    const TYPE_WARNING = 'warning';
    const TYPE_INFO = 'info';
    
    /**
     * Send an admin notice
     *
     * @param string $message The notification message
     * @param string $type The notification type (success, error, warning, info)
     * @param string $title Optional title for the notification
     * @return void
     */
    public static function send_admin_notice($message, $type = self::TYPE_INFO, $title = '') {
        $title_html = $title ? '<strong>' . \esc_html($title) . '</strong> ' : '';
        echo '<div class="notice notice-' . \esc_attr($type) . ' is-dismissible"><p>' . $title_html . \esc_html($message) . '</p></div>';
    }
    
    /**
     * Log a notification
     *
     * @param string $message The notification message
     * @param string $type The notification type
     * @param array $context Additional context data
     * @return void
     */
    public static function log_notification($message, $type = self::TYPE_INFO, $context = []) {
        // Use the existing logger if available
        if (class_exists('Bema_Hub\Bema_Hub_Logger')) {
            $logger = Bema_Hub_Logger::create('notifications');
            $logger->log($type, $message, $context);
        }
    }
    
    /**
     * Send a notification via multiple channels
     *
     * @param string $message The notification message
     * @param string $type The notification type
     * @param array $channels The channels to send the notification through
     * @param array $context Additional context data
     * @return void
     */
    public static function send_notification($message, $type = self::TYPE_INFO, $channels = ['admin_notice'], $context = []) {
        foreach ($channels as $channel) {
            switch ($channel) {
                case 'admin_notice':
                    self::send_admin_notice($message, $type);
                    break;
                case 'log':
                    self::log_notification($message, $type, $context);
                    break;
                // Additional channels can be added here
            }
        }
    }
}