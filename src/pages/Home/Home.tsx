import { SITE } from '../../constants/site';
import { projects } from '../../data/projects';
import AboutSection from '../../features/home/components/AboutSection';
import FeaturedProjectsSection from '../../features/home/components/FeaturedProjectsSection';
import HeroSection from '../../features/home/components/HeroSection';
import SkillsSection from '../../features/home/components/SkillsSection';
import TechStackSection from '../../features/home/components/TechStackSection';
import { ABOUT_CATEGORIES } from '../../features/home/data/about';
import { useSkillCategories } from '../../features/home/hooks/useSkillCategories';

const featuredProjects = projects.filter((project) => project.featured);
const showcasedProjects =
  featuredProjects.length > 0 ? featuredProjects : projects.slice(0, 3);

function Home() {
  const {
    activeCategoryIndex,
    activeCategory,
    isPanelVisible,
    handleSelectCategory,
    handleNextCategory,
    handlePrevCategory,
  } = useSkillCategories();

  return (
    <div>
      <HeroSection role={SITE.role} name={SITE.name} resumeUrl={SITE.resumeUrl} />
      <TechStackSection />
      <FeaturedProjectsSection projects={showcasedProjects} />
      <AboutSection />
      <SkillsSection
        categories={ABOUT_CATEGORIES}
        activeCategoryIndex={activeCategoryIndex}
        activeCategory={activeCategory}
        isPanelVisible={isPanelVisible}
        onSelectCategory={handleSelectCategory}
        onPrevCategory={handlePrevCategory}
        onNextCategory={handleNextCategory}
      />
    </div>
  );
}

export default Home;
