'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Wrench } from 'lucide-react';
import { useAppDispatch } from '@/store/hooks';
import { updateSkills } from '@/store/userProfileSlice';
import axios from 'axios';
import { handleApiError } from '@/lib/axios';

interface Skill {
  name: string;
}

export function SkillManager({
  initialSkills = [],
}: {
  initialSkills?: Skill[];
}) {
  const [skills, setSkills] = useState<Skill[]>(initialSkills);
  const [newSkill, setNewSkill] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();

  const updateSkillsInDB = async (updatedSkills: Skill[]) => {
    setLoading(true);
    try {
      await axios.put('/api/user/profile', { skills: updatedSkills });
      setSkills(updatedSkills);

      // Sync to Redux global state
      dispatch(updateSkills(updatedSkills));

      router.refresh();
    } catch (error) {
      Swal.fire('Error', handleApiError(error), 'error');
    } finally {
      setLoading(false);
    }
  };

  const addSkill = () => {
    if (
      newSkill &&
      !skills.find((s) => s.name.toLowerCase() === newSkill.toLowerCase())
    ) {
      updateSkillsInDB([...skills, { name: newSkill }]);
      setNewSkill('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    }
  };

  const removeSkill = (skillName: string) => {
    updateSkillsInDB(skills.filter((s) => s.name !== skillName));
  };

  return (
    <Card className="border-border/40 bg-card/80 backdrop-blur-sm hover:border-border/60 transition-colors duration-300">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2.5 text-lg">
          <div className="p-2 rounded-xl bg-linear-to-br from-emerald-500/15 to-emerald-500/5 border border-emerald-500/10">
            <Wrench className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="flex items-center gap-3">
            Skills & Expertise
            {skills.length > 0 && (
              <span className="text-xs font-normal text-muted-foreground bg-muted/30 px-2 py-0.5 rounded-full">
                {skills.length}
              </span>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="flex flex-col sm:flex-row gap-2">
          <Input
            placeholder="Add a skill..."
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-muted/20 border-border/40 focus:bg-background focus:border-primary/40 transition-all duration-200 h-10"
            disabled={loading}
          />
        </div>

        {skills.length > 0 ? (
          <div className="flex flex-wrap gap-2 items-center">
            {skills.map((skill) => (
              <Badge
                key={skill.name}
                variant="outline"
                className="pl-3 pr-1.5 py-1.5 flex items-center gap-2 text-sm border transition-all duration-200 bg-primary-foreground"
              >
                <span
                  className="w-1.5 h-1.5 rounded-full bg-primary"
                />
                <span className="font-medium text-primary">{skill.name}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5 hover:bg-transparent hover:text-destructive ml-0.5 transition-colors"
                  onClick={() => removeSkill(skill.name)}
                  disabled={loading}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 space-y-2">
            <div className="w-12 h-12 mx-auto rounded-xl bg-muted/20 flex items-center justify-center">
              <Wrench className="h-5 w-5 text-muted-foreground/40" />
            </div>
            <p className="text-sm text-muted-foreground/50">
              No skills added yet. Start typing above to add your skills.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
