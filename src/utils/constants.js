// fixed configuration values, constants, status mappings, styling rules, aur input limits
export const STATUSES = ['applied', 'interview', 'offer', 'rejected', 'withdrawn'];
export const STAGES = ['applied', 'interview', 'offer'];

export const STATUS_LABELS = {
  applied: 'Applied',
  interview: 'Interview',
  offer: 'Offer',
  rejected: 'Rejected',
  withdrawn: 'Withdrawn',
};


export const STATUS_STYLES = {
  applied: { header: 'bg-violet-700', border: 'border-l-violet-700', dot: 'bg-violet-700', step: 'bg-violet-700', stroke: 'stroke-violet-700' },
  interview: { header: 'bg-green-700', border: 'border-l-green-700', dot: 'bg-green-700', step: 'bg-green-700', stroke: 'stroke-green-700' },
  offer: { header: 'bg-amber-700', border: 'border-l-amber-700', dot: 'bg-amber-700', step: 'bg-amber-700', stroke: 'stroke-amber-700' },
  rejected: { header: 'bg-red-600', border: 'border-l-red-600', dot: 'bg-red-600', step: 'bg-red-600', stroke: 'stroke-red-600' },
  withdrawn: { header: 'bg-gray-600', border: 'border-l-gray-600', dot: 'bg-gray-600', step: 'bg-gray-600', stroke: 'stroke-gray-600' },
};

export const SORTS = [
  { value: 'new', label: 'Latest' },
  { value: 'old', label: 'Oldest' },
];

// fields maximum character limits
export const LIMITS = { company: 255, title: 255, url: 500, notes: 2000, name: 255, email: 255 };

// minimum password 
export const MIN_PASSWORD_LENGTH = 8;

export const CONVERSION_RATE_SCALE = 1;