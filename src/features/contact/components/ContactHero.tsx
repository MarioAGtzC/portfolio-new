import contactHeroImage from '../../../assets/images/contact-hero.jpg';

function ContactHero() {
  return (
    <section
      className='relative flex w-full flex-col items-center justify-center gap-4 bg-cover bg-center px-4 py-24 text-center sm:py-32'
      style={{ backgroundImage: `url(${contactHeroImage})` }}
    >
      <div className='absolute inset-0 bg-neutral-950/70' />
      <div className='relative flex flex-col items-center gap-4'>
        <a
          href='#contact-form'
          className='rounded-lg bg-primary px-3 py-1.5 text-sm font-semibold tracking-wide text-white uppercase'
        >
          Contact form
        </a>
        <h1 className='font-recoleta text-4xl font-black text-white sm:text-5xl'>
          Hire me
        </h1>
        <p className='max-w-2xl text-lg font-light text-neutral-200'>
          Looking for a reliable full-stack developer to build or scale your website, app, or backend system? Send me a message and let's talk about how I can help.
        </p>
      </div>
    </section>
  );
}

export default ContactHero;
