import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Faq from '../components/landing/Faq.jsx';
import FeatureSection from '../components/landing/FeatureSection.jsx';
import { HeroMock } from '../components/landing/Mockups.jsx';
import Icon from '../components/Icon.jsx';
import { useAuth } from '../hooks/useAuth.js';
import { useReveal } from '../hooks/useReveal.js';
import { FEATURES, MORE, SITE_NAME, SITE_URL, STEPS } from '../data/landing.js';
import { primaryButton } from '../utils/ui.js';


const GRADIENT =
  'bg-[linear-gradient(90deg,#6d28d9,#6366f1,#38bdf8,#6d28d9)] bg-[length:200%_100%] bg-clip-text text-transparent animate-word-shine';
const WORDS = [
  { text: 'All', delay: '[animation-delay:0ms]' },
  { text: 'your', delay: '[animation-delay:90ms]' },
  { text: 'job', delay: '[animation-delay:180ms]' },
  { text: 'applications', delay: '[animation-delay:270ms]' },
  { text: 'in', delay: '[animation-delay:360ms,0ms]', gradient: true },
  { text: 'one', delay: '[animation-delay:450ms,0ms]', gradient: true },
  { text: 'place.', delay: '[animation-delay:540ms,0ms]', gradient: true },
];

const outlineButton =
  'inline-flex min-h-11 items-center rounded-full border border-gray-200 bg-white px-5 text-sm font-medium text-gray-900 transition duration-150 hover:bg-gray-50 active:scale-[0.97]';


function Section({ id, className = '', children }) {
  const [ref, shown] = useReveal();
  return (
    <section id={id} ref={ref} className={`scroll-mt-20 ${className}`}>
      <div
        className={`transition-[opacity,transform] duration-700 ease-out motion-reduce:transition-none ${
          shown ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0 motion-reduce:translate-y-0 motion-reduce:opacity-100'
        }`}
      >
        {children}
      </div>
    </section>
  );
}

function SectionHead({ kicker, title, text }) {
  return (
    <div className="mb-10 text-center">
      <p className="mb-2.5 text-xs font-bold tracking-widest text-violet-700 uppercase">{kicker}</p>
      <h2 className="text-[clamp(1.9rem,4vw,2.8rem)] leading-tight font-extrabold tracking-tight text-gray-900">{title}</h2>
      {text && <p className="mt-3 text-gray-600">{text}</p>}
    </div>
  );
}

function Header({ appPath, appLabel }) {
  const [scrolled, setScrolled] = useState(false);


  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 8);
    }
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLink =
    'relative py-2 hover:text-gray-900 after:absolute after:inset-x-0 after:bottom-0.5 after:h-0.5 after:origin-left after:scale-x-0 after:bg-violet-700 after:transition-transform after:duration-200 hover:after:scale-x-100';

  return (
    <header
      className={`sticky top-0 z-30 border-b bg-white/85 backdrop-blur-md transition-[border-color,box-shadow] duration-200 ${
        scrolled ? 'border-gray-200 shadow-md shadow-violet-900/5' : 'border-transparent'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-280 items-center justify-between gap-4 px-5">
        <Link to="/" className="flex items-center gap-2.5 text-xl font-extrabold text-gray-900" aria-label={`${SITE_NAME} home`}>
          <span
            className="grid size-8.5 place-items-center rounded-[10px] bg-linear-to-br from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-700/35"
            aria-hidden="true"
          >
            H
          </span>
          {SITE_NAME}
        </Link>

        <nav aria-label="Main" className="hidden gap-7 text-[15px] font-semibold text-gray-600 md:flex">
          <a href="#features" className={navLink}>Features</a>
          <a href="#how" className={navLink}>How it works</a>
          <a href="#faq" className={navLink}>FAQs</a>
        </nav>

        <div className="flex items-center gap-3">
          <Link to="/login" className="hidden px-2 py-2 text-[15px] font-semibold text-gray-600 hover:text-gray-900 sm:block">
            Log in
          </Link>
          <Link to={appPath} className={`${primaryButton} group`}>
            {appLabel}
            <Icon name="arrow" className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </header>
  );
}

function Hero({ appPath, appLabel }) {
  return (
    <section className="mx-auto grid max-w-280 items-center gap-12 px-5 pt-16 pb-14 md:grid-cols-[1fr_1.05fr] md:pt-20">
      <div>
        <p className="mb-4 text-xs font-bold tracking-widest text-violet-700 uppercase">The job application tracker</p>
        <h1 aria-label="All your job applications in one place." className="text-[clamp(2.4rem,6vw,4.1rem)] leading-[1.04] font-extrabold tracking-tight text-gray-900">
          {WORDS.map((word) => (
            <span key={word.text} aria-hidden="true">
              <span className={`inline-block animate-word-in ${word.gradient ? GRADIENT : ''} ${word.delay}`}>{word.text}</span>{' '}
            </span>
          ))}
        </h1>
        <p className="mt-5 mb-7 max-w-lg text-lg text-gray-600">
          Drag jobs through every stage, see them in a clean table, get AI tips and track your progress. Less admin, more momentum.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link to={appPath} className={`${primaryButton} group`}>
            {appLabel === 'Get started' ? 'Start now for free' : appLabel}
            <Icon name="arrow" className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
          <a href="#features" className={outlineButton}>
            See what it does
          </a>
        </div>
        <p className="mt-4 text-[13px] text-gray-600">A free portfolio demo. Please use test data only.</p>
      </div>

      {/* LANDING: the animated board window gently floats. The card inside it moves from
          Applied to Interview on a loop (see HeroMock in Mockups.jsx). */}
      <div
        role="img"
        aria-label="The HireFlow board: a job card moves from the Applied column to the Interview column"
        className="relative animate-float motion-reduce:animate-none"
      >
        <HeroMock />
      </div>
    </section>
  );
}

export default function LandingPage() {
  const { user } = useAuth();
  const appPath = user ? '/board' : '/login';
  const appLabel = user ? 'Open app' : 'Get started';

  return (
    <div id="top" className="min-h-dvh bg-white text-gray-900">
      <Header appPath={appPath} appLabel={appLabel} />

      <main>
        <Hero appPath={appPath} appLabel={appLabel} />

        {FEATURES.map((feature) => (
          <FeatureSection key={feature.id} feature={feature} />
        ))}

        <Section className="bg-slate-50 py-18">
          <div className="mx-auto max-w-280 px-5">
            <SectionHead kicker="And more" title="Built for the whole search" />
            <div className="mx-auto grid max-w-184 gap-5 md:grid-cols-2">
              {MORE.map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-gray-200 bg-white p-6 transition duration-200 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-violet-900/15"
                >
                  <div className="mb-4 grid size-11.5 place-items-center rounded-xl bg-violet-100 text-violet-800">
                    <Icon name={item.icon} className="size-5" />
                  </div>
                  <h3 className="mb-1.5 text-lg font-bold">{item.title}</h3>
                  <p className="text-[15px] text-gray-600">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </Section>

        <Section id="how" className="py-18">
          <div className="mx-auto max-w-280 px-5">
            <SectionHead kicker="Simple from day one" title="How it works" text="Three simple steps to bring your job search together." />
            <div className="grid gap-8 md:grid-cols-3">
              {STEPS.map((step, index) => (
                <div key={step.title}>
                  <p className="mb-2.5 bg-linear-to-br from-violet-700 to-indigo-500 bg-clip-text text-6xl leading-none font-extrabold text-transparent">
                    {index + 1}
                  </p>
                  <h3 className="mb-1.5 text-lg font-bold">{step.title}</h3>
                  <p className="text-[15px] text-gray-600">{step.text}</p>
                </div>
              ))}
            </div>
          </div>
        </Section>

        <Section id="faq" className="bg-slate-50 py-18">
          <div className="mx-auto max-w-280 px-5">
            <SectionHead kicker="Good questions" title="FAQs" text="Everything you need to know to get started." />
            <Faq />
          </div>
        </Section>

        <section className="relative overflow-hidden bg-linear-to-br from-indigo-900 via-violet-700 to-violet-600 px-5 py-20 text-center text-white">
          <div aria-hidden="true" className="absolute -top-24 -left-20 size-80 animate-blob rounded-full bg-sky-400 opacity-45 blur-3xl motion-reduce:animate-none" />
          <div aria-hidden="true" className="absolute -right-24 -bottom-36 size-90 animate-blob rounded-full bg-pink-400 opacity-45 blur-3xl [animation-delay:-4s] motion-reduce:animate-none" />
          <div className="relative">
            <p className="mb-4 text-xs font-bold tracking-widest text-violet-200 uppercase">Make your next move</p>
            <h2 className="mx-auto mb-6 max-w-2xl text-[clamp(2rem,5vw,3.2rem)] leading-tight font-extrabold tracking-tight">
              Start tracking your job applications
            </h2>
            <Link
              to={appPath}
              className="group inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-6 text-sm font-bold text-violet-900 transition duration-150 hover:-translate-y-0.5 hover:shadow-xl active:scale-[0.97]"
            >
              {user ? 'Open app' : 'Create your free account'}
              <Icon name="arrow" className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-gray-200 px-5 py-8">
        <div className="mx-auto max-w-280">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="flex flex-wrap items-center gap-x-3 font-extrabold">
              {SITE_NAME}
              <span className="text-sm font-medium text-gray-600">Your job search, finally in one place.</span>
            </p>
            <a href="#top" className="text-sm font-bold text-violet-700">
              Back to top ↑
            </a>
          </div>
          <div className="mt-5 flex flex-wrap justify-between gap-2 border-t border-gray-200 pt-5 text-[13px] text-gray-600">
            <p>
              © 2026 {SITE_NAME}. A portfolio project. {SITE_URL}
            </p>
            <p>Demo app: please use test data only, not real personal information.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}