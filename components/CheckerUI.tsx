
import React, { useState } from 'react';

interface CheckerUIProps {
  onCheck: (appId: string) => void;
  isLoading: boolean;
}

export const CheckerUI: React.FC<CheckerUIProps> = ({ onCheck, isLoading }) => {
  const [url, setUrl] = useState('');
  const [error, setError] = useState<string | null>(null);

  const extractAppId = (input: string): string | null => {
    // Matches patterns like: apps.apple.com/us/app/name/id12345678 or just id12345678 or 12345678
    const idMatch = input.match(/id(\d+)/) || input.match(/(\d{8,12})/);
    return idMatch ? idMatch[1] : null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const appId = extractAppId(url);
    if (!appId) {
      setError('Please enter a valid App Store URL or App ID');
      return;
    }

    onCheck(appId);
  };

  return (
    <div className="max-w-2xl mx-auto w-full">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative group">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={isLoading}
            placeholder="https://apps.apple.com/us/app/..."
            className="w-full px-6 py-5 bg-white dark:bg-[#1C1C1E] border-2 border-transparent focus:border-blue-500 rounded-3xl shadow-xl outline-none text-lg transition-all disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isLoading || !url}
            className={`absolute right-3 top-3 bottom-3 px-6 rounded-2xl font-bold transition-all flex items-center gap-2 ${
              isLoading || !url
                ? 'bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-600'
                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/20 active:scale-95'
            }`}
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Checking...
              </>
            ) : (
              'Check Availability'
            )}
          </button>
        </div>
        {error && <p className="text-red-500 text-sm ml-4 font-medium animate-pulse">{error}</p>}
        <p className="text-xs text-gray-400 text-center">
          Checking 175 countries takes approx. 30 seconds. Please keep the window open.
        </p>
      </form>
    </div>
  );
};
