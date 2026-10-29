//tailwind CSS classes, input styles, button variants, aur accessibility props
export const inputBase =
  'block min-h-11 rounded-xl border border-gray-200 bg-white px-3 py-2 text-base text-gray-900 placeholder:text-gray-500 hover:border-gray-300 focus-visible:border-violet-700 disabled:bg-gray-50 disabled:text-gray-500';
export const inputClass = `${inputBase} w-full`;

export const labelClass = 'mb-1 block text-sm font-medium text-gray-900';

const buttonBase =
  'inline-flex min-h-11 items-center justify-center gap-2 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-60';
export const primaryButton = `${buttonBase} rounded-full bg-violet-700 px-5 text-white hover:bg-violet-800`;
export const secondaryButton = `${buttonBase} rounded-xl border border-gray-200 bg-white px-4 text-gray-900 hover:bg-gray-50`;
export const dangerButton = `${buttonBase} rounded-xl border border-rose-200 bg-white px-4 text-rose-700 hover:bg-rose-50`;


export function fieldProps(id, error) {
  return {
    id,
    'aria-invalid': Boolean(error),
    'aria-describedby': error ? `${id}-error` : undefined,
  };
}