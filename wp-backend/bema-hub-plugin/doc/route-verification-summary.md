# Route Verification Summary

## Overview
This document provides multiple methods to verify that the Bema Hub plugin REST API routes are properly registered and functioning as expected.

## Verification Methods

### 1. WordPress Admin Interface Verification

#### Site Health Check
1. Navigate to **Tools > Site Health** in the WordPress admin dashboard
2. Look for REST API related checks
3. Review any reported issues with API endpoints

#### Plugin Menu Verification
1. Navigate to the **Bema Hub** menu in the WordPress admin
2. Confirm that the settings page loads correctly
3. Verify that all tabs (General, Email, OTP) are accessible

### 2. WP-CLI Verification

#### List All Bema Hub Routes
```bash
wp rest route list --match=bema-hub
```

#### List All Routes (Filter Manually)
```bash
wp rest route list | grep bema-hub
```

#### Test Specific Endpoints
```bash
# Test signup endpoint
wp rest request POST /bema-hub/v1/auth/signup --body='{"email":"test@example.com","password":"password123","first_name":"Test","last_name":"User","country":"USA"}'

# Test signin endpoint
wp rest request POST /bema-hub/v1/auth/signin --body='{"username":"test@example.com","password":"password123"}'
```

### 3. Direct HTTP Testing

#### Using cURL
```bash
# Test signup endpoint
curl -X POST \
  http://yoursite.com/wp-json/bema-hub/v1/auth/signup \
  -H 'Content-Type: application/json' \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "first_name": "Test",
    "last_name": "User",
    "country": "USA"
  }'

# Test signin endpoint
curl -X POST \
  http://yoursite.com/wp-json/bema-hub/v1/auth/signin \
  -H 'Content-Type: application/json' \
  -d '{
    "username": "test@example.com",
    "password": "password123"
  }'
```

#### Using Postman or Similar Tools
1. Set up requests for each endpoint
2. Test with valid and invalid data
3. Verify response codes and content
4. Check authentication requirements

### 4. Code-Based Verification

#### Check REST Server Registration
```php
// Add this to a temporary plugin file or theme functions.php for testing
add_action('init', function() {
    global $wp_rest_server;
    
    if ($wp_rest_server) {
        $routes = $wp_rest_server->get_routes();
        
        // Check for Bema Hub routes
        foreach ($routes as $route => $handlers) {
            if (strpos($route, 'bema-hub') !== false) {
                error_log("Found Bema Hub route: " . $route);
            }
        }
    }
});
```

#### Plugin Method Verification
The Bema_Hub class includes a built-in verification method:
```php
$bema_hub = new Bema_Hub\Bema_Hub();
$verification_results = $bema_hub->verify_jwt_routes();
```

## Expected Routes

### Authentication Routes
- `POST /wp-json/bema-hub/v1/auth/signup`
- `POST /wp-json/bema-hub/v1/auth/verify-otp`
- `POST /wp-json/bema-hub/v1/auth/signin`
- `POST /wp-json/bema-hub/v1/auth/social-login`
- `POST /wp-json/bema-hub/v1/auth/validate`
- `POST /wp-json/bema-hub/v1/auth/resend-otp`
- `POST /wp-json/bema-hub/v1/auth/reset-password-request`
- `POST /wp-json/bema-hub/v1/auth/reset-password-verify`
- `POST /wp-json/bema-hub/v1/auth/reset-password`
- `POST /wp-json/bema-hub/v1/auth/signout`

### Protected Routes
- `GET /wp-json/bema-hub/v1/profile`
- `PUT /wp-json/bema-hub/v1/profile`

## Common Issues and Solutions

### Routes Not Found (404 Errors)
1. **Check Plugin Activation**: Ensure the Bema Hub plugin is activated
2. **Verify REST API Enabled**: Confirm WordPress REST API is not disabled
3. **Check Permalink Settings**: Visit Settings > Permalinks and save to refresh rewrite rules
4. **Clear Caches**: Clear any caching plugins or server-side caches

### Authentication Issues (401 Errors)
1. **Verify JWT Secret**: Ensure JWT_SECRET is defined in wp-config.php
2. **Check Token Format**: Ensure tokens are properly formatted
3. **Verify User Permissions**: Confirm user has appropriate capabilities

### Server Configuration Issues
1. **.htaccess Problems**: Check .htaccess file for proper rewrite rules
2. **Apache mod_rewrite**: Ensure mod_rewrite is enabled
3. **Nginx Configuration**: Verify nginx configuration for REST API requests

## Testing Checklist

### Basic Functionality
- [ ] All routes are registered and accessible
- [ ] Authentication endpoints accept valid requests
- [ ] Protected endpoints require valid authentication
- [ ] Error responses are properly formatted
- [ ] Success responses include expected data

### Security Verification
- [ ] JWT tokens are properly generated and validated
- [ ] OTP verification works as expected
- [ ] Password reset functionality is secure
- [ ] Rate limiting is implemented where appropriate
- [ ] Sensitive data is not exposed in logs

### Performance Testing
- [ ] Endpoints respond within acceptable time limits
- [ ] Database queries are optimized
- [ ] Caching is properly implemented
- [ ] Concurrent requests are handled correctly

## Monitoring and Maintenance

### Ongoing Verification
1. Regular testing of critical endpoints
2. Monitoring of error logs for API-related issues
3. Performance monitoring for response times
4. Security audits of authentication mechanisms

### Update Verification
1. After plugin updates, verify all routes still function
2. Test new features and endpoints
3. Confirm backward compatibility
4. Update documentation as needed

## Conclusion

The Bema Hub plugin implements a comprehensive REST API with proper WordPress integration. Multiple verification methods are available to ensure routes are properly registered and functioning. Regular verification helps maintain the reliability and security of the authentication system.