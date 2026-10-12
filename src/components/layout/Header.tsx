import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import Icon from '../ui/Icon';
import ThemeToggle from '../ui/ThemeToggle';
import { ROUTES } from '../../constants/routes';
import { SITE } from '../../constants/site';

const navLinks = [
  { to: ROUTES.home, label: 'Home' },
  { to: ROUTES.portfolio, label: 'Projects' },
  { to: ROUTES.contact, label: 'Contact' },
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
          'text-sm transition-colors duration-200',
          isActive ? 'text-accent' : 'text-ink-2 hover:text-ink',
        ].join(' ')
      }
    >
      {label}
    </NavLink>
  );
}

const resumeLinkStyles =
  'rounded-md border border-line px-3 py-1.5 text-[13px] text-ink transition-colors hover:border-line-strong';

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className='sticky top-0 z-50 border-b border-line bg-bar/90 backdrop-blur'>
      <div className='mx-auto flex max-w-[1160px] items-center justify-between gap-4 px-5 py-3.5 md:px-8'>
        <Link
          to={ROUTES.home}
          className='flex items-center gap-2 text-[15px] font-semibold text-ink'
          onClick={closeMenu}
        >
          <span
            aria-hidden='true'
            className='h-[7px] w-[7px] rounded-full bg-accent shadow-[0_0_0_3px_var(--color-glow)]'
          />
          {SITE.name}
        </Link>

        <nav className='hidden items-center gap-6 md:flex' aria-label='Main'>
          {navLinks.map((link) => (
            <NavItem key={link.to} to={link.to} label={link.label} />
          ))}
          <ThemeToggle />
          <a href={SITE.social.resume} target='_blank' rel='noopener noreferrer' className={resumeLinkStyles}>
            Resume ↗
          </a>
        </nav>

        <button
          type='button'
          className='inline-flex items-center justify-center rounded-md p-2 text-ink transition-colors hover:bg-surface-2 md:hidden'
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((prev) => !prev)}
        >
          <Icon name={isMenuOpen ? 'close' : 'menu'} />
        </button>
      </div>

      <div
        className={`grid border-t border-line transition-[grid-template-rows] duration-200 ease-in-out md:hidden ${
          isMenuOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr] border-transparent'
        }`}
        aria-hidden={!isMenuOpen}
        inert={!isMenuOpen}
      >
        <div className='overflow-hidden'>
          <nav className='flex flex-col gap-4 px-5 py-4' aria-label='Main'>
            {navLinks.map((link) => (
              <NavItem key={link.to} to={link.to} label={link.label} onNavigate={closeMenu} />
            ))}
            <div className='flex items-center gap-3'>
              <ThemeToggle />
              <a href={SITE.social.resume} target='_blank' rel='noopener noreferrer' className={resumeLinkStyles}>
                Resume ↗
              </a>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;
