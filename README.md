# Bema Hub

A campaign-based platform using an existing WordPress database with a Next.js frontend, following the Bema CORE naming framework.

## Project Structure

```
bema-hub/
├── next-frontend/          # Next.js frontend (TypeScript, App Router)
├── wp-backend/             # WordPress backend with bema-hub-plugin
│   └── bema-hub-plugin/    # Main plugin for WordPress integration
└── docs/                   # Documentation files
```

## Setup Instructions

### Prerequisites
- Node.js (version 16 or higher)
- WordPress installation with existing `wp_users` and `wp_usermeta` tables
- PHP 7.4 or higher

### Frontend Setup
1. Navigate to the `next-frontend` directory:
   ```bash
   cd next-frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file with the WordPress API URL:
   ```env
   NEXT_PUBLIC_WP_API_URL=https://www.bemahub.local/wp-json
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```

### Backend Setup
1. Copy the `bema-hub-plugin` folder to your WordPress plugins directory
2. Activate the plugin in the WordPress admin panel
3. Ensure JWT authentication is configured in `wp-config.php`:
   ```php
   define('JWT_SECRET', 'your_jwt_secret_key');
   ```

## Development

This is a monorepo structured for a Next.js frontend communicating with a WordPress backend via the REST API.

## Contributing

Please follow the established coding standards and naming conventions according to the Bema CORE framework.