import {
  FaGithub,
  FaInstagram,
  FaLinkedin,
  FaUserTie
} from 'react-icons/fa6';
import {
  FiArrowLeft,
  FiArrowRight,
  FiClock,
  FiExternalLink,
  FiMail,
  FiMapPin,
  FiMenu,
  FiPhone,
  FiX,
} from 'react-icons/fi';
import type { IconType } from 'react-icons';

export type IconName =
  | 'github'
  | 'linkedin'
  | 'instagram'
  | 'resume'
  | 'mail'
  | 'external-link'
  | 'arrow-right'
  | 'arrow-left'
  | 'menu'
  | 'close'
  | 'location'
  | 'phone'
  | 'clock';

export interface IconProps {
  name: IconName;
  size?: number;
  className?: string;
}

const ICONS: Record<IconName, IconType> = {
  github: FaGithub,
  linkedin: FaLinkedin,
  instagram: FaInstagram,
  resume: FaUserTie,
  mail: FiMail,
  'external-link': FiExternalLink,
  'arrow-right': FiArrowRight,
  'arrow-left': FiArrowLeft,
  menu: FiMenu,
  close: FiX,
  location: FiMapPin,
  phone: FiPhone,
  clock: FiClock,
};

function Icon({ name, size = 24, className }: IconProps) {
  const IconComponent = ICONS[name];

  return <IconComponent size={size} className={className} aria-hidden='true' />;
}

export default Icon;
