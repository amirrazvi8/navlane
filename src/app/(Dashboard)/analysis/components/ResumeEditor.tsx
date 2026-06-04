"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { FileEdit, Plus, Trash2, Wand2, ChevronDown, ChevronUp, LayoutTemplate, Briefcase, GraduationCap, Code, Award, User, FolderKanban } from "lucide-react";
import { ResumeData, ResumeExperience, ResumeEducation, ResumeProject, ResumeCertification, ResumeSkillCategory } from "@/types/resume";
import { motion, AnimatePresence } from "framer-motion";

// Dynamically import the LivePDFPreview to disable SSR since @react-pdf/renderer uses browser APIs
const LivePDFPreview = dynamic(() => import("./LivePDFPreview"), { 
    ssr: false,
    loading: () => (
        <div className="w-full h-full min-h-[600px] flex flex-col items-center justify-center bg-muted/10 border border-border/50 rounded-xl">
            <Wand2 className="h-10 w-10 text-primary animate-pulse mb-4" />
            <p className="text-muted-foreground font-medium animate-pulse">Initializing PDF Engine...</p>
        </div>
    )
});

const initialResumeData: ResumeData = {
    personalInfo: { fullName: "", email: "", phone: "", location: "", linkedin: "", portfolio: "", customFields: [] },
    summary: "",
    experience: [],
    education: [],
    skills: [],
    projects: [],
    certifications: [],
    customSections: []
};

export function ResumeEditor({ analysisResult }: { analysisResult: any }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [template, setTemplate] = useState<'professional' | 'modern' | 'minimal'>('professional');
    const [data, setData] = useState<ResumeData>(initialResumeData);

    // Use debounced data for the PDF to prevent lag while typing fast
    const [debouncedData, setDebouncedData] = useState<ResumeData>(data);
    
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedData(data), 500);
        return () => clearTimeout(timer);
    }, [data]);

    // --- Personal Info ---
    const handlePersonalInfoChange = (field: 'fullName' | 'email' | 'phone' | 'location' | 'linkedin' | 'portfolio', value: string) => {
        setData(prev => ({ ...prev, personalInfo: { ...prev.personalInfo, [field]: value } }));
    };

    const addCustomField = () => {
        setData(prev => ({
            ...prev,
            personalInfo: {
                ...prev.personalInfo,
                customFields: [...(prev.personalInfo.customFields || []), { label: "", value: "" }]
            }
        }));
    };

    const updateCustomField = (index: number, key: 'label' | 'value', val: string) => {
        setData(prev => ({
            ...prev,
            personalInfo: {
                ...prev.personalInfo,
                customFields: (prev.personalInfo.customFields || []).map((f, i) => 
                    i === index ? { ...f, [key]: val } : f
                )
            }
        }));
    };

    const removeCustomField = (index: number) => {
        setData(prev => ({
            ...prev,
            personalInfo: {
                ...prev.personalInfo,
                customFields: (prev.personalInfo.customFields || []).filter((_, i) => i !== index)
            }
        }));
    };

    // --- Experience ---
    const addExperience = () => {
        const newExp: ResumeExperience = { id: crypto.randomUUID(), company: "", role: "", startDate: "", endDate: "", description: "" };
        setData(prev => ({ ...prev, experience: [...prev.experience, newExp] }));
    };

    const updateExperience = (id: string, field: keyof ResumeExperience, value: string) => {
        setData(prev => ({
            ...prev,
            experience: prev.experience.map(exp => exp.id === id ? { ...exp, [field]: value } : exp)
        }));
    };

    const removeExperience = (id: string) => setData(prev => ({ ...prev, experience: prev.experience.filter(e => e.id !== id) }));

    // --- Education ---
    const addEducation = () => {
        const newEdu: ResumeEducation = { id: crypto.randomUUID(), institution: "", degree: "", fieldOfStudy: "", graduationYear: "" };
        setData(prev => ({ ...prev, education: [...prev.education, newEdu] }));
    };

    const updateEducation = (id: string, field: keyof ResumeEducation, value: string) => {
        setData(prev => ({
            ...prev,
            education: prev.education.map(edu => edu.id === id ? { ...edu, [field]: value } : edu)
        }));
    };

    const removeEducation = (id: string) => setData(prev => ({ ...prev, education: prev.education.filter(e => e.id !== id) }));

    // --- Skills (Categorized) ---
    const addSkillCategory = () => {
        const newCat: ResumeSkillCategory = { id: crypto.randomUUID(), category: "", skills: "" };
        setData(prev => ({ ...prev, skills: [...prev.skills, newCat] }));
    };

    const updateSkillCategory = (id: string, field: 'category' | 'skills', val: string) => {
        setData(prev => ({
            ...prev,
            skills: prev.skills.map(s => s.id === id ? { ...s, [field]: val } : s)
        }));
    };

    const removeSkillCategory = (id: string) => {
        setData(prev => ({ ...prev, skills: prev.skills.filter(s => s.id !== id) }));
    };

    // --- Projects ---
    const addProject = () => {
        const newProj: ResumeProject = { id: crypto.randomUUID(), name: "", description: "", technologies: "", link: "" };
        setData(prev => ({ ...prev, projects: [...prev.projects, newProj] }));
    };

    const updateProject = (id: string, field: keyof ResumeProject, value: string) => {
        setData(prev => ({
            ...prev,
            projects: prev.projects.map(p => p.id === id ? { ...p, [field]: value } : p)
        }));
    };

    const removeProject = (id: string) => setData(prev => ({ ...prev, projects: prev.projects.filter(p => p.id !== id) }));

    // --- Certifications ---
    const addCertification = () => {
        const newCert: ResumeCertification = { id: crypto.randomUUID(), name: "", issuer: "", date: "" };
        setData(prev => ({ ...prev, certifications: [...prev.certifications, newCert] }));
    };

    const updateCertification = (id: string, field: keyof ResumeCertification, value: string) => {
        setData(prev => ({
            ...prev,
            certifications: prev.certifications.map(c => c.id === id ? { ...c, [field]: value } : c)
        }));
    };

    const removeCertification = (id: string) => setData(prev => ({ ...prev, certifications: prev.certifications.filter(c => c.id !== id) }));

    // --- Custom Sections ---
    const addCustomSection = () => {
        setData(prev => ({
            ...prev,
            customSections: [...(prev.customSections || []), { id: crypto.randomUUID(), title: "", content: "" }]
        }));
    };

    const updateCustomSection = (id: string, key: 'title' | 'content', val: string) => {
        setData(prev => ({
            ...prev,
            customSections: (prev.customSections || []).map(sec => sec.id === id ? { ...sec, [key]: val } : sec)
        }));
    };

    const removeCustomSection = (id: string) => {
        setData(prev => ({
            ...prev,
            customSections: (prev.customSections || []).filter(sec => sec.id !== id)
        }));
    };

    // --- AI Suggestions ---
    const applyAISuggestions = () => {
        if (!analysisResult?.recommendations || !Array.isArray(analysisResult.recommendations)) return;
        
        const suggestedSkills = analysisResult.recommendations
            .map((rec: any) => typeof rec === 'string' ? rec : rec.title || rec.topic)
            .filter((skill: string) => skill && skill.length < 20);

        if (analysisResult.missingSkills) {
            suggestedSkills.push(...analysisResult.missingSkills.map((s: any) => typeof s === 'string' ? s : s.name));
        }

        const uniqueNewSkills = [...new Set<string>(suggestedSkills)].filter(s => s);
        
        if (uniqueNewSkills.length > 0) {
            setData(prev => ({ 
                ...prev, 
                skills: [
                    ...prev.skills, 
                    { id: crypto.randomUUID(), category: "Suggested by AI", skills: uniqueNewSkills.join(', ') }
                ] 
            }));
        }
    };

    // --- Collapsed State ---
    if (!isExpanded) {
        return (
            <Card className="border-primary/20 bg-card hover:border-primary/50 transition-all duration-300">
                <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-primary/10 rounded-xl">
                            <FileEdit className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold">Resume Builder</h3>
                            <p className="text-muted-foreground text-sm">Create an ATS-friendly resume perfectly tailored to your skill gap analysis.</p>
                        </div>
                    </div>
                    <Button onClick={() => setIsExpanded(true)} className="gap-2 shrink-0">
                        Open Editor <ChevronDown className="h-4 w-4" />
                    </Button>
                </CardContent>
            </Card>
        );
    }

    // --- Expanded Editor ---
    return (
        <Card className="border-primary/30 shadow-lg overflow-hidden flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between bg-muted/20 border-b pb-4">
                <div className="flex items-center gap-3">
                    <FileEdit className="h-5 w-5 text-primary" />
                    <CardTitle>Resume Builder</CardTitle>
                </div>
                <div className="flex items-center gap-3">
                    <div className="hidden sm:flex bg-background border rounded-lg p-1">
                        {(['professional', 'modern', 'minimal'] as const).map(t => (
                            <button
                                key={t}
                                onClick={() => setTemplate(t)}
                                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all capitalize ${template === t ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:bg-muted'}`}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => setIsExpanded(false)}>
                        <ChevronUp className="h-4 w-4" />
                    </Button>
                </div>
            </CardHeader>

            <CardContent className="p-0 flex flex-col lg:flex-row h-[800px]">
                
                {/* LEFT PANEL: Form Editor */}
                <div className="w-full lg:w-[45%] h-full overflow-y-auto p-6 space-y-8 bg-card custom-scrollbar border-r border-border/50">
                    
                    {/* Template Selector (Mobile only) */}
                    <div className="sm:hidden space-y-2">
                        <Label>Template</Label>
                        <div className="flex bg-background border rounded-lg p-1">
                            {(['professional', 'modern', 'minimal'] as const).map(t => (
                                <button
                                    key={t}
                                    onClick={() => setTemplate(t)}
                                    className={`flex-1 px-2 py-1.5 text-xs font-semibold rounded-md transition-all capitalize ${template === t ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:bg-muted'}`}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* ─── Personal Info ─── */}
                    <section className="space-y-4">
                        <div className="flex items-center justify-between border-b pb-2">
                            <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-primary" />
                                <h4 className="font-semibold text-lg tracking-tight">Personal Information</h4>
                            </div>
                            <Button variant="outline" size="sm" onClick={addCustomField} className="h-7 gap-1 px-2">
                                <Plus className="h-3 w-3" /> Add Field
                            </Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label>Full Name</Label>
                                <Input value={data.personalInfo.fullName} onChange={e => handlePersonalInfoChange('fullName', e.target.value)} placeholder="Jane Doe" />
                            </div>
                            <div className="space-y-1.5">
                                <Label>Email</Label>
                                <Input value={data.personalInfo.email} onChange={e => handlePersonalInfoChange('email', e.target.value)} placeholder="jane@example.com" />
                            </div>
                            <div className="space-y-1.5">
                                <Label>Phone</Label>
                                <Input value={data.personalInfo.phone} onChange={e => handlePersonalInfoChange('phone', e.target.value)} placeholder="+1 (555) 123-4567" />
                            </div>
                            <div className="space-y-1.5">
                                <Label>Location</Label>
                                <Input value={data.personalInfo.location} onChange={e => handlePersonalInfoChange('location', e.target.value)} placeholder="San Francisco, CA" />
                            </div>
                            <div className="space-y-1.5">
                                <Label>LinkedIn URL</Label>
                                <Input value={data.personalInfo.linkedin} onChange={e => handlePersonalInfoChange('linkedin', e.target.value)} placeholder="linkedin.com/in/janedoe" />
                            </div>
                            <div className="space-y-1.5">
                                <Label>Portfolio URL</Label>
                                <Input value={data.personalInfo.portfolio} onChange={e => handlePersonalInfoChange('portfolio', e.target.value)} placeholder="janedoe.dev" />
                            </div>
                            {/* Dynamic custom fields */}
                            {(data.personalInfo.customFields || []).map((field, idx) => (
                                <div key={`custom-field-${idx}`} className="col-span-1 md:col-span-2 flex gap-2 items-end">
                                    <div className="space-y-1.5 flex-1">
                                        <Label>Field Label</Label>
                                        <Input value={field.label} onChange={e => updateCustomField(idx, 'label', e.target.value)} placeholder="e.g. GitHub" />
                                    </div>
                                    <div className="space-y-1.5 flex-1">
                                        <Label>Field Value</Label>
                                        <Input value={field.value} onChange={e => updateCustomField(idx, 'value', e.target.value)} placeholder="github.com/janedoe" />
                                    </div>
                                    <Button variant="ghost" size="icon" className="h-10 w-10 text-muted-foreground hover:text-destructive shrink-0" onClick={() => removeCustomField(idx)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* ─── Summary ─── */}
                    <section className="space-y-4">
                        <div className="flex items-center gap-2 border-b pb-2">
                            <LayoutTemplate className="h-4 w-4 text-primary" />
                            <h4 className="font-semibold text-lg tracking-tight">Professional Summary</h4>
                        </div>
                        <Textarea 
                            rows={4}
                            value={data.summary} 
                            onChange={e => setData(prev => ({ ...prev, summary: e.target.value }))} 
                            placeholder="A passionate software engineer with 5+ years of experience..." 
                        />
                    </section>

                    {/* ─── Experience ─── */}
                    <section className="space-y-4">
                        <div className="flex items-center justify-between border-b pb-2">
                            <div className="flex items-center gap-2">
                                <Briefcase className="h-4 w-4 text-primary" />
                                <h4 className="font-semibold text-lg tracking-tight">Work Experience</h4>
                            </div>
                            <Button variant="outline" size="sm" onClick={addExperience} className="h-7 gap-1 px-2">
                                <Plus className="h-3 w-3" /> Add
                            </Button>
                        </div>
                        
                        <AnimatePresence>
                            {data.experience.map((exp) => (
                                <motion.div 
                                    initial={{ opacity: 0, height: 0 }} 
                                    animate={{ opacity: 1, height: 'auto' }} 
                                    exit={{ opacity: 0, height: 0 }}
                                    key={exp.id} 
                                    className="p-4 bg-muted/10 rounded-lg border border-border/50 space-y-4 relative"
                                >
                                    <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-6 w-6 text-muted-foreground hover:text-destructive" onClick={() => removeExperience(exp.id)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-6">
                                        <div className="space-y-1.5">
                                            <Label>Company</Label>
                                            <Input value={exp.company} onChange={e => updateExperience(exp.id, 'company', e.target.value)} placeholder="Tech Corp" />
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label>Role</Label>
                                            <Input value={exp.role} onChange={e => updateExperience(exp.id, 'role', e.target.value)} placeholder="Software Engineer" />
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label>Start Date</Label>
                                            <Input value={exp.startDate} onChange={e => updateExperience(exp.id, 'startDate', e.target.value)} placeholder="Jan 2021" />
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label>End Date</Label>
                                            <Input value={exp.endDate} onChange={e => updateExperience(exp.id, 'endDate', e.target.value)} placeholder="Present" />
                                        </div>
                                        <div className="space-y-1.5 col-span-1 md:col-span-2">
                                            <Label>Description (Bullets separated by newlines)</Label>
                                            <Textarea 
                                                rows={3} 
                                                value={exp.description} 
                                                onChange={e => updateExperience(exp.id, 'description', e.target.value)} 
                                                placeholder={"Developed scalable web applications...\nLed a team of 3 engineers..."} 
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        {data.experience.length === 0 && <p className="text-sm text-muted-foreground italic text-center py-2">No experience added yet.</p>}
                    </section>

                    {/* ─── Education ─── */}
                    <section className="space-y-4">
                        <div className="flex items-center justify-between border-b pb-2">
                            <div className="flex items-center gap-2">
                                <GraduationCap className="h-4 w-4 text-primary" />
                                <h4 className="font-semibold text-lg tracking-tight">Education</h4>
                            </div>
                            <Button variant="outline" size="sm" onClick={addEducation} className="h-7 gap-1 px-2">
                                <Plus className="h-3 w-3" /> Add
                            </Button>
                        </div>

                        <AnimatePresence>
                            {data.education.map((edu) => (
                                <motion.div 
                                    initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                                    key={edu.id} className="p-4 bg-muted/10 rounded-lg border border-border/50 space-y-4 relative"
                                >
                                    <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-6 w-6 text-muted-foreground hover:text-destructive" onClick={() => removeEducation(edu.id)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-6">
                                        <div className="space-y-1.5">
                                            <Label>Institution</Label>
                                            <Input value={edu.institution} onChange={e => updateEducation(edu.id, 'institution', e.target.value)} placeholder="University of Tech" />
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label>Degree</Label>
                                            <Input value={edu.degree} onChange={e => updateEducation(edu.id, 'degree', e.target.value)} placeholder="B.S." />
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label>Field of Study</Label>
                                            <Input value={edu.fieldOfStudy} onChange={e => updateEducation(edu.id, 'fieldOfStudy', e.target.value)} placeholder="Computer Science" />
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label>Graduation Year</Label>
                                            <Input value={edu.graduationYear} onChange={e => updateEducation(edu.id, 'graduationYear', e.target.value)} placeholder="2020" />
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        {data.education.length === 0 && <p className="text-sm text-muted-foreground italic text-center py-2">No education added yet.</p>}
                    </section>

                    {/* ─── Skills (Categorized) ─── */}
                    <section className="space-y-4">
                        <div className="flex items-center justify-between border-b pb-2">
                            <div className="flex items-center gap-2">
                                <Code className="h-4 w-4 text-primary" />
                                <h4 className="font-semibold text-lg tracking-tight">Skills</h4>
                            </div>
                            <div className="flex items-center gap-2">
                                {analysisResult && (
                                    <Button variant="outline" size="sm" onClick={applyAISuggestions} className="h-7 gap-1 px-2 border-primary/50 text-primary hover:bg-primary/10">
                                        <Wand2 className="h-3 w-3" /> AI Suggest
                                    </Button>
                                )}
                                <Button variant="outline" size="sm" onClick={addSkillCategory} className="h-7 gap-1 px-2">
                                    <Plus className="h-3 w-3" /> Add
                                </Button>
                            </div>
                        </div>
                        
                        <AnimatePresence>
                            {data.skills.map((skillCat) => (
                                <motion.div 
                                    initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                                    key={skillCat.id} className="p-4 bg-muted/10 rounded-lg border border-border/50 space-y-4 relative"
                                >
                                    <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-6 w-6 text-muted-foreground hover:text-destructive" onClick={() => removeSkillCategory(skillCat.id)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-6">
                                        <div className="space-y-1.5">
                                            <Label>Category (e.g. Frontend)</Label>
                                            <Input value={skillCat.category} onChange={e => updateSkillCategory(skillCat.id, 'category', e.target.value)} placeholder="Frontend" />
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label>Skills (Comma separated)</Label>
                                            <Input value={skillCat.skills} onChange={e => updateSkillCategory(skillCat.id, 'skills', e.target.value)} placeholder="React, TailwindCSS, Next.js" />
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        {data.skills.length === 0 && <p className="text-sm text-muted-foreground italic text-center py-2">No skills added yet.</p>}
                    </section>

                    {/* ─── Projects ─── */}
                    <section className="space-y-4">
                        <div className="flex items-center justify-between border-b pb-2">
                            <div className="flex items-center gap-2">
                                <FolderKanban className="h-4 w-4 text-primary" />
                                <h4 className="font-semibold text-lg tracking-tight">Projects</h4>
                            </div>
                            <Button variant="outline" size="sm" onClick={addProject} className="h-7 gap-1 px-2">
                                <Plus className="h-3 w-3" /> Add
                            </Button>
                        </div>

                        <AnimatePresence>
                            {data.projects.map((proj) => (
                                <motion.div 
                                    initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                                    key={proj.id} className="p-4 bg-muted/10 rounded-lg border border-border/50 space-y-4 relative"
                                >
                                    <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-6 w-6 text-muted-foreground hover:text-destructive" onClick={() => removeProject(proj.id)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-6">
                                        <div className="space-y-1.5">
                                            <Label>Project Name</Label>
                                            <Input value={proj.name} onChange={e => updateProject(proj.id, 'name', e.target.value)} placeholder="My Awesome App" />
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label>Technologies</Label>
                                            <Input value={proj.technologies} onChange={e => updateProject(proj.id, 'technologies', e.target.value)} placeholder="React, Node.js, PostgreSQL" />
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label>Link (optional)</Label>
                                            <Input value={proj.link || ""} onChange={e => updateProject(proj.id, 'link', e.target.value)} placeholder="https://github.com/..." />
                                        </div>
                                        <div className="space-y-1.5 col-span-1 md:col-span-2">
                                            <Label>Description</Label>
                                            <Textarea 
                                                rows={2} 
                                                value={proj.description} 
                                                onChange={e => updateProject(proj.id, 'description', e.target.value)} 
                                                placeholder="Built a full-stack web application that..." 
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        {data.projects.length === 0 && <p className="text-sm text-muted-foreground italic text-center py-2">No projects added yet.</p>}
                    </section>

                    {/* ─── Certifications ─── */}
                    <section className="space-y-4">
                        <div className="flex items-center justify-between border-b pb-2">
                            <div className="flex items-center gap-2">
                                <Award className="h-4 w-4 text-primary" />
                                <h4 className="font-semibold text-lg tracking-tight">Certifications</h4>
                            </div>
                            <Button variant="outline" size="sm" onClick={addCertification} className="h-7 gap-1 px-2">
                                <Plus className="h-3 w-3" /> Add
                            </Button>
                        </div>

                        <AnimatePresence>
                            {data.certifications.map((cert) => (
                                <motion.div 
                                    initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                                    key={cert.id} className="p-4 bg-muted/10 rounded-lg border border-border/50 space-y-4 relative"
                                >
                                    <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-6 w-6 text-muted-foreground hover:text-destructive" onClick={() => removeCertification(cert.id)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-6">
                                        <div className="space-y-1.5">
                                            <Label>Certification Name</Label>
                                            <Input value={cert.name} onChange={e => updateCertification(cert.id, 'name', e.target.value)} placeholder="AWS Certified Developer" />
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label>Issuer</Label>
                                            <Input value={cert.issuer} onChange={e => updateCertification(cert.id, 'issuer', e.target.value)} placeholder="Amazon Web Services" />
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label>Date</Label>
                                            <Input value={cert.date} onChange={e => updateCertification(cert.id, 'date', e.target.value)} placeholder="March 2023" />
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        {data.certifications.length === 0 && <p className="text-sm text-muted-foreground italic text-center py-2">No certifications added yet.</p>}
                    </section>

                    {/* ─── Custom Sections ─── */}
                    <section className="space-y-4 pt-4 border-t border-border/50">
                        <div className="flex items-center justify-between border-b pb-2">
                            <div className="flex items-center gap-2">
                                <LayoutTemplate className="h-4 w-4 text-primary" />
                                <h4 className="font-semibold text-lg tracking-tight">Custom Sections</h4>
                            </div>
                            <Button variant="outline" size="sm" onClick={addCustomSection} className="h-7 gap-1 px-2">
                                <Plus className="h-3 w-3" /> Add Section
                            </Button>
                        </div>
                        
                        <AnimatePresence>
                            {(data.customSections || []).map((sec) => (
                                <motion.div 
                                    initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                                    key={sec.id} className="p-4 bg-muted/10 rounded-lg border border-border/50 space-y-4 relative"
                                >
                                    <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-6 w-6 text-muted-foreground hover:text-destructive" onClick={() => removeCustomSection(sec.id)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                    <div className="space-y-4 pr-6">
                                        <div className="space-y-1.5">
                                            <Label>Section Title</Label>
                                            <Input value={sec.title} onChange={e => updateCustomSection(sec.id, 'title', e.target.value)} placeholder="e.g. Languages" />
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label>Content (Bullets separated by newlines)</Label>
                                            <Textarea 
                                                rows={4} 
                                                value={sec.content} 
                                                onChange={e => updateCustomSection(sec.id, 'content', e.target.value)} 
                                                placeholder={"English (Fluent)\nSpanish (Intermediate)"} 
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        {(!data.customSections || data.customSections.length === 0) && <p className="text-sm text-muted-foreground italic text-center py-2">No custom sections added.</p>}
                    </section>

                </div>

                {/* RIGHT PANEL: Live PDF Preview */}
                <div className="w-full lg:w-[55%] h-[500px] lg:h-full bg-muted/20 border-t lg:border-t-0 p-4 relative">
                    <LivePDFPreview data={debouncedData} template={template} />
                </div>
            </CardContent>
        </Card>
    );
}
