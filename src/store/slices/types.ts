// ---------------------------------------------------------------------------
// Shared type definitions for all Redux slices
// ---------------------------------------------------------------------------

export interface Skill {
  name: string;
  level: string;
}

export interface Education {
  degree: string;
  institution: string;
  startYear: string;
  endYear: string;
  grade: string;
}

export interface Experience {
  title: string;
  company: string;
  duration: string;
  description: string;
}

export interface Project {
  title: string;
  description: string;
  techStack: string[];
  liveUrl: string;
  githubUrl: string;
}

export interface SocialLinks {
  linkedin: string;
  github: string;
  portfolio: string;
  twitter: string;
}

export interface CareerGoal {
  role: string;
}

/** Full user profile shape — used for hydration from the server */
export interface FullUserProfile {
  name: string;
  email: string;
  bio: string;
  location: string;
  locationPreference: string;
  phone: string;
  profileImage: string;
  skills: Skill[];
  careerGoal: CareerGoal;
  educationHistory: Education[];
  projects: Project[];
  experience: Experience[];
  socialLinks: SocialLinks;
}
