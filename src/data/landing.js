// LANDING: all the words on the landing page. Edit text here, not in the components.

export const SITE_NAME = 'HireFlow';
export const SITE_URL = 'hireflow-job-tracker.vercel.app';

export const FEATURES = [
  {
    id: 'features',
    tag: 'Board view',
    title: 'Drag and drop your jobs through every stage',
    lead: 'See your whole search as a Kanban board. Move a card the moment something changes, and every column keeps a live count.',
    uses: [
      'Drag a job to Interview, Offer or Rejected',
      'The page scrolls by itself while you drag, with a floating bar to drop on any stage',
      'A status dropdown on every card for touch and keyboard',
      'Add, edit and delete without leaving the board',
    ],
    mock: 'board',
    alt: 'The HireFlow board with a column for every stage and a floating status bar',
    flip: false,
    tint: true,
  },
  {
    id: 'table',
    tag: 'Table view',
    title: 'A clean table when you want the details',
    lead: 'Switch views in one click. The same jobs, the same search and filters, laid out row by row.',
    uses: [
      'Company, role, link, status and date in one row',
      'Change a status from its pill, or edit and delete from the ⋯ menu',
      'Search by title or company, filter by stage and date, sort latest or oldest',
    ],
    mock: 'table',
    alt: 'The HireFlow table view with a row menu showing Edit and Delete',
    flip: true,
    tint: false,
  },
  {
    id: 'ai',
    tag: 'AI suggestion',
    title: '“AI suggestion”: one click, useful tips for a job',
    lead: 'Spend less time working out what to do next. Ask for tips on any application and keep them right next to the job.',
    uses: ['Click AI tip on a job and watch the suggestion appear', 'Copy it with one click'],
    mock: 'ai',
    alt: 'A job card with an AI suggestion box listing three tips',
    flip: false,
    tint: true,
  },
  {
    id: 'analytics',
    tag: 'Analytics',
    title: 'Know exactly where your search stands',
    lead: 'Numbers that update as you move jobs, so you can see what is working.',
    uses: [
      'Total applications, interviews, offers and your conversion rate',
      'A status breakdown chart',
      'Applications per week, to keep your pace steady',
    ],
    mock: 'stats',
    alt: 'The HireFlow analytics page with stat cards, a donut chart and weekly bars',
    flip: true,
    tint: false,
  },
];


export const MORE = [
  { icon: 'timeline', title: 'Timeline', text: 'See when you applied and when each job last changed, newest first, on one page.' },
  {
    icon: 'phone',
    title: 'Made for your phone',
    text: 'A menu button, swipeable columns and a slide-in drawer keep it comfortable on small screens.',
  },
];

export const STEPS = [
  { title: 'Add your applications', text: 'Save the company, role, link, date and notes for each job in seconds.' },
  { title: 'Move them through the stages', text: 'Drag a card, or use the status dropdown, whenever something changes.' },
  { title: 'Review your progress', text: 'Check the timeline and analytics, and get AI tips for the next step.' },
];


export const FAQS = [
  {
    q: 'Is HireFlow free to use?',
    a: 'Yes. HireFlow is a free portfolio demo. Please use test data only, not real personal information.',
  },
  {
    q: 'What can I track?',
    a: 'Company, job title, job link, status, the date you applied and notes for every application.',
  },
  {
    q: 'How do I move a job between stages?',
    a: 'Drag its card to another column, or use the status dropdown on the card. In the table view, use the status pill.',
  },
  {
    q: 'How does the AI suggestion work?',
    a: 'Click AI tip on a job. The app asks the server for tips and shows them in a suggestion box that you can copy. If the AI service is busy or you reach its limit, you will see a friendly message.',
  },
  {
    q: 'Can I use HireFlow on my phone?',
    a: 'Yes. On small screens you get a menu button, swipeable columns and a slide-in drawer.',
  },
  
];