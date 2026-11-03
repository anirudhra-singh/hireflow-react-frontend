import { useEffect, useRef, useState } from 'react';
import Icon from './Icon.jsx';

// just now, 3 min ago, 2 h ago
function since(timestamp) {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  return `${Math.floor(minutes / 60)} h ago`;
}

// sparkle badge + ai suggestion name 
function Title() {
  return (
    <span className="flex items-center gap-2">
      <span className="grid size-5.5 place-items-center rounded-md bg-linear-to-br from-violet-500 to-indigo-500 text-white">
        <Icon name="sparkle" className="size-3" />
      </span>
      <strong className="bg-linear-to-r from-violet-700 to-indigo-600 bg-clip-text text-xs font-bold tracking-wide text-transparent">
        AI suggestion
      </strong>
    </span>
  );
}

export default function AiSuggestion({ tip, loading, generatedAt }) {
  const [copyState, setCopyState] = useState('idle'); 
  const [, setTick] = useState(0);
  const timerRef = useRef(null);

  //re-rendering in every 30s so just now can turn into 1 min ago
  useEffect(() => {
    if (!generatedAt) return undefined;
    const id = setInterval(() => setTick((n) => n + 1), 30_000);
    return () => clearInterval(id);
  }, [generatedAt]);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  async function handleCopy() {
    clearTimeout(timerRef.current);
    try {
      await navigator.clipboard.writeText(tip);
      setCopyState('copied');
    } catch {
      setCopyState('failed'); 
    }
    timerRef.current = setTimeout(() => setCopyState('idle'), 1600);
  }

  if (loading) {
    return (
      <section
        role="status"
        aria-label="AI is writing a suggestion"
        className="ai-box flex flex-col gap-2 rounded-xl p-2.5 shadow-md shadow-indigo-500/10"
      >
        <Title />
        <div className="h-2.5 animate-shimmer rounded-md bg-linear-to-r from-slate-100 via-violet-100 to-slate-100 bg-size-[200%_100%]" />
        <div className="h-2.5 w-2/3 animate-shimmer rounded-md bg-linear-to-r from-slate-100 via-violet-100 to-slate-100 bg-size-[200%_100%]" />
        <p className="text-xs text-gray-600">Thinking…</p>
      </section>
    );
  }

  const lines = tip
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  return (
    <section
      aria-label="AI suggestion"
      className={`ai-box flex flex-col gap-2 rounded-xl p-2.5 shadow-md shadow-indigo-500/10 ${generatedAt ? 'animate-ai-in' : ''}`}
    >
      <div className="flex items-center gap-2">
        <div className="flex min-w-0 flex-col leading-tight">
          <Title />
          {generatedAt && <span className="mt-0.5 pl-7.5 text-[11px] text-gray-600">Generated {since(generatedAt)}</span>}
        </div>

        <button
          type="button"
          onClick={handleCopy}
          aria-label="Copy suggestion to clipboard"
          className={`group relative ml-auto inline-flex min-h-6.5 items-center gap-1 rounded-full px-2 text-[11px] font-semibold transition duration-150 after:absolute after:-inset-x-1.5 after:-inset-y-2 after:content-[''] active:scale-95 ${
            copyState === 'copied'
              ? 'bg-green-600/15 text-green-700'
              : copyState === 'failed'
                ? 'bg-rose-50 text-rose-700'
                : 'text-gray-600 hover:bg-violet-50 hover:text-violet-700'
          }`}
        >
          <Icon
            name={copyState === 'copied' ? 'check' : 'copy'}
            className={`size-3.5 transition-transform duration-150 ${
              copyState === 'copied' ? 'animate-pop' : copyState === 'idle' ? 'group-hover:-translate-y-px group-hover:scale-110' : ''
            }`}
          />
          {copyState === 'copied' ? 'Copied' : copyState === 'failed' ? 'Failed' : 'Copy'}
        </button>
        <span className="sr-only" role="status">
          {copyState === 'copied' ? 'Copied to clipboard' : copyState === 'failed' ? 'Copy failed' : ''}
        </span>
      </div>

      <ul className="flex flex-col gap-1.5 text-[13px] leading-snug text-gray-800">
        {lines.map((line, index) => (
          <li key={`${index}-${line}`} className="flex items-start gap-2">
            <Icon name="check" className="mt-0.5 size-3.5 shrink-0 text-green-600" />
            <span className="wrap-break-word">{line}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}