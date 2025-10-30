# WordPress Setup for Bema Hub Blog

## Required WordPress Plugins

### 1. JWT Authentication for WP REST API
```bash
# Install via WordPress admin or upload plugin
# Plugin: JWT Authentication for WP REST API
# Author: Enrique Chavez
```

### 2. WordPress Configuration

Add to `wp-config.php`:

```php
// JWT Authentication
define('JWT_AUTH_SECRET_KEY', 'your-top-secret-key');
define('JWT_AUTH_CORS_ENABLE', true);

// CORS Headers
add_action('init', 'handle_preflight');
function handle_preflight() {
    if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, POST, OPTIONS, DELETE');
        header('Access-Control-Allow-Headers: Authorization, Content-Type');
        exit(0);
    }
}

// Enable CORS for REST API
add_action('rest_api_init', function() {
    remove_filter('rest_pre_serve_request', 'rest_send_cors_headers');
    add_filter('rest_pre_serve_request', function($value) {
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, POST, OPTIONS, DELETE');
        header('Access-Control-Allow-Headers: Authorization, Content-Type');
        return $value;
    });
});
```

### 3. .htaccess Configuration

Add to `.htaccess`:

```apache
# JWT Authentication
RewriteCond %{HTTP:Authorization} ^(.*)
RewriteRule .* - [e=HTTP_AUTHORIZATION:%1]

# CORS Headers
Header always set Access-Control-Allow-Origin "*"
Header always set Access-Control-Allow-Methods "GET, POST, OPTIONS, DELETE"
Header always set Access-Control-Allow-Headers "Authorization, Content-Type"
```

## WordPress User Setup

### Create Blog Editor User
1. Go to WordPress Admin → Users → Add New
2. Username: `blog-editor`
3. Email: `blog@bemahub.local`
4. Role: `Editor` or `Administrator`
5. Set strong password

### Test Authentication
```bash
curl -X POST http://www.bemahub.local/wp-json/jwt-auth/v1/token \
  -H "Content-Type: application/json" \
  -d '{"username":"blog-editor","password":"your-password"}'
```

## Environment Variables

Update `.env.local`:

```env
# WordPress API
NEXT_PUBLIC_API_URL=http://www.bemahub.local

# WordPress Auth (for testing)
WP_USERNAME=blog-editor
WP_PASSWORD=your-password
```

## Testing Endpoints

### Get Posts
```bash
curl http://www.bemahub.local/wp-json/wp/v2/posts
```

### Create Post (with auth)
```bash
curl -X POST http://www.bemahub.local/wp-json/wp/v2/posts \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Post","content":"Test content","status":"publish"}'
```

### Upload Media
```bash
curl -X POST http://www.bemahub.local/wp-json/wp/v2/media \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@image.jpg"
```

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure CORS headers are properly configured
   - Check .htaccess file
   - Verify wp-config.php settings

2. **JWT Token Issues**
   - Verify JWT_AUTH_SECRET_KEY is set
   - Check plugin is activated
   - Ensure .htaccess rewrite rules are working

3. **Permission Errors**
   - User must have proper capabilities
   - Check WordPress user roles
   - Verify file upload permissions

### Debug Mode

Enable WordPress debug mode in `wp-config.php`:

```php
define('WP_DEBUG', true);
define('WP_DEBUG_LOG', true);
define('WP_DEBUG_DISPLAY', false);
```

Check logs in `/wp-content/debug.log`
