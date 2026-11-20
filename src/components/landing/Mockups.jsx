import { useEffect, useState } from 'react';
import Icon from '../Icon.jsx';
import { STATUS_STYLES } from '../../utils/constants.js';


const PROGRESS = { none: 'w-0', third: 'w-1/3', two: 'w-2/3', full: 'w-full' };

//  window frame
function BrowserWindow({ url, children }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl shadow-violet-900/20 transition-transform duration-300 hover:-translate-y-1">
      <div className="flex items-center gap-1.5 border-b border-gray-200 px-3.5 py-2.5 text-[11px] text-gray-500">
        <span className="size-2.25 rounded-full bg-[#ff6159]" />
        <span className="size-2.25 rounded-full bg-[#ffbd2e]" />
        <span className="size-2.25 rounded-full bg-[#28ca41]" />
        <span className="ml-2 truncate">{url}</span>
      </div>
      <div className="relative p-3">{children}</div>
    </div>
  );
}

//  mini board pieces
function MiniCard({ status, company, title, progress, className = '' }) {
  const styles = STATUS_STYLES[status];
  return (
    <div
      className={`flex flex-col gap-0.5 rounded-[7px] border border-l-[3px] border-gray-200 bg-white px-2 py-1.5 text-[10px] transition-transform duration-200 hover:-translate-y-0.5 ${styles.border} ${className}`}
    >
      <b className="truncate text-[11px] text-gray-900">{company}</b>
      <span className="truncate text-gray-500">{title}</span>
      <div className="mt-0.5 h-0.75 rounded-sm bg-gray-200">
        <div className={`h-full rounded-sm ${styles.step} ${PROGRESS[progress]}`} />
      </div>
    </div>
  );
}

function MiniColumn({ status, label, count, children }) {
  return (
    <div className="flex min-w-0 flex-col gap-1.5 rounded-[10px] bg-slate-100 p-1.5">
      <h4 className={`flex justify-between rounded-md px-2 py-1 text-[10px] font-semibold text-white ${STATUS_STYLES[status].header}`}>
        {label}
        <em className="not-italic opacity-80">{count}</em>
      </h4>
      {children}
    </div>
  );
}

//  hero mockup
export function HeroMock() {
  return (
    <BrowserWindow url="hireflow-job-tracker.vercel.app/board">
      <div className="relative grid grid-cols-3 gap-2.5">
        <MiniColumn status="applied" label="Applied" count={2}>
          <MiniCard status="applied" company="Northwind Labs" title="Python Developer" progress="third" />
          <MiniCard
            status="applied"
            company="Cobalt AI"
            title="ML Engineer"
            progress="third"
            className="animate-card-ghost motion-reduce:animate-none"
          />
        </MiniColumn>
        <MiniColumn status="interview" label="Interview" count={1}>
          <MiniCard status="interview" company="Orbit Health" title="Backend Engineer" progress="two" />
        </MiniColumn>
        <MiniColumn status="offer" label="Offer" count={1}>
          <MiniCard status="offer" company="Harbor Systems" title="Software Engineer" progress="full" />
        </MiniColumn>

        <div
          aria-hidden="true"
          className="absolute top-23 left-1.5 z-10 w-[calc((100%-20px)/3-12px)] animate-card-drag drop-shadow-lg motion-reduce:hidden"
        >
          <MiniCard status="applied" company="Cobalt AI" title="ML Engineer" progress="third" />
        </div>
      </div>

      <div
        aria-hidden="true"
        className="absolute right-3.5 bottom-2.5 flex animate-toast-pop items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-[11px] font-bold text-gray-900 shadow-lg motion-reduce:hidden"
      >
        <Icon name="check" className="size-3.5 text-green-600" />
        Moved to Interview
      </div>
      {/* Empty space at the bottom so the chip never covers a card. */}
      <div className="h-9" />
    </BrowserWindow>
  );
}

// board mockup
const DOCK = [
  { status: 'applied', label: 'Applied', delay: '[animation-delay:0s]' },
  { status: 'interview', label: 'Interview', delay: '[animation-delay:1s]' },
  { status: 'offer', label: 'Offer', delay: '[animation-delay:2s]' },
  { status: 'rejected', label: 'Rejected', delay: '[animation-delay:3s]' },
];

export function BoardMock() {
  return (
    <BrowserWindow url="hireflow-job-tracker.vercel.app/board">
      <div className="grid grid-cols-4 gap-2.5">
        <MiniColumn status="applied" label="Applied" count={3}>
          <MiniCard status="applied" company="Northwind Labs" title="Python Developer" progress="third" />
          <MiniCard status="applied" company="Cobalt AI" title="ML Engineer" progress="third" />
          <MiniCard status="applied" company="Aster Pay" title="Backend Developer" progress="third" />
        </MiniColumn>
        <MiniColumn status="interview" label="Interview" count={2}>
          <MiniCard status="interview" company="Orbit Health" title="Backend Engineer" progress="two" />
          <MiniCard status="interview" company="Kestrel Pay" title="API Developer" progress="two" />
        </MiniColumn>
        <MiniColumn status="offer" label="Offer" count={1}>
          <MiniCard status="offer" company="Harbor Systems" title="Software Engineer" progress="full" />
        </MiniColumn>
        <MiniColumn status="rejected" label="Rejected" count={1}>
          <MiniCard status="rejected" company="Lumen Cloud" title="Backend Intern" progress="none" />
        </MiniColumn>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5 text-[10px] text-gray-500">
        Drop on a status:
        {DOCK.map((item) => (
          <span
            key={item.status}
            className={`relative inline-flex animate-dock-pill rounded-full bg-slate-100 px-2.5 py-1 font-bold text-gray-800 motion-reduce:animate-none ${item.delay}`}
          >
            {item.label}
            <span
              aria-hidden="true"
              className={`absolute inset-0 grid animate-dock-fill place-items-center rounded-full text-white opacity-0 motion-reduce:hidden ${STATUS_STYLES[item.status].header} ${item.delay}`}
            >
              {item.label}
            </span>
          </span>
        ))}
      </div>
    </BrowserWindow>
  );
}

//  table mockup
const ROWS = [
  { company: 'Northwind Labs', title: 'Python Backend Developer', status: 'interview', date: 'Nov 2, 2026' },
  { company: 'Cobalt AI', title: 'ML Platform Engineer', status: 'applied', date: 'Nov 7, 2026', active: true },
  { company: 'Harbor Systems', title: 'Junior Software Engineer', status: 'offer', date: 'Oct 20, 2026' },
  { company: 'Lumen Cloud', title: 'Backend Intern', status: 'rejected', date: 'Oct 12, 2026' },
];
const STATUS_TEXT = { applied: 'Applied', interview: 'Interview', offer: 'Offer', rejected: 'Rejected' };


const ROW_GRID =
  'relative grid grid-cols-[1.1fr_1.4fr_1fr_0.9fr_28px] items-center gap-2 border-b border-gray-200 px-2.5 py-2 max-sm:grid-cols-[1.2fr_1.3fr_1fr_28px]';


export function TableMock() {
  return (
    <BrowserWindow url="hireflow-job-tracker.vercel.app/board">
      <div className="text-[11px]">
        <div className={`${ROW_GRID} rounded-t-lg bg-slate-100 font-bold text-gray-600`}>
          <span>Company</span>
          <span>Job title</span>
          <span>Status</span>
          <span className="max-sm:hidden">Applied on</span>
          <span />
        </div>

        {ROWS.map((row) => {
          const styles = STATUS_STYLES[row.status];
          return (
            <div key={row.company} className={`${ROW_GRID} ${row.active ? 'animate-row-hl motion-reduce:animate-none' : ''}`}>
              <b className="truncate text-gray-900">{row.company}</b>
              <span className="truncate text-gray-700">{row.title}</span>
              <span className={`inline-flex w-max items-center gap-1.5 rounded-full px-2 py-0.5 font-bold ${styles.pill}`}>
                <span className={`size-1.5 rounded-full ${styles.dot}`} />
                {STATUS_TEXT[row.status]}
              </span>
              <span className="truncate text-gray-600 max-sm:hidden">{row.date}</span>
              <span className="text-center font-extrabold tracking-widest text-gray-500">···</span>

              {row.active && (
                <div
                  aria-hidden="true"
                  className="absolute top-8 right-2 z-10 grid origin-top-right animate-menu-pop rounded-[10px] border border-gray-200 bg-white p-1 text-[11px] shadow-xl motion-reduce:hidden"
                >
                  <span className="rounded-md py-1.5 pr-4 pl-2.5">Edit</span>
                  <span className="rounded-md py-1.5 pr-4 pl-2.5 text-red-600">Delete</span>
                </div>
              )}
            </div>
          );
        })}
        <div className="h-6" />
      </div>
    </BrowserWindow>
  );
}

// ai mockup
const AI_LINES = [
  { text: 'Prepare a rate limiter design.', delay: '[animation-delay:0.4s]' },
  { text: 'Have one production debugging story ready.', delay: '[animation-delay:1.4s]' },
  { text: 'Ask how the team ships and tests code.', delay: '[animation-delay:2.4s]' },
];

export function AiMock() {
  return (
    <BrowserWindow url="hireflow-job-tracker.vercel.app/board">
        <div className={`flex flex-col gap-0.5 rounded-lg border border-l-[3px] border-gray-200 bg-white px-3 py-2.5 text-xs shadow-sm ${STATUS_STYLES.interview.border}`}>
        <b className="text-sm text-gray-900">Northwind Labs</b>
        <span className="text-gray-500">Python Backend Developer</span>
        <div className="mt-1 h-0.75 rounded-sm bg-gray-200">
          <div className="h-full w-2/3 rounded-sm bg-green-700" />
        </div>
      </div>

      <div className="ai-box mt-2.5 grid gap-2 rounded-xl p-3 text-xs shadow-md shadow-indigo-500/15">
        <div className="flex items-center gap-2 font-bold">
          <span className="grid size-5.5 place-items-center rounded-md bg-linear-to-br from-violet-500 to-indigo-500 text-white">
            <Icon name="sparkle" className="size-3" />
          </span>
          <span className="bg-linear-to-r from-violet-700 to-indigo-600 bg-clip-text text-transparent">AI suggestion</span>
          <small className="ml-auto font-medium text-gray-500">Generated just now · Copy</small>
        </div>
        {AI_LINES.map((line) => (
          <div key={line.text} className={`flex animate-ai-line items-start gap-2 motion-reduce:animate-none ${line.delay}`}>
            <Icon name="check" className="mt-0.5 size-3.5 shrink-0 text-green-600" />
            <span className="text-gray-800">{line.text}</span>
          </div>
        ))}
      </div>
    </BrowserWindow>
  );
}

// analytics mockup
function CountUp({ to, run }) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!run) return undefined;
    let frame = 0;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      frame = requestAnimationFrame(() => setValue(to));
      return () => cancelAnimationFrame(frame);
    }
    const start = performance.now();
    function step(now) {
      const progress = Math.min((now - start) / 1100, 1);
      setValue(Math.round(to * (1 - (1 - progress) ** 3))); // ease-out
      if (progress < 1) frame = requestAnimationFrame(step);
    }
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [run, to]);

  return <>{value}</>;
}

const SEGMENTS = [
  { stroke: 'stroke-violet-700', on: '[stroke-dasharray:45_55]', offset: 25 },
  { stroke: 'stroke-green-700', on: '[stroke-dasharray:25_75]', offset: -20 },
  { stroke: 'stroke-amber-700', on: '[stroke-dasharray:8_92]', offset: -45 },
  { stroke: 'stroke-red-600', on: '[stroke-dasharray:14_86]', offset: -53 },
  { stroke: 'stroke-gray-600', on: '[stroke-dasharray:8_92]', offset: -67 },
];
const BAR_HEIGHTS = ['h-[30%]', 'h-[50%]', 'h-[40%]', 'h-[70%]', 'h-[60%]', 'h-[90%]'];
const BAR_DELAYS = ['delay-300', 'delay-[380ms]', 'delay-[460ms]', 'delay-[540ms]', 'delay-[620ms]', 'delay-[700ms]'];

function StatCard({ label, children }) {
  return (
    <div className="rounded-[10px] border border-gray-200 px-2.5 py-2">
      <small className="block text-[9px] text-gray-500">{label}</small>
      <b className="text-lg text-gray-900">{children}</b>
    </div>
  );
}

export function StatsMock({ run = false }) {
  return (
    <BrowserWindow url="hireflow-job-tracker.vercel.app/analytics">
      <div className="mb-2.5 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <StatCard label="Total">
          <CountUp to={24} run={run} />
        </StatCard>
        <StatCard label="Interviewing">
          <CountUp to={6} run={run} />
        </StatCard>
        <StatCard label="Offers">
          <CountUp to={2} run={run} />
        </StatCard>
        <StatCard label="Conversion">8.3%</StatCard>
      </div>

      <div className="grid gap-2.5 sm:grid-cols-[1fr_1.3fr]">
        <div className="flex flex-col gap-2 rounded-[10px] border border-gray-200 p-2.5 text-[10px] text-gray-500">
          <b className="text-gray-900">Status breakdown</b>
          <svg viewBox="0 0 42 42" className="m-auto size-22" aria-hidden="true">
            <circle cx="21" cy="21" r="15.9155" fill="none" strokeWidth="6" className="stroke-slate-100" />
            {SEGMENTS.map((segment) => (
              <circle
                key={segment.stroke}
                cx="21"
                cy="21"
                r="15.9155"
                fill="none"
                strokeWidth="6"
                strokeDashoffset={segment.offset}
                className={`${segment.stroke} transition-[stroke-dasharray] duration-1300 ease-out ${
                  run ? segment.on : '[stroke-dasharray:0_100]'
                }`}
              />
            ))}
          </svg>
        </div>

        <div className="flex flex-col gap-2 rounded-[10px] border border-gray-200 p-2.5 text-[10px] text-gray-500">
          <b className="text-gray-900">Applications per week</b>
          <div className="flex h-22 items-end gap-2">
            {BAR_HEIGHTS.map((height, index) => (
              <div
                key={height}
                className={`flex-1 rounded-t bg-linear-to-b from-violet-700 to-indigo-500 transition-[height] duration-900ms ease-out ${
                  run ? height : 'h-0'
                } ${BAR_DELAYS[index]}`}
              />
            ))}
          </div>
        </div>
      </div>
    </BrowserWindow>
  );
}