import React, { useState, useMemo, useEffect } from 'react';
import { JsonViewer } from './components/JsonViewer';
import { JsonInputArea } from './components/JsonInputArea';
import { type JsonValue } from './types';
import { LogoIcon, SunIcon, MoonIcon } from './components/icons';

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

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [theme]);

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
      <header className="bg-slate-200/50 dark:bg-slate-800/50 border-b border-slate-300 dark:border-slate-700 p-4 sticky top-0 z-10 backdrop-blur-sm">
        <div className="container mx-auto flex items-center gap-3">
          <LogoIcon className="h-8 w-8 text-cyan-500 dark:text-cyan-400" />
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            JSON Visualizer <span className="text-cyan-500 dark:text-cyan-400">Pro</span>
          </h1>
          <div className="flex-grow" />
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-md text-slate-600 dark:text-slate-400 hover:bg-slate-300/70 dark:hover:bg-slate-700/70 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
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
              className="text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors"
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