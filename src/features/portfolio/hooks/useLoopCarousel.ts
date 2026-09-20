import { useMemo } from 'react';
import AutoScroll from 'embla-carousel-auto-scroll';
import useEmblaCarousel from 'embla-carousel-react';

const MIN_SLIDES = 10;

interface UseLoopCarouselOptions {
  autoscroll?: boolean;
}

export function useLoopCarousel(
  itemCount: number,
  { autoscroll = false }: UseLoopCarouselOptions = {},
) {
  const isCarousel = itemCount > 1;
  const plugins = useMemo(
    () =>
      autoscroll
        ? [
            AutoScroll({
              speed: 1,
              stopOnInteraction: false,
              stopOnMouseEnter: true,
            }),
          ]
        : [],
    [autoscroll],
  );
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'center',
    loop: isCarousel,
  }, plugins);

  const repeatCount = isCarousel
    ? Math.max(1, Math.ceil(MIN_SLIDES / itemCount))
    : 1;

  return { emblaRef, emblaApi, isCarousel, repeatCount };
}
