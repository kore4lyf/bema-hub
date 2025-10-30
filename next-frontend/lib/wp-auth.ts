/**
 * WordPress JWT Authentication Helper
 */

const WP_API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://www.bemahub.local';

export interface WPAuthResponse {
  token: string;
  user_email: string;
  user_nicename: string;
  user_display_name: string;
}

export async function authenticateWithWordPress(username: string, password: string): Promise<WPAuthResponse> {
  const response = await fetch(`${WP_API_BASE}/wp-json/jwt-auth/v1/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username,
      password,
    }),
  });

  if (!response.ok) {
    throw new Error('WordPress authentication failed');
  }

  return response.json();
}

export async function validateWordPressToken(token: string): Promise<boolean> {
  try {
    const response = await fetch(`${WP_API_BASE}/wp-json/jwt-auth/v1/token/validate`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    return response.ok;
  } catch {
    return false;
  }
}

export function getWordPressHeaders(token?: string) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
}
