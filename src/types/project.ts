export interface ProjectImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface Project {
  slug: string;
  title: string;
  summary: string;
  stack: string[];
  role: string;
  problem: string;
  process: string;
  results: string;
  liveUrl?: string;
  repoUrl?: string;
  coverImage: ProjectImage | null;
  images: ProjectImage[];
  year: number;
  featured: boolean;
  category: (
    | 'web app'
    | 'mobile app'
    | 'backend'
    | 'api'
    | 'serverless'
    | 'microservice'
    | 'platform'
    | 'landing'
    | 'client work'
    | 'template'
  )[];
  status: 'live' | 'in progress' | 'archived';
  parentSlug?: string;
}
