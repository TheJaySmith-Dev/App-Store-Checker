
import React from 'react';
import { CountryData } from '../types';

interface ResultsDisplayProps {
  results: {
    available: CountryData[];
    unavailable: CountryData[];
  };
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results }) => {
  const { available, unavailable } = results;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
      {/* Available Column */}
      <div className="apple-glass rounded-[2rem] p-8 shadow-2xl border border-green-500/10">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <span className="w-6 h-6 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full flex items-center justify-center text-xs">
              ✓
            </span>
            Available
          </h3>
          <span className="px-3 py-1 bg-green-500/10 text-green-600 text-sm font-bold rounded-full">
            {available.length} Countries
          </span>
        </div>

        {available.length === 0 ? (
          <p className="text-gray-400 text-center py-12 italic">Not available in any store checked.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
            {available.map((c) => (
              <div key={c.code} className="flex items-center gap-3 p-3 bg-white/50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-gray-800 hover:scale-[1.02] transition-transform">
                <span className="text-xl" aria-hidden="true">{getFlagEmoji(c.code)}</span>
                <span className="text-sm font-medium truncate">{c.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Unavailable Column */}
      <div className="apple-glass rounded-[2rem] p-8 shadow-2xl border border-red-500/10">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <span className="w-6 h-6 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-full flex items-center justify-center text-xs">
              ✕
            </span>
            Unavailable
          </h3>
          <span className="px-3 py-1 bg-red-500/10 text-red-600 text-sm font-bold rounded-full">
            {unavailable.length} Countries
          </span>
        </div>

        {unavailable.length === 0 ? (
          <p className="text-gray-400 text-center py-12 italic">Available everywhere checked.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
            {unavailable.map((c) => (
              <div key={c.code} className="flex items-center gap-3 p-3 bg-white/50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-gray-800 hover:scale-[1.02] transition-transform grayscale opacity-60">
                <span className="text-xl" aria-hidden="true">{getFlagEmoji(c.code)}</span>
                <span className="text-sm font-medium truncate">{c.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Helper to get flag emoji from ISO code
function getFlagEmoji(countryCode: string) {
  if (countryCode === 'gb') countryCode = 'uk'; // Special case for flags sometimes
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}
