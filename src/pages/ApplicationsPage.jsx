//job applications  dashbord search, sorting, drag and drop status update, job add edit functionality
import { useMemo, useRef, useState } from 'react';
import { useApplications } from '../hooks/useApplications.js';
import { useDragAutoScroll } from '../hooks/useDragAutoScroll.js';
import ApplicationCard from '../components/ApplicationCard.jsx';
import ApplicationForm from '../components/ApplicationForm.jsx';
import BoardColumn from '../components/BoardColumn.jsx';
import DragDock from '../components/DragDock.jsx';
import Modal from '../components/Modal.jsx';
import { Alert } from '../components/Alert.jsx';
import { CardSkeleton } from '../components/Loading.jsx';
import { SORTS, STATUSES } from '../utils/constants.js';
import { inputClass, primaryButton, secondaryButton } from '../utils/ui.js';


function compareByDate(order) {
  const direction = order === 'new' ? -1 : 1;
  return (a, b) =>
    direction *
    (String(a.applied_date).localeCompare(String(b.applied_date)) || String(a.id).localeCompare(String(b.id)));
}

export default function ApplicationsPage() {
  const { applications, status, error, reload, create, update, changeStatus, remove, fetchTip } = useApplications();


  const [dialog, setDialog] = useState(null);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('new');
  const [moveError, setMoveError] = useState('');
  const [hoverStatus, setHoverStatus] = useState(null);
  const boardRef = useRef(null);
  const dragging = useDragAutoScroll(boardRef);
  const columns = useMemo(() => {
    const query = search.trim().toLowerCase();
    const sorter = compareByDate(sort);
    const matches = applications.filter((a) => !query || (a.company_name ?? '').toLowerCase().includes(query));
    return STATUSES.map((s) => ({ status: s, items: matches.filter((a) => a.status === s).sort(sorter) }));
  }, [applications, search, sort]);


  async function handleDropCard(id, newStatus) {
    setHoverStatus(null);
    const application = applications.find((a) => String(a.id) === id);
    if (!application || application.status === newStatus) return;
    setMoveError('');
    try {
      await changeStatus(application.id, newStatus);
    } catch (err) {
      setMoveError(err.message);
    }
  }

  async function handleSave(payload) {
    if (dialog.application) await update(dialog.application.id, payload);
    else await create(payload);
    setDialog(null);
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">Job hunt</h1>

        <div className="flex flex-1 flex-wrap items-center justify-end gap-2">
          <label htmlFor="company-search" className="sr-only">
            Search by company
          </label>
          <input
            id="company-search"
            type="search"
            placeholder="Search by company"
            maxLength={255}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className={`${inputClass} min-w-40 flex-[1_1_100%] sm:max-w-72 sm:flex-1`}
          />

          <div role="group" aria-label="Sort by date applied" className="inline-grid flex-1 grid-cols-2 gap-1 rounded-xl bg-slate-100 p-1 sm:flex-none">
            {SORTS.map((option) => (
              <button
                key={option.value}
                type="button"
                aria-pressed={sort === option.value}
                onClick={() => setSort(option.value)}
                className={`min-h-10 rounded-lg px-3.5 text-sm font-medium ${
                  sort === option.value ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          <button type="button" className={`${primaryButton} flex-1 sm:flex-none`} onClick={() => setDialog({ status: 'applied' })}>
            Add job
          </button>
        </div>
      </div>

      {moveError && <Alert>{moveError}</Alert>}

      {status === 'loading' && (
        <div aria-busy="true" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <p role="status" className="sr-only">
            Loading applications
          </p>
          {[0, 1, 2].map((n) => (
            <CardSkeleton key={n} /> // static list, so index-like keys are safe here
          ))}
        </div>
      )}

      {status === 'error' && (
        <div className="flex flex-col items-start gap-3">
          <Alert>{error}</Alert>
          <button type="button" className={secondaryButton} onClick={reload}>
            Try again
          </button>
        </div>
      )}

      {status === 'ready' && applications.length === 0 && (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center">
          <h2 className="text-base font-semibold text-gray-900">No applications yet</h2>
          <p className="mt-1 text-sm text-gray-600">Add your first job to start tracking.</p>
          <button type="button" className={`${primaryButton} mt-4`} onClick={() => setDialog({ status: 'applied' })}>
            Add job
          </button>
        </div>
      )}

      {status === 'ready' && applications.length > 0 && (
        <div
          ref={boardRef}
          role="region"
          aria-label="Application board"
          tabIndex={0}
          className={`flex ${dragging ? '' : 'snap-x snap-mandatory'} gap-3 overflow-x-auto pb-3 md:grid md:snap-none md:grid-cols-2 md:overflow-visible lg:flex lg:overflow-x-auto`}
        >
          {columns.map((column) => (
            <BoardColumn
              key={column.status}
              status={column.status}
              count={column.items.length}
              onDropCard={handleDropCard}
              onAdd={(s) => setDialog({ status: s })}
              onHover={setHoverStatus}
            >

              {column.items.map((application) => (
                <ApplicationCard
                  key={application.id}
                  application={application}
                  onEdit={(a) => setDialog({ application: a })}
                  onStatusChange={changeStatus}
                  onDelete={remove}
                  onGetTip={fetchTip}
                />
              ))}
            </BoardColumn>
          ))}
        </div>
      )}

      <DragDock
        visible={dragging}
        target={dragging ? hoverStatus : null}
        onHover={setHoverStatus}
        onDropCard={handleDropCard}
      />

      {dialog && (
        <Modal title={dialog.application ? 'Edit job' : 'Add job'} onClose={() => setDialog(null)}>
          <ApplicationForm
            initial={dialog.application ?? null}
            defaultStatus={dialog.status}
            onSubmit={handleSave}
            onCancel={() => setDialog(null)}
          />
        </Modal>
      )}
    </div>
  );
}