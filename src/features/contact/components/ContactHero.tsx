import ApiLabel from '../../../components/ui/ApiLabel';

function ContactHero() {
  return (
    <section className='flex flex-col gap-4 pt-14'>
      <ApiLabel method='POST' path='/contact' />
      <h1 className='text-4xl font-bold tracking-tight sm:text-5xl'>Contact</h1>
      <p className='max-w-2xl text-lg text-ink-2'>
        Looking for a backend engineer to build or scale your API, cloud infrastructure, or product? Send me a message and let's talk.
      </p>
      <a
        href='#contact-form'
        className='w-fit font-geist-mono text-[13px] text-accent hover:underline'
      >
        Go to the form ↓
      </a>
    </section>
  );
}

export default ContactHero;
