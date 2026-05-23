'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { login, getCountryList } from './service/allApi';
import { extractToken } from './service/APIutils';
import Toast from './components/Toast';
import { Loader2 } from 'lucide-react';
import LegalModal from './components/LegalModal';

export default function SignUpPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [agreedToPrivacy, setAgreedToPrivacy] = useState(false);
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [legalModalType, setLegalModalType] = useState<'terms' | 'privacy' | null>(null);

    const handleSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();

        if (!agreedToTerms) {
            setToast({ message: 'Please accept Terms & Conditions', type: 'error' });
            return;
        }
        if (!agreedToPrivacy) {
            setToast({ message: 'Please accept Privacy Policy', type: 'error' });
            return;
        }

        // Clear previous toasts
        setToast(null);
        setLoading(true);

        try {
            const response = await login({
                email,
                password,
                term_condition_accepted: agreedToTerms ? 1 : 0,
                privacy_policy_accepted: agreedToPrivacy ? 1 : 0
            });

            // Check if the response indicates success
            if (response.success === false) {
                setToast({ message: response.message || 'Signup failed. Please try again.', type: 'error' });
                setLoading(false);
                return;
            }

            // Store token and email for verification on the next page
            const token = extractToken(response);
            if (token) {
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
            <div className="flex flex-col flex-1 lg:flex-row min-h-screen lg:pt-0">
                <main className="flex-1 flex flex-col justify-center items-center py-8 lg:py-0 bg-white lg:w-1/2">
                    <div className="max-w-md mx-auto w-full px-6">
                        <h2 className="text-4xl font-black mb-8 uppercase text-gray-900">Create Your Account</h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2 font-semibold">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Email address"
                                    className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent transition-all bg-gray-50/50"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2 font-semibold">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        id="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Password"
                                        className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent transition-all bg-gray-50/50"
                                        required
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
                                </div>
                            </div>

                            {/* Terms and Privacy Policy */}
                            <div className="space-y-3 pt-2">
                                {/* Terms Checkbox */}
                                <div className={`flex items-center p-3.5 rounded-xl border transition-all duration-300 ${
                                    agreedToTerms 
                                        ? 'border-lime-400 bg-lime-50/10 shadow-sm' 
                                        : 'border-gray-200 hover:border-gray-300 bg-gray-50/30'
                                }`}>
                                    <label className="flex items-center space-x-3.5 w-full cursor-pointer group">
                                        <div className="relative flex-shrink-0">
                                            <input
                                                type="checkbox"
                                                id="terms"
                                                checked={agreedToTerms}
                                                onChange={(e) => setAgreedToTerms(e.target.checked)}
                                                className="sr-only peer"
                                            />
                                            <div className={`w-6 h-6 border-2 rounded-lg flex items-center justify-center transition-all duration-200 peer-focus-visible:ring-2 peer-focus-visible:ring-lime-400 peer-focus-visible:ring-offset-2 ${
                                                agreedToTerms 
                                                    ? 'bg-lime-400 border-lime-400 shadow-md shadow-lime-400/30 scale-105' 
                                                    : 'border-gray-300 bg-white group-hover:border-gray-400 group-hover:scale-105'
                                            }`}>
                                                {agreedToTerms && (
                                                    <svg className="w-4 h-4 text-black stroke-[3.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                    </svg>
                                                )}
                                            </div>
                                        </div>
                                        <span className="text-sm text-gray-700 select-none leading-relaxed">
                                            I agree to the{' '}
                                            <span
                                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setLegalModalType('terms'); }}
                                                className="text-gray-900 font-bold hover:underline"
                                            >
                                                Terms & Conditions
                                            </span>
                                        </span>
                                    </label>
                                </div>

                                {/* Privacy Policy Checkbox */}
                                <div className={`flex items-center p-3.5 rounded-xl border transition-all duration-300 ${
                                    agreedToPrivacy 
                                        ? 'border-lime-400 bg-lime-50/10 shadow-sm' 
                                        : 'border-gray-200 hover:border-gray-300 bg-gray-50/30'
                                }`}>
                                    <label className="flex items-center space-x-3.5 w-full cursor-pointer group">
                                        <div className="relative flex-shrink-0">
                                            <input
                                                type="checkbox"
                                                id="privacy"
                                                checked={agreedToPrivacy}
                                                onChange={(e) => setAgreedToPrivacy(e.target.checked)}
                                                className="sr-only peer"
                                            />
                                            <div className={`w-6 h-6 border-2 rounded-lg flex items-center justify-center transition-all duration-200 peer-focus-visible:ring-2 peer-focus-visible:ring-lime-400 peer-focus-visible:ring-offset-2 ${
                                                agreedToPrivacy 
                                                    ? 'bg-lime-400 border-lime-400 shadow-md shadow-lime-400/30 scale-105' 
                                                    : 'border-gray-300 bg-white group-hover:border-gray-400 group-hover:scale-105'
                                            }`}>
                                                {agreedToPrivacy && (
                                                    <svg className="w-4 h-4 text-black stroke-[3.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                    </svg>
                                                )}
                                            </div>
                                        </div>
                                        <span className="text-sm text-gray-700 select-none leading-relaxed">
                                            I agree to the{' '}
                                            <span
                                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setLegalModalType('privacy'); }}
                                                className="text-gray-900 font-bold hover:underline"
                                            >
                                                Privacy Policy
                                            </span>
                                        </span>
                                    </label>
                                </div>
                            </div>

                            {/* Sign Up Button */}
                            <button
                                type="submit"
                                disabled={!agreedToTerms || !agreedToPrivacy || loading}
                                className="w-full bg-lime-400 hover:bg-lime-500 disabled:opacity-50 disabled:cursor-not-allowed text-black font-black py-5 rounded-xl transition-all duration-300 uppercase shadow-xl hover:shadow-lime-200/50 flex items-center justify-center gap-2 text-lg active:scale-[0.98]"
                            >
                                {loading && <Loader2 className="animate-spin" size={24} />}
                                {loading ? 'Sending OTP...' : 'Sign Up'}
                            </button>

                            <div className="text-center mt-4">
                                <p className="text-gray-600">
                                    Already have an account?{' '}
                                    <button
                                        type="button"
                                        onClick={() => router.push('/login')}
                                        className="text-lime-600 font-bold hover:underline"
                                    >
                                        Sign In
                                    </button>
                                </p>
                            </div>
                        </form>
                    </div>
                </main>

                {/* Image Section */}
                <div className="relative w-full h-[370px] lg:h-screen lg:w-1/2 overflow-hidden bg-white">
                    <Image
                        src="/signup5.png"
                        alt="Signup Banner"
                        fill
                        className="object-cover"
                        priority
                    />
                </div>
            </div>

            {/* Toast Notification */}
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}

            <LegalModal
                isOpen={legalModalType !== null}
                onClose={() => setLegalModalType(null)}
                type={legalModalType}
            />
        </div>
    );
}