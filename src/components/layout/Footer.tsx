import Icon, { type IconName } from '../ui/Icon';
import { SITE } from '../../constants/site';

interface SocialLink {
  name: IconName;
  href: string;
  label: string;
  external: boolean;
}

const socialLinks: SocialLink[] = [
  { name: 'github', href: SITE.social.github, label: 'GitHub', external: true },
  { name: 'linkedin', href: SITE.social.linkedin, label: 'LinkedIn', external: true },
  { name: 'instagram', href: SITE.social.instagram, label: 'Instagram', external: true },
  { name: 'resume', href: SITE.social.resume, label: 'Resume', external: true },
  { name: 'mail', href: `mailto:${SITE.email}`, label: 'Email', external: false },
];

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className='border-t border-neutral-200 py-8 dark:border-neutral-800'>
      <div className='mx-auto flex max-w-5xl flex-col items-center gap-4 px-4 text-sm text-neutral-500 sm:flex-row sm:justify-between dark:text-neutral-400'>
        <p>
          © {year} {SITE.name}. All rights reserved.
        </p>

        <div className='flex items-center gap-4'>
          {socialLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              target={link.external ? '_blank' : undefined}
              rel={link.external ? 'noopener noreferrer' : undefined}
              aria-label={link.label}
              className='text-neutral-500 transition-colors duration-200 hover:text-primary dark:text-neutral-400 dark:hover:text-primary'
            >
              <Icon name={link.name} size={20} />
            </a>
          ))}
        </div>

        <a
          href={SITE.resumeUrl}
          target='_blank'
          rel='noopener noreferrer'
          className='font-medium text-neutral-900 underline-offset-4 transition-colors duration-200 hover:text-primary hover:underline dark:text-white'
        >
          Download CV
        </a>
      </div>
    </footer>
  );
}

export default Footer;
