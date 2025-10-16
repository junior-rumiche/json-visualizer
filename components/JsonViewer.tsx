import React, { useState, useMemo, useEffect } from 'react';
import { type JsonValue } from '../types';
import { MinusSquareIcon, PlusSquareIcon } from './icons';

const getValueSummary = (value: JsonValue): string => {
  if (value === null) return 'null';
  if (typeof value === 'string') return `"${value}"`;
  if (Array.isArray(value)) return `Array[${value.length}]`;
  if (typeof value === 'object') return `Object`;
  return String(value);
};

const renderSimpleValue = (value: JsonValue) => {
    const style: React.CSSProperties = {};
    if (value === null) {
        style.color = 'var(--syntax-null)';
        return <span style={style}>null</span>;
    }
    switch (typeof value) {
        case 'string': 
            style.color = 'var(--syntax-string)';
            return <span style={style}>"{value}"</span>;
        case 'number': 
            style.color = 'var(--syntax-number)';
            return <span style={style}>{value}</span>;
        case 'boolean': 
            style.color = 'var(--syntax-boolean)';
            return <span style={style}>{String(value)}</span>;
        default: return null;
    }
};

const PropertyTable: React.FC<{ data: JsonValue }> = ({ data }) => {
  const [sortKey, setSortKey] = useState<'name' | 'value'>('name');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const items = useMemo(() => {
    if (typeof data !== 'object' || data === null || Array.isArray(data)) {
      return [];
    }
    const entries = Object.entries(data);
    entries.sort(([keyA, valueA], [keyB, valueB]) => {
      const fieldA = sortKey === 'name' ? keyA.toLowerCase() : String(getValueSummary(valueA)).toLowerCase();
      const fieldB = sortKey === 'name' ? keyB.toLowerCase() : String(getValueSummary(valueB)).toLowerCase();
      if (fieldA < fieldB) return sortDir === 'asc' ? -1 : 1;
      if (fieldA > fieldB) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
    return entries;
  }, [data, sortKey, sortDir]);

  if (typeof data !== 'object' || data === null || Array.isArray(data)) {
    return (
      <div className="flex items-center justify-center h-full text-slate-400 dark:text-slate-500 px-4">
        <p>Select an object to view its properties.</p>
      </div>
    );
  }

  const handleSort = (key: 'name' | 'value') => {
    if (key === sortKey) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  return (
    <div className="h-full w-full overflow-auto">
      <table className="w-full text-left text-xs">
        <thead className="sticky top-0 bg-white dark:bg-slate-800 z-10">
          <tr className="border-b border-slate-300 dark:border-slate-700">
            <th className="p-2 font-semibold cursor-pointer text-slate-700 dark:text-slate-300" onClick={() => handleSort('name')}>
              Name {sortKey === 'name' && <span className="text-primary dark:text-primary-dark ml-1">{sortDir === 'asc' ? '▲' : '▼'}</span>}
            </th>
            <th className="p-2 font-semibold cursor-pointer text-slate-700 dark:text-slate-300" onClick={() => handleSort('value')}>
              Value {sortKey === 'value' && <span className="text-primary dark:text-primary-dark ml-1">{sortDir === 'asc' ? '▲' : '▼'}</span>}
            </th>
          </tr>
        </thead>
        <tbody className="align-top">
          {items.map(([key, value]) => (
            <tr key={key} className="border-b border-slate-200/70 dark:border-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700/20">
              <td className="p-2" style={{ color: 'var(--syntax-key)' }}>{key}</td>
              <td className="p-2">
                {typeof value === 'object' && value !== null ? 
                  <span className="text-slate-400 dark:text-slate-500">{getValueSummary(value)}</span> : 
                  renderSimpleValue(value)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const JsonNode: React.FC<{
  nodeKey: string | number;
  nodeValue: JsonValue;
  onSelect: (value: JsonValue) => void;
  selected: boolean;
  isRoot?: boolean;
}> = ({ nodeKey, nodeValue, onSelect, selected, isRoot = false }) => {
    const [isExpanded, setIsExpanded] = useState(isRoot);
    const isObject = typeof nodeValue === 'object' && nodeValue !== null;

    const handleSelect = (e: React.MouseEvent) => {
        e.stopPropagation();
        onSelect(nodeValue);
    };

    const handleToggle = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsExpanded(prev => !prev);
    };

    const TypeIcon = () => {
        const className = 'w-2.5 h-2.5 mr-2 inline-block rounded-sm';
        if (nodeValue === null) return <span className={`${className} bg-rose-500`}></span>;
        switch (typeof nodeValue) {
          case 'string': return <span className={`${className} bg-blue-500`}></span>;
          case 'number': return <span className={`${className} bg-green-500`}></span>;
          case 'boolean': return <span className={`${className} bg-yellow-500`}></span>;
          default: return null;
        }
    };

    return (
        <div className="select-none">
            <div onClick={handleSelect} className={`flex items-center cursor-pointer hover:bg-slate-200/60 dark:hover:bg-slate-700/50 rounded-sm py-0.5 px-1 ${selected ? 'bg-primary-bg/70 dark:bg-primary-bg-dark/60' : ''}`}>
                <span onClick={isObject ? handleToggle : undefined} className="w-5 h-5 flex items-center justify-center shrink-0 text-slate-500">
                    {isObject && (isExpanded ? <MinusSquareIcon className="w-3.5 h-3.5" /> : <PlusSquareIcon className="w-3.5 h-3.5" />)}
                </span>
                
                {isObject 
                    ? <span className="mr-1 text-slate-400 dark:text-slate-500">{Array.isArray(nodeValue) ? '[]' : '{}'}</span>
                    : <TypeIcon />
                }
                
                <span 
                  className={isRoot ? 'font-bold' : isObject ? 'text-slate-800 dark:text-slate-200' : ''}
                  style={!isRoot && !isObject ? { color: 'var(--syntax-key)' } : {}}
                >
                  {nodeKey}
                </span>

                {!isObject && <span className="text-slate-400 dark:text-slate-500 mx-1">:</span>}
                {!isObject && renderSimpleValue(nodeValue)}
            </div>
            {isExpanded && isObject && (
                <div className="pl-5 border-l border-slate-300/70 dark:border-slate-700/50 ml-2.5">
                    {Array.isArray(nodeValue)
                        ? nodeValue.map((item, index) => <JsonNode key={index} nodeKey={index} nodeValue={item} onSelect={onSelect} selected={selected && item === selected} />)
                        : Object.entries(nodeValue).map(([key, value]) => <JsonNode key={key} nodeKey={key} nodeValue={value} onSelect={onSelect} selected={selected && value === selected}/>)
                    }
                </div>
            )}
        </div>
    )
};


export const JsonViewer: React.FC<{ data: JsonValue }> = ({ data }) => {
  const [selectedNode, setSelectedNode] = useState(data);

  useEffect(() => {
    setSelectedNode(data);
  }, [data]);
  
  return (
    <div className="grid grid-cols-2 h-full">
      <div className="overflow-auto p-2 border-r border-slate-300 dark:border-slate-700">
        <JsonNode nodeKey="JSON" nodeValue={data} isRoot onSelect={setSelectedNode} selected={selectedNode === data} />
      </div>
      <div className="overflow-auto">
        <PropertyTable data={selectedNode} />
      </div>
    </div>
  );
};