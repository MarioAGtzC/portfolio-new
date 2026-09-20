import {
  // Frontend
  SiHtml5,
  SiCss,
  SiJavascript,
  SiTypescript,
  SiReact,
  SiNextdotjs,
  SiTailwindcss,
  SiRedux,
  SiVite,

  // Backend
  SiNodedotjs,
  SiExpress,
  SiNestjs,
  SiDjango,
  SiPhp,

  // Data
  SiMongodb,
  SiMysql,
  SiPostgresql,
  SiPrisma,
  SiRedis,
  SiFirebase,

  // Cloud & Infra
  SiDocker,
  SiTerraform,
  SiGithubactions,

  // Payments & Auth
  SiStripe,
  SiJsonwebtokens,

  // Tools
  SiGit,
  SiSwagger,
} from 'react-icons/si';
import { FaAws, FaJava, FaPython } from 'react-icons/fa';
import type { IconType } from 'react-icons';

export interface TechStackItem {
  name: string;
  Icon: IconType;
}

export const TECH_STACK: TechStackItem[] = [
  // Frontend
  { name: 'HTML5', Icon: SiHtml5 },
  { name: 'CSS3', Icon: SiCss },
  { name: 'JavaScript', Icon: SiJavascript },
  { name: 'TypeScript', Icon: SiTypescript },
  { name: 'React', Icon: SiReact },
  { name: 'Next.js', Icon: SiNextdotjs },
  { name: 'TailwindCSS', Icon: SiTailwindcss },
  { name: 'Redux', Icon: SiRedux },
  { name: 'Vite', Icon: SiVite },

  // Backend
  { name: 'Node.js', Icon: SiNodedotjs },
  { name: 'Express', Icon: SiExpress },
  { name: 'NestJS', Icon: SiNestjs },
  { name: 'Django', Icon: SiDjango },
  { name: 'PHP', Icon: SiPhp },
  { name: 'Python', Icon: FaPython },
  { name: 'Java', Icon: FaJava },

  // Data
  { name: 'MongoDB', Icon: SiMongodb },
  { name: 'MySQL', Icon: SiMysql },
  { name: 'PostgreSQL', Icon: SiPostgresql },
  { name: 'Prisma', Icon: SiPrisma },
  { name: 'Redis', Icon: SiRedis },
  { name: 'Firebase', Icon: SiFirebase },

  // Cloud & Infra
  { name: 'AWS', Icon: FaAws },
  { name: 'Docker', Icon: SiDocker },
  { name: 'Terraform', Icon: SiTerraform },
  { name: 'GitHub Actions', Icon: SiGithubactions },

  // Payments & Auth
  { name: 'Stripe', Icon: SiStripe },
  { name: 'JWT', Icon: SiJsonwebtokens },

  // Tools
  { name: 'Git', Icon: SiGit },
  { name: 'Swagger', Icon: SiSwagger },
];