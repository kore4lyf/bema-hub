// Social login utility functions

export async function socialLogin(socialData: {
  provider: string;
  provider_id: string;
  email: string;
  first_name: string;
  last_name: string;
}) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/social-login`, {
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
    
    localStorage.setItem('authToken', data.token);
    return data;
  } catch (error) {
    console.error('Social login error:', error);
    throw error;
  }
}

// Google login handler
export function handleGoogleLogin(response: any) {
  const profile = response.getBasicProfile();
  
  const socialData = {
    provider: 'google',
    provider_id: response.getBasicProfile().getId(),
    email: profile.getEmail(),
    first_name: profile.getGivenName(),
    last_name: profile.getFamilyName()
  };

  return socialLogin(socialData);
}

// Facebook login handler
export function handleFacebookLogin(response: any) {
  return new Promise((resolve, reject) => {
    (window as any).FB.api('/me', { fields: 'id,name,email,first_name,last_name' }, function(profile: any) {
      const socialData = {
        provider: 'facebook',
        provider_id: profile.id,
        email: profile.email,
        first_name: profile.first_name,
        last_name: profile.last_name
      };

      socialLogin(socialData).then(resolve).catch(reject);
    });
  });
}

// Twitter login handler
export async function handleTwitterLogin(twitterUserData: {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
}) {
  const socialData = {
    provider: 'twitter',
    provider_id: twitterUserData.id,
    email: twitterUserData.email,
    first_name: twitterUserData.first_name,
    last_name: twitterUserData.last_name
  };

  return await socialLogin(socialData);
}
