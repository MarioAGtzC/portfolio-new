import Card from '../../../components/ui/Card';
import Icon from '../../../components/ui/Icon';
import type { AboutCategory } from '../data/about';

interface SkillsSectionProps {
  categories: AboutCategory[];
  activeCategoryIndex: number;
  activeCategory: AboutCategory;
  isPanelVisible: boolean;
  onSelectCategory: (index: number) => void;
  onPrevCategory: () => void;
  onNextCategory: () => void;
}

function SkillsSection({
  categories,
  activeCategoryIndex,
  activeCategory,
  isPanelVisible,
  onSelectCategory,
  onPrevCategory,
  onNextCategory,
}: SkillsSectionProps) {
  return (
    <section className='mx-auto max-w-6xl px-5 pb-24 md:px-16'>
      <div className='flex flex-col gap-8 lg:flex-row'>
        <div className='hidden lg:grid grid-cols-2 gap-6 xl:grid-cols-3 lg:w-7/12'>
          {categories.map((category, index) => {
            const isActive = index === activeCategoryIndex;
            return (
              <Card
                key={category.title}
                onClick={() => onSelectCategory(index)}
                className={`flex flex-col items-center justify-center gap-3 p-6 text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:bg-secondary! hover:text-white! lg:p-10 ${
                  isActive ? '-translate-y-2 bg-secondary! text-white!' : ''
                }`}
              >
                <img
                  src={category.icon}
                  alt=''
                  aria-hidden='true'
                  className='h-10 w-10 lg:h-16 lg:w-16'
                />
                <span className='font-recoleta text-sm font-bold lg:text-xl'>
                  {category.title}
                </span>
              </Card>
            );
          })}
        </div>

        <div className='lg:w-5/12'>
          <div className='relative rounded-xl bg-white p-10 shadow-lg xl:p-12 dark:bg-neutral-900'>
            <div
              className={`transition-all duration-500 ${
                isPanelVisible
                  ? 'translate-x-0 opacity-100'
                  : 'translate-x-6 opacity-0'
              }`}
            >
              <p className='text-lg text-secondary sm:text-base lg:text-xl dark:text-neutral-300'>
                My skills as
              </p>
              <h3 className='font-recoleta mb-6 w-full text-3xl font-bold text-secondary sm:text-2xl md:text-3xl dark:text-white'>
                {activeCategory.title}
              </h3>
              <ul className='ml-8 list-disc space-y-2 text-base text-secondary lg:ml-10 lg:text-lg dark:text-neutral-300'>
                {activeCategory.skills.map((skill) => (
                  <li key={skill}>{skill}</li>
                ))}
              </ul>
            </div>

            <div className='absolute -bottom-5 right-10 flex'>
              <button
                type='button'
                onClick={onPrevCategory}
                aria-label='Previous category'
                className='mr-1 flex h-12 w-12 items-center justify-center rounded-xl bg-secondary text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg'
              >
                <Icon name='arrow-left' size={20} />
              </button>
              <button
                type='button'
                onClick={onNextCategory}
                aria-label='Next category'
                className='flex h-12 w-12 items-center justify-center rounded-xl bg-secondary text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg'
              >
                <Icon name='arrow-right' size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SkillsSection;
