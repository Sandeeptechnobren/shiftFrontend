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
    const [showPassword, setShowPassword] = useState(false);
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
                <div className="max-w-md mx-auto w-full">
                    <h1 className="
  self-stretch
  text-black
  font-built
  text-[32px]
  font-black
  leading-[150%]
  tracking-[-0.4px]
">
                        Create Your Account
                    </h1>


                </div>
            </div>

            {/* Main Container */}
            <div className="flex flex-col flex-1 lg:flex-row min-h-screen pt-4 lg:pt-0">
                {/* Form Section */}


                <div className="flex-1 flex flex-col lg:justify-center px-6 pb-6 ">
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
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Password"
                                    className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent bg-gray-50/50 transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showPassword ? (
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    ) : (
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                        </svg>
                                    )}
                                </button>
                                {/* <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div> */}
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
                <div className="relative w-full h-[500px] lg:h-screen overflow-hidden bg-white">
                    <Image
                        src="/signup5.png"
                        alt="Signup Banner"
                        fill
                        className="object-cover"
                        priority
                    />
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