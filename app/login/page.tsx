'use client';
import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { swiftLogin } from '../service/allApi';
// import { login, swiftLogin } from '../service/allApi';
import { Loader2 } from 'lucide-react';
import Toast from '../components/Toast';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setToast(null);

        if (!agreedToTerms) {
            setToast({ message: 'Please agree to the terms and conditions', type: 'error' });
            return;
        }

        setLoading(true);
        try {
            const response = await swiftLogin({ email, password });

            if (response && response.success !== false) {
                if (response.token || (response.data && response.data.token)) {
                    const token = response.token || response.data.token;
                    localStorage.setItem('authToken', token);
                }

                // Show success message
                setToast({ message: 'Login successful! Redirecting...', type: 'success' });

                // Redirect to dashboard after short delay
                setTimeout(() => {
                    router.push('/dashboard');
                }, 1500);
            } else {
                setToast({ message: response?.message || 'Login failed. Please check your credentials.', type: 'error' });
            }
        } catch (err) {
            // console.error('Login error:', err);
            setToast({ message: 'An unexpected error occurred. Please try again.', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="min-h-screen bg-white flex flex-col lg:flex-row">
                <div className="flex flex-col flex-1 lg:flex-row min-h-screen lg:pt-0">
                    <main className="flex-1 flex flex-col justify-center items-center py-8 lg:py-0 bg-white lg:w-1/2">
                        <div className="max-w-md mx-auto w-full px-6">
                            <h2 className="text-4xl font-black mb-8 uppercase text-gray-900">Log into your account</h2>
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

                                {/* Terms and Conditions */}
                                <div className="relative">
                                    <div className="flex items-start">
                                        <input
                                            type="checkbox"
                                            id="terms"
                                            checked={agreedToTerms}
                                            onChange={(e) => setAgreedToTerms(e.target.checked)}
                                            className="mt-1 h-5 w-5 bg-white border-solid-[1px] border-gray-200 rounded-lg"
                                        />
                                        <label htmlFor="terms" className="ml-3 text-sm text-gray-700 cursor-pointer select-none leading-relaxed">
                                            I agree to the terms and conditions
                                        </label>
                                    </div>

                                    {/* Tooltip */}
                                    {/* <div className="mt-4 bg-gray-50 p-4 rounded-xl border border-gray-100 text-xs text-gray-500 italic shadow-sm">
                                    This is the first onboarding step, where we take only the email and password of the user.
                                </div> */}
                                </div>

                                {/* Login Button */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-lime-400 hover:bg-lime-500 disabled:opacity-50 disabled:cursor-not-allowed text-black font-black py-5 rounded-xl transition-all duration-300 uppercase shadow-xl hover:shadow-lime-200/50 flex items-center justify-center gap-2 text-lg active:scale-[0.98]"
                                >
                                    {loading && <Loader2 className="animate-spin" size={24} />}
                                    {loading ? 'Logging in...' : 'Login'}
                                </button>
                            </form>
                        </div>
                    </main>

                    {/* Image Section */}
                    <div className="relative w-full h-[370px] lg:h-screen lg:w-1/2 overflow-hidden bg-white">
                        <Image
                            src="/signup5.png"
                            alt="Login Banner"
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
            </div>
        </>
    );
}