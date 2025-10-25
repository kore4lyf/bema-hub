# Frontend Integration Guide

This guide explains how to integrate the Bema Hub plugin API endpoints into your frontend application (e.g., React, Next.js, Vue.js).

## Table of Contents

- [Frontend Integration Guide](#frontend-integration-guide)
  - [Table of Contents](#table-of-contents)
  - [Setup and Configuration](#setup-and-configuration)
  - [User Registration Flow](#user-registration-flow)
  - [Email Signup with OTP Verification](#email-signup-with-otp-verification)
    - [Step 1: Register User](#step-1-register-user)
    - [Step 2: Verify OTP](#step-2-verify-otp)
  - [Social Login Integration](#social-login-integration)
    - [Google Login Example](#google-login-example)
    - [Facebook Login Example](#facebook-login-example)
    - [Twitter Login Example](#twitter-login-example)
  - [Traditional Login](#traditional-login)
  - [Making Authenticated Requests](#making-authenticated-requests)
  - [Token Management](#token-management)
  - [Error Handling](#error-handling)
  - [Best Practices](#best-practices)

## Setup and Configuration

Before integrating the API endpoints, ensure your frontend application is configured to communicate with your WordPress site:

```javascript
// Configuration
const API_BASE_URL = 'https://yoursite.com/wp-json/bema-hub/v1';
```

## User Registration Flow

The registration process varies depending on the signup method:

1. **Email Signup**: Register → Verify OTP → Login
2. **Social Signup**: Social Login (creates account automatically)

## Email Signup with OTP Verification

### Step 1: Register User

```javascript
async function registerUser(userData) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Registration failed');
    }
    
    return data;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
}

// Usage
const userData = {
  email: 'user@example.com',
  password: 'securepassword123',
  first_name: 'John',
  last_name: 'Doe',
  phone_number: '+1234567890',
  country: 'United States',
  city: 'New York',
  referred_by: 'R-SOS2026-123'
};

registerUser(userData)
  .then(result => {
    console.log('Registration successful:', result);
    // Save email for OTP verification
    localStorage.setItem('pendingUserEmail', result.user_email);
  })
  .catch(error => {
    console.error('Registration failed:', error);
  });
```

### Step 2: Verify OTP

```javascript
async function verifyOTP(email, otpCode) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        otp_code: otpCode
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'OTP verification failed');
    }
    
    return data;
  } catch (error) {
    console.error('OTP verification error:', error);
    throw error;
  }
}

// Usage
const email = localStorage.getItem('pendingUserEmail');
const otpCode = '123456'; // From user input

verifyOTP(email, otpCode)
  .then(result => {
    console.log('OTP verification successful:', result);
    // Save the token for authenticated requests
    localStorage.setItem('authToken', result.token);
    // Clear pending user email
    localStorage.removeItem('pendingUserEmail');
    // Redirect to dashboard or home page
  })
  .catch(error => {
    console.error('OTP verification failed:', error);
  });
```

## Social Login Integration

### Google Login Example

```javascript
// Using Google Identity Services
function handleGoogleLogin(response) {
  const profile = response.getBasicProfile();
  
  const socialData = {
    provider: 'google',
    provider_id: response.getBasicProfile().getId(),
    email: profile.getEmail(),
    first_name: profile.getGivenName(),
    last_name: profile.getFamilyName()
  };

  socialLogin(socialData);
}

async function socialLogin(socialData) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/social-login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(socialData),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Social login failed');
    }
    
    // Save the token for authenticated requests
    localStorage.setItem('authToken', data.token);
    
    // Redirect to dashboard or home page
    return data;
  } catch (error) {
    console.error('Social login error:', error);
    throw error;
  }
}
```

### Facebook Login Example

```javascript
// Using Facebook SDK
function handleFacebookLogin(response) {
  FB.api('/me', { fields: 'id,name,email,first_name,last_name' }, function(profile) {
    const socialData = {
      provider: 'facebook',
      provider_id: profile.id,
      email: profile.email,
      first_name: profile.first_name,
      last_name: profile.last_name
    };

    socialLogin(socialData);
  });
}
```

### Twitter Login Example

```javascript
// Using Twitter API (implementation depends on your specific setup)
async function handleTwitterLogin(twitterUserData) {
  const socialData = {
    provider: 'twitter',
    provider_id: twitterUserData.id,
    email: twitterUserData.email,
    first_name: twitterUserData.first_name,
    last_name: twitterUserData.last_name
  };

  return await socialLogin(socialData);
}
```

## Traditional Login

## User Signout

To sign out a user, make a POST request to the signout endpoint. This endpoint requires authentication with a valid JWT token.

```javascript
async function signout() {
  try {
    const token = localStorage.getItem('authToken');
    
    const response = await fetch(`${API_BASE_URL}/auth/signout`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Signout failed');
    }
    
    // Clear the token from storage
    localStorage.removeItem('authToken');
    
    // Redirect to login page or home page
    window.location.href = '/login';
    
    return data;
  } catch (error) {
    console.error('Signout error:', error);
    throw error;
  }
}

// Usage
signout()
  .then(result => {
    console.log('Signout successful:', result);
  })
  .catch(error => {
    console.error('Signout failed:', error);
    // Even if the API call fails, clear the token locally
    localStorage.removeItem('authToken');
    window.location.href = '/login';
  });
```

The signout endpoint now implements JWT token invalidation by adding the token to a blacklist on the server. This prevents the token from being used for further requests. The client-side token removal ensures the token is also cleared from the user's browser.


```javascript
async function loginUser(credentials) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }
    
    // Save the token for authenticated requests
    localStorage.setItem('authToken', data.token);
    
    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}

// Usage
const credentials = {
  username: 'user@example.com', // Can be email or username
  password: 'securepassword123'
};

loginUser(credentials)
  .then(result => {
    console.log('Login successful:', result);
    // Redirect to dashboard or home page
  })
  .catch(error => {
    console.error('Login failed:', error);
  });
```

## Making Authenticated Requests

Once you have a valid token, you can make authenticated requests to protected endpoints:

```javascript
async function getProfile() {
  const token = localStorage.getItem('authToken');
  
  if (!token) {
    throw new Error('No authentication token found');
  }

  try {
    const response = await fetch(`${API_BASE_URL}/profile`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch profile');
    }
    
    return data;
  } catch (error) {
    console.error('Profile fetch error:', error);
    throw error;
  }
}

// Usage
getProfile()
  .then(profile => {
    console.log('User profile:', profile);
  })
  .catch(error => {
    console.error('Failed to fetch profile:', error);
    // If it's an authentication error, redirect to login
    if (error.message.includes('Unauthorized')) {
      localStorage.removeItem('authToken');
      // Redirect to login page
    }
  });
```

## Token Management

Proper token management is crucial for a smooth user experience:

```javascript
class TokenManager {
  static getToken() {
    return localStorage.getItem('authToken');
  }

  static setToken(token) {
    localStorage.setItem('authToken', token);
  }

  static clearToken() {
    localStorage.removeItem('authToken');
  }

  static isTokenExpired(token) {
    if (!token) return true;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp < currentTime;
    } catch (error) {
      return true;
    }
  }

  static isAuthenticated() {
    const token = this.getToken();
    return token && !this.isTokenExpired(token);
  }
}

// Usage in a React component or similar
function ProtectedComponent() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!TokenManager.isAuthenticated()) {
      // Redirect to login
      window.location.href = '/login';
      return;
    }

    getProfile()
      .then(profileData => {
        setProfile(profileData);
      })
      .catch(error => {
        console.error('Failed to load profile:', error);
        if (error.message.includes('Unauthorized')) {
          TokenManager.clearToken();
          window.location.href = '/login';
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!profile) return <div>Failed to load profile</div>;

  return (
    <div>
      <h1>Welcome, {profile.first_name}!</h1>
      <p>Email: {profile.email}</p>
    </div>
  );
}
```

## Error Handling

Implement consistent error handling across your application:

```javascript
class ApiError extends Error {
  constructor(message, status, code) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

async function apiRequest(url, options = {}) {
  const token = localStorage.getItem('authToken');
  
  // Add default headers
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  // Add authentication header if token exists
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}${url}`, {
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
    // Handle network errors
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new ApiError('Network error - please check your connection', 0, 'NETWORK_ERROR');
    }
    
    // Re-throw ApiError instances
    if (error instanceof ApiError) {
      throw error;
    }
    
    // Handle other errors
    throw new ApiError('An unexpected error occurred', 0, 'UNKNOWN_ERROR');
  }
}

// Usage with error handling
async function login(credentials) {
  try {
    const data = await apiRequest('/auth/signin', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    TokenManager.setToken(data.token);
    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      switch (error.code) {
        case 'invalid_login':
          // Handle invalid credentials
          alert('Invalid username or password');
          break;
        case 'missing_credentials':
          // Handle missing fields
          alert('Please fill in all required fields');
          break;
        default:
          // Handle other API errors
          alert(error.message);
      }
    } else {
      // Handle network or unexpected errors
      alert('An unexpected error occurred. Please try again.');
    }
    
    throw error;
  }
}
```

## Best Practices

1. **Secure Token Storage**: Store tokens in `localStorage` or `sessionStorage` for web apps. For mobile apps, use secure storage solutions.

2. **Token Expiration Handling**: Check token expiration before making requests and redirect to login when expired.

3. **Error Resilience**: Implement retry logic for transient network errors.

4. **User Experience**: Provide clear feedback during authentication flows.

5. **Security**: Always use HTTPS in production and validate all user inputs.

6. **Social Login**: Handle cases where users revoke social app permissions.

7. **Logging**: All authentication events are logged for security monitoring (on the backend), including signout events and token validation attempts.

8. **Signout Handling**: Call the signout endpoint to invalidate the token on the server and clear tokens from local storage. Redirect users appropriately after signout.

This guide provides a comprehensive foundation for integrating the Bema Hub plugin API into your frontend application. Adjust the implementation details based on your specific framework and requirements.