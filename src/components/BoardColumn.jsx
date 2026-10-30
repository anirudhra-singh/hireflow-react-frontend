import { useState } from 'react';
import { STATUS_LABELS, STATUS_STYLES } from '../utils/constants.js';


export default function BoardColumn({ status, count, onDropCard, onAdd, onHover, children }) {
  const [isOver, setIsOver] = useState(false);

  return (
    <section
      aria-label={STATUS_LABELS[status]}
      onDragOver={(event) => {
        event.preventDefault();
        setIsOver(true);
        onHover(status);
      }}
      onDragLeave={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setIsOver(false);
          onHover(null);
        }
      }}
      onDrop={(event) => {
        event.preventDefault();
        setIsOver(false);
        onDropCard(event.dataTransfer.getData('text/plain'), status);
      }}
      // Phones: swipeable columns (86% wide, snap). Tablets: 2-column grid
      // Desktop: fixed-width columns inside a horizontally scrolling board
      className={`flex w-[86%] shrink-0 snap-start flex-col gap-2.5 rounded-2xl bg-slate-100 p-2.5 md:w-auto md:shrink md:snap-align-none lg:w-68 lg:shrink-0 ${
        isOver ? 'outline-2 outline-dashed outline-violet-700' : ''
      }`}
    >
      <h2
        className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm font-semibold text-white ${STATUS_STYLES[status].header}`}
      >
        <span>{STATUS_LABELS[status]}</span>
        <span className="rounded-full bg-white/25 px-2 text-xs">{count}</span>
      </h2>

      {children}

      <button
        type="button"
        onClick={() => onAdd(status)}
        className="min-h-11 rounded-xl border-[1.5px] border-dashed border-gray-300 text-[13px] font-medium text-gray-600 hover:border-violet-700 hover:bg-white hover:text-violet-700"
      >
        Add job
      </button>
    </section>
  );
}