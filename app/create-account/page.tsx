'use client';

import { useState, useEffect } from 'react';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { createAccount, getCountryList } from '../service/allApi';
import { useRouter } from 'next/navigation';
import Toast from '../components/Toast';

interface Country {
  name: string;
  code: string;
  flag: string;
}



export default function SignUpForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [countries, setCountries] = useState<Country[]>([]);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Modal dropdown states
  const [openModal, setOpenModal] = useState<'gender' | 'age_range' | 'country' | null>(null);

  const [formData, setFormData] = useState({
    username: '',
    gender: '',
    age_range: '',
    country_code: '',
    password: '',
    agreeToTerms: false,
  });

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await getCountryList();
        if (response && Array.isArray(response.data)) {
          setCountries(response.data);
        } else if (Array.isArray(response)) {
          setCountries(response);
        }
      } catch (error) {
        console.error('Error fetching countries:', error);
      }
    };
    fetchCountries();
  }, []);

  // No longer need the local toast effect since the Toast component handles its own timeout


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.agreeToTerms) {
      setToast({ message: "Please agree to the terms and conditions.", type: 'error' });
      return;
    }

    setLoading(true);
    setToast(null);

    try {
      // Get email from localStorage which was set in the first signup step
      const email = typeof window !== 'undefined' ? localStorage.getItem('verificationEmail') : '';

      const payload = {
        email: email || '', // Including email as it might be required for /api/profile
        username: formData.username,
        gender: formData.gender,
        age_range: formData.age_range,
        country_code: formData.country_code,
        password: formData.password,
      };

      const response = await createAccount(payload);

      if (response && response.success !== false) {
        console.log('Account created successfully:', response);
        setToast({ message: 'Account created successfully! Redirecting...', type: 'success' });

        // Clear form or redirect
        setTimeout(() => {
          router.push('/login'); // Redirect to login after successful signup
        }, 2000);
      } else {
        setToast({ message: response?.message || 'Failed to create account', type: 'error' });
      }
    } catch (error) {
      console.error('Error creating account:', error);
      setToast({ message: 'An unexpected error occurred.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // Custom Modal Dropdown Component
  const ModalDropdown = ({
    isOpen,
    onClose,
    title,
    options,
    onSelect
  }: {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    options: { label: string; value: string }[];
    onSelect: (value: string) => void;
  }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="bg-gray-800 rounded-3xl w-[90%] max-w-md mx-4 overflow-hidden shadow-2xl animate-in zoom-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-700">
            <h2 className="text-white text-2xl font-black uppercase tracking-wide">{title}</h2>
            <button
              onClick={onClose}
              className="bg-lime-400 hover:bg-lime-500 text-black rounded-xl p-2 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Options */}
          <div className="p-4 max-h-[60vh] overflow-y-auto space-y-3">
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onSelect(option.value);
                  onClose();
                }}
                className="w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold text-left px-6 py-4 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      {/* Brand Panel - Visible only on desktop */}
      <div className="hidden lg:flex lg:w-1/3 bg-gray-900 flex-col justify-between p-12 text-white relative overflow-hidden">
        <div className="z-10">
          <h2 className="text-3xl font-black italic tracking-tighter mb-4 text-lime-400">SHIFT PROJECT</h2>
          <p className="text-gray-400 text-lg max-w-xs">Complete your profile to unlock all features of our shift management platform.</p>
        </div>

        <div className="z-10 bg-black/40 backdrop-blur-md p-6 rounded-2xl border border-white/10">
          <p className="text-sm font-medium italic">"The most efficient way to manage my work schedule. Simply brilliant."</p>
          <p className="text-lime-400 text-xs mt-3 font-bold uppercase tracking-widest">— Early Beta User</p>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-lime-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-5%] left-[-5%] w-48 h-48 bg-lime-400/5 rounded-full blur-2xl"></div>
      </div>

      {/* Form Section */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-white">
        <div className="w-full max-w-xl">
          <div className="bg-white lg:shadow-2xl lg:rounded-3xl lg:p-10 lg:border lg:border-gray-100">
            <h1 className="text-3xl font-black text-gray-900 mb-2 uppercase tracking-tight">
              Complete Your Profile
            </h1>
            <p className="text-gray-500 mb-10">Help us personalize your experience</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Username */}
                <div className="md:col-span-2">
                  <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                    Username
                  </label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    placeholder="e.g. shiftmaster"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent transition-all bg-gray-50/50"
                  />
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                    Gender
                  </label>
                  <button
                    type="button"
                    onClick={() => setOpenModal('gender')}
                    className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent transition-all bg-gray-50/50 text-left flex items-center justify-between group"
                  >
                    <span className={formData.gender ? "text-gray-900 font-medium" : "text-gray-500"}>
                      {formData.gender ? (
                        formData.gender === 'male' ? 'Male' :
                          formData.gender === 'female' ? 'Female' :
                            formData.gender === 'other' ? 'Other' : 'N/A'
                      ) : 'Select'}
                    </span>
                    <svg className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>

                {/* Age Range */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                    Age Range
                  </label>
                  <button
                    type="button"
                    onClick={() => setOpenModal('age_range')}
                    className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent transition-all bg-gray-50/50 text-left flex items-center justify-between group"
                  >
                    <span className={formData.age_range ? "text-gray-900 font-medium" : "text-gray-500"}>
                      {formData.age_range || 'Select'}
                    </span>
                    <svg className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>

                {/* Country */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                    Country
                  </label>
                  <button
                    type="button"
                    onClick={() => setOpenModal('country')}
                    className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent transition-all bg-gray-50/50 text-left flex items-center justify-between group"
                  >
                    <span className={formData.country_code ? "text-gray-900 font-medium" : "text-gray-500"}>
                      {formData.country_code ?
                        countries.find(c => c.code === formData.country_code)?.name || formData.country_code
                        : 'Select Country'}
                    </span>
                    <svg className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>

                {/* Password */}
                <div className="md:col-span-2">
                  <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      name="password"
                      placeholder="Combine letters and numbers"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent transition-all pr-12 bg-gray-50/50"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-start gap-3 pt-4">
                <input
                  type="checkbox"
                  id="terms"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                  className="w-6 h-6 mt-0.5 border-gray-300 rounded-lg text-lime-400 focus:ring-lime-400 cursor-pointer"
                />
                <label htmlFor="terms" className="text-sm text-gray-600 leading-relaxed cursor-pointer select-none">
                  I agree to the <span className="text-gray-900 font-bold hover:underline">Terms of Service</span> and <span className="text-gray-900 font-bold hover:underline">Privacy Policy</span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-lime-400 hover:bg-lime-500 text-gray-900 font-black py-5 rounded-xl transition-all duration-300 shadow-xl hover:shadow-lime-200/50 active:scale-[0.98] mt-8 uppercase tracking-widest text-lg flex items-center justify-center gap-2"
              >
                {loading && <Loader2 className="animate-spin" size={24} />}
                {loading ? 'Creating Account...' : 'Finish Registration'}
              </button>

              {/* Already have account */}
              <p className="text-center text-sm text-gray-600 pt-6">
                Already have an account?{' '}
                <a href="/login" className="text-gray-900 font-black uppercase tracking-wider hover:underline ml-1">
                  Sign in
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>

      {/* Custom Toast Message */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Modal Dropdowns */}
      <ModalDropdown
        isOpen={openModal === 'gender'}
        onClose={() => setOpenModal(null)}
        title="GENDER"
        options={[
          { label: 'Male', value: 'male' },
          { label: 'Female', value: 'female' },
          { label: 'Other', value: 'other' },
          { label: 'N/A', value: 'prefer-not-to-say' }
        ]}
        onSelect={(value) => setFormData(prev => ({ ...prev, gender: value }))}
      />

      <ModalDropdown
        isOpen={openModal === 'age_range'}
        onClose={() => setOpenModal(null)}
        title="AGE RANGE"
        options={[
          { label: 'Under 20', value: 'Under 20' },
          { label: '21 - 25', value: '21 - 25' },
          { label: '26 - 36', value: '26 - 36' },
          { label: '36 - 45', value: '36 - 45' },
          { label: '46+', value: '46+' }
        ]}
        onSelect={(value) => setFormData(prev => ({ ...prev, age_range: value }))}
      />

      <ModalDropdown
        isOpen={openModal === 'country'}
        onClose={() => setOpenModal(null)}
        title="COUNTRY"
        options={countries.map(country => ({
          label: `${country.name} (${country.code})`,
          value: country.code
        }))}
        onSelect={(value) => setFormData(prev => ({ ...prev, country_code: value }))}
      />
    </div>
  );
}
