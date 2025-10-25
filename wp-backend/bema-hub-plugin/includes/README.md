# Bema Hub Plugin - Includes Directory Structure

This document explains the organization of the includes directory.

## Directory Structure

```
includes/
├── auth/                 # Authentication related classes
│   ├── class-bema-hub-jwt-auth.php
│   └── index.php
├── logger/               # Logging functionality
│   ├── class-bema-logger.php
│   └── index.php
├── notification/         # Notification system
│   ├── class-bema-crm-notifier.php
│   └── index.php
├── rest/                 # REST API controllers
│   ├── class-bema-hub-rest-api.php
│   └── index.php
├── class-bema-hub-activator.php
├── class-bema-hub-deactivator.php
├── class-bema-hub-i18n.php
├── class-bema-hub-loader.php
├── class-bema-hub.php
└── index.php
```

## Component Descriptions

### Authentication (auth/)
Contains classes related to user authentication and JWT token handling.

### Logger (logger/)
Contains the logging system with file rotation and cleanup functionality.

### Notification (notification/)
Contains the notification system for sending messages to users.

### REST API (rest/)
Contains controllers for handling REST API endpoints.

### Core Classes
- `class-bema-hub-activator.php` - Plugin activation logic
- `class-bema-hub-deactivator.php` - Plugin deactivation logic
- `class-bema-hub-i18n.php` - Internationalization support
- `class-bema-hub-loader.php` - Hook management system
- `class-bema-hub.php` - Main plugin class

This structure follows WordPress plugin development best practices for organization and maintainability.