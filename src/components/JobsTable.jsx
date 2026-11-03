import { useState } from 'react';
import RowMenu from './RowMenu.jsx';
import StatusDropdown from './StatusDropdown.jsx';
import { parseSafeUrl } from '../utils/safeUrl.js';
import { formatDate } from '../utils/format.js';
import { dangerButton, secondaryButton } from '../utils/ui.js';


function TableRow({ application, isLast, onEdit, onStatusChange, onDelete }) {
  const [confirming, setConfirming] = useState(false);
  const [leaving, setLeaving] = useState(false); 
  const [error, setError] = useState('');

  const link = parseSafeUrl(application.job_url);

  async function handleStatusChange(next) {
    setError('');
    try {
      await onStatusChange(application.id, next);
    } catch (err) {
      setError(err.message);
    }
  }


  async function handleAnimationEnd(event) {
    if (event.target !== event.currentTarget || !leaving) return;
    try {
      await onDelete(application.id);
    } catch (err) {
      setLeaving(false);
      setConfirming(false);
      setError(err.message);
    }
  }


  const cell = (extra = '') =>
    `block px-4 py-1.5 before:block before:text-[11px] before:font-medium before:tracking-wide before:text-gray-500 before:uppercase before:content-[attr(data-label)] md:table-cell md:border-b md:border-gray-200 md:py-1 md:before:hidden md:group-hover:bg-slate-50 ${
      isLast ? 'md:border-b-0 md:first:rounded-bl-2xl md:last:rounded-br-2xl' : ''
    } ${extra}`;

  return (
    <tr
      onAnimationEnd={handleAnimationEnd}
      className={`group block max-md:mb-3 max-md:rounded-xl max-md:border max-md:border-gray-200 max-md:bg-white max-md:p-2 md:table-row ${
        leaving ? 'pointer-events-none animate-leave' : ''
      }`}
    >
      {/* All server text below is rendered as plain text (React escapes it). */}
      <td data-label="Company" className={cell('wrap-break-word font-semibold text-gray-900')}>
        {application.company_name}
      </td>
      <td data-label="Job title" className={cell('wrap-break-word text-gray-800')}>
        {application.job_title}
      </td>
      <td data-label="Link" className={cell()}>
        {link ? (
          <a
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="break-all font-medium text-violet-700 underline underline-offset-2"
          >
            {link.host}
          </a>
        ) : (
          <span className="text-gray-500">—</span>
        )}
      </td>
      <td data-label="Status" className={cell()}>
        <StatusDropdown
          variant="pill"
          status={application.status}
          companyName={application.company_name}
          disabled={leaving}
          onChange={handleStatusChange}
        />
      </td>
      <td data-label="Applied on" className={cell('whitespace-nowrap text-gray-800')}>
        {formatDate(application.applied_date)}
      </td>
      <td data-label="Actions" className={cell('md:text-right')}>
        {confirming ? (
          // ANIMATION: the confirm question slides in (animate-item-in).
          <div role="group" aria-label="Confirm delete" className="flex animate-item-in flex-wrap items-center gap-1.5 md:justify-end">
            <span className="text-xs text-gray-700">Delete?</span>
            <button type="button" className={dangerButton} onClick={() => setLeaving(true)}>
              Yes, delete
            </button>
            {/* autoFocus: focus goes to the SAFE choice. */}
            <button type="button" autoFocus className={secondaryButton} onClick={() => setConfirming(false)}>
              Cancel
            </button>
          </div>
        ) : (
          <div className="flex md:justify-end">
            <RowMenu
              companyName={application.company_name}
              disabled={leaving}
              onEdit={() => onEdit(application)}
              onDelete={() => setConfirming(true)}
            />
          </div>
        )}
        {error && (
          <p role="alert" className="mt-1 text-xs text-rose-700">
            {error}
          </p>
        )}
      </td>
    </tr>
  );
}


export default function JobsTable({ applications, onEdit, onStatusChange, onDelete }) {
  const th = 'border-b border-gray-200 bg-slate-100 px-4 py-3 text-left text-[13px] font-semibold text-gray-700 first:rounded-tl-2xl last:rounded-tr-2xl';

  return (
    <div className="rounded-2xl border border-gray-200 bg-white max-md:border-0 max-md:bg-transparent">
      <table className="block w-full border-separate border-spacing-0 text-[15px] md:table">
        <thead className="sr-only md:not-sr-only md:table-header-group">
          <tr>
            <th className={th}>Company</th>
            <th className={th}>Job title</th>
            <th className={th}>Link</th>
            <th className={th}>Status</th>
            <th className={th}>Applied on</th>
            <th className={th}>
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="block md:table-row-group">
          {applications.map((application, index) => (
            <TableRow
              key={application.id}
              application={application}
              isLast={index === applications.length - 1}
              onEdit={onEdit}
              onStatusChange={onStatusChange}
              onDelete={onDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}