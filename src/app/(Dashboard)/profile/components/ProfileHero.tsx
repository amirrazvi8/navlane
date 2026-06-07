'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera, MapPin, Mail } from 'lucide-react';
import { FaLinkedin, FaGithub, FaGlobe, FaXTwitter, FaInstagram } from 'react-icons/fa6';
import { useRef } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { updateProfileImage } from '@/store/userProfileSlice';

interface ProfileHeroProps {
  name: string;
  email: string;
  bio: string;
  profileImage: string;
  location: string;
  socialLinks: {
    linkedin: string;
    github: string;
    portfolio: string;
    twitter: string;
    instagram: string;
  };
  completeness: number;
  onImageChange: (base64: string) => void;
}

export function ProfileHero({
  name,
  email,
  bio,
  profileImage,
  location,
  socialLinks,
  completeness,
  onImageChange,
}: ProfileHeroProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dispatch = useAppDispatch();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        onImageChange(base64);
        dispatch(updateProfileImage(base64));
      };
      reader.readAsDataURL(file);
    }
  };

  console.log('socialLinks in ProfileHero', socialLinks);

  const socialItems = [
    {
      url: socialLinks?.linkedin,
      icon: FaLinkedin,
      label: 'LinkedIn',
      color: 'hover:text-blue-400 hover:bg-blue-500/10',
    },
    {
      url: socialLinks?.github,
      icon: FaGithub,
      label: 'GitHub',
      color: 'hover:text-white hover:bg-white/10',
    },
    {
      url: socialLinks?.portfolio,
      icon: FaGlobe,
      label: 'Portfolio',
      color: 'hover:text-emerald-400 hover:bg-emerald-500/10',
    },
    {
      url: socialLinks?.twitter,
      icon: FaXTwitter,
      label: 'Twitter',
      color: 'hover:text-sky-400 hover:bg-sky-500/10',
    },
    {
      url: socialLinks?.instagram,
      icon: FaInstagram,
      label: 'Instagram',
      color: 'hover:text-pink-400 hover:bg-pink-500/10',
    },
  ].filter((s) => s.url);

  const completenessColor =
    completeness >= 80
      ? 'from-emerald-500 to-emerald-400'
      : completeness >= 50
        ? 'from-amber-500 to-amber-400'
        : 'from-primary to-secondary';

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border/40 bg-card">
      <div className="absolute inset-0 bg-linear-to-br from-primary/15 via-primary/5 to-secondary/10" />
      <div
        className="absolute top-0 right-0 w-80 h-80 bg-primary/8 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 animate-pulse"
        style={{ animationDuration: '4s' }}
      />
      <div
        className="absolute bottom-0 left-0 w-56 h-56 bg-secondary/8 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4 animate-pulse"
        style={{ animationDuration: '6s' }}
      />
      <div className="absolute top-1/2 left-1/2 w-40 h-40 bg-primary/5 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2" />

      <div className="relative z-10 p-5 sm:p-6 md:p-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 sm:gap-6">
          <div className="relative group shrink-0">
            <div className="absolute -inset-1.5 bg-linear-to-br from-primary via-secondary to-primary rounded-full opacity-40 blur-md group-hover:opacity-70 transition-all duration-500" />
            <Avatar className="h-24 w-24 sm:h-28 sm:w-28 md:h-32 md:w-32 relative border-3 border-background shadow-xl shadow-primary/10">
              <AvatarImage
                src={profileImage || '/placeholder-avatar.jpg'}
                alt={name}
                className="object-cover"
              />
              <AvatarFallback className="text-2xl md:text-3xl font-bold bg-linear-to-br from-primary/20 to-secondary/20 text-primary">
                {(name || 'U')[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-1 right-1 bg-primary text-primary-foreground rounded-full p-2 shadow-lg shadow-primary/20 hover:scale-110 hover:shadow-primary/40 transition-all duration-200 cursor-pointer"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileChange}
            />
          </div>

          <div className="flex-1 min-w-0 text-center sm:text-left space-y-3">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight truncate">
                {name || 'Your Name'}
              </h1>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-1.5 mt-2 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 opacity-60" />
                  <span className="truncate max-w-[200px] sm:max-w-none">
                    {email}
                  </span>
                </span>
                {location && (
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 opacity-60" />
                    {location}
                  </span>
                )}
              </div>
            </div>

            {bio && (
              <p className="text-sm text-muted-foreground/80 max-w-xl line-clamp-2 leading-relaxed">
                {bio}
              </p>
            )}

            {socialItems.length > 0 && (
              <div className="flex items-center justify-center sm:justify-start gap-2 pt-0.5">
                {socialItems.map((s) => (
                  <a
                    key={s.label}
                    href={s.url}
                    target="_blank"
                    rel="noreferrer"
                    className={`p-2.5 rounded-xl bg-muted/30 text-muted-foreground border border-transparent hover:border-border/50 ${s.color} transition-all duration-200`}
                    title={s.label}
                  >
                    <s.icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 pt-5 border-t border-border/30">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Profile Completeness
              </span>
            </div>
            <span
              className={`text-sm font-bold tabular-nums ${completeness >= 80 ? 'text-emerald-400' : completeness >= 50 ? 'text-amber-400' : 'text-primary'}`}
            >
              {completeness}%
            </span>
          </div>
          <div className="w-full h-2.5 bg-muted/30 rounded-full overflow-hidden backdrop-blur-sm">
            <div
              className={`h-full rounded-full bg-linear-to-r ${completenessColor} transition-all duration-1000 ease-out shadow-sm`}
              style={{ width: `${completeness}%` }}
            />
          </div>
          {completeness < 100 && (
            <p className="text-xs text-muted-foreground/50 mt-2">
              {completeness < 50
                ? 'Complete your profile to unlock personalized recommendations.'
                : completeness < 80
                  ? 'Almost there! Add more details for better matches.'
                  : 'Great profile! Just a few more things to hit 100%.'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
