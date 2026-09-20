import useContactForm from '../hooks/useContactForm';

const fieldBaseClassName =
  'flex-1 rounded-lg bg-neutral-100 px-4 py-3 text-neutral-900 outline-none dark:bg-neutral-800 dark:text-white';

function ContactForm() {
  const { formState, isSubmitting, handleChange, handleSubmit } = useContactForm();

  return (
    <section
      id='contact-form'
      className='relative mx-auto max-w-3xl overflow-hidden px-5 py-24 md:px-16'
    >
      <div className='flex flex-col gap-4'>
        <span className='w-fit rounded-lg bg-secondary px-3 py-1 text-xs font-semibold tracking-wide text-white uppercase'>
          Contact me
        </span>
        <h2 className='font-recoleta text-3xl font-black text-primary sm:text-4xl'>
          Get in touch, tell me about your project.
        </h2>

        <form className='mt-6 flex flex-col gap-5' onSubmit={handleSubmit}>
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

          <div className='flex items-center gap-4'>
            <button
              type='submit'
              disabled={isSubmitting}
              className='inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-base font-medium text-white transition-colors duration-200 hover:brightness-90 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:brightness-110'
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
