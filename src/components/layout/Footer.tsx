import Icon, { type IconName } from '../ui/Icon';
import { SITE } from '../../constants/site';
import { downloadFile } from '../../lib/downloadFile';

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
    <footer className='border-t border-line'>
      <div className='mx-auto flex max-w-[1160px] flex-col items-center gap-4 px-5 py-6 text-[13px] text-muted sm:flex-row sm:justify-between md:px-8'>
        <p>
          © {year} {SITE.name}
        </p>

        <div className='flex items-center gap-4'>
          {socialLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              target={link.external ? '_blank' : undefined}
              rel={link.external ? 'noopener noreferrer' : undefined}
              aria-label={link.label}
              className='text-muted transition-colors duration-200 hover:text-accent'
            >
              <Icon name={link.name} size={18} />
            </a>
          ))}
        </div>

        <a
          href={SITE.resumeUrl}
          download={SITE.resumeName}
          onClick={(event) => {
            event.preventDefault();
            void downloadFile(SITE.resumeUrl, SITE.resumeName);
          }}
          className='font-medium text-ink underline-offset-4 transition-colors duration-200 hover:text-accent hover:underline'
        >
          Download CV
        </a>
      </div>
    </footer>
  );
}

export default Footer;
