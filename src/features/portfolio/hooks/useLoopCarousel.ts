import useEmblaCarousel from 'embla-carousel-react';

const MIN_SLIDES = 10;

export function useLoopCarousel(itemCount: number) {
  const isCarousel = itemCount > 1;
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'center',
    loop: isCarousel,
    skipSnaps: true,
  });

  const repeatCount = isCarousel
    ? Math.max(1, Math.ceil(MIN_SLIDES / itemCount))
    : 1;

  return { emblaRef, emblaApi, isCarousel, repeatCount };
}
