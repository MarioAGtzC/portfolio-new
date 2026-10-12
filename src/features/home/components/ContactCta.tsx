import Button from '../../../components/ui/Button';
import ResponsePanel from '../../../components/ui/ResponsePanel';
import { ROUTES } from '../../../constants/routes';

function ContactCta() {
  return (
    <section className='flex flex-col gap-[18px]'>
      <h2 className='text-[30px] font-semibold'>Contact</h2>
      <ResponsePanel
        method='POST'
        path='/contact'
        aside={<span className='font-geist-mono text-xs text-muted'>Lambda → SES</span>}
      >
        <div className='flex flex-wrap items-center justify-between gap-4'>
          <p className='text-lg font-semibold'>Building something similar? Let's talk.</p>
          <Button href={ROUTES.contact} variant='accent'>
            Send a message
          </Button>
        </div>
      </ResponsePanel>
    </section>
  );
}

export default ContactCta;
