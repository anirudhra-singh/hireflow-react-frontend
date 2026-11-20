import { useState } from 'react';
import Icon from '../Icon.jsx';
import { FAQS } from '../../data/landing.js';


export default function Faq() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="mx-auto grid max-w-3xl gap-3">
      {FAQS.map((item, index) => {
        const open = openIndex === index;
        return (
          <div
            key={item.q}
            className="rounded-2xl border border-gray-200 bg-white transition-shadow duration-200 hover:shadow-lg hover:shadow-violet-900/10"
          >
            <button
              type="button"
              aria-expanded={open}
              aria-controls={`faq-panel-${index}`}
              onClick={() => setOpenIndex(open ? null : index)}
              className="flex min-h-14 w-full items-center justify-between gap-4 px-5 text-left font-bold text-gray-900"
            >
              {item.q}
              <Icon
                name="chevron"
                className={`size-4.5 shrink-0 text-violet-700 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
              />
            </button>
            <div
              id={`faq-panel-${index}`}
              className={`grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none ${
                open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
              }`}
            >
              <div className="overflow-hidden">
                <p className="px-5 pb-4.5 text-gray-600">{item.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}