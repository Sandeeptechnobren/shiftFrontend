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
    <div className="min-h-screen bg-white flex flex-col lg:flex-row">
      {/* Side Panel - Desktop Only */}
      <div className="hidden lg:flex lg:w-1/3 bg-gray-900 flex-col justify-center items-center p-12 text-center text-white border-r-4 border-lime-400">
        <div className="max-w-xs">
          <h2 className="text-4xl font-black italic tracking-tighter mb-6 text-lime-400">SECURITY FIRST</h2>
          <p className="text-gray-400 uppercase tracking-widest text-xs font-bold leading-relaxed">
            We take your account security seriously. Please verify your email to continue.
          </p>
          <div className="mt-12 p-8 bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10">
            <div className="w-16 h-1 bg-lime-400 mx-auto mb-6"></div>
            <p className="text-sm italic text-gray-300">"Verification is the bridge to a seamless shift experience."</p>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        {isVerified ? (
          // Success Screen
          <div className="w-full max-w-md text-center animate-in fade-in zoom-in duration-500">
            <div className="flex justify-center mb-10">
              <div className="relative">
                <div className="absolute inset-0 bg-lime-400 rounded-full blur-2xl opacity-20 animate-pulse"></div>
                <div className="bg-lime-400 p-8 rounded-full inline-block relative border-4 border-black/5">
                  <svg
                    className="w-20 h-20 text-black"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
              </div>
            </div>
            <h2 className="text-4xl font-black mb-4 uppercase tracking-tight italic">Verified!</h2>
            <p className="text-gray-500 font-medium mb-2">Setting up your workplace dashboard...</p>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-lime-400 rounded-full text-xs font-bold uppercase tracking-widest mt-4">
              <span className="w-2 h-2 bg-lime-400 rounded-full animate-ping"></span>
              Redirecting in {countdown}s
            </div>
          </div>
        ) : (
          // OTP Verification Screen
          <div className="w-full max-w-md">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-3xl font-black tracking-tight uppercase italic mb-4">
                Verify Your Email
              </h1>
              <div className="flex flex-col items-center gap-2 bg-gray-50 p-6 rounded-3xl border border-gray-100">
                <p className="text-gray-500 text-sm font-medium">
                  We have sent an OTP code to
                </p>
                <div className="px-4 py-2 bg-white rounded-xl border border-gray-200 shadow-sm">
                  <p className="text-gray-900 font-bold tracking-tight">
                    {email}
                  </p>
                </div>
              </div>
            </div>

            {/* OTP Input Boxes */}
            <div className="flex justify-center gap-4 mb-8">
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
                  className={`w-14 h-20 text-center text-3xl font-black border-2 rounded-2xl focus:border-lime-400 focus:ring-4 focus:ring-lime-100 focus:outline-none transition-all duration-300 ${error ? 'border-red-500 bg-red-50 text-red-600' : 'border-gray-200 bg-gray-50/30'
                    }`}
                />
              ))}
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 text-red-600 bg-red-50 p-4 rounded-xl mb-6 border border-red-100 animate-in slide-in-from-top-2">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm font-semibold">{error}</p>
              </div>
            )}

            {/* Loading Message */}
            {loading && (
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="w-5 h-5 border-4 border-lime-400 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-500 font-bold text-xs uppercase tracking-widest">Verifying Code...</p>
              </div>
            )}

            {/* Resend Link */}
            <div className="flex flex-col items-center gap-4 mt-8 pt-8 border-t border-gray-100">
              <p className="text-gray-400 text-sm">Didn&apos;t receive a code?</p>
              <button
                onClick={handleResend}
                disabled={timeLeft > 0 || loading}
                className={`group flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 ${timeLeft > 0
                  ? 'bg-gray-50 text-gray-400 cursor-not-allowed border border-gray-100'
                  : 'bg-gray-900 text-white hover:bg-black shadow-xl hover:shadow-gray-200 active:scale-[0.98]'
                  }`}
              >
                <span className="text-sm font-black uppercase tracking-widest">
                  Resend OTP
                </span>
                <span className={`w-12 h-12 flex items-center justify-center rounded-xl font-black text-lg ${timeLeft > 0 ? 'bg-gray-200 text-gray-500' : 'bg-lime-400 text-black group-hover:bg-lime-300'}`}>
                  {formatTime(timeLeft)}
                </span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
