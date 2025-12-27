'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { login, otpVerify } from './service/allApi';
import Toast from './components/Toast';
// import {signup1}

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const router = useRouter();

  const handleSubmit = async () => {
    if (!agreed) return;

    // Clear previous toasts
    setToast(null);
    setLoading(true);

    try {
      const response = await login({ email, password });

      // Check if the response indicates success
      if (response.success === false) {
        setToast({ message: response.message || 'Signup failed. Please try again.', type: 'error' });
        setLoading(false);
        return;
      }

      // Store token and email for verification on the next page
      if (response.token || (response.data && response.data.token)) {
        const token = response.token || response.data.token;
        localStorage.setItem('authToken', token);
      }
      localStorage.setItem('verificationEmail', email);

      // Show success message
      setToast({ message: 'OTP sent successfully! Redirecting...', type: 'success' });

      // Redirect to email-recovery after short delay
      setTimeout(() => {
        router.push('/email-recovery');
      }, 1500);

    } catch (err) {
      setToast({ message: 'An unexpected error occurred. Please try again.', type: 'error' });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row">
      {/* Header - Stays at top on mobile, becomes part of left panel on desktop */}
      <div className="p-6 lg:fixed lg:top-0 lg:left-0 lg:w-1/2 bg-white z-50">
        <h1 className="text-2xl font-black tracking-tight uppercase">Create Your Account</h1>
      </div>

      {/* Main Container */}
      <div className="flex flex-col flex-1 lg:flex-row min-h-screen pt-4 lg:pt-0">
        {/* Form Section */}
        <div className="flex-1 flex flex-col lg:justify-center px-6 pb-6 pt-16 lg:pt-20">
          <div className="max-w-md mx-auto w-full">
            {/* Email Field */}
            <div className="mb-6">
              <label htmlFor="email" className="block text-sm font-semibold mb-2 text-gray-700">
                Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent bg-gray-50/50 transition-all"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Password Field */}
            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-semibold mb-2 text-gray-700">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent bg-gray-50/50 transition-all"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Terms Checkbox */}
            <div className="mb-8">
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-1 w-5 h-5 rounded border-gray-300 text-lime-400 focus:ring-lime-400 cursor-pointer"
                />
                <span className="text-sm text-gray-600 leading-relaxed group-hover:text-gray-900 transition-colors">
                  I agree to the terms and conditions
                </span>
              </label>
            </div>



            {/* Sign Up Button */}
            <button
              onClick={handleSubmit}
              disabled={!agreed || loading}
              className="w-full py-5 bg-lime-400 text-black font-black text-lg rounded-xl hover:bg-lime-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed mb-8 shadow-xl hover:shadow-lime-200/50 active:scale-[0.98] uppercase tracking-wide"
            >
              {loading ? 'Sending OTP...' : 'Sign Up'}
            </button>
          </div>
        </div>

        {/* Hero Image Section - Desktop Panel */}
        <div className="lg:w-1/2 h-[400px] lg:h-screen sticky bottom-0 lg:relative overflow-hidden bg-gray-900 border-t-4 border-lime-400 lg:border-t-0 lg:border-l-4">
          <div className="absolute inset-0 grid grid-cols-3">
            {/* Left Image */}
            <div className="relative overflow-hidden group">
              <Image
                src="/signup1.png"
                alt="Signup 1"
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-lime-400 text-black font-black text-center py-4 text-xs uppercase tracking-wider backdrop-blur-sm bg-lime-400/90 transform translate-y-0 lg:translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                #IMMUNITY
              </div>
            </div>

            {/* Center Image - Featured */}
            <div className="relative overflow-hidden group border-x-2 border-white/20">
              <Image
                src="/signup2.png"
                alt="Signup 2"
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black text-[#BEFF00] font-black text-center py-4 text-xs uppercase tracking-wider backdrop-blur-sm bg-black/90 transform translate-y-0 lg:translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                #IMMUNITY TO...
              </div>
            </div>

            {/* Right Image */}
            <div className="relative overflow-hidden group">
              <Image
                src="/signup3.png"
                alt="Signup 3"
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-lime-400 text-black font-black text-center py-4 text-sm uppercase tracking-wider backdrop-blur-sm bg-lime-400/90 transform translate-y-0 lg:translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                IN THE C...
              </div>
            </div>
          </div>

          {/* Desktop Text Overlay */}
          <div className="absolute inset-0 pointer-events-none hidden lg:flex flex-col justify-center items-center p-12 text-center bg-black/20">
            <div className="bg-black/80 backdrop-blur-md p-10 rounded-2xl border border-white/10 max-w-sm">
              <h3 className="text-4xl font-black text-white mb-6 italic tracking-tighter leading-none">THE FUTURE IS HERE</h3>
              <p className="text-lime-400 font-bold uppercase tracking-widest text-sm">Join the shift revolution today</p>
            </div>
          </div>
        </div>
      </div>
      {
        toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )
      }
    </div >
  );
}