export interface ResumeExperience {
    id: string;
    company: string;
    role: string;
    startDate: string;
    endDate: string;
    description: string; // bullet points separated by newlines
}

export interface ResumeEducation {
    id: string;
    institution: string;
    degree: string;
    fieldOfStudy: string;
    graduationYear: string;
    gpa?: string;
}

export interface ResumeProject {
    id: string;
    name: string;
    description: string;
    technologies: string;
    link?: string;
}

export interface ResumeCertification {
    id: string;
    name: string;
    issuer: string;
    date: string;
}

export interface ResumeSkillCategory {
    id: string;
    category: string;
    skills: string; // Comma separated
}

export interface ResumeData {
    personalInfo: {
        fullName: string;
        email: string;
        phone: string;
        location: string;
        linkedin: string;
        portfolio: string;
        customFields?: { label: string; value: string }[];
    };
    summary: string;
    experience: ResumeExperience[];
    education: ResumeEducation[];
    skills: ResumeSkillCategory[];
    projects: ResumeProject[];
    certifications: ResumeCertification[];
    customSections?: { id: string; title: string; content: string }[];
}
