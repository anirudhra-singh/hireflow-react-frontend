// authentication page login and register
import { useId, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import DemoBanner from '../components/DemoBanner.jsx';
import ServerStatus from '../components/ServerStatus.jsx';
import FormField from '../components/FormField.jsx';
import { Alert } from '../components/Alert.jsx';
import { LIMITS, MIN_PASSWORD_LENGTH } from '../utils/constants.js';
import { validateLogin, validateRegister } from '../utils/validators.js';
import { fieldProps, inputClass, primaryButton } from '../utils/ui.js';

const TABS = [
  { id: 'login', label: 'Sign in' },
  { id: 'register', label: 'Create account' },
];

function messageForAuthError(err, isRegister) {
  // connection problems message
  if (err.kind === 'network' || err.kind === 'timeout') return err.message;
  if (err.status >= 500) return 'The server had a problem. Please try again in a moment.';

  if (isRegister) {
    if (err.status === 400) return 'An account with this email already exists.';
    return err.message; 
  }
  return 'Invalid email or password.';
}
// auth form component
function AuthForm({ mode }) {
  const { login, register } = useAuth();
  const uid = useId();
  const isRegister = mode === 'register';

  const [values, setValues] = useState({ full_name: '', email: '', password: '' });
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

  
    const found = isRegister ? validateRegister(values) : validateLogin(values);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setServerError('');
    setSubmitting(true);
    try {
      const email = values.email.trim();
      if (isRegister) await register({ full_name: values.full_name.trim(), email, password: values.password });
      else await login(email, values.password);
    } catch (err) {
      setServerError(messageForAuthError(err, isRegister));
    } finally {
      setSubmitting(false);
    }
  }

  const id = (name) => `${uid}-${name}`;

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      {serverError && <Alert>{serverError}</Alert>}

      {isRegister && (
        <FormField id={id('name')} label="Full name" error={errors.full_name}>
          <input
            {...fieldProps(id('name'), errors.full_name)}
            name="full_name"
            type="text"
            autoComplete="name"
            required
            maxLength={LIMITS.name}
            value={values.full_name}
            onChange={handleChange}
            className={inputClass}
          />
        </FormField>
      )}

      <FormField id={id('email')} label="Email" error={errors.email}>
        <input
          {...fieldProps(id('email'), errors.email)}
          name="email"
          type="email"
          autoComplete="email"
          required
          maxLength={LIMITS.email}
          value={values.email}
          onChange={handleChange}
          className={inputClass}
        />
      </FormField>

      <FormField
        id={id('password')}
        label="Password"
        error={errors.password}
        hint={isRegister ? `At least ${MIN_PASSWORD_LENGTH} characters.` : undefined}
      >
        <input
          {...fieldProps(id('password'), errors.password)}
          name="password"
          type="password"
          autoComplete={isRegister ? 'new-password' : 'current-password'}
          required
          value={values.password}
          onChange={handleChange}
          className={inputClass}
        />
      </FormField>

      <button type="submit" className={primaryButton} disabled={submitting}>
        {submitting ? (isRegister ? 'Creating account…' : 'Signing in…') : isRegister ? 'Create account' : 'Sign in'}
      </button>
    </form>
  );
}

export default function AuthPage() {
  const { user } = useAuth();
  const location = useLocation();
  const [mode, setMode] = useState('login');

  if (user) return <Navigate to={location.state?.from?.pathname ?? '/'} replace />;

  return (
    <div className="min-h-dvh">
      <DemoBanner />
      
      {/* login page headline on the left  */}
      <main className="mx-auto grid max-w-5xl items-center gap-8 px-4 py-10 md:grid-cols-[1.1fr_1fr] md:py-16">
        <section>
          <p className="mb-2 font-semibold text-violet-700">Job tracker</p>
          <h1 className="mb-3 text-3xl font-extrabold leading-tight text-gray-900 sm:text-4xl">
            Focus more on applying, not on managing
          </h1>
          <p className="text-gray-600">Every application, stage and date in one place.</p>
          <ul className="mt-6 flex flex-col gap-3 text-gray-800">
            {[
              'Save a job in seconds with role, link and notes',
              'Move jobs between columns as you progress',
              'See your timeline and overall job hunt statistics',
            ].map((text) => (
              <li key={text} className="flex items-start gap-2.5">
                <span className="mt-0.5 text-violet-700" aria-hidden="true">
                  ✓
                </span>
                {text}
              </li>
            ))}
          </ul>
        </section>

        <section className="flex flex-col gap-4">
          <ServerStatus />
          <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
            <div
              role="group"
              aria-label="Sign in or create an account"
              className="mb-5 grid grid-cols-2 gap-1 rounded-xl bg-slate-100 p-1"
            >
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  aria-pressed={mode === tab.id}
                  onClick={() => setMode(tab.id)}
                  className={`min-h-11 rounded-lg px-3 text-sm font-medium ${
                    mode === tab.id ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <AuthForm key={mode} mode={mode} />
          </div>
        </section>
      </main>
    </div>
  );
}