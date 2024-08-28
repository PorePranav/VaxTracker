// import { useRef, useEffect, MutableRefObject } from 'react';

// export default function useOutsideClick<T extends HTMLElement>(
//   handler: () => void,
//   listenCapturing: boolean = true
// ): MutableRefObject<T | null> {
//   const ref = useRef<T | null>(null);

//   useEffect(() => {
//     function handleClick(e: MouseEvent) {
//       if (ref.current && !ref.current.contains(e.target as Node)) {
//         handler();
//       }
//     }

//     document.addEventListener('click', handleClick, listenCapturing);

//     return () => {
//       document.removeEventListener('click', handleClick, listenCapturing);
//     };
//   }, [handler, listenCapturing]);

//   return ref;
// }

import { useEffect, useRef, MutableRefObject } from 'react';

export default function useOutsideClick(
  handler: () => void
): MutableRefObject<HTMLDivElement | null> {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        handler();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handler]);

  return ref;
}
