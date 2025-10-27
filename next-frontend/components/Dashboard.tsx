'use client';

import { useState, useEffect } from 'react';
import { 
  useSignupMutation,
  useVerifyOtpMutation,
  useSigninMutation,
  useSocialLoginMutation,
  useSignoutMutation,
  useValidateMutation,
  useResetPasswordRequestMutation,
  useResetPasswordVerifyMutation,
  useResetPasswordMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
} from '../lib/api/authApi';
import { ErrorBoundary } from './ErrorBoundary';
import ApiStatus from './ApiStatus';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.bemahub.com';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('auth');
  const [token, setToken] = useState('');
  
  // Auth mutations
  const [signup, { isLoading: signupLoading }] = useSignupMutation();
  const [verifyOTP, { isLoading: verifyLoading }] = useVerifyOtpMutation();
  const [signin, { isLoading: signinLoading }] = useSigninMutation();
  const [socialLogin, { isLoading: socialLoading }] = useSocialLoginMutation();
  const [signout, { isLoading: signoutLoading }] = useSignoutMutation();
  const [validateToken, { isLoading: validateLoading }] = useValidateMutation();
  const [resetPasswordRequest, { isLoading: resetRequestLoading }] = useResetPasswordRequestMutation();
  const [resetPasswordVerify, { isLoading: resetVerifyLoading }] = useResetPasswordVerifyMutation();
  const [resetPassword, { isLoading: resetLoading }] = useResetPasswordMutation();
  const [updateProfile, { isLoading: updateLoading }] = useUpdateProfileMutation();
  
  const [profile, setProfile] = useState<any>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState<any>(null);

  const loadProfile = async () => {
    if (!token) return;
    setProfileLoading(true);
    setProfileError(null);
    try {
      const data = await getUserProfileWithToken();
      setProfile(data);
    } catch (error) {
      setProfileError(error);
    } finally {
      setProfileLoading(false);
    }
  };

  const refetchProfile = () => loadProfile();

  // Load profile when token changes
  useEffect(() => {
    if (token) {
      loadProfile();
    } else {
      setProfile(null);
    }
  }, [token]);

  // Override the query to include token
  const getUserProfileWithToken = () => {
    if (!token) return Promise.reject('No token');
    return fetch(`${BASE_URL}/wp-json/bema-hub/v1/profile`, {
      headers: { 'Authorization': `Bearer ${token}` }
    }).then(res => res.json());
  };

  const updateProfileWithToken = (data: any) => {
    if (!token) return Promise.reject('No token');
    return fetch(`${BASE_URL}/wp-json/bema-hub/v1/profile`, {
      method: 'PUT',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }).then(res => res.json());
  };

  const signoutWithToken = () => {
    if (!token) return Promise.reject('No token');
    return fetch(`${BASE_URL}/wp-json/bema-hub/v1/auth/signout`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    }).then(res => res.json());
  };

  const [results, setResults] = useState<any[]>([]);

  const addResult = (operation: string, result: any, error?: any) => {
    setResults(prev => [{
      id: Date.now(),
      operation,
      timestamp: new Date().toLocaleTimeString(),
      success: !error,
      data: error || result
    }, ...prev.slice(0, 9)]);
  };

  const handleApiCall = async (apiCall: () => Promise<any>, operation: string, onSuccess?: (result: any) => void) => {
    try {
      const result = await apiCall();
      addResult(operation, result);
      onSuccess?.(result);
    } catch (error: any) {
      addResult(operation, null, {
        status: error.status,
        data: error.data,
        message: error.message || 'Network error occurred'
      });
    }
  };

  const handleSignup = () => handleApiCall(
    () => signup({
      email: 'test@example.com',
      password: 'password123',
      first_name: 'John',
      last_name: 'Doe',
      phone_number: '+1234567890',
      country: 'United States',
      state: 'New York',
      referred_by: 'R-SOS2026-123'
    }).unwrap(),
    'Signup'
  );

  const handleVerifyOTP = () => handleApiCall(
    () => verifyOTP({
      email: 'test@example.com',
      otp_code: '123456'
    }).unwrap(),
    'Verify OTP'
  );

  const handleSignin = () => handleApiCall(
    () => signin({
      username: 'admin',
      password: 'password123'
    }).unwrap(),
    'Signin',
    (result) => setToken(result.token)
  );

  const handleSocialLogin = () => handleApiCall(
    () => socialLogin({
      provider: 'google',
      provider_id: '1234567890',
      email: 'social@example.com',
      first_name: 'Social',
      last_name: 'User',
      phone_number: '+1234567890',
      country: 'United States',
      state: 'California'
    }).unwrap(),
    'Social Login',
    (result) => setToken(result.token)
  );

  const handleSignout = () => handleApiCall(
    () => signoutWithToken(),
    'Signout',
    () => setToken('')
  );

  const handleValidateToken = () => {
    if (!token) return;
    handleApiCall(
      () => validateToken({ token }).unwrap(),
      'Validate Token'
    );
  };

  const handleResetPasswordRequest = () => handleApiCall(
    () => resetPasswordRequest({
      email: 'test@example.com'
    }).unwrap(),
    'Reset Password Request'
  );

  const handleResetPasswordVerify = () => handleApiCall(
    () => resetPasswordVerify({
      email: 'test@example.com',
      otp_code: '123456'
    }).unwrap(),
    'Reset Password Verify'
  );

  const handleResetPasswordFinal = () => handleApiCall(
    () => resetPassword({
      email: 'test@example.com',
      otp_code: '123456',
      new_password: 'newPassword123'
    }).unwrap(),
    'Reset Password'
  );

  const handleUpdateProfile = () => handleApiCall(
    () => updateProfileWithToken({
      first_name: 'Updated',
      last_name: 'Name',
      bema_country: 'Canada',
      bema_state: 'Ontario'
    }),
    'Update Profile'
  );

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Bema Hub API Integration Dashboard</h1>
            <ApiStatus baseUrl={BASE_URL} />
          </div>
          
          {/* Navigation */}
          <div className="flex space-x-4 mb-6">
            <button
              onClick={() => setActiveTab('auth')}
              className={`px-4 py-2 rounded-lg transition-colors ${activeTab === 'auth' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
            >
              Authentication
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-4 py-2 rounded-lg transition-colors ${activeTab === 'profile' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
            >
              Profile
            </button>
            <button
              onClick={() => setActiveTab('results')}
              className={`px-4 py-2 rounded-lg transition-colors ${activeTab === 'results' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
            >
              API Results ({results.length})
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Authentication Panel */}
            {activeTab === 'auth' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Authentication Operations</h2>
                <div className="space-y-3">
                  <button 
                    onClick={handleSignup} 
                    disabled={signupLoading}
                    className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {signupLoading ? 'Loading...' : 'Test Signup'}
                  </button>
                  <button 
                    onClick={handleVerifyOTP} 
                    disabled={verifyLoading}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {verifyLoading ? 'Loading...' : 'Test Verify OTP'}
                  </button>
                  <button 
                    onClick={handleSignin} 
                    disabled={signinLoading}
                    className="w-full bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {signinLoading ? 'Loading...' : 'Test Signin'}
                  </button>
                  <button 
                    onClick={handleSocialLogin} 
                    disabled={socialLoading}
                    className="w-full bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {socialLoading ? 'Loading...' : 'Test Social Login'}
                  </button>
                  <button 
                    onClick={handleSignout} 
                    disabled={signoutLoading}
                    className="w-full bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {signoutLoading ? 'Loading...' : 'Test Signout'}
                  </button>
                  <button 
                    onClick={handleValidateToken} 
                    disabled={validateLoading || !token}
                    className="w-full bg-yellow-600 text-white py-2 px-4 rounded hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {validateLoading ? 'Loading...' : 'Test Validate Token'}
                  </button>
                  <button 
                    onClick={handleResetPasswordRequest} 
                    disabled={resetRequestLoading}
                    className="w-full bg-orange-600 text-white py-2 px-4 rounded hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {resetRequestLoading ? 'Loading...' : 'Test Reset Password Request'}
                  </button>
                  <button 
                    onClick={handleResetPasswordVerify} 
                    disabled={resetVerifyLoading}
                    className="w-full bg-pink-600 text-white py-2 px-4 rounded hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {resetVerifyLoading ? 'Loading...' : 'Test Reset Password Verify'}
                  </button>
                  <button 
                    onClick={handleResetPasswordFinal} 
                    disabled={resetLoading}
                    className="w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {resetLoading ? 'Loading...' : 'Test Reset Password Final'}
                  </button>
                </div>
                
                {token && (
                  <div className="mt-4 p-3 bg-green-50 rounded">
                    <p className="text-sm text-green-700 font-medium">Active Token:</p>
                    <p className="text-xs text-green-600 break-all">{token.substring(0, 100)}...</p>
                  </div>
                )}
              </div>
            )}

            {/* Profile Panel */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Profile Management</h2>
                  <button 
                    onClick={() => refetchProfile()}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    Refresh
                  </button>
                </div>
                
                {!token && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mb-4">
                    <p className="text-yellow-700">Please login first to view profile data</p>
                  </div>
                )}
                
                {profileLoading && <p className="text-gray-600">Loading profile...</p>}
                
                {profileError && (
                  <div className="bg-red-50 border border-red-200 rounded p-3 mb-4">
                    <p className="text-red-700">Error loading profile:</p>
                    <pre className="text-xs mt-2">{JSON.stringify(profileError, null, 2)}</pre>
                  </div>
                )}
                
                {profile && (
                  <div className="space-y-4 mb-4">
                    <div className="flex items-center space-x-3">
                      <img src={profile.avatar_url} alt="Avatar" className="w-12 h-12 rounded-full" />
                      <div>
                        <h3 className="font-semibold">{profile.display_name}</h3>
                        <p className="text-gray-600">{profile.email}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div><strong>Country:</strong> {profile.bema_country}</div>
                      <div><strong>State:</strong> {profile.bema_state}</div>
                      <div><strong>Tier:</strong> {profile.bema_tier_level}</div>
                      <div><strong>Account Type:</strong> {profile.bema_account_type}</div>
                      <div><strong>Email Verified:</strong> {profile.bema_email_verified ? '✅' : '❌'}</div>
                      <div><strong>Phone Verified:</strong> {profile.bema_phone_verified ? '✅' : '❌'}</div>
                    </div>
                    
                    {profile.bema_referred_by && (
                      <div className="bg-blue-50 p-3 rounded">
                        <p className="text-sm"><strong>Referred by:</strong> {profile.bema_referred_by}</p>
                      </div>
                    )}
                  </div>
                )}
                
                <button 
                  onClick={handleUpdateProfile} 
                  disabled={updateLoading || !token}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {updateLoading ? 'Updating...' : 'Test Update Profile'}
                </button>
              </div>
            )}

            {/* Results Panel */}
            {activeTab === 'results' && (
              <div className="bg-white rounded-lg shadow-md p-6 lg:col-span-2">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">API Call Results</h2>
                  <button 
                    onClick={() => setResults([])}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Clear Results
                  </button>
                </div>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {results.map((result) => (
                    <div key={result.id} className={`p-3 rounded border-l-4 ${result.success ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}>
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold">{result.operation}</h3>
                        <div className="text-right">
                          <span className="text-sm text-gray-500">{result.timestamp}</span>
                          <div className={`text-xs px-2 py-1 rounded ${result.success ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                            {result.success ? 'SUCCESS' : 'ERROR'}
                          </div>
                        </div>
                      </div>
                      <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto max-h-32">
                        {JSON.stringify(result.data, null, 2)}
                      </pre>
                    </div>
                  ))}
                  {results.length === 0 && (
                    <p className="text-gray-500 text-center py-8">No API calls made yet. Try the authentication operations!</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}
