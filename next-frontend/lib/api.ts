import { TokenManager } from './token-manager';

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code: string
  ) {
    super(message);
  }
}

export async function apiRequest(url: string, options: RequestInit = {}) {
  const token = TokenManager.getToken();
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}${url}`, {
      ...options,
      headers,
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new ApiError(
        data.message || 'API request failed',
        response.status,
        data.code
      );
    }
    
    return data;
  } catch (error) {
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new ApiError('Network error - please check your connection', 0, 'NETWORK_ERROR');
    }
    
    if (error instanceof ApiError) {
      throw error;
    }
    
    throw new ApiError('An unexpected error occurred', 0, 'UNKNOWN_ERROR');
  }
}

export async function getProfile() {
  const token = TokenManager.getToken();
  
  if (!token) {
    throw new Error('No authentication token found');
  }

  return await apiRequest('/profile');
}
