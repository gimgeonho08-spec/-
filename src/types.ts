export interface HeroData {
  title: string;
  subtitle: string;
  stats: {
    value: string;
    label: string;
  }[];
}

export interface AboutMeData {
  name: string;
  role: string;
  keywords: string[];
  descriptions: string[];
  imageUrl: string;
}

export interface TimelineEvent {
  id: string;
  year: string;
  title: string;
  description: string;
  imageUrl?: string;
}

export interface CoreProject {
  id: string;
  title: string;
  period: string;
  imageUrl: string;
  problem: string;
  solution: string;
  roles: string[];
  result: string;
  learnings: string[];
}

export interface ExperienceCard {
  id: string;
  company: string;
  role: string;
  period: string;
  activities: string[];
  learnings: string[];
}

export interface TechnicalSkills {
  electrical: string[];
  programming: string[];
  tools: string[];
}

export interface ArchiveItem {
  id: string;
  category: '독서' | '봉사' | '인턴' | '프로젝트';
  title: string;
  reflection: string;
}

export interface WhyHireMeItem {
  id: string;
  title: string;
  description: string;
}

export interface ContactInfo {
  email: string;
  youtube: string;
}

export interface GalleryImage {
  id: string;
  category: 'capstone' | 'volunteer' | 'intern';
  dataUrl: string;
  name: string;
  uploadedAt: string;
}

export interface PortfolioData {
  hero: HeroData;
  aboutMe: AboutMeData;
  timeline: TimelineEvent[];
  coreProject: CoreProject;
  experiences: ExperienceCard[];
  skills: TechnicalSkills;
  archive: ArchiveItem[];
  whyHireMe: WhyHireMeItem[];
  contact: ContactInfo;
  galleryImages?: GalleryImage[];
}
