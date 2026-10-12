import { SITE } from '../../constants/site';
import { getFeaturedProjects, getTopLevelProjects } from '../../data/projects';
import AboutSection from '../../features/home/components/AboutSection';
import ContactCta from '../../features/home/components/ContactCta';
import FeaturedProjectsSection from '../../features/home/components/FeaturedProjectsSection';
import HeroSection from '../../features/home/components/HeroSection';
import SkillsTable from '../../features/home/components/SkillsTable';
import { HOME_SEO } from '../../seo/routes';
import { useSeo } from '../../seo/useSeo';

const featuredProjects = getFeaturedProjects();
const showcasedProjects =
  featuredProjects.length > 0 ? featuredProjects : getTopLevelProjects().slice(0, 3);

function Home() {
  useSeo(HOME_SEO);

  return (
    <div className='mx-auto flex max-w-[1160px] flex-col gap-14 px-5 pb-16 md:px-8'>
      <HeroSection
        role={SITE.role}
        name={SITE.name}
        resumeUrl={SITE.resumeUrl}
        resumeName={SITE.resumeName}
      />
      <FeaturedProjectsSection projects={showcasedProjects} />
      <AboutSection />
      <SkillsTable />
      <ContactCta />
    </div>
  );
}

export default Home;
