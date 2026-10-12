import ContactHero from './ContactHero';
import ContactInfoCards from './ContactInfoCards';
import ContactForm from './ContactForm';

function ContactSection() {
  return (
    <div className='mx-auto max-w-[1160px] px-5 pb-16 md:px-8'>
      <ContactHero />
      <ContactInfoCards />
      <ContactForm />
    </div>
  );
}

export default ContactSection;
