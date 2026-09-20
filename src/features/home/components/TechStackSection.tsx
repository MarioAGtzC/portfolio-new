import { TECH_STACK } from '../data/techStack';
import { useLoopCarousel } from '../../portfolio/hooks/useLoopCarousel';

function TechStackSection() {
  const { emblaRef, repeatCount } = useLoopCarousel(TECH_STACK.length, {
    autoscroll: true,
  });

  const slides = Array.from({ length: repeatCount }, (_, copyIndex) =>
    TECH_STACK.map((tech, index) => ({
      tech,
      key: `${tech.name}-${copyIndex}-${index}`,
    })),
  ).flat();

  return (
    <section className='mx-auto max-w-6xl px-5 pb-16 md:px-16'>
      <div className='relative mt-8 rounded-xl bg-white py-8 shadow-sm dark:bg-neutral-900 dark:ring-1 dark:ring-neutral-800'>
        <div className='pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-linear-to-r from-white to-transparent dark:from-neutral-900' />
        <div className='pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-linear-to-l from-white to-transparent dark:from-neutral-900' />

        <div className='overflow-hidden' ref={emblaRef}>
          <div className='-ml-16 flex'>
            {slides.map(({ tech, key }) => (
              <div
                key={key}
                className='flex shrink-0 grow-0 flex-col items-center gap-2 pl-16 text-neutral-400 opacity-60 transition-[color,opacity] duration-300 hover:text-primary hover:opacity-100 dark:text-neutral-500'
              >
                <tech.Icon size={36} />
                <span className='text-xs font-medium'>{tech.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default TechStackSection;
