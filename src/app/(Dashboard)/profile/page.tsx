import { ChangePassowrd } from "./components/PasswordSetting";
import { CareerGoalSettings } from "./components/CareerGoalSettings";
import { DangerZone } from "./components/DangerZone";
import { ProfileInfo } from "./components/ProfileInfo";
import { SkillManager } from "./components/SkillManager";

export default function ProfilePage() {
    return (
        <div className="flex-1 space-y-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Profile & Settings</h2>
            </div>
            <ProfileInfo />
            <SkillManager />
            <CareerGoalSettings />
            <ChangePassowrd />
            <DangerZone />
        </div>
    );
}
