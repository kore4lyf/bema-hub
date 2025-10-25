<?php
/**
 * Plugin Name: Bema Hub
 * Description: WordPress plugin for Bema Hub platform
 * Version: 1.0.0
 * Requires at least: 5.6
 * Requires PHP: 7.4
 * Author: Bema Integrated Services
 * Author URI: https://bemamusic.com
 * License: GPL v2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: bema-crm
 * Domain Path: /languages
 *
 * @package Bema Hub
 * @author  Bema Music
 * @since   0.1.0
 *
 */

// If this file is called directly, abort.
if (!defined('WPINC')) {
    die;
}

// Define plugin constants
define('BEMA_HUB_PLUGIN_VERSION', '1.0.0');
define('BEMA_HUB_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('BEMA_HUB_PLUGIN_URL', plugin_dir_url(__FILE__));

/**
 * The code that runs during plugin activation.
 * This action is documented in includes/class-bema-hub-activator.php
 */
function activate_bema_hub_plugin() {
    require_once plugin_dir_path( __FILE__ ) . 'includes/class-bema-hub-activator.php';
    Bema_Hub\Bema_Hub_Activator::activate();
}

/**
 * The code that runs during plugin deactivation.
 * This action is documented in includes/class-bema-hub-deactivator.php
 */
function deactivate_bema_hub_plugin() {
    require_once plugin_dir_path( __FILE__ ) . 'includes/class-bema-hub-deactivator.php';
    Bema_Hub\Bema_Hub_Deactivator::deactivate();
}

register_activation_hook(__FILE__, 'activate_bema_hub_plugin');
register_deactivation_hook(__FILE__, 'deactivate_bema_hub_plugin');

/**
 * The core plugin class that is used to define internationalization,
 * admin-specific hooks, and public-facing site hooks.
 */
require plugin_dir_path( __FILE__ ) . 'includes/class-bema-hub.php';

/**
 * Begins execution of the plugin.
 *
 * Since everything within the plugin is registered via hooks,
 * then kicking off the plugin from this point in the file does
 * not affect the page life cycle.
 *
 * @since    1.0.0
 */
function run_bema_hub_plugin() {
    $plugin = new Bema_Hub\Bema_Hub();
    $plugin->run();
}

run_bema_hub_plugin();