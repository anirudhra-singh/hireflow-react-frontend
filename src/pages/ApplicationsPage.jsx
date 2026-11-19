import { useMemo, useRef, useState } from 'react';
import { useApplications } from '../hooks/useApplications.js';
import { useDragAutoScroll } from '../hooks/useDragAutoScroll.js';
import ApplicationCard from '../components/ApplicationCard.jsx';
import ApplicationForm from '../components/ApplicationForm.jsx';
import BoardColumn from '../components/BoardColumn.jsx';
import DragDock from '../components/DragDock.jsx';
import FiltersMenu from '../components/FiltersMenu.jsx';
import Icon from '../components/Icon.jsx';
import JobsTable from '../components/JobsTable.jsx';
import Modal from '../components/Modal.jsx';
import PageHeader from '../components/PageHeader.jsx';
import SortMenu from '../components/SortMenu.jsx';
import { Alert } from '../components/Alert.jsx';
import { CardSkeleton } from '../components/Loading.jsx';
import { STATUSES } from '../utils/constants.js';
import { EMPTY_FILTERS, matchesFilters } from '../utils/filters.js';
import { primaryButton, secondaryButton } from '../utils/ui.js';

// The two ways to look at the same jobs. To rename a tab, change `label` here.
const VIEWS = [
  { value: 'board', label: 'Board View' },
  { value: 'table', label: 'Table View' },
];

// SORT: sort by the date applied. Ties are broken by id so the order never jumps
// around (ids are compared as text, so this works for numbers and UUIDs alike).
// The sort choices themselves are listed in SORTS in utils/constants.js.
function compareByDate(order) {
  const direction = order === 'new' ? -1 : 1;
  return (a, b) =>
    direction *
    (String(a.applied_date).localeCompare(String(b.applied_date)) || String(a.id).localeCompare(String(b.id)));
}

export default function ApplicationsPage() {
  const { applications, status, error, reload, create, update, changeStatus, remove, fetchTip } = useApplications();

  // dialog: null (closed) | { status } (adding to a column) | { application } (editing)
  const [dialog, setDialog] = useState(null);
  const [view, setView] = useState('board');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('new');
  // FILTER: { statuses: [...], when: 'any' | '7' | '30' }. See utils/filters.js.
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [moveError, setMoveError] = useState('');
  // Which status is under the pointer while dragging (a column or a dock pill).
  const [hoverStatus, setHoverStatus] = useState(null);

  const boardRef = useRef(null);
  const dragging = useDragAutoScroll(boardRef);

  // ONE filtered and sorted list, shared by BOTH views. That is why search, filters
  // and sort work the same in Board and Table.
  const visible = useMemo(
    () => applications.filter((a) => matchesFilters(a, search, filters)).sort(compareByDate(sort)),
    [applications, search, filters, sort],
  );

  // The Board splits that same list into one column per status. When a status
  // filter is on, the columns you didn't pick are hidden.
  const columns = useMemo(
    () =>
      STATUSES.filter((s) => filters.statuses.length === 0 || filters.statuses.includes(s)).map((s) => ({
        status: s,
        items: visible.filter((a) => a.status === s),
      })),
    [visible, filters.statuses],
  );

  // Used by BOTH the columns and the DragDock pills.
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

  function clearSearchAndFilters() {
    setSearch('');
    setFilters(EMPTY_FILTERS);
  }

  const showContent = status === 'ready' && applications.length > 0;

  return (
    <div className="flex flex-col gap-4">
      <PageHeader onAdd={() => setDialog({ status: 'applied' })} />

      {/* The view switch: underlined tabs. Your choice stays while you search or filter. */}
      <div role="group" aria-label="View" className="flex gap-6 border-b border-gray-200">
        {VIEWS.map((option) => (
          <button
            key={option.value}
            type="button"
            aria-pressed={view === option.value}
            onClick={() => setView(option.value)}
            className={`-mb-px min-h-11 border-b-2 px-1 text-[15px] font-medium transition-colors duration-150 ${
              view === option.value
                ? 'border-violet-700 text-violet-700'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* HEADER: the toolbar. The search box is deliberately small (w-60 from sm up).
          On phones it takes its own full-width row, and Filters + Sort share the next
          row, half each. */}
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        <div className="relative w-full sm:w-60">
          <Icon name="search" className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-gray-500" />
          <label htmlFor="job-search" className="sr-only">
            Search by title or company
          </label>
          <input
            id="job-search"
            type="search"
            placeholder="Search by title or company"
            maxLength={255}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            // h-9 = 36px for a mouse, 44px and 16px text on touch (pointer-coarse:),
            // which also stops iOS Safari from zooming in when you tap the box.
            className="h-9 w-full rounded-[10px] border border-gray-200 bg-white pr-3 pl-8 text-sm text-gray-900 placeholder:text-gray-500 hover:border-gray-300 focus-visible:border-violet-700 pointer-coarse:h-11 pointer-coarse:text-base"
          />
        </div>

        <div className="flex w-full gap-2 sm:w-auto">
          <FiltersMenu filters={filters} onChange={setFilters} />
          <SortMenu value={sort} onChange={setSort} />
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

      {showContent && view === 'board' && (
        // tabIndex={0} + role="region": keyboard users can focus the board and
        // scroll it sideways with the arrow keys.
        <div
          ref={boardRef}
          role="region"
          aria-label="Application board"
          tabIndex={0}
          // BOARD: the columns SHARE the available width equally (auto-cols with
          // minmax(11rem,1fr)) and only scroll sideways, inside this box, if the window
          // is narrower than that. lg:grid-cols-none cancels the 2-column tablet layout.
          // Scroll-snap is off during a drag, otherwise it fights the auto-scroll.
          // DROPDOWN: has-data-dropdown:pb-52 adds empty space under the board while a
          // card's status dropdown is open, so the menu isn't cut off.
          className={`flex ${dragging ? '' : 'snap-x snap-mandatory'} gap-3 overflow-x-auto pb-3 has-data-dropdown:pb-52 md:grid md:snap-none md:grid-cols-2 md:overflow-visible lg:grid-flow-col lg:grid-cols-none lg:auto-cols-[minmax(11rem,1fr)] lg:overflow-x-auto`}
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
              {/* LISTS AND KEYS: key={id} lets React tell cards apart, so moving
                  or deleting one card doesn't mix up another card's open state. */}
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

      {showContent && view === 'table' &&
        (visible.length === 0 ? (
          <div className="flex flex-col items-start gap-3">
            <p className="text-sm text-gray-600">No applications match your search or filters.</p>
            <button type="button" className={secondaryButton} onClick={clearSearchAndFilters}>
              Clear search and filters
            </button>
          </div>
        ) : (
          <JobsTable
            applications={visible}
            onEdit={(a) => setDialog({ application: a })}
            onStatusChange={changeStatus}
            onDelete={remove}
          />
        ))}

      {/* The drag bar only makes sense on the Board. Always rendered there (just
          hidden), so showing it never remounts anything while a drag is running. */}
      {view === 'board' && (
        <DragDock
          visible={dragging}
          target={dragging ? hoverStatus : null}
          onHover={setHoverStatus}
          onDropCard={handleDropCard}
        />
      )}

      {/* CONDITIONAL RENDERING: the dialog exists only while `dialog` is set. */}
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