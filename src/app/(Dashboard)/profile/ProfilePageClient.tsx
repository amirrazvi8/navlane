'use client';

import { useState, useMemo, useEffect } from 'react';
import { ProfileHero } from './components/ProfileHero';
import { ProfileInfo } from './components/ProfileInfo';
import { CareerGoalSettings } from './components/CareerGoalSettings';
import { SkillManager } from './components/SkillManager';
import { EducationManager } from './components/EducationManager';
import { ExperienceManager } from './components/ExperienceManager';
import { ProjectManager } from './components/ProjectManager';
import { SocialLinksManager } from './components/SocialLinksManager';
import { ChangePassowrd } from './components/PasswordSetting';
import { DangerZone } from './components/DangerZone';
import { LogoutButton } from './components/LogoutButton';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import { useAppDispatch } from '@/store/hooks';
import { setUserProfile } from '@/store/userProfileSlice';
import axios from 'axios';
import { handleApiError } from '@/lib/axios';

interface UserData {
  name: string;
  email: string;
  bio: string;
  education: string;
  profileImage: string;
  location: string;
  phone: string;
  locationPreference: string;
  skills: { name: string; level: string }[];
  careerGoal: { role?: string };
  educationHistory: {
    degree: string;
    institution: string;
    startYear: string;
    endYear: string;
    grade: string;
  }[];
  projects: {
    title: string;
    description: string;
    techStack: string[];
    liveUrl: string;
    githubUrl: string;
  }[];
  experience: {
    title: string;
    company: string;
    duration: string;
    description: string;
  }[];
  socialLinks: {
    linkedin: string;
    github: string;
    portfolio: string;
    twitter: string;
    instagram:string;
  };
}

const COMPLETENESS_RULES: {
  label: string;
  weight: number;
  check: (u: UserData) => boolean;
}[] = [
  {
    label: 'Name',
    weight: 10,
    check: (u) => !!u.name,
  },
  {
    label: 'Email',
    weight: 10,
    check: (u) => !!u.email,
  },
  {
    label: 'Profile photo',
    weight: 10,
    check: (u) => !!u.profileImage,
  },
  {
    label: 'Bio',
    weight: 10,
    check: (u) => !!u.bio,
  },
  {
    label: 'Skills',
    weight: 10,
    check: (u) => (u.skills?.length ?? 0) > 0,
  },
  {
    label: 'Career goal',
    weight: 10,
    check: (u) => !!u.careerGoal?.role,
  },
  {
    label: 'Education history',
    weight: 10,
    check: (u) => (u.educationHistory?.length ?? 0) > 0,
  },
  {
    label: 'Work experience', // ← was missing from the original function
    weight: 10,
    check: (u) => (u.experience?.length ?? 0) > 0,
  },

  {
    label: 'Location',
    weight: 5,
    check: (u) => !!u.location,
  },
  {
    label: 'Phone',
    weight: 5,
    check: (u) => !!u.phone,
  },
  {
    label: 'Projects',
    weight: 5,
    check: (u) => (u.projects?.length ?? 0) > 0,
  },
  {
    label: 'Social links',
    weight: 5,
    check: (u) => !!(u.socialLinks?.linkedin || u.socialLinks?.github),
  },
];

function computeCompleteness(user: UserData): number {
  return COMPLETENESS_RULES.reduce(
    (total, { weight, check }) => total + (check(user) ? weight : 0),
    0,
  );
}

export function ProfilePageClient({ user }: { user: UserData }) {

  const [profileImage, setProfileImage] = useState(user.profileImage || '');
  const router = useRouter();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(
      setUserProfile({
        name: user.name || '',
        email: user.email || '',
        bio: user.bio || '',
        location: user.location || '',
        locationPreference: user.locationPreference || '',
        phone: user.phone || '',
        profileImage: user.profileImage || '',
        skills: user.skills || [],
        careerGoal: { role: user.careerGoal?.role || '' },
        educationHistory: user.educationHistory || [],
        projects: user.projects || [],
        experience: user.experience || [],
        socialLinks: user.socialLinks || {
          linkedin: '',
          github: '',
          portfolio: '',
          twitter: '',
          instagram: '',
        },
      }),
    );
  }, [dispatch, user]);

  const completeness = useMemo(
    () => computeCompleteness({ ...user, profileImage }),
    [user, profileImage],
  );

  const handleImageChange = async (base64: string) => {
    setProfileImage(base64);
    try {
      await axios.put('/api/user/profile', { profileImage: base64 });
      router.refresh();
    } catch (err: unknown) {
      Swal.fire('Error', handleApiError(err), 'error');
    }
  };

  return (
    <div className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-0 pb-12">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight bg-linear-to-r from-primary via-primary/80 to-secondary bg-clip-text text-transparent">
            Profile & Settings
          </h2>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">
            Manage your profile, skills, and preferences
          </p>
        </div>
        <LogoutButton />
      </div>

      <div className="space-y-6">
        <div
          className="animate-in fade-in slide-in-from-bottom-3 duration-600"
          style={{ animationDelay: '50ms' }}
        >
          <ProfileHero
            name={user.name}
            email={user.email}
            bio={user.bio}
            profileImage={profileImage}
            location={user.location}
            socialLinks={user.socialLinks}
            completeness={completeness}
            onImageChange={handleImageChange}
          />
        </div>

        <div
          className="grid gap-6 grid-cols-1 animate-in fade-in slide-in-from-bottom-3 duration-600"
          style={{ animationDelay: '100ms' }}
        >
          <ProfileInfo
            initialData={{
              name: user.name,
              email: user.email,
              bio: user.bio,
              location: user.location,
              phone: user.phone,
              profileImage: user.profileImage,
              locationPreference: user.locationPreference,
            }}
          />
          <div className="space-y-6">
            <CareerGoalSettings initialRole={user.careerGoal?.role || ''} />
            <SocialLinksManager initialLinks={user.socialLinks} />
          </div>
        </div>

        <div
          className="animate-in fade-in slide-in-from-bottom-3 duration-600"
          style={{ animationDelay: '150ms' }}
        >
          <SkillManager initialSkills={user.skills || []} />
        </div>

        <div
          className="grid gap-6 grid-cols-1 animate-in fade-in slide-in-from-bottom-3 duration-600"
          style={{ animationDelay: '200ms' }}
        >
          <EducationManager initialEducation={user.educationHistory || []} />
          <ExperienceManager initialExperience={user.experience || []} />
        </div>

        <div
          className="animate-in fade-in slide-in-from-bottom-3 duration-600"
          style={{ animationDelay: '250ms' }}
        >
          <ProjectManager initialProjects={user.projects || []} />
        </div>

        <div
          className="grid gap-6 grid-cols-1 sm:grid-cols-2 animate-in fade-in slide-in-from-bottom-3 duration-600"
          style={{ animationDelay: '300ms' }}
        >
          <ChangePassowrd />
          <DangerZone />
        </div>
      </div>
    </div>
  );
}
