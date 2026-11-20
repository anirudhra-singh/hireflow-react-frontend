import Icon from '../Icon.jsx';
import { AiMock, BoardMock, StatsMock, TableMock } from './Mockups.jsx';
import { useReveal } from '../../hooks/useReveal.js';


const MOCKS = { board: BoardMock, table: TableMock, ai: AiMock, stats: StatsMock };

const ITEM_DELAYS = ['delay-[300ms]', 'delay-[400ms]', 'delay-[500ms]', 'delay-[600ms]'];


export default function FeatureSection({ feature }) {
  const [ref, shown] = useReveal();
  const { id, tag, title, lead, uses, mock, alt, flip, tint } = feature;
  const Mock = MOCKS[mock];

  const hidden = 'translate-y-6 opacity-0 motion-reduce:translate-y-0 motion-reduce:opacity-100';
  const visible = 'translate-y-0 opacity-100';

  return (
    <section id={id} className={`scroll-mt-20 py-18 ${tint ? 'bg-slate-50' : 'bg-white'}`}>
      <div ref={ref} className="mx-auto grid max-w-280 items-center gap-10 px-5 md:grid-cols-[1fr_1.15fr]">
        <div
          className={`transition-[opacity,transform] duration-700 ease-out motion-reduce:transition-none ${shown ? visible : hidden} ${
            flip ? 'md:order-2' : ''
          }`}
        >
          <span className="mb-4 inline-flex rounded-full bg-violet-100 px-3 py-1 text-xs font-bold tracking-widest text-violet-800 uppercase">
            {tag}
          </span>
          <h2 className="mb-3.5 text-[clamp(1.7rem,3.4vw,2.4rem)] leading-tight font-extrabold tracking-tight text-gray-900">{title}</h2>
          <p className="mb-5 text-gray-600">{lead}</p>

          <ul className="grid gap-3">
            {uses.map((use, index) => (
              <li
                key={use}
                className={`flex items-start gap-3 transition-[opacity,transform] duration-500 motion-reduce:transition-none ${ITEM_DELAYS[index] ?? ''} ${
                  shown ? 'translate-x-0 opacity-100' : '-translate-x-3 opacity-0 motion-reduce:translate-x-0 motion-reduce:opacity-100'
                }`}
              >
                <Icon name="check" className="mt-1 size-4.5 shrink-0 text-violet-700" />
                <span className="text-gray-800">{use}</span>
              </li>
            ))}
          </ul>
        </div>


        <div
          role="img"
          aria-label={alt}
          className={`transition-[opacity,transform] delay-150 duration-700 ease-out motion-reduce:transition-none ${shown ? visible : hidden}`}
        >
          <Mock run={shown} />
        </div>
      </div>
    </section>
  );
}