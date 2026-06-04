export function WelcomeHeader({ name = "Guest" }: { name?: string }) {
    return (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-background border border-primary/10 p-8 shadow-sm">
            {/* Abstract background shapes */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/20 rounded-full blur-3xl opacity-50" />
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl opacity-50" />
            
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-2">
                    <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                        Welcome back, <span className="text-primary">{name}</span>! 👋
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-2xl">
                        Here&apos;s a quick snapshot of your learning journey today. Keep up the great momentum!
                    </p>
                </div>
            </div>
        </div>
    );
}
