<?php
namespace Bema_Hub\Admin;

/**
 * The admin-specific functionality of the plugin.
 *
 * Defines the plugin name, version, and two examples hooks for how to
 * enqueue the admin-specific stylesheet and JavaScript.
 *
 * @since      1.0.0
 * @package    Bema_Hub
 * @subpackage Bema_Hub/admin
 */
class Bema_Hub_Admin {

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
	 * Register the stylesheets for the admin area.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_styles() {
		\wp_enqueue_style( $this->plugin_name, \plugin_dir_url( __FILE__ ) . 'css/bema-hub-admin.css', array(), $this->version, 'all' );
	}

	/**
	 * Register the JavaScript for the admin area.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_scripts() {
		\wp_enqueue_script( $this->plugin_name, \plugin_dir_url( __FILE__ ) . 'js/bema-hub-admin.js', array( 'jquery' ), $this->version, false );
	}

	/**
	 * Add the OTP settings menu page
	 *
	 * @since    1.0.0
	 */
	public function add_menu_page() {
		add_menu_page(
			'Bema Hub Settings',           // Page title
			'Bema Hub',                    // Menu title
			'manage_options',              // Capability
			'bema-hub-settings',           // Menu slug (Main page)
			array($this, 'settings_page'), // Function to render the page
			'dashicons-email',             // Icon
			60                             // Position
		);
	}

	/**
	 * Main renderer function for the settings page
	 *
	 * @since    1.0.0
	 */
	public function settings_page() {
		// Determine the current active tab
		$active_tab = isset( $_GET[ 'tab' ] ) ? $_GET[ 'tab' ] : 'general';
		
		// Check for settings update messages
		$settings_updated = isset( $_GET[ 'settings-updated' ] ) ? $_GET[ 'settings-updated' ] : false;
		?>
		<div class="wrap">
			<h2>Bema Hub Settings</h2>
			
			<?php if ( $settings_updated === 'true' ) : ?>
				<div class="notice notice-success is-dismissible">
					<p><strong>Settings saved successfully!</strong></p>
				</div>
			<?php elseif ( $settings_updated === 'false' ) : ?>
				<div class="notice notice-error is-dismissible">
					<p><strong>Error saving settings. Please try again.</strong></p>
				</div>
			<?php endif; ?>
			
			<h2 class="nav-tab-wrapper">
				<a href="?page=bema-hub-settings&tab=general" class="nav-tab <?php echo $active_tab == 'general' ? 'nav-tab-active' : ''; ?>">General</a>
				<a href="?page=bema-hub-settings&tab=email" class="nav-tab <?php echo $active_tab == 'email' ? 'nav-tab-active' : ''; ?>">Email (SMTP)</a>
				<a href="?page=bema-hub-settings&tab=otp" class="nav-tab <?php echo $active_tab == 'otp' ? 'nav-tab-active' : ''; ?>">OTP Settings</a>
			</h2>

			<?php 
			if( $active_tab == 'email' ) {
				// Call the function to display the Email tab content
				$this->email_tab_content();
			} elseif( $active_tab == 'otp' ) {
				// Call the function to display the OTP tab content
				$this->otp_tab_content();
			} else {
				// Placeholder for the General tab content
				echo '<h3>General Settings</h3><p>Content for general plugin options will go here.</p>';
			}
			?>
		</div>
		<?php
	}

	/**
	 * Register settings specific to the Email tab
	 *
	 * @since    1.0.0
	 */
	public function register_email_settings() {
		// Register a setting group named 'bema-hub-smtp-group' for the 'bema_hub_smtp_settings' option array
		register_setting( 'bema-hub-smtp-group', 'bema_hub_smtp_settings', array($this, 'smtp_settings_validate') );

		add_settings_section(
			'bema-hub-smtp-main-section',
			'SMTP Mailer Credentials',
			array($this, 'smtp_plugin_section_callback'), // Section introduction text
			'bema-hub-smtp-settings-email' // Unique page slug for this tab's settings
		);
		
		// Define all SMTP fields
		add_settings_field('smtp_host', 'SMTP Host', array($this, 'smtp_plugin_field_callback'), 'bema-hub-smtp-settings-email', 'bema-hub-smtp-main-section', ['field' => 'host']);
		add_settings_field('smtp_port', 'SMTP Port', array($this, 'smtp_plugin_field_callback'), 'bema-hub-smtp-settings-email', 'bema-hub-smtp-main-section', ['field' => 'port']);
		add_settings_field('smtp_secure', 'Encryption', array($this, 'smtp_plugin_field_callback'), 'bema-hub-smtp-settings-email', 'bema-hub-smtp-main-section', ['field' => 'secure']);
		add_settings_field('smtp_user', 'Username (Email)', array($this, 'smtp_plugin_field_callback'), 'bema-hub-smtp-settings-email', 'bema-hub-smtp-main-section', ['field' => 'user']);
		add_settings_field('smtp_pass', 'Password/App Key', array($this, 'smtp_plugin_field_callback'), 'bema-hub-smtp-settings-email', 'bema-hub-smtp-main-section', ['field' => 'pass', 'type' => 'password']);
		add_settings_field('smtp_from_name', 'From Name', array($this, 'smtp_plugin_field_callback'), 'bema-hub-smtp-settings-email', 'bema-hub-smtp-main-section', ['field' => 'name']);
	}

	/**
	 * Register settings specific to the OTP tab
	 *
	 * @since    1.0.0
	 */
	public function register_otp_settings() {
		// Register a setting group named 'bema-hub-otp-group' for the 'bema_hub_otp_settings' option array
		register_setting( 'bema-hub-otp-group', 'bema_hub_otp_settings', array($this, 'otp_settings_validate') );

		add_settings_section(
			'bema-hub-otp-main-section',
			'OTP Verification Settings',
			array($this, 'otp_plugin_section_callback'), // Section introduction text
			'bema-hub-otp-settings' // Unique page slug for this tab's settings
		);
		
		// Define all OTP fields
		add_settings_field('otp_expiry_time', 'OTP Expiry Time (minutes)', array($this, 'otp_plugin_field_callback'), 'bema-hub-otp-settings', 'bema-hub-otp-main-section', ['field' => 'expiry_time']);
		add_settings_field('otp_length', 'OTP Length', array($this, 'otp_plugin_field_callback'), 'bema-hub-otp-settings', 'bema-hub-otp-main-section', ['field' => 'length']);
		add_settings_field('otp_max_attempts', 'Max Verification Attempts', array($this, 'otp_plugin_field_callback'), 'bema-hub-otp-settings', 'bema-hub-otp-main-section', ['field' => 'max_attempts']);
		add_settings_field('otp_resend_delay', 'Resend Delay (seconds)', array($this, 'otp_plugin_field_callback'), 'bema-hub-otp-settings', 'bema-hub-otp-main-section', ['field' => 'resend_delay']);
	}

	/**
	 * Function to display the Email tab content and form
	 *
	 * @since    1.0.0
	 */
	public function email_tab_content() {
		?>
		<h3>Email Settings (SMTP)</h3>
		<form method="post" action="options.php">
			<?php
			settings_fields( 'bema-hub-smtp-group' ); // The setting group registered above
			do_settings_sections( 'bema-hub-smtp-settings-email' ); // The page slug used for fields
			submit_button();
			?>
		</form>
		<?php
	}

	/**
	 * Function to display the OTP tab content and form
	 *
	 * @since    1.0.0
	 */
	public function otp_tab_content() {
		?>
		<h3>OTP Verification Settings</h3>
		<form method="post" action="options.php">
			<?php
			settings_fields( 'bema-hub-otp-group' ); // The setting group registered above
			do_settings_sections( 'bema-hub-otp-settings' ); // The page slug used for fields
			submit_button();
			?>
		</form>
		<?php
	}

	/**
	 * Section Callback (Intro text for SMTP)
	 *
	 * @since    1.0.0
	 */
	public function smtp_plugin_section_callback() {
		echo '<p>Configure your external SMTP server details to ensure reliable email delivery.</p>';
	}

	/**
	 * Section Callback (Intro text for OTP)
	 *
	 * @since    1.0.0
	 */
	public function otp_plugin_section_callback() {
		echo '<p>Configure OTP verification settings for user authentication.</p>';
	}

	/**
	 * Field Callback (Renders SMTP inputs)
	 *
	 * @since    1.0.0
	 */
	public function smtp_plugin_field_callback( $args ) {
		$options = get_option( 'bema_hub_smtp_settings' );
		$field   = $args['field'];
		$type    = isset($args['type']) ? $args['type'] : 'text';
		$value   = isset( $options[ $field ] ) ? esc_attr( $options[ $field ] ) : '';
		
		echo '<input type="' . $type . '" name="bema_hub_smtp_settings[' . $field . ']" value="' . $value . '" style="width: 350px;" />';

		if ($field === 'secure') {
			echo '<p class="description">Use "tls" (Port 587) or "ssl" (Port 465). Blank for none.</p>';
		} elseif ($field === 'port') {
			echo '<p class="description">Common ports: 587 (TLS), 465 (SSL), 25 (None)</p>';
		}
	}

	/**
	 * Field Callback (Renders OTP inputs)
	 *
	 * @since    1.0.0
	 */
	public function otp_plugin_field_callback( $args ) {
		$options = get_option( 'bema_hub_otp_settings' );
		$field   = $args['field'];
		$value   = isset( $options[ $field ] ) ? esc_attr( $options[ $field ] ) : '';
		
		// Set default values if not set
		if (empty($value)) {
			switch ($field) {
				case 'expiry_time':
					$value = '10'; // 10 minutes
					break;
				case 'length':
					$value = '6'; // 6 digits
					break;
				case 'max_attempts':
					$value = '3'; // 3 attempts
					break;
				case 'resend_delay':
					$value = '60'; // 60 seconds
					break;
			}
		}
		
		echo '<input type="number" name="bema_hub_otp_settings[' . $field . ']" value="' . $value . '" style="width: 100px;" />';

		// Add descriptions for each field
		switch ($field) {
			case 'expiry_time':
				echo '<p class="description">Time in minutes before OTP expires (1-60 minutes)</p>';
				break;
			case 'length':
				echo '<p class="description">Number of digits in OTP (4-10 digits)</p>';
				break;
			case 'max_attempts':
				echo '<p class="description">Maximum verification attempts before locking (1-10 attempts)</p>';
				break;
			case 'resend_delay':
				echo '<p class="description">Delay in seconds before user can request new OTP (0-300 seconds)</p>';
				break;
		}
	}

	/**
	 * Validate SMTP settings before saving
	 *
	 * @since    1.0.0
	 */
	public function smtp_settings_validate( $input ) {
		// Validate SMTP port
		if ( isset( $input['port'] ) ) {
			$input['port'] = absint( $input['port'] );
			if ( $input['port'] < 1 || $input['port'] > 65535 ) {
				add_settings_error(
					'bema_hub_smtp_settings',
					'invalid_port',
					'Invalid SMTP port. Please enter a port between 1 and 65535.',
					'error'
				);
				return get_option( 'bema_hub_smtp_settings' ); // Return previous settings
			}
		}
		
		// Add success message
		add_settings_error(
			'bema_hub_smtp_settings',
			'smtp_settings_updated',
			'SMTP settings saved successfully!',
			'updated'
		);
		
		return $input;
	}

	/**
	 * Validate OTP settings before saving
	 *
	 * @since    1.0.0
	 */
	public function otp_settings_validate( $input ) {
		// Validate OTP expiry time
		if ( isset( $input['expiry_time'] ) ) {
			$input['expiry_time'] = absint( $input['expiry_time'] );
			if ( $input['expiry_time'] < 1 || $input['expiry_time'] > 60 ) {
				add_settings_error(
					'bema_hub_otp_settings',
					'invalid_expiry_time',
					'Invalid OTP expiry time. Please enter a value between 1 and 60 minutes.',
					'error'
				);
				return get_option( 'bema_hub_otp_settings' ); // Return previous settings
			}
		}
		
		// Validate OTP length
		if ( isset( $input['length'] ) ) {
			$input['length'] = absint( $input['length'] );
			if ( $input['length'] < 4 || $input['length'] > 10 ) {
				add_settings_error(
					'bema_hub_otp_settings',
					'invalid_length',
					'Invalid OTP length. Please enter a value between 4 and 10 digits.',
					'error'
				);
				return get_option( 'bema_hub_otp_settings' ); // Return previous settings
			}
		}
		
		// Validate max attempts
		if ( isset( $input['max_attempts'] ) ) {
			$input['max_attempts'] = absint( $input['max_attempts'] );
			if ( $input['max_attempts'] < 1 || $input['max_attempts'] > 10 ) {
				add_settings_error(
					'bema_hub_otp_settings',
					'invalid_max_attempts',
					'Invalid max attempts. Please enter a value between 1 and 10 attempts.',
					'error'
				);
				return get_option( 'bema_hub_otp_settings' ); // Return previous settings
			}
		}
		
		// Validate resend delay
		if ( isset( $input['resend_delay'] ) ) {
			$input['resend_delay'] = absint( $input['resend_delay'] );
			if ( $input['resend_delay'] < 0 || $input['resend_delay'] > 300 ) {
				add_settings_error(
					'bema_hub_otp_settings',
					'invalid_resend_delay',
					'Invalid resend delay. Please enter a value between 0 and 300 seconds.',
					'error'
				);
				return get_option( 'bema_hub_otp_settings' ); // Return previous settings
			}
		}
		
		// Add success message
		add_settings_error(
			'bema_hub_otp_settings',
			'otp_settings_updated',
			'OTP settings saved successfully!',
			'updated'
		);
		
		return $input;
	}

	/**
	 * Hook into the PHPMailer setup globally
	 *
	 * @since    1.0.0
	 */
	public function load_smtp_settings( $phpmailer ) {
		// Retrieve the saved SMTP settings array
		$options = get_option( 'bema_hub_smtp_settings' );

		// Check if the required settings exist and are not empty
		if ( ! is_array( $options ) || empty( $options['host'] ) || empty( $options['user'] ) || empty( $options['pass'] ) ) {
			return; // If settings are incomplete, use default PHP mail()
		}
		
		// Apply settings retrieved from the Options API
		$phpmailer->isSMTP();
		$phpmailer->Host       = $options['host'];
		$phpmailer->Port       = (int) $options['port']; // Cast to int for security
		$phpmailer->Username   = $options['user'];
		$phpmailer->Password   = $options['pass'];
		$phpmailer->SMTPAuth   = true;
		
		if ( ! empty( $options['secure'] ) ) {
			$phpmailer->SMTPSecure = $options['secure'];
		}
		
		// Set default From details
		$phpmailer->From       = $options['user']; // Use username as From email
		if ( ! empty( $options['name'] ) ) {
			$phpmailer->FromName   = $options['name'];
		}
	}
}