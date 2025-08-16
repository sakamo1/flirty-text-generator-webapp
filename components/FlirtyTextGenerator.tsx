import React, { useState } from 'react';
import PremiumBadge from './PremiumBadge';
import MessageGenerator from './MessageGenerator';
import ConversationCoach from './ConversationCoach';
import ReadyMadeTexts from './ReadyMadeTexts';
import ProfileAnalyzer from './ProfileAnalyzer';
import DateIdeaGenerator from './DateIdeaGenerator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Card } from './ui/card';
import { Button } from './ui/button';

interface FlirtyTextGeneratorProps {
    onOpenPremiumModal: () => void;
    isPremiumUnlocked: boolean;
}

type ActiveTab = 'generator' | 'inspiration' | 'ideas' | 'coach' | 'analyzer';

const FlirtyTextGenerator: React.FC<FlirtyTextGeneratorProps> = ({ onOpenPremiumModal, isPremiumUnlocked }) => {
    const [activeTab, setActiveTab] = useState<ActiveTab>('generator');

    const handleTabChange = (value: string) => {
        const newTab = value as ActiveTab;
        setActiveTab(newTab);
        if ((newTab === 'coach' || newTab === 'analyzer') && !isPremiumUnlocked) {
            onOpenPremiumModal();
        }
    };

    return (
        <div className="w-full max-w-4xl animate-fade-in">
            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                <TabsList className="grid w-full grid-cols-5 max-w-2xl mx-auto">
                    <TabsTrigger value="generator">Generator</TabsTrigger>
                    <TabsTrigger value="inspiration">Inspiration</TabsTrigger>
                    <TabsTrigger value="ideas">Date Ideas</TabsTrigger>
                    <TabsTrigger value="coach">
                        <div className="flex items-center space-x-2">
                             <span>Coach</span>
                            {!isPremiumUnlocked && <PremiumBadge />}
                        </div>
                    </TabsTrigger>
                    <TabsTrigger value="analyzer">
                        <div className="flex items-center space-x-2">
                             <span>Analyzer</span>
                            {!isPremiumUnlocked && <PremiumBadge />}
                        </div>
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="generator" className="mt-6">
                    <MessageGenerator />
                </TabsContent>
                <TabsContent value="inspiration" className="mt-6">
                    <ReadyMadeTexts />
                </TabsContent>
                 <TabsContent value="ideas" className="mt-6">
                    <DateIdeaGenerator />
                </TabsContent>
                <TabsContent value="coach" className="mt-6">
                    {isPremiumUnlocked ? <ConversationCoach /> : (
                        <Card className="text-center p-8 animate-fade-in">
                            <h3 className="text-lg font-semibold">Premium Feature Locked</h3>
                            <p className="text-muted-foreground mt-2">Unlock the AI Coach to get expert advice on your conversations.</p>
                             <Button onClick={onOpenPremiumModal} className="mt-4">Unlock Coach</Button>
                        </Card>
                    )}
                </TabsContent>
                 <TabsContent value="analyzer" className="mt-6">
                    {isPremiumUnlocked ? <ProfileAnalyzer /> : (
                        <Card className="text-center p-8 animate-fade-in">
                            <h3 className="text-lg font-semibold">Premium Feature Locked</h3>
                            <p className="text-muted-foreground mt-2">Unlock the Profile Analyzer to get an AI-powered review of your dating profile.</p>
                             <Button onClick={onOpenPremiumModal} className="mt-4">Unlock Analyzer</Button>
                        </Card>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default FlirtyTextGenerator;
