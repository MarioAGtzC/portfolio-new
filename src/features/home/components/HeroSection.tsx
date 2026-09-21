import Button from '../../../components/ui/Button';
import { downloadFile } from '../../../lib/downloadFile';

interface HeroSectionProps {
  role: string;
  name: string;
  resumeUrl: string;
  resumeName: string;
}

function HeroSection({ role, name, resumeUrl, resumeName }: HeroSectionProps) {
  return (
    <section className='mx-auto flex max-w-5xl flex-col items-start gap-6 px-4 py-20 sm:py-28'>
      <div>
        <p className='text-sm font-medium uppercase tracking-wide text-primary'>
          {role}
        </p>
        <h1 className='mt-2 text-4xl font-bold tracking-tight text-neutral-900 sm:text-5xl dark:text-white'>
          {name}
        </h1>
      </div>

      <p className='max-w-2xl text-lg text-neutral-500 dark:text-neutral-400'>
        Full-Stack Software Engineer building backend APIs, serverless AWS architectures, and web products from database design to production deployment.
      </p>

      <div className='flex flex-wrap gap-4'>
        <Button href='/portfolio' variant='primary' size='lg'>
          View projects
        </Button>
        <Button
          href={resumeUrl}
          download={resumeName}
          onClick={(event) => {
            event.preventDefault();
            void downloadFile(resumeUrl, resumeName);
          }}
          variant='ghost'
          size='lg'
        >
          Download CV
        </Button>
      </div>
    </section>
  );
}

export default HeroSection;
