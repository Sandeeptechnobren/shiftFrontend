"use client";

// import React from 'react';
import { Check } from 'lucide-react';

export default function PremiumClubCard() {
  const features = [
    'All challenges',
    'Virtual Challenge',
    'Pre-log all meals',
    'Real-time League table',
    'Ability to create groups',
    'Ability to add unlimited friends',
    'Personalized workout plans',
    'Workout Tracker/Journal',
    'Weight Tracker'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
        {/* Header Section with Images */}
        <div className="relative bg-gradient-to-r from-teal-400 to-blue-500 p-6 pb-8">
          <h2 className="text-white text-2xl font-bold text-center mb-4">
            JOIN THE PREMIUM CLUB
          </h2>
          
          {/* Image placeholders - using gradient circles as demonstration */}
          <div className="flex justify-center gap-2 mb-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-16 h-20 bg-gradient-to-br from-gray-700 to-gray-900 rounded-lg shadow-md"
              />
            ))}
          </div>
          
          {/* Community badge */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
            <div className="bg-teal-500 text-white px-4 py-1 rounded-full text-xs font-semibold shadow-lg">
              JOIN THE COMMUNITY
            </div>
          </div>
        </div>

        {/* Features List */}
        <div className="p-6 pt-8">
          <ul className="space-y-3 mb-6">
            {features.map((feature, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  <Check className="w-5 h-5 text-teal-500" />
                </div>
                <span className="text-gray-700 text-sm">{feature}</span>
              </li>
            ))}
          </ul>

          {/* Pricing Button */}
          <button className="w-full bg-gradient-to-r from-lime-400 to-lime-500 hover:from-lime-500 hover:to-lime-600 text-gray-900 font-bold py-4 rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl transform hover:-translate-y-0.5">
            <div className="flex items-center justify-center gap-2">
              <span className="text-lg line-through text-gray-700 opacity-70">19.99</span>
              <span className="text-2xl">$5.99/m</span>
            </div>
          </button>

          {/* Trial Info */}
          <p className="text-center text-xs text-gray-500 mt-3">
            70% discount applies for up to 6 months
          </p>

          {/* Footer */}
          <div className="text-center mt-4 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-400">
              Powered by <span className="font-semibold text-blue-600">stripe</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}