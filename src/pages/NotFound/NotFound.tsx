import ApiLabel from '../../components/ui/ApiLabel';
import Button from '../../components/ui/Button';
import { NOT_FOUND_SEO } from '../../seo/routes';
import { useSeo } from '../../seo/useSeo';

function NotFound() {
  useSeo(NOT_FOUND_SEO);

  return (
    <div className='mx-auto flex max-w-[1160px] flex-col items-start gap-4 px-5 py-24 md:px-8'>
      <span className='font-geist-mono text-xs text-warn'>404 Not Found</span>
      <h1 className='text-4xl font-bold tracking-tight sm:text-5xl'>This page doesn't exist</h1>
      <p className='max-w-xl text-lg text-ink-2'>The link may be broken or the page may have moved.</p>
      <div className='flex flex-wrap items-center gap-3 pt-2'>
        <Button href='/' variant='accent'>
          Go home
        </Button>
        <Button href='/portfolio' variant='outline'>
          See projects
        </Button>
      </div>
      <ApiLabel path='/404' className='pt-4' />
    </div>
  );
}

export default NotFound;
