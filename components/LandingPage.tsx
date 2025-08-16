import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface LandingPageProps {
    onGetStarted: () => void;
}

const MessageSquareIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
);
const BrainCircuitIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a2.5 2.5 0 0 1 2.5 2.5v1.5a2.5 2.5 0 0 1-5 0v-1.5A2.5 2.5 0 0 1 12 2zM2.5 13a2.5 2.5 0 0 0 0 5h.5a2.5 2.5 0 0 0 5 0h.5a2.5 2.5 0 0 0 5 0h.5a2.5 2.5 0 0 0 5 0h.5a2.5 2.5 0 0 0 0-5zM12 13v-1.5a2.5 2.5 0 0 0-5 0V13a2.5 2.5 0 0 0 5 0z" />
        <path d="M21.5 13v-1.5a2.5 2.5 0 0 0-5 0V13a2.5 2.5 0 0 0 5 0z" />
    </svg>
);
const SparklesIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L9.5 9.5 2 12l7.5 2.5L12 22l2.5-7.5L22 12l-7.5-2.5L12 2z" />
    </svg>
);

const UserCheckIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <polyline points="16 11 18 13 22 9" />
    </svg>
);

const CalendarHeartIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="16" y1="2" x2="16" y2="6"></line>
        <line x1="8" y1="2" x2="8" y2="6"></line>
        <line x1="3" y1="10" x2="21" y2="10"></line>
        <path d="M12 16.5l-1.4-1.4a2 2 0 0 1 2.8-2.8l.6.6.6-.6a2 2 0 0 1 2.8 2.8L12 16.5z"/>
    </svg>
);


const FeatureCard: React.FC<{ title: string; description: string; icon: React.ReactNode }> = ({ title, description, icon }) => (
    <Card className="bg-secondary/50 border-primary/20 text-center animate-fade-in">
        <CardHeader className="flex flex-col items-center">
             <div className="mb-4 h-12 w-12 rounded-lg bg-primary/20 flex items-center justify-center">
                {icon}
            </div>
            <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
            <p className="text-muted-foreground">{description}</p>
        </CardContent>
    </Card>
);

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
    return (
        <div className="w-full max-w-5xl animate-fade-in text-center">
            {/* Hero Section */}
            <section className="py-16 md:py-24">
                <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
                    Never Be Lost for Words Again
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                   Unleash your inner charmer. Get instant, AI-powered flirty texts, conversation coaching, and chat analysis to ignite the spark.
                </p>
                <Button onClick={onGetStarted} size="lg" className="text-lg">
                    Get Started for Free
                </Button>
            </section>
            
            {/* Features Section */}
            <section className="py-16">
                <h2 className="text-3xl font-bold mb-10">All The Tools You Need To Shine</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <FeatureCard 
                        title="Message Generator"
                        description="Craft the perfect message for any vibe. Get unique, creative texts in seconds."
                        icon={<MessageSquareIcon className="h-6 w-6 text-primary" />}
                    />
                     <FeatureCard 
                        title="Inspiration"
                        description="Browse categories of proven, ready-to-use texts for any situation."
                        icon={<SparklesIcon className="h-6 w-6 text-primary" />}
                    />
                     <FeatureCard 
                        title="Date Idea Generator"
                        description="Never have a boring date again. Get creative ideas for any vibe or budget."
                        icon={<CalendarHeartIcon className="h-6 w-6 text-primary" />}
                    />
                     <FeatureCard 
                        title="AI Conversation Coach"
                        description="Stuck on a reply? Get context-aware suggestions to keep the chat flowing."
                        icon={<BrainCircuitIcon className="h-6 w-6 text-primary" />}
                    />
                     <FeatureCard 
                        title="Profile Analyzer"
                        description="Get expert AI feedback on your dating profile pictures and bio to make a better impression."
                        icon={<UserCheckIcon className="h-6 w-6 text-primary" />}
                    />
                </div>
            </section>

             {/* Final CTA */}
            <section className="py-16">
                 <h2 className="text-3xl font-bold mb-4">Ready to Ignite the Spark?</h2>
                 <p className="text-muted-foreground mb-8">Stop guessing and start charming. Your next great conversation is one click away.</p>
                 <Button onClick={onGetStarted} size="lg" className="text-lg">
                    Start Charming
                </Button>
            </section>
        </div>
    );
};

export default LandingPage;
