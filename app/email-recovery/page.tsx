"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { otpVerify } from '../service/allApi';

export default function VerifyEmailPage() {
  const [timeLeft, setTimeLeft] = useState(30);
  const [otp, setOtp] = useState(['', '', '', '']);
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [email, setEmail] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Get email from localStorage
    const storedEmail = localStorage.getItem('verificationEmail');
    if (storedEmail) {
      setEmail(storedEmail);
    } else {
      // Fallback if no email found
      setEmail("user@example.com");
    }
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  useEffect(() => {
    // Check if all OTP fields are filled (6 digits)
    if (otp.every(digit => digit !== '')) {
      handleVerify(otp.join(''));
    }
  }, [otp]);

  const handleVerify = async (otpCode: string) => {
    setError('');
    setLoading(true);

    try {
      const response = await otpVerify({ email, otp: otpCode });

      if (response.success === false) {
        setError(response.message || 'Verification failed. Please check the code.');
        setLoading(false);
        return;
      }

      // If successful
      setIsVerified(true);
      setCountdown(3);
      setLoading(false);

      // Store token if provided
      if (response.token) {
        localStorage.setItem('authToken', response.token);
      }
    } catch (err) {
      setError('An error occurred during verification.');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (countdown <= 0) return;

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  useEffect(() => {
    if (countdown === 0 && isVerified) {
      router.push('/payment');
    }
  }, [countdown, isVerified, router]);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      // Handle paste
      const pastedData = value.substring(0, 4).split('');
      const newOtp = [...otp];
      pastedData.forEach((char, i) => {
        if (index + i < 4) newOtp[index + i] = char;
      });
      setOtp(newOtp);
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 3) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleResend = () => {
    if (timeLeft <= 0) {
      setTimeLeft(30);
      setError('');
      console.log('Resending OTP to:', email);
      // You might want to call the signup/resend API here
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      {isVerified ? (
        // Success Screen
        <div className="w-full max-w-md text-center">
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="bg-lime-400 p-6 rounded-full inline-block animate-bounce">
                <svg
                  className="w-16 h-16 text-black"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-2">Verified Successfully!</h2>
          <p className="text-gray-600">Redirecting in {countdown}...</p>
        </div>
      ) : (
        // OTP Verification Screen
        <div className="w-full max-w-md text-center">
          {/* Header */}
          <h1 className="text-2xl font-black tracking-tight uppercase mb-8">
            Verify Your Email
          </h1>

          {/* Message */}
          <p className="text-gray-700 mb-8">
            We have sent an OTP Verification to
          </p>

          {/* OTP Input Boxes */}
          <div className="flex justify-center gap-2 mb-4">
            {[0, 1, 2, 3].map((index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                maxLength={1}
                value={otp[index]}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                disabled={loading}
                className={`w-12 h-14 text-center text-2xl font-bold border-2 rounded-lg focus:border-lime-400 focus:outline-none transition-colors ${error ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  }`}
              />
            ))}
          </div>

          {/* Error Message */}
          {error && (
            <p className="text-red-500 text-sm mb-4">{error}</p>
          )}

          {/* Loading Message */}
          {loading && (
            <p className="text-gray-500 text-sm mb-4">Verifying...</p>
          )}

          {/* Email */}
          <p className="text-black font-semibold mb-12">
            {email}
          </p>

          {/* Resend Link */}
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={handleResend}
              disabled={timeLeft > 0 || loading}
              className={`text-sm ${timeLeft > 0
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-black font-medium hover:underline cursor-pointer'
                }`}
            >
              Didn&apos;t receive a code?
            </button>
            <span className="text-black font-bold">
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
