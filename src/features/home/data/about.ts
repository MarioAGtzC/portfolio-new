export interface AboutCategory {
  title: string;
  skills: string[];
}

export const ABOUT_CATEGORIES: AboutCategory[] = [
  {
    title: 'Front-end Developer',
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
    skills: [
      'AWS Lambda / API Gateway',
      'Amazon Connect / Lex',
      'AWS Bedrock',
      'Fargate / ECS',
    ],
  },
  {
    title: 'DevOps & Delivery',
    skills: ['Terraform', 'Docker', 'GitHub Actions', 'Git / GitHub'],
  },
  {
    title: 'Databases',
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
    skills: [
      'REST APIs',
      'Stripe Connect',
      'JWT / OAuth (Google, Apple)',
      'Swagger / OpenAPI',
      'Webhooks & Reconciliation',
    ],
  },
];
