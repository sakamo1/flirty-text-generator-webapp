import React, { useState, useCallback } from 'react';
import { generateDateIdeas } from '../services/geminiService';
import { DateIdea } from '../types';
import LoadingSpinner, { CenteredLoader } from './LoadingSpinner';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

const dateVibes = ['Casual ☕', 'Romantic ❤️', 'Adventurous 🧗', 'Unique ✨', 'At-home 🏠'];
const dateBudgets = ['Free 💰', 'Cheap 💵', 'Moderate 💸', 'Splurge 💎'];

const InitialState = () => (
    <div className="text-center p-8 mt-8 border border-dashed border-border rounded-lg animate-fade-in flex flex-col items-center">
        <div className="mb-4 h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 10l.01.01" />
            </svg>
        </div>
        <h3 className="text-lg font-semibold text-foreground mt-2">Looking for the perfect date?</h3>
        <p className="text-muted-foreground mt-1 text-sm max-w-xs">Select a vibe and budget, add some interests, and get creative date ideas in seconds.</p>
    </div>
);

const DateIdeaGenerator: React.FC = () => {
    const [vibe, setVibe] = useState<string>(dateVibes[0]);
    const [budget, setBudget] = useState<string>(dateBudgets[1]);
    const [interests, setInterests] = useState<string>('');
    const [generatedIdeas, setGeneratedIdeas] = useState<DateIdea[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setGeneratedIdeas([]);

        try {
            // Remove emoji from vibe and budget before sending to API
            const cleanVibe = vibe.split(' ')[0];
            const cleanBudget = budget.split(' ')[0];
            const result = await generateDateIdeas(cleanVibe, cleanBudget, interests);
            setGeneratedIdeas(result.ideas);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [vibe, budget, interests]);

    const hasInitialState = !isLoading && !error && generatedIdeas.length === 0;

    return (
        <div className="animate-slide-in-fade">
            <Card>
                <CardHeader>
                    <CardTitle>Date Idea Generator</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label>Choose a Vibe</Label>
                             <div className="flex flex-wrap gap-2">
                            {dateVibes.map((v) => (
                                    <button
                                        key={v}
                                        type="button"
                                        onClick={() => setVibe(v)}
                                        className={`px-3 py-2 rounded-md border-2 transition-all duration-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background
                                        ${v === vibe ? 'bg-primary/20 border-primary' : 'bg-secondary border-secondary hover:border-muted-foreground'}`}
                                    >
                                        {v}
                                    </button>
                                ))}
                            </div>
                        </div>
                        
                        <div className="space-y-2">
                            <Label>Set a Budget</Label>
                            <div className="flex flex-wrap gap-2">
                            {dateBudgets.map((b) => (
                                    <button
                                        key={b}
                                        type="button"
                                        onClick={() => setBudget(b)}
                                        className={`px-3 py-2 rounded-md border-2 transition-all duration-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background
                                        ${b === budget ? 'bg-primary/20 border-primary' : 'bg-secondary border-secondary hover:border-muted-foreground'}`}
                                    >
                                        {b}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="interests">Add shared interests (optional)</Label>
                            <Input
                                id="interests"
                                value={interests}
                                onChange={(e) => setInterests(e.target.value)}
                                placeholder="e.g., loves art, hiking, live music"
                            />
                        </div>
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full text-lg"
                        >
                            {isLoading && <LoadingSpinner className="mr-2 h-5 w-5" />}
                            {isLoading ? 'Generating...' : 'Generate Ideas'}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <div className="mt-8">
                {isLoading && <CenteredLoader />}
                {error && (
                    <Alert variant="destructive">
                        <AlertTitle>Oops! Something went wrong.</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}
                {generatedIdeas.length > 0 && (
                    <div className="space-y-4 animate-fade-in">
                        <h2 className="text-xl font-semibold text-center text-foreground mb-4">Your personalized date ideas:</h2>
                        {generatedIdeas.map((idea, index) => (
                           <Card key={index} className="bg-secondary/50">
                                <CardContent className="p-4">
                                    <h3 className="text-lg font-semibold text-foreground">{idea.emoji} {idea.title}</h3>
                                    <p className="text-muted-foreground mt-1">{idea.description}</p>
                                </CardContent>
                           </Card>
                        ))}
                    </div>
                )}
                 {hasInitialState && <InitialState />}
            </div>
        </div>
    );
};

export default DateIdeaGenerator;
