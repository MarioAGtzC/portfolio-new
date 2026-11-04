import { ABOUT } from '../data/about';

function AboutSection() {
  return (
    <section className='flex flex-col gap-[18px]'>
      <h2 className='text-[30px] font-semibold'>About myself</h2>
      <p className='max-w-3xl text-xl text-ink-2'>{ABOUT.subtitle}</p>

      <div className='mt-2 grid grid-cols-1 gap-6 text-[15px] leading-relaxed text-ink-2 lg:grid-cols-3'>
        {ABOUT.paragraphs.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
    </section>
  );
}

export default AboutSection;
