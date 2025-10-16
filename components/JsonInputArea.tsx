import React, { useRef } from 'react';

const highlightJson = (jsonStr: string): string => {
  if (!jsonStr) {
    return '';
  }
  // Basic HTML escaping for safety
  jsonStr = jsonStr.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  
  // Regex to find JSON tokens and wrap them in spans with Tailwind CSS classes
  return jsonStr.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
    (match) => {
      let className = 'text-amber-600 dark:text-amber-400'; // Default for numbers
      if (/^"/.test(match)) {
        className = /:$/.test(match) 
          ? 'text-sky-600 dark:text-sky-400' // Key
          : 'text-emerald-600 dark:text-emerald-400'; // String
      } else if (/true|false/.test(match)) {
        className = 'text-violet-600 dark:text-violet-400'; // Boolean
      } else if (/null/.test(match)) {
        className = 'text-rose-500 dark:text-rose-400'; // Null
      }
      return `<span class="${className}">${match}</span>`;
    }
  );
};


interface JsonInputAreaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const JsonInputArea: React.FC<JsonInputAreaProps> = ({ value, onChange, placeholder }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const preRef = useRef<HTMLPreElement>(null);

  const handleScroll = () => {
    if (preRef.current && textareaRef.current) {
      preRef.current.scrollTop = textareaRef.current.scrollTop;
      preRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  };
  
  const highlightedHtml = highlightJson(value);
  const commonClasses = "w-full h-full p-4 font-mono text-sm resize-none focus:outline-none leading-relaxed whitespace-pre-wrap break-words";

  return (
    <div className="relative flex-grow">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onScroll={handleScroll}
        className={`${commonClasses} absolute inset-0 z-10 bg-transparent text-transparent caret-slate-800 dark:caret-slate-300`}
        spellCheck="false"
      />
      <pre
        ref={preRef}
        className={`${commonClasses} absolute inset-0 z-0 overflow-auto pointer-events-none`}
        aria-hidden="true"
      >
        <code dangerouslySetInnerHTML={{ __html: highlightedHtml + '\n' }} />
      </pre>
      {!value && placeholder && (
          <div className="absolute top-4 left-4 text-slate-400 dark:text-slate-500 pointer-events-none font-mono text-sm">
              {placeholder}
          </div>
      )}
    </div>
  );
};