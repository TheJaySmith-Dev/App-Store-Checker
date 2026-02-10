
import React, { useState, useEffect } from 'react';
import { CheckerUI } from './components/CheckerUI';
import { ResultsDisplay } from './components/ResultsDisplay';
import { CountryData } from './types';

const App: React.FC = () => {
  const [results, setResults] = useState<{ available: CountryData[], unavailable: CountryData[] } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const handleCheck = async (appId: string) => {
    setIsLoading(true);
    setError(null);
    setResults(null);

    try {
      const response = await fetch(`/api/check?id=${appId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch availability data. The server may have timed out (Vercel Hobby limit is 10s). For full 175-country checks, Pro is recommended.');
      }
      const data = await response.json();
      setResults(data);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 md:py-20">
      <header className="flex justify-between items-center mb-12">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">AppStore Checker</h1>
        </div>
        
        <button 
          onClick={toggleDarkMode}
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
        >
          {isDarkMode ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
          )}
        </button>
      </header>

      <main className="space-y-12">
        <section className="text-center space-y-4 max-w-2xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">Global Availability Check</h2>
          <p className="text-lg text-gray-500 dark:text-gray-400 font-medium">
            Paste an Apple App Store link to see which storefronts currently list your app.
          </p>
        </section>

        <CheckerUI onCheck={handleCheck} isLoading={isLoading} />

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-6 py-4 rounded-2xl flex items-center gap-3 max-w-2xl mx-auto">
            <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}

        {results && <ResultsDisplay results={results} />}
        
        {!results && !isLoading && !error && (
          <div className="flex flex-col items-center justify-center py-20 opacity-30 grayscale pointer-events-none">
            <svg className="w-32 h-32 mb-4" fill="currentColor" viewBox="0 0 24 24"><path d="M21 16.5c0 .38-.21.71-.53.88l-7.9 4.44c-.16.12-.36.18-.57.18s-.41-.06-.57-.18l-7.9-4.44A.991.991 0 013 16.5v-9c0-.38.21-.71.53-.88l7.9-4.44c.16-.12.36-.18.57-.18s.41.06.57.18l7.9 4.44c.32.17.53.5.53.88v9zM12 4.15L6.04 7.5 12 10.85l5.96-3.35L12 4.15zM5 15.91l6 3.38v-6.71L5 9.21v6.7zm14 0v-6.7l-6 3.37v6.71l6-3.38z"/></svg>
            <p className="text-xl font-bold">Waiting for input...</p>
          </div>
        )}
      </main>

      <footer className="mt-32 pt-12 border-t border-gray-200 dark:border-gray-800 text-center text-sm text-gray-500">
        <p>© {new Date().getFullYear()} AppStore Checker Tool. For informational purposes only.</p>
      </footer>
    </div>
  );
};

export default App;
