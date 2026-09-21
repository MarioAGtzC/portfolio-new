import frontendIcon from '../../../assets/images/about-frontend.svg';
import backendIcon from '../../../assets/images/about-backend.svg';
import cloudIcon from '../../../assets/images/about-cloud.svg';
import integrationsIcon from '../../../assets/images/about-integration.svg';
import databaseIcon from '../../../assets/images/about-database.svg';
import toolsIcon from '../../../assets/images/about-tools.svg';

export interface AboutCategory {
  title: string;
  icon: string;
  skills: string[];
}

export const ABOUT_CATEGORIES: AboutCategory[] = [
  {
    title: 'Front-end Developer',
    icon: frontendIcon,
    skills: [
      'HTML / CSS3',
      'JavaScript (ES6+)',
      'TypeScript',
      'React',
      'Next.js',
      'TailwindCSS',
      'Redux',
    ],
  },
  {
    title: 'Back-end Developer',
    icon: backendIcon,
    skills: [
      'Node.js / Express',
      'NestJS',
      'Next.js (API routes)',
      'Django',
      'PHP',
      'Java',
      'Python',
    ],
  },
  {
    title: 'Cloud & Serverless (AWS)',
    icon: cloudIcon,
    skills: [
      'AWS Lambda / API Gateway',
      'Amazon Connect / Lex',
      'AWS Bedrock',
      'Fargate / ECS',
      'Terraform',
      'Docker / CI-CD',
    ],
  },
  {
    title: 'Databases',
    icon: databaseIcon,
    skills: [
      'PostgreSQL',
      'MySQL',
      'MongoDB',
      'DynamoDB',
      'Redis',
      'Firebase',
      'Prisma',
    ],
  },
  {
    title: 'APIs & Integrations',
    icon: integrationsIcon,
    skills: [
      'REST APIs',
      'Stripe Connect',
      'JWT / OAuth (Google, Apple)',
      'Swagger / OpenAPI',
      'Webhooks & Reconciliation',
    ],
  },
  {
    title: 'Tools and Workflow',
    icon: toolsIcon,
    skills: [
      'VSCode',
      'Git / GitHub',
      'GitHub Actions',
      'Postman / Swagger',
      'npm / pnpm / Yarn',
      'Docker',
    ],
  },
];