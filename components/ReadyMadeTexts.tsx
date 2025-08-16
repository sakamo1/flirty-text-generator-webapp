import React, { useState, useCallback } from 'react';
import CopyButton from './CopyButton';
import { generateInspirationTexts } from '../services/geminiService';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import LoadingSpinner from './LoadingSpinner';
import { Alert, AlertDescription } from './ui/alert';

interface Category {
    title: string;
    texts: string[];
}

const initialTexts: Category[] = [
    {
        title: "Ice Breakers & Openers",
        texts: [
            "Are you a magician? Because whenever I look at you, everyone else disappears.",
            "I'm not a photographer, but I can definitely picture us together.",
            "My phone must be broken, because it's missing your number.",
            "Besides being gorgeous, what do you do for a living?",
        ]
    },
    {
        title: "Playful & Witty",
        texts: [
            "If you were a vegetable, you’d be a cute-cumber.",
            "I'm currently accepting applications for a partner in crime. You interested?",
            "Are you a parking ticket? Because you’ve got FINE written all over you.",
            "I'm pretty sure my happiness is spelled Y-O-U."
        ]
    },
    {
        title: "Deep & Romantic",
        texts: [
            "Just so you know, you're the reason I'm smiling at my phone right now.",
            "I was having an off day, but then I thought of you and it all got better.",
            "You have this incredible way of making my heart happy.",
            "Seeing your name pop up on my phone is the best part of my day.",
        ]
    },
    {
        title: "Late Night Thoughts",
        texts: [
            "Can't sleep. Too busy thinking about you.",
            "My bed is way too big for just one person... just saying.",
            "Hope you're having a good night. You're definitely starring in my dreams.",
            "Wish you were here to steal my blankets."
        ]
    }
];

const ReadyMadeTexts: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>(initialTexts);
    const [loadingCategory, setLoadingCategory] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleLoadMore = useCallback(async (categoryTitle: string) => {
        setLoadingCategory(categoryTitle);
        setError(null);
        
        const category = categories.find(c => c.title === categoryTitle);
        if (!category) return;

        try {
            const newTexts = await generateInspirationTexts(category.title, category.texts);
            setCategories(prevCategories => 
                prevCategories.map(c => 
                    c.title === categoryTitle 
                        ? { ...c, texts: [...c.texts, ...newTexts] } 
                        : c
                )
            );
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setLoadingCategory(null);
        }
    }, [categories]);

    return (
        <div className="animate-fade-in space-y-8">
            {error && (
                 <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}
            {categories.map((category) => (
                <Card key={category.title} className="bg-secondary/50">
                    <CardHeader>
                        <CardTitle className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                            {category.title}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {category.texts.map((text, index) => (
                             <div key={index} className="bg-background/50 p-3 rounded-md flex justify-between items-center border border-border">
                                <p className="flex-grow mr-4 text-foreground">{text}</p>
                                <CopyButton textToCopy={text} />
                            </div>
                        ))}
                         <div className="pt-4 flex justify-center">
                            <Button
                                variant="outline"
                                onClick={() => handleLoadMore(category.title)}
                                disabled={loadingCategory === category.title}
                            >
                                {loadingCategory === category.title ? (
                                    <>
                                        <LoadingSpinner className="mr-2 h-4 w-4" />
                                        Generating...
                                    </>
                                ) : (
                                    'Show Me More'
                                )}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

export default ReadyMadeTexts;