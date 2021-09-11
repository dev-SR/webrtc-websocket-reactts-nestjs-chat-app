import React from 'react';

interface DropdownItemProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  children: React.ReactNode;
}

const useToggle = () => {
  const [show, setShow] = React.useState<boolean>(false);
  const ref = React.useRef<HTMLDivElement>(null);

  const toggle = React.useCallback(() => {
    setShow((prevState) => !prevState);
  }, []);

  // close dropdown when you click outside
  React.useEffect(() => {
    const handleOutsideClick = (event: Event) => {
      if (!ref.current?.contains(event.target as Node)) {
        if (!show) return;
        setShow(false);
      }
    };
    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, [show, ref]);

  // close dropdown when you click on "ESC" key
  React.useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (!show) return;

      if (event.key === 'Escape') {
        setShow(false);
      }
    };
    document.addEventListener('keyup', handleEscape);
    return () => document.removeEventListener('keyup', handleEscape);
  }, [show]);

  return {
    show,
    toggle,
    ref,
  };
};

// const style = {
//   menu: `block z-30 absolute top-0 left-0 bg-white float-left py-2 px-0 text-left border border-gray-300 rounded-sm mt-0.5 mb-0 mx-0 bg-clip-padding`,
//   item: `block w-full py-1 px-8 mb-2 text-sm font-normal clear-both whitespace-nowrap border-0 hover:bg-gray-200 cursor-pointer`,
// };

interface DropdownProps {
  children: React.ReactNode[];
}

export function Dropdown({ children }: DropdownProps) {
  const { show, toggle } = useToggle();
  /* First child contains the dropdown toggle */

  const dropdownToggle = children[0];

  /* Second child contains the dropdown menu */
  const dropdownMenu = children[1];

  return (
    <>
      <button
        onClick={toggle}
        type="button"
        className="shadow rounded-full font-medium w-12 h-12 flex justify-center items-center text-gray-light"
        aria-expanded="true"
        aria-haspopup="true">
        {dropdownToggle}
      </button>
      {show && <>{dropdownMenu}</>}
    </>
  );
}
interface DropdownToggleProps {
  children: React.ReactNode;
}

export function DropdownToggle({ children }: DropdownToggleProps) {
  return <>{children}</>;
}
interface DropdownMenuProps {
  children: React.ReactNode;
}
export function DropdownMenu({ children }: DropdownMenuProps) {
  return (
    <div className="relative">
      <div
        style={{ transform: 'translate3d(0px, 3px, 0px)' }}
        className="block z-50 absolute top-0 right-0 bg-gray-semiDark float-left py-2 px-0 text-left rounded-sm mt-0.5 mb-0 mx-0 bg-clip-padding"
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="options-menu">
        {children}
      </div>
    </div>
  );
}

/* You can wrap the a tag with Link if you are using either Create-React-App, Next.js or Gatsby */
export function DropdownItem({ children }: DropdownItemProps) {
  return (
    <a
      tabIndex={0}
      className="block w-full py-1 px-8 mb-2 text-sm font-normal clear-both whitespace-nowrap border-0 hover:bg-gray cursor-pointer"
      role="menuitem">
      {children}
    </a>
  );
}

export function DropdownDivider() {
  return <hr className="my-2" />;
}
