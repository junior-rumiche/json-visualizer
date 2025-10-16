import React, { useState, useMemo, useEffect, useRef } from 'react';
import { JsonViewer } from './components/JsonViewer';
import { JsonInputArea } from './components/JsonInputArea';
import { type JsonValue } from './types';
import { LogoIcon, SunIcon, MoonIcon, PaletteIcon } from './components/icons';

const placeholderJson = `{
  "id": "0001",
  "type": "donut",
  "name": "Cake",
  "ppu": 0.55,
  "available": true,
  "topping": [
    { "id": "5001", "type": "None" },
    { "id": "5002", "type": "Glazed" },
    { "id": "5005", "type": "Sugar" },
    { "id": "5007", "type": "Powdered Sugar" },
    { "id": "5006", "type": "Chocolate with Sprinkles" },
    { "id": "5003", "type": "Chocolate" },
    { "id": "5004", "type": "Maple" }
  ],
  "related": null
}`;

const themes = [
    { name: 'cyan', color: '#06b6d4' },
    { name: 'violet', color: '#8b5cf6' },
    { name: 'emerald', color: '#10b981' },
    { name: 'rose', color: '#f43f5e' },
    { name: 'amber', color: '#f59e0b' },
];

const App: React.FC = () => {
  const [rawJson, setRawJson] = useState<string>(placeholderJson);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
        const storedTheme = localStorage.getItem('theme');
        if (storedTheme === 'dark' || storedTheme === 'light') {
            return storedTheme;
        }
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
    }
    return 'light';
  });

  const [themeColor, setThemeColor] = useState<string>(() => {
      if (typeof window !== 'undefined' && window.localStorage) {
          return localStorage.getItem('themeColor') || 'cyan';
      }
      return 'cyan';
  });

  const [isThemePickerOpen, setIsThemePickerOpen] = useState(false);
  const themePickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [theme]);

  useEffect(() => {
    document.documentElement.dataset.themeColor = themeColor;
    localStorage.setItem('themeColor', themeColor);
  }, [themeColor]);

  // Close theme picker on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (themePickerRef.current && !themePickerRef.current.contains(event.target as Node)) {
        setIsThemePickerOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const { parsedData, error } = useMemo<{ parsedData: JsonValue | null; error: string | null }>(() => {
    if (!rawJson.trim()) {
      return { parsedData: null, error: null };
    }
    try {
      const data = JSON.parse(rawJson);
      return { parsedData: data, error: null };
    } catch (e) {
      if (e instanceof Error) {
        return { parsedData: null, error: e.message };
      }
      return { parsedData: null, error: 'An unknown parsing error occurred.' };
    }
  }, [rawJson]);

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-300 font-sans flex flex-col transition-colors duration-300">
      <header className="bg-slate-200/50 dark:bg-slate-800/50 border-b border-slate-300 dark:border-slate-700 p-4 sticky top-0 z-20 backdrop-blur-sm">
        <div className="container mx-auto flex items-center gap-3">
          <LogoIcon className="h-8 w-8 text-primary dark:text-primary-dark" />
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            JSON Visualizer <span className="text-primary dark:text-primary-dark">Pro</span>
          </h1>
          <div className="flex-grow" />
          <div className="relative" ref={themePickerRef}>
            <button
                onClick={() => setIsThemePickerOpen(prev => !prev)}
                className="p-2 rounded-md text-slate-600 dark:text-slate-400 hover:bg-primary-bg/70 dark:hover:bg-primary-bg-dark/70 hover:text-primary dark:hover:text-primary-dark transition-colors"
                aria-label="Choose theme color"
            >
                <PaletteIcon className="h-5 w-5" />
            </button>
            {isThemePickerOpen && (
                <div className="absolute top-full right-0 mt-2 w-40 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md shadow-lg p-2 z-30">
                    <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2 px-1">Accent Color</p>
                    <div className="grid grid-cols-5 gap-2">
                        {themes.map(t => (
                            <button
                                key={t.name}
                                onClick={() => {
                                    setThemeColor(t.name);
                                    setIsThemePickerOpen(false);
                                }}
                                className={`w-6 h-6 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-800 transition-transform duration-150 transform hover:scale-110 ${themeColor === t.name ? 'ring-2 ring-offset-1 dark:ring-offset-slate-800 ring-primary' : ''}`}
                                style={{ backgroundColor: t.color }}
                                aria-label={`Set theme to ${t.name}`}
                            />
                        ))}
                    </div>
                </div>
            )}
          </div>
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-md text-slate-600 dark:text-slate-400 hover:bg-primary-bg/70 dark:hover:bg-primary-bg-dark/70 hover:text-primary dark:hover:text-primary-dark transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? <MoonIcon className="h-5 w-5" /> : <SunIcon className="h-5 w-5" />}
          </button>
        </div>
      </header>

      <main className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-4 p-4 container mx-auto">
        <div className="flex flex-col rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 overflow-hidden shadow-2xl shadow-slate-200 dark:shadow-slate-950/50">
          <div className="flex-shrink-0 p-3 bg-slate-100/70 dark:bg-slate-900/70 border-b border-slate-300 dark:border-slate-700 flex justify-between items-center">
            <h2 className="font-semibold text-slate-900 dark:text-slate-200">JSON Input</h2>
            <button
              onClick={() => setRawJson('')}
              className="text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary-dark transition-colors"
            >
              Clear
            </button>
          </div>
          <JsonInputArea
            value={rawJson}
            onChange={setRawJson}
            placeholder="Paste your JSON here..."
          />
        </div>

        <div className="flex flex-col rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 overflow-hidden shadow-2xl shadow-slate-200 dark:shadow-slate-950/50">
          <div className="flex-shrink-0 p-3 bg-slate-100/70 dark:bg-slate-900/70 border-b border-slate-300 dark:border-slate-700">
            <h2 className="font-semibold text-slate-900 dark:text-slate-200">Visualizer</h2>
          </div>
          <div className="overflow-auto flex-grow font-mono text-sm">
            {error && (
              <div className="p-4 m-4 rounded-md bg-red-100 dark:bg-red-900/50 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 font-mono text-sm">
                <p className="font-bold mb-2">Parsing Error:</p>
                <pre>{error}</pre>
              </div>
            )}
            {!error && parsedData !== null && (
                <JsonViewer data={parsedData} />
            )}
             {!error && parsedData === null && rawJson.trim() === '' && (
              <div className="flex items-center justify-center h-full text-slate-400 dark:text-slate-500 p-4">
                <p>Waiting for JSON data...</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;