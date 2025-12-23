"use client";

import { useState, useEffect } from 'react';

export default function VerifyEmailPage() {
  const [timeLeft, setTimeLeft] = useState(30);
  const [otp, setOtp] = useState(['', '', '', '']);
  const [isVerified, setIsVerified] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const email = "anabelle@gmail.com";

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  useEffect(() => {
    // Check if all OTP fields are filled
    if (otp.every(digit => digit !== '')) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsVerified(true);
      setCountdown(3);
    }
  }, [otp]);

  useEffect(() => {
    if (countdown <= 0) return;

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  useEffect(() => {
    if (countdown === 0 && isVerified) {
      window.location.href = '/payment';
    }
  }, [countdown, isVerified]);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 3) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleResend = () => {
    if (timeLeft <= 0) {
      setTimeLeft(30);
      console.log('Resending OTP...');
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
              {/* Walking Person Icon */}
              <svg 
                className="w-24 h-24 text-lime-400" 
                viewBox="0 0 24 24" 
                fill="currentColor"
              >
                <path d="M13.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM9.8 8.9L7 23h2.1l1.8-8 2.1 2v6h2v-7.5l-2.1-2 .6-3C14.8 12 16.8 13 19 13v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1L6 8.3V13h2V9.6l1.8-.7" />
              </svg>
            </div>
          </div>
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
        <div className="flex justify-center gap-3 mb-4">
          {[0, 1, 2, 3].map((index) => (
            <input
              key={index}
              id={`otp-${index}`}
              type="text"
              maxLength={1}
              value={otp[index]}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              className="w-14 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:border-lime-400 focus:outline-none"
            />
          ))}
        </div>

        {/* Email */}
        <p className="text-black font-semibold mb-12">
          {email}
        </p>

        {/* Resend Link */}
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={handleResend}
            disabled={timeLeft > 0}
            className={`text-sm ${
              timeLeft > 0
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