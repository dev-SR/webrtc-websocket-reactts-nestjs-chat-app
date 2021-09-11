import React from 'react';
import Portal from '@reach/portal';

interface Props {
  children: React.ReactNode;
}

// const style: {
//   [key: string]:string| {
//     [key:string]:string
//   }
// } = {
//   animate: 'animate-modal',
//   body: `flex-shrink flex-grow p-4`,
//   headerTitle: `text-2xl md:text-3xl font-light`,
//   header: `items-start justify-between p-4 border-b border-gray-300`,
//   container: `fixed top-0 left-0 z-40 w-full h-full m-0 overflow-y-auto`,
//   overlay: `fixed top-0 left-0 z-30 w-screen h-screen bg-black opacity-50`,
//   footer: `flex flex-wrap items-center justify-end p-3 border-t border-gray-300`,
//   content: {
//     default: `relative flex flex-col bg-white pointer-events-auto`,
//   },
//   orientation: {
//     default: 'mt-12 mx-8 pb-6 md:m-auto md:w-6/12 lg:w-4/12 md:pt-12 focus:outline-none',
//     large: 'mt-12 mx-8 pb-6 md:m-auto md:w-8/12 lg:w-8/12 md:pt-12 focus:outline-none',
//     extraLarge: 'mt-12 mx-8 pb-6 md:w-12/12 md:pt-12 focus:outline-none',
//   },
// };
interface ModalProps extends Props {
  isOpen: boolean;
  toggle: (isOpen?: boolean) => void;
  closeOnClickOutside: boolean;
}
export function Modal({
  isOpen,
  toggle,
  children,
  // animate = false,
  closeOnClickOutside, //true /false
}: // position = 'default',
ModalProps) {
  const ref = React.useRef<HTMLDivElement>(null);

  // close modal when you click outside the modal dialogue
  React.useEffect(() => {
    const handleOutsideClick = (event: Event) => {
      if (closeOnClickOutside && !ref.current?.contains(event.target as Node)) {
        if (!isOpen) return;
        toggle(false);
      }
    };
    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, [closeOnClickOutside, isOpen, ref, toggle]);

  // close modal when you click on "ESC" key
  React.useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (!isOpen) return;
      if (event.key === 'Escape') {
        toggle(false);
      }
    };
    document.addEventListener('keyup', handleEscape);
    return () => document.removeEventListener('keyup', handleEscape);
  }, [isOpen, toggle]);

  // Put focus on modal dialogue, hide scrollbar and prevent body from moving when modal is open
  React.useEffect(() => {
    if (!isOpen) return;

    ref.current?.focus();

    const html = document.documentElement;
    const scrollbarWidth = window.innerWidth - html.clientWidth;

    html.style.overflow = 'hidden';
    html.style.paddingRight = `${scrollbarWidth}px`;

    return () => {
      document.documentElement.style.overflow = '';
      document.documentElement.style.paddingRight = '';
    };
  }, [isOpen]);

  return (
    <Portal>
      {isOpen && (
        <>
          <div className="fixed top-0 left-0 z-50 w-screen h-screen bg-black opacity-50" />
          <div className="fixed top-0 left-0 z-50 w-full h-full m-0 overflow-y-auto flex justify-center items-start ">
            <div
              className="w-4/5 md:w-1/4 mt-20"
              ref={closeOnClickOutside ? ref : null}
              role="dialogue"
              aria-modal={true}>
              <div className="bg-black p-4 flex flex-col items-center rounded">
                {children}
              </div>
            </div>
          </div>
        </>
      )}
    </Portal>
  );
}

// export function ModalHeader({ children }: Props) {
//   return (
//     <div className={style.header}>
//       <h4 className={style.headerTitle}>{children}</h4>
//     </div>
//   );
// }

// export function ModalBody({ children }: Props) {
//   return <div className={style.body}>{children}</div>;
// }

// export function ModalFooter({ children }: Props) {
//   return <div className={style.footer}>{children}</div>;
// }
