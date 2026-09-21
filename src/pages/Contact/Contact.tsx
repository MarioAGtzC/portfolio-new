import ContactSection from '../../features/contact/components/ContactSection';
import { CONTACT_SEO } from '../../seo/routes';
import { useSeo } from '../../seo/useSeo';

function Contact() {
  useSeo(CONTACT_SEO);

  return <ContactSection />;
}

export default Contact;
