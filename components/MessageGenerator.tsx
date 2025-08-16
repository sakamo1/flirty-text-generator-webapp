import React, { useState, useCallback, useEffect } from 'react';
import { generateFlirtyTexts } from '../services/geminiService';
import { Vibe } from '../types';
import LoadingSpinner, { CenteredLoader } from './LoadingSpinner';
import CopyButton from './CopyButton';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

const vibeEmojis: Record<Vibe, string> = {
    [Vibe.Playful]: '😜',
    [Vibe.Romantic]: '🥰',
    [Vibe.Bold]: '🔥',
    [Vibe.Witty]: '😏',
    [Vibe.Mysterious]: '🤫',
    [Vibe.Sweet]: '😊',
    [Vibe.Poetic]: '✍️',
    [Vibe.Sexual]: '😈',
};

const InitialState = () => (
    <div className="text-center p-8 mt-8 border border-dashed border-border rounded-lg animate-fade-in flex flex-col items-center">
        <div className="mb-4 h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                 <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v11.494m-9-5.747h18" />
            </svg>
        </div>
        <h3 className="text-lg font-semibold text-foreground mt-2">Ready to Charm?</h3>
        <p className="text-muted-foreground mt-1 text-sm max-w-xs">Fill out the form and let our AI work its magic to craft the perfect message for you!</p>
    </div>
);


const MessageGenerator: React.FC = () => {
    const [recipient, setRecipient] = useState<string>(() => localStorage.getItem('mg-recipient') || 'my crush');
    const [vibe, setVibe] = useState<Vibe>(() => (localStorage.getItem('mg-vibe') as Vibe) || Vibe.Playful);
    const [context, setContext] = useState<string>(() => localStorage.getItem('mg-context') || '');
    const [generatedTexts, setGeneratedTexts] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    
    useEffect(() => {
        localStorage.setItem('mg-recipient', recipient);
    }, [recipient]);
    
    useEffect(() => {
        localStorage.setItem('mg-vibe', vibe);
    }, [vibe]);

    useEffect(() => {
        localStorage.setItem('mg-context', context);
    }, [context]);

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setGeneratedTexts([]);

        try {
            const texts = await generateFlirtyTexts(recipient, vibe, context);
            setGeneratedTexts(texts);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [recipient, vibe, context]);

    const hasInitialState = !isLoading && !error && generatedTexts.length === 0;

    return (
        <div className="animate-slide-in-fade">
            <Card>
                <CardHeader>
                    <CardTitle>Message Generator</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="recipient">Who is this for?</Label>
                            <Input
                                id="recipient"
                                type="text"
                                value={recipient}
                                onChange={(e) => setRecipient(e.target.value)}
                                placeholder="e.g., my partner, someone I just met"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Choose a Vibe</Label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                            {Object.values(Vibe).map((v) => (
                                    <button
                                        key={v}
                                        type="button"
                                        onClick={() => setVibe(v)}
                                        className={`p-3 rounded-md border-2 transition-all duration-200 flex flex-col items-center justify-center space-y-2 text-sm capitalize font-semibold focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background
                                        ${v === vibe ? 'bg-primary/20 border-primary' : 'bg-secondary border-secondary hover:border-muted-foreground'}`}
                                    >
                                        <span className="text-xl">{vibeEmojis[v]}</span>
                                        <span>{v}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="context">Add some context (optional)</Label>
                            <Textarea
                                id="context"
                                value={context}
                                onChange={(e) => setContext(e.target.value)}
                                placeholder="e.g., we just had a great date, it's their birthday"
                                rows={3}
                            />
                        </div>
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full text-lg"
                        >
                            {isLoading && <LoadingSpinner className="mr-2 h-5 w-5" />}
                            {isLoading ? 'Generating...' : 'Generate Messages'}
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
                {generatedTexts.length > 0 && (
                    <div className="space-y-4 animate-fade-in">
                        <h2 className="text-xl font-semibold text-center text-foreground mb-4">Your personalized messages:</h2>
                        {generatedTexts.map((text, index) => (
                           <Card key={index} className="bg-secondary/50">
                                <CardContent className="p-4 flex justify-between items-center">
                                    <p className="flex-grow mr-4 text-foreground">{text}</p>
                                    <CopyButton textToCopy={text} />
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

export default MessageGenerator;