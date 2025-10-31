'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useVerifyPasswordResetOtpMutation, useResetPasswordMutation } from '@/lib/api/authApi'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { Eye, EyeOff, Loader2 } from 'lucide-react'

export default function ResetPasswordWithOtpPage() {
  const params = useParams()
  const router = useRouter()
  const otp = params.otp as string

  const [email, setEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isOtpValid, setIsOtpValid] = useState(false)
  const [isVerifying, setIsVerifying] = useState(true)

  const [verifyOtp] = useVerifyPasswordResetOtpMutation()
  const [resetPassword, { isLoading: isResetting }] = useResetPasswordMutation()

  useEffect(() => {
    const storedEmail = localStorage.getItem('resetPasswordEmail')
    if (storedEmail) {
      setEmail(storedEmail)
    }
  }, [])

  useEffect(() => {
    if (otp && email) {
      verifyOtpCode()
    }
  }, [otp, email])

  const verifyOtpCode = async () => {
    if (!email) {
      toast.error('Email not found. Please request a new reset link.')
      router.push('/reset-password')
      return
    }

    try {
      const result = await verifyOtp({ email, otp_code: otp }).unwrap()
      if (result.success) {
        setIsOtpValid(true)
        toast.success('OTP verified successfully')
      }
    } catch (error: any) {
      const errorMessage = error?.data?.message || 'Invalid or expired OTP'
      toast.error(errorMessage)
      setTimeout(() => router.push('/reset-password'), 2000)
    } finally {
      setIsVerifying(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters long')
      return
    }

    try {
      const result = await resetPassword({
        email,
        otp_code: otp,
        new_password: newPassword
      }).unwrap()

      if (result.success) {
        toast.success('Password reset successfully!')
        localStorage.removeItem('resetPasswordEmail')
        setTimeout(() => router.push('/signin'), 2000)
      }
    } catch (error: any) {
      const errorMessage = error?.data?.message || 'Failed to reset password'
      toast.error(errorMessage)
    }
  }

  if (isVerifying) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin mb-4" />
            <p>Verifying reset link...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!isOtpValid) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center p-8">
            <p className="text-center text-red-600 mb-4">Invalid or expired reset link</p>
            <Button onClick={() => router.push('/reset-password')}>
              Request New Reset Link
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Reset Your Password</CardTitle>
          <CardDescription>
            Enter your new password below
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={8}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={8}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isResetting}>
              {isResetting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Resetting Password...
                </>
              ) : (
                'Reset Password'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
