import { Turnstile } from '@marsidev/react-turnstile';

import useContactForm from '../hooks/useContactForm';

const fieldBaseClassName =
  'flex-1 rounded-lg border border-line bg-surface px-4 py-3 text-ink placeholder:text-muted outline-none focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-glow';

const TURNSTILE_SITE_KEY = import.meta.env.VITE_SITE_KEY;

function ContactForm() {
  const {
    formState,
    isSubmitting,
    honeypot,
    handleChange,
    handleHoneypotChange,
    handleTurnstileSuccess,
    handleTurnstileExpireOrError,
    handleSubmit,
  } = useContactForm();

  return (
    <section
      id='contact-form'
      className='relative max-w-3xl scroll-mt-24 overflow-hidden pt-12'
    >
      <div className='flex flex-col gap-4'>
        <h2 className='text-[30px] font-semibold text-ink'>
          Get in touch, tell me about your project.
        </h2>

        <form className='mt-6 flex flex-col gap-5' onSubmit={handleSubmit}>
          {/* Honeypot: display:none keeps browser autofill (and people) out of it; simple bots still fill it. */}
          <div hidden aria-hidden='true'>
            <input
              type='text'
              name='hp_extra'
              value={honeypot}
              onChange={handleHoneypotChange}
              tabIndex={-1}
              autoComplete='off'
            />
          </div>

          <div className='flex flex-col gap-5 sm:flex-row'>
            <label htmlFor='contact-name' className='sr-only'>
              Your name
            </label>
            <input
              id='contact-name'
              type='text'
              name='name'
              placeholder='Your name'
              required
              value={formState.name}
              onChange={handleChange}
              className={fieldBaseClassName}
            />
            <label htmlFor='contact-email' className='sr-only'>
              Your email
            </label>
            <input
              id='contact-email'
              type='email'
              name='email'
              placeholder='Your email'
              required
              value={formState.email}
              onChange={handleChange}
              className={fieldBaseClassName}
            />
          </div>

          <div className='flex flex-col gap-5 sm:flex-row'>
            <label htmlFor='contact-phone' className='sr-only'>
              Your phone number
            </label>
            <input
              id='contact-phone'
              type='tel'
              name='phone'
              placeholder='Your phone number'
              value={formState.phone}
              onChange={handleChange}
              className={fieldBaseClassName}
            />
            <label htmlFor='contact-subject' className='sr-only'>
              Subject
            </label>
            <input
              id='contact-subject'
              type='text'
              name='subject'
              placeholder='Subject'
              required
              value={formState.subject}
              onChange={handleChange}
              className={fieldBaseClassName}
            />
          </div>

          <label htmlFor='contact-message' className='sr-only'>
            Your message
          </label>
          <textarea
            id='contact-message'
            name='message'
            placeholder='Your message'
            required
            rows={6}
            value={formState.message}
            onChange={handleChange}
            className={`${fieldBaseClassName} resize-none`}
          />

          <div className='w-full rounded-[10px] overflow-hidden'>
            <div className='leading-0 -m-1.25'>
              <Turnstile
                siteKey={TURNSTILE_SITE_KEY}
                onSuccess={handleTurnstileSuccess}
                onExpire={handleTurnstileExpireOrError}
                onError={handleTurnstileExpireOrError}
                options={{ size: 'flexible', theme: 'auto' }}
                className='border-0 w-full h-15'
              />
            </div>
          </div>

          <div className='flex items-center gap-4'>
            <button
              type='submit'
              disabled={isSubmitting}
              className='inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-6 py-3 text-base font-semibold text-on-accent transition-[filter] duration-200 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50'
            >
              {isSubmitting ? 'Sending' : 'Send message'}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default ContactForm;
