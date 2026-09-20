import { useLoopCarousel } from '../../portfolio/hooks/useLoopCarousel';
import type { Project } from '../../../types/project';

interface ProjectGalleryProps {
  project: Project;
}

function ProjectGallery({ project }: ProjectGalleryProps) {
  const images = project.images;
  const { emblaRef, isCarousel, repeatCount } = useLoopCarousel(images.length, {
    autoscroll: true,
  });

  if (images.length === 0) {
    return null;
  }
  console.log(images);

  if (!isCarousel) {
    
    const [image] = images;
    return (
      <div className='mt-8 flex justify-center'>
        <img
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          loading='eager'
          decoding='async'
          className='aspect-video w-75 rounded-xl object-cover md:w-112.5 lg:w-162.5'
        />
      </div>
    );
  }

  const slides = Array.from({ length: repeatCount }, (_, copyIndex) =>
    images.map((image, index) => ({
      image,
      key: `${image.src}-${index}-${copyIndex}`,
    })),
  ).flat();

  return (
    <div className='mt-8 overflow-hidden' ref={emblaRef}>
      <div className='-ml-4 flex'>
        {slides.map(({ image, key }) => (
          <div
            key={key}
            className='w-75 shrink-0 grow-0 pl-4 md:w-112.5 lg:w-130 xl:w-160'
          >
            <img
              src={image.src}
              alt={image.alt}
              width={image.width}
              height={image.height}
              loading='lazy'
              decoding='async'
              className='aspect-video w-full rounded-xl object-center'
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProjectGallery;
