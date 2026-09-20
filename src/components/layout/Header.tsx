import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import Button from '../ui/Button';
import Icon from '../ui/Icon';
import { ROUTES } from '../../constants/routes';
import { SITE } from '../../constants/site';

const navLinks = [
  { to: ROUTES.home, label: 'Home' },
  { to: ROUTES.portfolio, label: 'Portfolio' },
];

interface NavItemProps {
  to: string;
  label: string;
  onNavigate?: () => void;
}

function NavItem({ to, label, onNavigate }: NavItemProps) {
  return (
    <NavLink
      to={to}
      end={to === '/'}
      onClick={onNavigate}
      className={({ isActive }) =>
        [
          'text-sm font-medium transition-colors duration-200',
          isActive
            ? 'text-primary'
            : 'text-neutral-500 hover:text-primary dark:text-neutral-400 dark:hover:text-primary',
        ].join(' ')
      }
    >
      {label}
    </NavLink>
  );
}

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className='sticky top-0 z-50 border-b border-neutral-200 bg-white/80 backdrop-blur dark:border-neutral-800 dark:bg-neutral-950/80'>
      <div className='mx-auto flex max-w-5xl items-center justify-between px-4 py-4'>
        <Link
          to={ROUTES.home}
          className='text-lg font-semibold text-neutral-900 dark:text-white'
          onClick={closeMenu}
        >
          {SITE.name}
        </Link>

        <nav className='hidden items-center gap-6 md:flex'>
          {navLinks.map((link) => (
            <NavItem key={link.to} to={link.to} label={link.label} />
          ))}
          <Button href={ROUTES.contact} size='sm'>
            Contact
          </Button>
        </nav>

        <button
          type='button'
          className='inline-flex items-center justify-center rounded-lg p-2 text-neutral-900 transition-colors duration-200 hover:bg-neutral-100 md:hidden dark:text-white dark:hover:bg-neutral-800'
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((prev) => !prev)}
        >
          <Icon name={isMenuOpen ? 'close' : 'menu'} />
        </button>
      </div>

      <div
        className={`grid border-t border-neutral-200 transition-[grid-template-rows] duration-200 ease-in-out md:hidden dark:border-neutral-800 ${
          isMenuOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
        aria-hidden={!isMenuOpen}
      >
        <div className='overflow-hidden'>
          <nav className='flex flex-col gap-4 px-4 py-4'>
            {navLinks.map((link) => (
              <NavItem
                key={link.to}
                to={link.to}
                label={link.label}
                onNavigate={closeMenu}
              />
            ))}
            <Button
              href={ROUTES.contact}
              size='sm'
              className='w-full'
              onClick={closeMenu}
            >
              Contact
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;
