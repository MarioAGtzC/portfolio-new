import Card from '../../../components/ui/Card';
import Icon, { type IconName } from '../../../components/ui/Icon';
import { SITE } from '../../../constants/site';

interface ContactInfoCard {
  icon: IconName;
  eyebrow: string;
  title: string;
  lines: string[];
}

const CONTACT_INFO: ContactInfoCard[] = [
  {
    icon: 'location',
    eyebrow: 'Location',
    title: 'Located at:',
    lines: ['Colima, Colima, México', 'Open to remote work worldwide'],
  },
  {
    icon: 'phone',
    eyebrow: 'Available',
    title: 'Call me at:',
    lines: ['+52 (312) 103 1850'],
  },
  {
    icon: 'mail',
    eyebrow: 'Email me',
    title: 'Email:',
    lines: [SITE.email],
  },
  {
    icon: 'clock',
    eyebrow: 'Hours',
    title: 'Business hours:',
    lines: ['Mon–Fri, 9am–6pm (GMT-6)'],
  },
];

function ContactInfoCards() {
  return (
    <section className='mx-auto max-w-7xl px-5 pt-16 pb-10 md:px-16'>
      <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4'>
        {CONTACT_INFO.map((info) => (
          <Card
            key={info.title}
            className='flex flex-col gap-4 p-8 transition-transform duration-300 hover:-translate-y-2'
          >
            <div className='flex items-center gap-4'>
              <Icon name={info.icon} size={32} className='text-primary' />
              <div className='flex flex-col'>
                <span className='text-xs text-primary'>{info.eyebrow}</span>
                <span className='font-recoleta text-lg font-bold text-neutral-900 dark:text-white'>
                  {info.title}
                </span>
              </div>
            </div>
            <div className='flex flex-col gap-1'>
              {info.lines.map((line, index) => (
                <p key={index} className='text-neutral-500 dark:text-neutral-400'>
                  {line}
                </p>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}

export default ContactInfoCards;
