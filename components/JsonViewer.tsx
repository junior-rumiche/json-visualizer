import React, { useState } from 'react';
import { type JsonValue } from '../types';
import { PlusSquareIcon, MinusSquareIcon } from './icons';

interface JsonViewerProps {
  data: JsonValue;
}

const getDataType = (value: JsonValue): 'string' | 'number' | 'boolean' | 'null' | 'array' | 'object' => {
  if (value === null) return 'null';
  if (Array.isArray(value)) return 'array';
  const type = typeof value;
  if (type === 'string' || type === 'number' || type === 'boolean' || type === 'object') {
    return type;
  }
  return 'object'; // Fallback for other object-like types
};

const ValueRenderer: React.FC<{ value: JsonValue }> = ({ value }) => {
  const type = getDataType(value);
  switch (type) {
    case 'string':
      return <span className="text-emerald-600 dark:text-emerald-400">"{value}"</span>;
    case 'number':
      return <span className="text-amber-600 dark:text-amber-400">{String(value)}</span>;
    case 'boolean':
      return <span className="text-violet-600 dark:text-violet-400">{String(value)}</span>;
    case 'null':
      return <span className="text-rose-500 dark:text-rose-400">null</span>;
    default:
      return null;
  }
};

const JsonNode: React.FC<{
  nodeKey?: string;
  value: JsonValue;
  isRoot?: boolean;
}> = ({ nodeKey, value, isRoot = false }) => {
  const [isExpanded, setIsExpanded] = useState(isRoot);
  const type = getDataType(value);

  const isExpandable = type === 'object' || type === 'array';
  const itemCount = isExpandable ? (type === 'object' ? Object.keys(value as object).length : (value as any[]).length) : 0;

  const toggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isExpandable && itemCount > 0) {
      setIsExpanded(!isExpanded);
    }
  };

  const renderPreview = () => {
    if (type === 'array') return `[...] ${itemCount} items`;
    if (type === 'object') return `{...} ${itemCount} keys`;
    return null;
  };
  
  const Bracket: React.FC<{open: boolean, isArray: boolean}> = ({ open, isArray }) => {
    const char = isArray ? (open ? '[' : ']') : (open ? '{' : '}');
    return <span className="text-slate-600 dark:text-slate-400">{char}</span>;
  }
  
  const keyComponent = nodeKey ? <span className="text-sky-600 dark:text-sky-400 mr-2">"{nodeKey}":</span> : null;
  
  const cursorClass = isExpandable && itemCount > 0 ? 'cursor-pointer' : '';

  return (
    <div className="pl-4">
      <div className={`flex items-start leading-relaxed ${cursorClass}`} onClick={toggleExpand}>
        {isExpandable && itemCount > 0 ? (
          <button className="pr-2 pt-1 -ml-6 flex-shrink-0 focus:outline-none" aria-label={isExpanded ? 'Collapse' : 'Expand'}>
            {isExpanded 
              ? <MinusSquareIcon className="h-3 w-3 text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200" /> 
              : <PlusSquareIcon className="h-3 w-3 text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200" />
            }
          </button>
        ) : (
          <div className="w-6 -ml-6 flex-shrink-0"></div>
        )}
        
        {keyComponent}
        
        {isExpandable ? (
          <>
            <Bracket open={true} isArray={type === 'array'} />
            {!isExpanded && itemCount > 0 && (
                <span className="ml-1 text-slate-500 dark:text-slate-500">{renderPreview()}</span>
            )}
            {(!isExpanded || itemCount === 0) && <Bracket open={false} isArray={type === 'array'} />}
          </>
        ) : (
          <ValueRenderer value={value} />
        )}
      </div>

      {isExpanded && isExpandable && itemCount > 0 && (
        <>
          {type === 'object' && Object.entries(value as object).map(([key, val]) => (
            <JsonNode key={key} nodeKey={key} value={val} />
          ))}
          {type === 'array' && (value as JsonValue[]).map((val, index) => (
            <JsonNode key={index} value={val} />
          ))}
          <div className="flex items-start">
             <div className="w-6 -ml-6 flex-shrink-0"></div>
            <Bracket open={false} isArray={type === 'array'} />
          </div>
        </>
      )}
    </div>
  );
};

export const JsonViewer: React.FC<JsonViewerProps> = ({ data }) => {
  return (
    <div className="p-4">
      <JsonNode value={data} isRoot={true} />
    </div>
  );
};
