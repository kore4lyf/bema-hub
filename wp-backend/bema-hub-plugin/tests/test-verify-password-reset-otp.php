<?php
/**
 * Test for the verify password reset OTP endpoint
 *
 * This test verifies that the OTP verification endpoint works correctly
 * for the Next.js frontend flow.
 */

// Test data
$email = 'test@example.com';
$otp_code = '123456';

// Test the endpoint
$endpoint = '/wp-json/bema-hub/v1/auth/verify-password-reset-otp';

// Test case 1: Missing parameters
echo "Test 1: Missing parameters\n";
$response = wp_remote_post(home_url($endpoint), array(
    'headers' => array('Content-Type' => 'application/json'),
    'body' => json_encode(array())
));

if (is_wp_error($response)) {
    echo "Error: " . $response->get_error_message() . "\n";
} else {
    $body = json_decode(wp_remote_retrieve_body($response), true);
    $code = wp_remote_retrieve_response_code($response);
    echo "Response Code: " . $code . "\n";
    echo "Response Body: " . print_r($body, true) . "\n";
}

// Test case 2: Valid request (would need a real user and OTP in the database)
echo "\nTest 2: Valid request (requires setup)\n";
$response = wp_remote_post(home_url($endpoint), array(
    'headers' => array('Content-Type' => 'application/json'),
    'body' => json_encode(array(
        'email' => $email,
        'otp_code' => $otp_code
    ))
));

if (is_wp_error($response)) {
    echo "Error: " . $response->get_error_message() . "\n";
} else {
    $body = json_decode(wp_remote_retrieve_body($response), true);
    $code = wp_remote_retrieve_response_code($response);
    echo "Response Code: " . $code . "\n";
    echo "Response Body: " . print_r($body, true) . "\n";
}

echo "\nTest completed.\n";