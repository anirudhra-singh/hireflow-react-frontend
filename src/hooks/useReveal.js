import { useEffect, useRef, useState } from 'react';

// LANDING: "reveal on scroll". Attach `ref` to an element; `shown` turns true once the
// element is about 18% visible, and stays true. The component then fades and slides
// the element in with Tailwind classes. Without IntersectionObserver (very old
// browsers) everything is simply shown at once.
export function useReveal() {
  const ref = useRef(null);
  const [shown, setShown] = useState(() => typeof IntersectionObserver === 'undefined');

  useEffect(() => {
    const element = ref.current;
    if (!element || typeof IntersectionObserver === 'undefined') return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          observer.disconnect();
        }
      },
      { threshold: 0.18 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return [ref, shown];
}