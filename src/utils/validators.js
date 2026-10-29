import { LIMITS, MIN_PASSWORD_LENGTH, STATUSES } from './constants.js';
import { parseSafeUrl } from './safeUrl.js';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

// Keeps only the fields that actually have an error message.
function collect(checks) {
  const errors = {};
  for (const [field, message] of Object.entries(checks)) {
    if (message) errors[field] = message;
  }
  return errors;
}

function required(value, label, max) {
  const text = value.trim();
  if (!text) return `${label} is required.`;
  if (text.length > max) return `${label} must be ${max} characters or fewer.`;
  return '';
}

function checkEmail(value) {
  const email = value.trim();
  if (!email) return 'Email is required.';
  if (!EMAIL_PATTERN.test(email) || email.length > LIMITS.email) return 'Enter a valid email address.';
  return '';
}

function isRealDate(text) {
  if (!DATE_PATTERN.test(text)) return false;
  const [y, m, d] = text.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return date.getFullYear() === y && date.getMonth() === m - 1 && date.getDate() === d;
}

export function validateLogin({ email, password }) {
  return collect({
    email: checkEmail(email),
    password: password ? '' : 'Password is required.',
  });
}

export function validateRegister({ full_name, email, password }) {
  return collect({
    full_name: required(full_name, 'Full name', LIMITS.name),
    email: checkEmail(email),
    password:
      password.length >= MIN_PASSWORD_LENGTH
        ? ''
        : `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`,
  });
}

export function validateApplication(values) {
  const url = values.job_url.trim();
  let urlError = '';
  if (url) {
    if (url.length > LIMITS.url) urlError = `Link must be ${LIMITS.url} characters or fewer.`;
    else if (!parseSafeUrl(url)) urlError = 'Enter a valid link starting with http:// or https://.';
  }

  return collect({
    company_name: required(values.company_name, 'Company', LIMITS.company),
    job_title: required(values.job_title, 'Job title', LIMITS.title),
    job_url: urlError,
    status: STATUSES.includes(values.status) ? '' : 'Choose a status.',
    applied_date: isRealDate(values.applied_date) ? '' : 'Choose a valid date.',
    notes: values.notes.length > LIMITS.notes ? `Notes must be ${LIMITS.notes} characters or fewer.` : '',
  });
}