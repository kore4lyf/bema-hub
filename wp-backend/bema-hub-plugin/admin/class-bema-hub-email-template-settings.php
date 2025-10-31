<?php
namespace Bema_Hub\Admin;

/**
 * Email Template Settings class for Bema Hub plugin
 *
 * Handles the admin settings page for email template configuration
 *
 * @since      1.0.0
 * @package    Bema_Hub
 * @subpackage Bema_Hub/admin
 */
class Bema_Hub_Email_Template_Settings {

	/**
	 * The ID of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $plugin_name    The ID of this plugin.
	 */
	private $plugin_name;

	/**
	 * The version of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $version    The current version of this plugin.
	 */
	private $version;

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    1.0.0
	 * @param      string    $plugin_name       The name of this plugin.
	 * @param      string    $version    The version of this plugin.
	 */
	public function __construct( $plugin_name, $version ) {
		$this->plugin_name = $plugin_name;
		$this->version = $version;
	}

	/**
	 * Add the Email Template settings submenu page
	 *
	 * @since    1.0.0
	 */
	public function add_submenu_page() {
		add_submenu_page(
			'bema-hub-settings',           // Parent slug
			'Email Templates',             // Page title
			'Email Templates',             // Menu title
			'manage_options',              // Capability
			'bema-hub-email-templates',    // Menu slug
			array($this, 'settings_page')  // Function to render the page
		);
	}

	/**
	 * Main renderer function for the email template settings page
	 *
	 * @since    1.0.0
	 */
	public function settings_page() {
		// Handle form submissions
		if (isset($_POST['submit']) && isset($_POST['bema_hub_email_template_settings'])) {
			$this->save_settings();
		}
		
		// Get current settings
		$settings = get_option('bema_hub_email_template_settings', array());
		
		// Determine the current active tab
		$active_tab = isset($_GET['template_tab']) ? $_GET['template_tab'] : 'general';
		
		// Check for settings update messages
		$settings_updated = isset($_GET['settings-updated']) ? $_GET['settings-updated'] : false;
		?>
		<div class="wrap">
			<h2>Email Templates</h2>
			
			<?php if ($settings_updated === 'true') : ?>
				<div class="notice notice-success is-dismissible">
					<p><strong>Settings saved successfully!</strong></p>
				</div>
			<?php elseif ($settings_updated === 'false') : ?>
				<div class="notice notice-error is-dismissible">
					<p><strong>Error saving settings. Please try again.</strong></p>
				</div>
			<?php endif; ?>
			
			<h2 class="nav-tab-wrapper">
				<a href="?page=bema-hub-email-templates&template_tab=general" class="nav-tab <?php echo $active_tab == 'general' ? 'nav-tab-active' : ''; ?>">General</a>
				<a href="?page=bema-hub-email-templates&template_tab=password_reset" class="nav-tab <?php echo $active_tab == 'password_reset' ? 'nav-tab-active' : ''; ?>">Password Reset</a>
			</h2>

			<form method="post" action="">
				<?php wp_nonce_field('bema_hub_email_template_settings', 'bema_hub_email_template_nonce'); ?>
				
				<?php 
				if ($active_tab == 'password_reset') {
					$this->password_reset_tab_content($settings);
				} else {
					$this->general_tab_content($settings);
				}
				?>
				
				<?php submit_button(); ?>
			</form>
		</div>
		<?php
	}

	/**
	 * Function to display the General tab content and form
	 *
	 * @since    1.0.0
	 */
	public function general_tab_content($settings) {
		// Default values
		$logo_url = isset($settings['logo_url']) ? $settings['logo_url'] : '';
		$website_name = isset($settings['website_name']) ? $settings['website_name'] : get_bloginfo('name');
		$company_email = isset($settings['company_email']) ? $settings['company_email'] : get_bloginfo('admin_email');
		$company_phone = isset($settings['company_phone']) ? $settings['company_phone'] : '';
		$facebook_url = isset($settings['facebook_url']) ? $settings['facebook_url'] : '';
		$twitter_url = isset($settings['twitter_url']) ? $settings['twitter_url'] : '';
		$instagram_url = isset($settings['instagram_url']) ? $settings['instagram_url'] : '';
		?>
		<h3>General Email Settings</h3>
		<table class="form-table">
			<tr>
				<th scope="row">Logo URL</th>
				<td>
					<input type="text" name="bema_hub_email_template_settings[logo_url]" value="<?php echo esc_attr($logo_url); ?>" class="regular-text" />
					<p class="description">URL to your company logo (recommended size: 200x60px)</p>
				</td>
			</tr>
			<tr>
				<th scope="row">Website Name</th>
				<td>
					<input type="text" name="bema_hub_email_template_settings[website_name]" value="<?php echo esc_attr($website_name); ?>" class="regular-text" />
				</td>
			</tr>
			<tr>
				<th scope="row">Company Email</th>
				<td>
					<input type="email" name="bema_hub_email_template_settings[company_email]" value="<?php echo esc_attr($company_email); ?>" class="regular-text" />
				</td>
			</tr>
			<tr>
				<th scope="row">Company Phone</th>
				<td>
					<input type="text" name="bema_hub_email_template_settings[company_phone]" value="<?php echo esc_attr($company_phone); ?>" class="regular-text" />
				</td>
			</tr>
			<tr>
				<th scope="row">Facebook URL</th>
				<td>
					<input type="url" name="bema_hub_email_template_settings[facebook_url]" value="<?php echo esc_attr($facebook_url); ?>" class="regular-text" />
				</td>
			</tr>
			<tr>
				<th scope="row">Twitter URL</th>
				<td>
					<input type="url" name="bema_hub_email_template_settings[twitter_url]" value="<?php echo esc_attr($twitter_url); ?>" class="regular-text" />
				</td>
			</tr>
			<tr>
				<th scope="row">Instagram URL</th>
				<td>
					<input type="url" name="bema_hub_email_template_settings[instagram_url]" value="<?php echo esc_attr($instagram_url); ?>" class="regular-text" />
				</td>
			</tr>
		</table>
		<?php
	}

	/**
	 * Function to display the Password Reset tab content and form
	 *
	 * @since    1.0.0
	 */
	public function password_reset_tab_content($settings) {
		// Default values (using shared settings)
		$logo_url = isset($settings['logo_url']) ? $settings['logo_url'] : '';
		$website_name = isset($settings['website_name']) ? $settings['website_name'] : get_bloginfo('name');
		$company_email = isset($settings['company_email']) ? $settings['company_email'] : get_bloginfo('admin_email');
		$company_phone = isset($settings['company_phone']) ? $settings['company_phone'] : '';
		$facebook_url = isset($settings['facebook_url']) ? $settings['facebook_url'] : '';
		$twitter_url = isset($settings['twitter_url']) ? $settings['twitter_url'] : '';
		$instagram_url = isset($settings['instagram_url']) ? $settings['instagram_url'] : '';
		$password_reset_page_url = isset($settings['password_reset_page_url']) ? $settings['password_reset_page_url'] : '';
		?>
		<h3>Password Reset Email Template</h3>
		<table class="form-table">
			<tr>
				<th scope="row">Password Reset Page URL</th>
				<td>
					<input type="url" name="bema_hub_email_template_settings[password_reset_page_url]" value="<?php echo esc_attr($password_reset_page_url); ?>" class="regular-text" />
					<p class="description">URL to your password reset page where users will enter their new password (e.g., /reset-password)</p>
				</td>
			</tr>
			<tr>
				<th scope="row">Logo URL</th>
				<td>
					<input type="text" name="bema_hub_email_template_settings[logo_url]" value="<?php echo esc_attr($logo_url); ?>" class="regular-text" readonly />
					<p class="description">Managed in General tab</p>
				</td>
			</tr>
			<tr>
				<th scope="row">Website Name</th>
				<td>
					<input type="text" name="bema_hub_email_template_settings[website_name]" value="<?php echo esc_attr($website_name); ?>" class="regular-text" readonly />
					<p class="description">Managed in General tab</p>
				</td>
			</tr>
			<tr>
				<th scope="row">Company Email</th>
				<td>
					<input type="email" name="bema_hub_email_template_settings[company_email]" value="<?php echo esc_attr($company_email); ?>" class="regular-text" readonly />
					<p class="description">Managed in General tab</p>
				</td>
			</tr>
			<tr>
				<th scope="row">Company Phone</th>
				<td>
					<input type="text" name="bema_hub_email_template_settings[company_phone]" value="<?php echo esc_attr($company_phone); ?>" class="regular-text" readonly />
					<p class="description">Managed in General tab</p>
				</td>
			</tr>
			<tr>
				<th scope="row">Facebook URL</th>
				<td>
					<input type="url" name="bema_hub_email_template_settings[facebook_url]" value="<?php echo esc_attr($facebook_url); ?>" class="regular-text" readonly />
					<p class="description">Managed in General tab</p>
				</td>
			</tr>
			<tr>
				<th scope="row">Twitter URL</th>
				<td>
					<input type="url" name="bema_hub_email_template_settings[twitter_url]" value="<?php echo esc_attr($twitter_url); ?>" class="regular-text" readonly />
					<p class="description">Managed in General tab</p>
				</td>
			</tr>
			<tr>
				<th scope="row">Instagram URL</th>
				<td>
					<input type="url" name="bema_hub_email_template_settings[instagram_url]" value="<?php echo esc_attr($instagram_url); ?>" class="regular-text" readonly />
					<p class="description">Managed in General tab</p>
				</td>
			</tr>
		</table>
		<?php
	}

	/**
	 * Save email template settings
	 *
	 * @since    1.0.0
	 */
	private function save_settings() {
		// Verify nonce
		if (!isset($_POST['bema_hub_email_template_nonce']) || !wp_verify_nonce($_POST['bema_hub_email_template_nonce'], 'bema_hub_email_template_settings')) {
			wp_die('Security check failed');
		}
		
		// Check permissions
		if (!current_user_can('manage_options')) {
			wp_die('Insufficient permissions');
		}
		
		// Save settings
		if (isset($_POST['bema_hub_email_template_settings'])) {
			$settings = $_POST['bema_hub_email_template_settings'];
			update_option('bema_hub_email_template_settings', $settings);
			
			// Redirect with success message
			wp_redirect(add_query_arg(array(
				'page' => 'bema-hub-email-templates',
				'settings-updated' => 'true'
			), admin_url('admin.php')));
			exit;
		}
	}
}