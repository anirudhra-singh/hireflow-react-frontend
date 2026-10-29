// job application card company name, job title, status progress bar, applied date, link, notes, AI tips related code
import { useId, useState } from 'react';
import StatusPicker from './StatusPicker.jsx';
import { Alert } from './Alert.jsx';
import { STAGES, STATUS_LABELS, STATUS_STYLES } from '../utils/constants.js';
import { parseSafeUrl } from '../utils/safeUrl.js';
import { formatDate } from '../utils/format.js';
import { dangerButton, secondaryButton } from '../utils/ui.js';

// ai error message
function tipErrorMessage(err) {
  if (err.status === 429) return 'You have reached the AI tip limit for now. Please try again later.';
  if (err.status === 502) return 'The AI service had a problem. Please try again in a moment.';
  if (err.status === 504) return 'The AI service took too long to answer. Please try again.';
  return err.message;
}

export default function ApplicationCard({ application, onEdit, onStatusChange, onDelete, onGetTip }) {
  const uid = useId();
  const [busy, setBusy] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [tipLoading, setTipLoading] = useState(false);
  const [actionError, setActionError] = useState('');
  const [tipError, setTipError] = useState('');

  const styles = STATUS_STYLES[application.status] ?? STATUS_STYLES.applied;
  // job application process ke kis stage par hai
  const stageIndex = STAGES.indexOf(application.status);
  const link = parseSafeUrl(application.job_url);

  // call api to change the status of appliction
  async function handleStatusChange(next) {
    setBusy(true);
    setActionError('');
    try {
      await onStatusChange(application.id, next); // on success the card moves column
    } catch (err) {
      setActionError(err.message);
      setBusy(false);
    }
  }
// call api handle appliction delete
  async function handleDelete() {
    setBusy(true);
    setActionError('');
    try {
      await onDelete(application.id); // on success this card unmounts
    } catch (err) {
      setActionError(err.message);
      setBusy(false);
      setConfirmingDelete(false);
    }
  }
// call api for ai tips
  async function handleGetTip() {
    setTipLoading(true);
    setTipError('');
    try {
      await onGetTip(application.id);
    } catch (err) {
      setTipError(tipErrorMessage(err));
    } finally {
      setTipLoading(false);
    }
  }

  return (
    <article
      aria-labelledby={`${uid}-heading`}
      // draggable drop it on another column to change its status. The status
      draggable
      onDragStart={(event) => event.dataTransfer.setData('text/plain', String(application.id))}
      className={`flex min-w-0 cursor-grab flex-col gap-2.5 rounded-xl border border-l-[3px] border-gray-200 bg-white p-3 shadow-sm ${styles.border}`}
    >
      <div className="min-w-0">
        <h3 id={`${uid}-heading`} className="break-words text-[15px] font-semibold text-gray-900">
          {application.company_name}
        </h3>
        <p className="break-words text-xs text-gray-600">{application.job_title}</p>
      </div>

      {stageIndex >= 0 ? (
        <div
          role="img"
          aria-label={`Stage ${stageIndex + 1} of ${STAGES.length}: ${STATUS_LABELS[application.status]}`}
          className="flex gap-1"
        >
          {STAGES.map((stage, index) => (
            <span
              key={stage}
              className={`h-1 flex-1 rounded-full ${index <= stageIndex ? styles.step : 'bg-gray-200'}`}
            />
          ))}
        </div>
      ) : (
        <p className="text-xs text-gray-600">Process ended</p>
      )}

      <p className="text-xs text-gray-600">
        Applied {formatDate(application.applied_date)}
        {link && (
          <>
            {' · '}
            <a
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="break-all font-medium text-violet-700 underline underline-offset-2"
            >
              {link.host}
            </a>
          </>
        )}
      </p>

      {application.notes && (
        <p className="line-clamp-2 whitespace-pre-line break-words text-xs text-gray-700">{application.notes}</p>
      )}

      {application.ai_tip && (
        <p className="whitespace-pre-line break-words rounded-lg bg-violet-50 p-2.5 text-[13px] text-gray-800">
          {application.ai_tip}
        </p>
      )}

      {tipError && <Alert>{tipError}</Alert>}
      {actionError && <Alert>{actionError}</Alert>}

      <div className="flex flex-col gap-1.5">
        <StatusPicker
          status={application.status}
          companyName={application.company_name}
          disabled={busy}
          onChange={handleStatusChange}
        />

        {confirmingDelete ? (
          <div role="group" aria-label="Confirm delete" className="flex flex-col gap-1.5">
            <p className="text-xs text-gray-700">Delete this application?</p>
            <div className="flex gap-1.5">
              <button type="button" className={`${dangerButton} flex-1`} onClick={handleDelete} disabled={busy}>
                Yes, delete
              </button>
              {/* autoFocus - delete button just vanished so focus goes to the SAFE choice. */}
              <button
                type="button"
                autoFocus
                className={`${secondaryButton} flex-1`}
                onClick={() => setConfirmingDelete(false)}
                disabled={busy}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="flex gap-1.5">
            <button
              type="button"
              className={`${secondaryButton} flex-1 px-2`}
              aria-label={`Edit ${application.company_name}`}
              onClick={() => onEdit(application)}
              disabled={busy}
            >
              Edit
            </button>
            <button
              type="button"
              className={`${secondaryButton} flex-1 px-2`}
              onClick={handleGetTip}
              disabled={tipLoading || busy}
            >
              {tipLoading ? 'Getting tip…' : application.ai_tip ? 'New tip' : 'AI tip'}
            </button>
            <button
              type="button"
              className={`${dangerButton} flex-1 px-2`}
              aria-label={`Delete ${application.company_name}`}
              onClick={() => setConfirmingDelete(true)}
              disabled={busy}
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </article>
  );
}