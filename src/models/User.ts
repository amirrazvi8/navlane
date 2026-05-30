import mongoose from 'mongoose'

// ---------------------------------------------------------------------------
// Skill
// ---------------------------------------------------------------------------
export interface ISkill {
  name: string,
  level: "Beginner" | "Intermediate" | "Advanced" | "Expert"
}

const SkillSchema = new mongoose.Schema<ISkill>({
  name: { type: String, required: true },
  level: {
    type: String,
    enum: ["Beginner", "Intermediate", "Advanced", "Expert"],
    required: true
  }
})

// ---------------------------------------------------------------------------
// Education (structured)
// ---------------------------------------------------------------------------
export interface IEducation {
  degree: string;
  institution: string;
  startYear: string;
  endYear: string;
  grade: string;
}

const EducationSchema = new mongoose.Schema<IEducation>({
  degree: { type: String, required: true },
  institution: { type: String, required: true },
  startYear: { type: String, default: "" },
  endYear: { type: String, default: "" },
  grade: { type: String, default: "" },
})

// ---------------------------------------------------------------------------
// Project
// ---------------------------------------------------------------------------
export interface IProject {
  title: string;
  description: string;
  techStack: string[];
  liveUrl: string;
  githubUrl: string;
}

const ProjectSchema = new mongoose.Schema<IProject>({
  title: { type: String, required: true },
  description: { type: String, default: "" },
  techStack: { type: [String], default: [] },
  liveUrl: { type: String, default: "" },
  githubUrl: { type: String, default: "" },
})

// ---------------------------------------------------------------------------
// Experience
// ---------------------------------------------------------------------------
export interface IExperience {
  title: string;
  company: string;
  duration: string;
  description: string;
}

const ExperienceSchema = new mongoose.Schema<IExperience>({
  title: { type: String, required: true },
  company: { type: String, required: true },
  duration: { type: String, default: "" },
  description: { type: String, default: "" },
})

// ---------------------------------------------------------------------------
// Social Links
// ---------------------------------------------------------------------------
export interface ISocialLinks {
  linkedin: string;
  github: string;
  portfolio: string;
  twitter: string;
}

const SocialLinksSchema = new mongoose.Schema<ISocialLinks>({
  linkedin: { type: String, default: "" },
  github: { type: String, default: "" },
  portfolio: { type: String, default: "" },
  twitter: { type: String, default: "" },
}, { _id: false })

// ---------------------------------------------------------------------------
// User
// ---------------------------------------------------------------------------
export interface IUser {
  name: string,
  email: string,
  password: string,
  education?: string,
  profileImage?: string,
  bio?: string,
  skills?: ISkill[],
  careerGoal?: {
    role: string,
  },
  educationHistory?: IEducation[],
  projects?: IProject[],
  experience?: IExperience[],
  socialLinks?: ISocialLinks,
  location?: string,
  phone?: string,
  locationPreference?: string,
}

const UserSchema = new mongoose.Schema<IUser>({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  // Legacy string field — kept for backward compatibility
  education: {
    type: String,
    default: ""
  },
  profileImage: {
    type: String
  },
  bio: {
    type: String,
    default: ""
  },
  careerGoal: {
    role: {
      type: String,
      enum: [
        'Frontend Development',
        'Backend Development',
        'Full Stack Development',
        'AI Engineer',
        'Cloud Engineer',
        'DevOps Engineer',
        'Data Science',
        'Mobile Development',
        'Cybersecurity',
        'UI/UX Design',
        // Keep old values so existing data doesn't break
        ' Ai Enginner',
        'Cloud Enginner',
      ]
    }
  },
  skills: {
    type: [SkillSchema],
    default: []
  },
  // New structured fields
  educationHistory: {
    type: [EducationSchema],
    default: []
  },
  projects: {
    type: [ProjectSchema],
    default: []
  },
  experience: {
    type: [ExperienceSchema],
    default: []
  },
  socialLinks: {
    type: SocialLinksSchema,
    default: () => ({ linkedin: "", github: "", portfolio: "", twitter: "" })
  },
  location: {
    type: String,
    default: ""
  },
  phone: {
    type: String,
    default: ""
  },
  locationPreference: {
    type: String,
    default: ""
  },

}, { timestamps: true })

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);