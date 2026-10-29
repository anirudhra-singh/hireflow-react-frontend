import { useId, useState } from 'react';
import FormField from './FormField.jsx';
import { Alert } from './Alert.jsx';
import { STATUSES, STATUS_LABELS, STATUS_STYLES, LIMITS } from '../utils/constants.js';
import { validateApplication } from '../utils/validators.js';
import { todayISO } from '../utils/format.js';
import { fieldProps, inputClass, primaryButton, secondaryButton } from '../utils/ui.js';

const FIELDS = ['company_name', 'job_title', 'job_url', 'status', 'applied_date', 'notes'];
const OPTIONAL_FIELDS = ['job_url', 'notes'];

function toValues(application, defaultStatus) {
  if (!application) {
    return {
      company_name: '',
      job_title: '',
      job_url: '',
      status: defaultStatus ?? 'applied',
      applied_date: todayISO(),
      notes: '',
    };
  }
  return {
    company_name: application.company_name ?? '',
    job_title: application.job_title ?? '',
    job_url: application.job_url ?? '',
    status: application.status,
    applied_date: String(application.applied_date ?? '').slice(0, 10),
    notes: application.notes ?? '',
  };
}

// send required fields and optional ones only when filled in
function buildCreatePayload(values) {
  const payload = {
    company_name: values.company_name.trim(),
    job_title: values.job_title.trim(),
    status: values.status,
    applied_date: values.applied_date,
  };
  if (values.job_url.trim()) payload.job_url = values.job_url.trim();
  if (values.notes.trim()) payload.notes = values.notes.trim();
  return payload;
}

//  api accepts a partial update so sending what actually changed
function buildChanges(values, initial) {
  const before = toValues(initial);
  const changes = {};
  for (const field of FIELDS) {
    const now = values[field].trim();
    if (now === before[field].trim()) continue;
    changes[field] = now === '' && OPTIONAL_FIELDS.includes(field) ? null : now;
  }
  return changes;
}

export default function ApplicationForm({ initial = null, defaultStatus, onSubmit, onCancel }) {
  const uid = useId();
  const isEdit = initial !== null;

  const [values, setValues] = useState(() => toValues(initial, defaultStatus));
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (submitting) return;

    const found = validateApplication(values);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    const payload = isEdit ? buildChanges(values, initial) : buildCreatePayload(values);
    if (isEdit && Object.keys(payload).length === 0) {
      onCancel(); 
      return;
    }

    setServerError('');
    setSubmitting(true);
    try {
      await onSubmit(payload); 
    } catch (err) {
      setServerError(err.message);
      setSubmitting(false);
    }
  }

  const id = (name) => `${uid}-${name}`;

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      {serverError && <Alert>{serverError}</Alert>}

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField id={id('company')} label="Company" error={errors.company_name}>
          <input
            {...fieldProps(id('company'), errors.company_name)}
            name="company_name"
            type="text"
            required
            maxLength={LIMITS.company}
            value={values.company_name}
            onChange={handleChange}
            className={inputClass}
          />
        </FormField>

        <FormField id={id('title')} label="Job title" error={errors.job_title}>
          <input
            {...fieldProps(id('title'), errors.job_title)}
            name="job_title"
            type="text"
            required
            maxLength={LIMITS.title}
            value={values.job_title}
            onChange={handleChange}
            className={inputClass}
          />
        </FormField>

        <FormField id={id('date')} label="Date applied" error={errors.applied_date}>
          <input
            {...fieldProps(id('date'), errors.applied_date)}
            name="applied_date"
            type="date"
            required
            value={values.applied_date}
            onChange={handleChange}
            className={inputClass}
          />
        </FormField>
      </div>

      <fieldset>
        <legend className="mb-1 text-sm font-medium text-gray-900">Status</legend>
        <div className="flex flex-wrap gap-2">
          {STATUSES.map((s) => (
            <label key={s} className="relative">
              <input
                type="radio"
                name="status"
                value={s}
                checked={values.status === s}
                onChange={handleChange}
                className="peer sr-only"
              />
              <span className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border border-gray-200 bg-white px-3.5 text-sm font-medium text-gray-800 hover:bg-gray-50 peer-checked:border-violet-700 peer-checked:bg-violet-50 peer-checked:text-violet-800 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-violet-700">
                <span className={`h-2.5 w-2.5 rounded-full ${STATUS_STYLES[s].dot}`} aria-hidden="true" />
                {STATUS_LABELS[s]}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <FormField id={id('url')} label="Job link (optional)" error={errors.job_url}>
        <input
          {...fieldProps(id('url'), errors.job_url)}
          name="job_url"
          type="url"
          autoComplete="off"
          maxLength={LIMITS.url}
          value={values.job_url}
          onChange={handleChange}
          className={inputClass}
        />
      </FormField>

      <FormField id={id('notes')} label="Notes (optional)" error={errors.notes}>
        <textarea
          {...fieldProps(id('notes'), errors.notes)}
          name="notes"
          rows={4}
          maxLength={LIMITS.notes}
          value={values.notes}
          onChange={handleChange}
          className={inputClass}
        />
      </FormField>

      <div className="flex flex-wrap gap-2">
        <button type="submit" className={primaryButton} disabled={submitting}> 
          {submitting ? 'Saving…' : isEdit ? 'Save changes' : 'Save job'}
        </button>
        <button type="button" className={secondaryButton} onClick={onCancel} disabled={submitting}>
          Cancel
        </button>
      </div>
    </form>
  );
}