import Button from '../../../components/ui/Button';
import LiveClock from '../../../components/ui/LiveClock';
import ApiLabel from '../../../components/ui/ApiLabel';
import { downloadFile } from '../../../lib/downloadFile';
import { CAREER_START, formatShortDuration, monthsSince } from '../../../lib/experience';

interface HeroSectionProps {
  role: string;
  name: string;
  resumeUrl: string;
  resumeName: string;
}

const pillStyles =
  'inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-2.5 py-1 font-geist-mono text-xs';

function HeroSection({ role, name, resumeUrl, resumeName }: HeroSectionProps) {
  const experience = formatShortDuration(monthsSince(CAREER_START));
  const me = {
    role: 'backend',
    focus: 'aws · serverless',
    stack: 'node · ts · python',
    experience,
  };

  return (
    <section className='flex flex-wrap items-end justify-between gap-10 pt-16'>
      <div className='flex min-w-0 flex-[999_1_560px] flex-col gap-[18px]'>
        <div className='flex flex-wrap gap-2.5'>
          <span className={pillStyles}>
            <span
              aria-hidden='true'
              className='h-[7px] w-[7px] rounded-full bg-accent shadow-[0_0_0_3px_var(--color-glow)]'
            />
            Open to backend roles
          </span>
          <span className={`${pillStyles} text-muted`}>
            Colima, MX · <LiveClock /> · UTC−6
          </span>
        </div>
        <p className='sr-only'>{name}</p>
        <h1 className='text-5xl leading-none font-bold tracking-[-0.03em] text-balance sm:text-[68px]'>
          {role}
        </h1>
        <p className='max-w-[58ch] text-lg leading-relaxed text-ink-2 sm:text-[19px]'>
          Building backend APIs, serverless AWS architectures, and web products from database design to production deployment.
        </p>
        <div className='flex flex-wrap gap-2.5 pt-1.5'>
          <Button href='/portfolio' variant='accent'>
            View projects
          </Button>
          <Button
            href={resumeUrl}
            download={resumeName}
            onClick={(event) => {
              event.preventDefault();
              void downloadFile(resumeUrl, resumeName);
            }}
            variant='outline'
          >
            Download CV
          </Button>
        </div>
      </div>

      <div className='w-full max-w-[380px] flex-[1_1_300px] overflow-hidden rounded-[10px] border border-line bg-surface'>
        <div className='flex justify-between gap-2 border-b border-line px-[18px] py-3'>
          <ApiLabel variant='bar' path='/me' />
          <span className='font-geist-mono text-xs text-accent'>200 OK</span>
        </div>
        <pre className='px-[18px] py-3.5 font-geist-mono text-[13px] leading-[1.85]'>
          <span className='text-muted'>{'{'}</span>
          {'\n'}
          {Object.entries(me).map(([key, value], index, all) => (
            <span key={key}>
              {'  '}
              <span className='text-warn'>"{key}"</span>
              <span className='text-muted'>: </span>
              <span className={key === 'experience' ? 'text-code-num' : 'text-accent'}>"{value}"</span>
              {index < all.length - 1 ? ',' : ''}
              {'\n'}
            </span>
          ))}
          <span className='text-muted'>{'}'}</span>
        </pre>
      </div>
    </section>
  );
}

export default HeroSection;
