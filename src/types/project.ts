export interface ProjectImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

/** Where the project came from. Shown as a label on cards and project pages. */
export type ProjectOrigin = 'product' | 'personal' | 'course' | 'client';

export interface ArchitectureNode {
  label: string;
  detail?: string;
  /** Slug of a piece of this project; the node links to its page. */
  pieceSlug?: string;
}

export interface ArchitectureLayer {
  label?: string;
  nodes: ArchitectureNode[];
}

export interface Project {
  slug: string;
  title: string;
  summary: string;
  /** Ordered by importance: cards show the first items, the project page shows all. */
  stack: string[];
  role: string;
  /** Team size. Omit for solo projects. */
  team?: number;
  problem: string;
  process: string;
  /** One outcome per item. Omit when there is nothing to show yet. */
  results?: string[];
  /** Optional system diagram, top to bottom. */
  architecture?: ArchitectureLayer[];
  liveUrl?: string;
  repoUrl?: string;
  coverImage: ProjectImage | null;
  images: ProjectImage[];
  year: number;
  featured: boolean;
  /** Sort order among siblings (top-level projects, or the pieces of one hub). */
  order: number;
  origin: ProjectOrigin;
  category: (
    | 'web app'
    | 'mobile app'
    | 'backend'
    | 'api'
    | 'serverless'
    | 'microservice'
    | 'platform'
    | 'landing'
    | 'template'
  )[];
  status: 'live' | 'in progress' | 'archived';
  parentSlug?: string;
}
