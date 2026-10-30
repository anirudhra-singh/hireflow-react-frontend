import { STATUSES, STATUS_LABELS, STATUS_STYLES } from '../utils/constants.js';

//floating bar appears only while a card is being dragged
export default function DragDock({ visible, target, onHover, onDropCard }) {
  return (
    <div
      data-drag-dock 
      aria-hidden="true"
      onDragLeave={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) onHover(null);
      }}
      className={`fixed bottom-18 left-1/2 z-30 flex max-w-[calc(100vw-1rem)] -translate-x-1/2 flex-col items-center gap-2 rounded-3xl border border-gray-200/70 bg-white/75 p-3 shadow-2xl shadow-violet-900/25 backdrop-blur-xl transition duration-200 motion-reduce:transition-none lg:bottom-4 ${
        visible ? 'visible translate-y-0 opacity-100' : 'pointer-events-none invisible translate-y-6 opacity-0'
      }`}
    >
      <p className="text-[13px] font-medium text-gray-600">
        {target ? `Move to ${STATUS_LABELS[target]}` : 'Drop on a status to move the card'}
      </p>

      <div className="flex flex-wrap justify-center gap-2">
        {STATUSES.map((status) => {
          const active = target === status;
          const styles = STATUS_STYLES[status];
          return (
            <div
              key={status}
              onDragOver={(event) => {
                event.preventDefault();
                onHover(status);
              }}
              onDrop={(event) => {
                event.preventDefault();
                onDropCard(event.dataTransfer.getData('text/plain'), status);
              }}
              className={`inline-flex min-h-12 min-w-26 items-center justify-center gap-2 rounded-full px-4 text-sm font-semibold transition duration-150 motion-reduce:transition-none ${
                active ? `scale-110 text-white shadow-lg ${styles.header}` : 'bg-slate-100 text-gray-800'
              }`}
            >
              <span className={`h-2.5 w-2.5 rounded-full ${active ? 'bg-white' : styles.dot}`} />
              {STATUS_LABELS[status]}
            </div>
          );
        })}
      </div>
    </div>
  );
}