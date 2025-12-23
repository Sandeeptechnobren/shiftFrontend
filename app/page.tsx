'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreed, setAgreed] = useState(false);
  const router = useRouter();

  const handleSubmit = () => {
    if (agreed) {
      console.log('Sign up:', { email, password });
      router.push('/email-recovery');
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="p-6">
        <h1 className="text-2xl font-black tracking-tight uppercase">Create Your Account</h1>
      </div>

      {/* Form Container */}
      <div className="flex-1 flex flex-col px-6 pb-6">
        <div className="flex flex-col flex-1">
          {/* Email Field */}
          <div className="mb-6">
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email
            </label>
            <div className="relative">
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Password Field */}
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Terms Checkbox */}
          <div className="mb-6">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-1 w-4 h-4 rounded border-gray-300 text-lime-400 focus:ring-lime-400"
              />
              <span className="text-sm text-gray-700">
                I agree to the terms and conditions
              </span>
            </label>
          </div>

          {/* Sign Up Button */}
          <button
            onClick={handleSubmit}
            
            disabled={!agreed}
            className="w-full py-4 bg-lime-400 text-black font-bold text-lg rounded-full hover:bg-lime-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-6"
          >
            Sign Up
          </button>

          {/* Hero Image */}
          <div className="flex-1 min-h-[300px] rounded-2xl overflow-hidden bg-gradient-to-br from-cyan-500 to-blue-600 relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="grid grid-cols-3 gap-2 w-full h-full p-4">
                {/* Left Image */}
                <div className="bg-cyan-600 rounded-lg flex items-end justify-center overflow-hidden relative">
                  <div className="absolute bottom-0 left-0 right-0 bg-lime-400 text-black font-bold text-xs p-2 text-center">
                    #IMMUNITY
                  </div>
                </div>
                
                {/* Center Image - Featured */}
                <div className="bg-blue-600 rounded-lg flex items-end justify-center overflow-hidden relative border-2 border-dashed border-white">
                  <div className="absolute bottom-0 left-0 right-0 bg-lime-400 text-black font-bold text-xs p-2 text-center">
                    #IMMUNITY TO...
                  </div>
                </div>
                
                {/* Right Image */}
                <div className="bg-cyan-600 rounded-lg flex items-end justify-center overflow-hidden relative">
                  <div className="absolute bottom-0 left-0 right-0 bg-lime-400 text-black font-bold text-xs p-2 text-center">
                    IN THE C...
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}