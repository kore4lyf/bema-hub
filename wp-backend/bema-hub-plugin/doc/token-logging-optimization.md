# Token Logging Optimization

## Overview
This document describes the optimization implemented to reduce excessive logging of "Invalidated tokens saved to database" messages in the Bema Hub plugin. The fix prevents unnecessary database updates and log entries when there are no changes to the invalidated tokens.

## Problem Identified
The original implementation was causing excessive logging with entries like:
```
[2025-10-29 13:40:10] INFO: Invalidated tokens saved to database {"count":11,"correlation_id":"Bema_Crowdfunding_6902193a410f00.11605818"}
[2025-10-29 13:41:36] INFO: Invalidated tokens saved to database {"count":11,"correlation_id":"Bema_Crowdfunding_6902198f452192.71710062"}
...
```

This was happening on every WordPress shutdown event, even when there were no changes to the invalidated tokens, which would be problematic for production sites with high traffic.

## Solution Implemented

### Optimized save_invalidated_tokens() Method
```php
public function save_invalidated_tokens() {
    if ($this->user_controller) {
        $tokens = $this->user_controller->get_invalidated_tokens();
        
        // Only update if there are tokens and they've changed
        $existing_tokens = \get_option('bema_hub_invalidated_tokens', array());
        
        // Check if tokens have changed (simple array comparison)
        $tokens_changed = ($tokens !== $existing_tokens);
        
        if ($tokens_changed) {
            \update_option('bema_hub_invalidated_tokens', $tokens, false);
            
            if ($this->logger) {
                $this->logger->info('Invalidated tokens saved to database', array(
                    'count' => count($tokens),
                    'changed' => true
                ));
            }
        } elseif (!empty($tokens) && $this->logger) {
            // Log only when there are tokens but they haven't changed
            // This can be removed in production to reduce logging
            $this->logger->debug('Invalidated tokens unchanged, skipping database update', array(
                'count' => count($tokens),
                'changed' => false
            ));
        }
    }
}
```

## Key Improvements

### 1. Change Detection
- Compares current tokens with existing tokens in database
- Only performs database update when there are actual changes
- Prevents unnecessary I/O operations

### 2. Reduced Logging
- Only logs when tokens are actually saved to database
- Uses debug level for unchanged tokens (can be disabled in production)
- Eliminates repetitive INFO level log entries

### 3. Performance Benefits
- Reduces database writes on every request
- Decreases I/O overhead
- Improves overall site performance

## Implementation Details

### Before Fix
- Database update on every shutdown event
- INFO log entry on every shutdown event
- No change detection

### After Fix
- Database update only when tokens change
- INFO log entry only when tokens change
- DEBUG log entry for unchanged tokens (optional)
- Efficient array comparison for change detection

## Benefits

### 1. Production Ready
- Eliminates excessive logging that would fill up disk space
- Reduces database load
- Improves site performance

### 2. Better Monitoring
- Log entries now indicate actual changes
- Easier to identify when token invalidation occurs
- More meaningful audit trail

### 3. Scalability
- Suitable for high-traffic sites
- Minimal performance impact
- Efficient resource usage

## Technical Notes

### Static Analysis Warnings
The implementation may show static analysis warnings for WordPress core functions:
- These are normal and do not affect runtime functionality
- Functions are properly prefixed with backslashes for global namespace access
- The warnings are common in static analysis tools when analyzing WordPress plugins

### Logger Integration
- Uses existing `Bema_Hub_Logger` system
- Maintains consistent logging format with other plugin components
- Follows WordPress plugin development best practices

## Usage Instructions

No changes are required for existing functionality. The optimization works automatically:
1. When users sign out, tokens are invalidated as before
2. Only changed token lists are saved to database
3. Log entries only appear when actual changes occur

## Monitoring

### Log File Location
- Path: `/wp-content/uploads/bema-crowdfunding-logger/rest-api/rest-api.log`

### Expected Log Pattern
After the fix, you should see:
- INFO entries only when tokens are actually invalidated and saved
- DEBUG entries (if enabled) for unchanged tokens
- Significant reduction in log volume

### Troubleshooting
If you still see excessive logging:
1. Check if DEBUG level logging is enabled
2. Verify the change detection is working correctly
3. Ensure the logger configuration is appropriate for your environment