'use client';

import React, { useEffect, useState } from 'react';
import { Loader2, X } from 'lucide-react';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'terms' | 'privacy' | null;
}

export default function LegalModal({ isOpen, onClose, type }: LegalModalProps) {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (!isOpen || !type) return;

    let isMounted = true;
    const fetchContent = async () => {
      setLoading(true);
      setError('');
      try {
        const url =
          type === 'terms'
            ? 'https://api.buildacademy.io/projects/shift_backend/public/api/termsCondition/list'
            : 'https://api.buildacademy.io/projects/shift_backend/public/api/privacyPolicy/list';

        const token = typeof window !== 'undefined' ? (localStorage.getItem('authToken') || localStorage.getItem('token')) : null;
        const headers: HeadersInit = {
          'Accept': 'application/json'
        };
        if (token && token !== 'undefined' && token !== 'null') {
          headers['Authorization'] = token.toLowerCase().startsWith('bearer ') ? token : `Bearer ${token}`;
        }

        const res = await fetch(url, { headers });

        if (!res.ok) {
          let errMsg = 'Failed to fetch data';
          try {
            const errJson = await res.json();
            if (errJson && errJson.message) {
              errMsg = errJson.message;
            }
          } catch (e) { }
          throw new Error(errMsg);
        }

        const json = await res.json();

        if (isMounted) {
          // Parse API response
          let extractedContent = '';
          const items = json.data || json;
          const item = Array.isArray(items) ? items[0] : items;

          if (item) {
            if (type === 'terms' && item.terms_and_condition) {
              extractedContent = item.terms_and_condition;
            } else if (type === 'privacy' && item.privacy_policy) {
              extractedContent = item.privacy_policy;
            } else if (item.content) {
              extractedContent = item.content;
            } else if (item.text) {
              extractedContent = item.text;
            } else if (item.description) {
              extractedContent = item.description;
            } else {
              extractedContent = JSON.stringify(item, null, 2);
            }
          } else {
            extractedContent = 'No content available.';
          }
          setContent(extractedContent);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message || 'Failed to load content. Please try again.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchContent();

    return () => {
      isMounted = false;
    };
  }, [isOpen, type]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const title = type === 'terms' ? 'Terms & Conditions' : 'Privacy Policy';

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-md animate-in fade-in duration-300 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white/90 backdrop-blur-xl border border-white/20 rounded-3xl w-full max-w-2xl overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] flex flex-col max-h-[85vh] animate-in zoom-in-95 slide-in-from-bottom-8 duration-500 ease-out"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - Sticky */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-8 py-6 border-b border-gray-100 bg-white/80 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-lime-100 text-lime-600 rounded-xl">
              {type === 'terms' ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              )}
            </div>
            <h2 className="text-gray-900 text-2xl font-black tracking-tight">
              {title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="bg-gray-100/50 hover:bg-gray-200 text-gray-500 hover:text-gray-900 rounded-full p-2.5 transition-all duration-200 hover:rotate-90 active:scale-90"
            aria-label="Close"
          >
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-8 overflow-y-auto min-h-[300px] relative scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400">
          {loading ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-lime-500 bg-white/50 backdrop-blur-sm z-10">
              <Loader2 className="animate-spin mb-4" size={40} strokeWidth={3} />
              <p className="text-gray-600 font-bold tracking-wide animate-pulse">Loading {title}...</p>
            </div>
          ) : error ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
              <div className="bg-red-50 text-red-500 p-5 rounded-2xl mb-5 shadow-sm">
                <X size={40} strokeWidth={2.5} />
              </div>
              <p className="text-red-600 font-black text-xl mb-3 tracking-tight">Oops! Something went wrong</p>
              <p className="text-gray-500 mb-8 max-w-xs">{error}</p>
              <button
                onClick={onClose}
                className="px-8 py-3 bg-gray-900 hover:bg-black text-white font-bold rounded-xl transition-all duration-200 hover:shadow-lg active:scale-95"
              >
                Close & Return
              </button>
            </div>
          ) : (
            <div
              className="prose prose-sm sm:prose-base max-w-none prose-headings:font-black prose-headings:text-gray-900 prose-headings:tracking-tight prose-p:text-gray-600 prose-p:leading-loose prose-a:text-lime-600 prose-a:font-bold hover:prose-a:text-lime-700 prose-ul:text-gray-600 prose-li:marker:text-lime-500 whitespace-pre-wrap selection:bg-lime-200 selection:text-lime-900 font-medium"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          )}
        </div>

        {/* Footer - Sticky */}
        <div className="sticky bottom-0 z-10 px-8 py-6 border-t border-gray-100 bg-white/90 backdrop-blur-xl flex justify-end">
          <button
            onClick={onClose}
            className="w-full sm:w-auto bg-gray-900 hover:bg-black text-white font-black py-4 px-10 rounded-xl transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] tracking-widest uppercase text-sm"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
}
