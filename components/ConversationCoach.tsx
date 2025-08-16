import React, { useState, useCallback } from 'react';
import { generateConversationReplies, analyzeConversationScreenshot } from '../services/geminiService';
import { CoachReply, ChatReviewResponse } from '../types';
import LoadingSpinner, { CenteredLoader } from './LoadingSpinner';
import CopyButton from './CopyButton';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

const RepliesInitialState = () => (
     <div className="text-center p-8 mt-8 border border-dashed border-border rounded-lg animate-fade-in flex flex-col items-center">
        <div className="mb-4 h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
        </div>
        <h3 className="text-lg font-semibold text-foreground mt-2">Stuck on what to say next?</h3>
        <p className="text-muted-foreground mt-1 text-sm max-w-xs">Enter their last message and get 3 clever, context-aware replies instantly.</p>
    </div>
);

const ReviewInitialState = () => (
     <div className="text-center p-8 mt-8 border border-dashed border-border rounded-lg animate-fade-in flex flex-col items-center">
        <div className="mb-4 h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
           <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
        </div>
        <h3 className="text-lg font-semibold text-foreground mt-2">Improve your chat game</h3>
        <p className="text-muted-foreground mt-1 text-sm max-w-xs">Upload a conversation screenshot and get an expert AI analysis of your messages.</p>
    </div>
);

const UploadIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-muted-foreground mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
);

const RemoveIcon: React.FC = () => (
     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
)

const ConversationCoach: React.FC = () => {
    // State for "Get Replies"
    const [lastMessage, setLastMessage] = useState('');
    const [history, setHistory] = useState('');
    const [replies, setReplies] = useState<CoachReply[]>([]);
    const [isRepliesLoading, setIsRepliesLoading] = useState(false);
    const [repliesError, setRepliesError] = useState<string | null>(null);

    // State for "Review My Chat"
    const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
    const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
    const [userIdentifier, setUserIdentifier] = useState<string>("the blue bubbles");
    const [reviewResult, setReviewResult] = useState<ChatReviewResponse | null>(null);
    const [isReviewLoading, setIsReviewLoading] = useState(false);
    const [reviewError, setReviewError] = useState<string | null>(null);

    const handleRepliesSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        if (!lastMessage.trim()) {
            setRepliesError("Please enter the message you received.");
            return;
        }
        setIsRepliesLoading(true);
        setRepliesError(null);
        setReplies([]);

        try {
            const result = await generateConversationReplies(lastMessage, history);
            setReplies(result.replies);
        } catch (err) {
            setRepliesError(err instanceof Error ? err.message : 'An unknown error occurred.');
            console.error(err);
        } finally {
            setIsRepliesLoading(false);
        }
    }, [lastMessage, history]);
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setScreenshotFile(file);
            setReviewResult(null);
            setReviewError(null);
            const reader = new FileReader();
            reader.onloadend = () => {
                setScreenshotPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const clearScreenshot = useCallback(() => {
        setScreenshotFile(null);
        setScreenshotPreview(null);
        const input = document.getElementById('screenshot-upload') as HTMLInputElement;
        if (input) {
            input.value = '';
        }
    }, []);

    const handleReviewSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        if (!screenshotFile) {
            setReviewError("Please upload a screenshot of your conversation.");
            return;
        }
        if (!userIdentifier.trim()) {
            setReviewError("Please describe your messages (e.g., 'I'm the blue bubbles').");
            return;
        }
        setIsReviewLoading(true);
        setReviewError(null);
        setReviewResult(null);

        try {
            const result = await analyzeConversationScreenshot(screenshotFile, userIdentifier);
            setReviewResult(result);
        } catch (err) {
             setReviewError(err instanceof Error ? err.message : 'An unknown error occurred.');
            console.error(err);
        } finally {
            setIsReviewLoading(false);
        }
    }, [screenshotFile, userIdentifier]);

    const hasRepliesInitialState = !isRepliesLoading && !repliesError && replies.length === 0;
    const hasReviewInitialState = !isReviewLoading && !reviewError && !reviewResult;

    return (
        <div className="animate-slide-in-fade">
            <Tabs defaultValue="replies" className="w-full">
                <TabsList className="grid w-full grid-cols-2 max-w-sm mx-auto">
                    <TabsTrigger value="replies">Get Replies</TabsTrigger>
                    <TabsTrigger value="review">Review My Chat</TabsTrigger>
                </TabsList>

                <TabsContent value="replies" className="mt-6">
                     <Card>
                        <CardHeader>
                            <CardTitle>Get Replies</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleRepliesSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="lastMessage">What was their last message? <span className="text-primary">*</span></Label>
                                    <Textarea
                                        id="lastMessage"
                                        value={lastMessage}
                                        onChange={(e) => setLastMessage(e.target.value)}
                                        placeholder="e.g., Had a great time tonight!"
                                        rows={3}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="history">Add conversation context (optional)</Label>
                                    <Textarea
                                        id="history"
                                        value={history}
                                        onChange={(e) => setHistory(e.target.value)}
                                        placeholder="Paste previous messages for better suggestions..."
                                        rows={4}
                                    />
                                </div>
                                <Button type="submit" disabled={isRepliesLoading} className="w-full text-md">
                                    {isRepliesLoading && <LoadingSpinner className="mr-2 h-5 w-5" />}
                                    {isRepliesLoading ? 'Getting Advice...' : 'Get Replies'}
                                </Button>
                            </form>
                        </CardContent>
                     </Card>
                     <div className="mt-8">
                        {isRepliesLoading && <CenteredLoader />}
                        {repliesError && <Alert variant="destructive"><AlertTitle>Error</AlertTitle><AlertDescription>{repliesError}</AlertDescription></Alert>}
                        {replies.length > 0 && (
                            <div className="space-y-4 animate-fade-in">
                                <h2 className="text-xl font-semibold text-center text-foreground mb-4">Here are a few options:</h2>
                                {replies.map((item, index) => (
                                    <Card key={index} className="bg-secondary/50">
                                        <CardContent className="p-4">
                                            <div className="flex justify-between items-start">
                                                <p className="flex-grow mr-4 text-foreground font-semibold text-lg">“{item.reply}”</p>
                                                <CopyButton textToCopy={item.reply} />
                                            </div>
                                            <p className="text-sm text-muted-foreground mt-2 pt-2 border-t border-border">
                                                <span className="font-bold text-accent">Why it works:</span> {item.explanation}
                                            </p>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                        {hasRepliesInitialState && <RepliesInitialState />}
                    </div>
                </TabsContent>

                <TabsContent value="review" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Review My Chat</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleReviewSubmit} className="space-y-6">
                               <div className="space-y-2">
                                    <Label>Upload a screenshot</Label>
                                    {screenshotPreview ? (
                                        <div className="p-3 bg-secondary border border-border rounded-lg">
                                            <div className="flex items-center space-x-3">
                                                <img src={screenshotPreview} alt="Screenshot preview" className="h-16 w-16 rounded-md object-cover" />
                                                <div className="flex-grow overflow-hidden">
                                                    <p className="text-sm font-semibold text-foreground truncate">{screenshotFile?.name}</p>
                                                    <p className="text-xs text-muted-foreground">{screenshotFile ? `${(screenshotFile.size / 1024).toFixed(1)} KB` : ''}</p>
                                                </div>
                                                <Button type="button" variant="ghost" size="icon" onClick={clearScreenshot} aria-label="Remove image">
                                                    <RemoveIcon />
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <label htmlFor="screenshot-upload" className="w-full cursor-pointer bg-secondary border-2 border-dashed border-border rounded-lg p-6 text-center text-muted-foreground hover:border-primary hover:text-primary transition-colors flex flex-col items-center justify-center">
                                            <UploadIcon />
                                            <span className="text-sm font-semibold">Click to select an image</span>
                                            <span className="text-xs">PNG, JPG, or WEBP</span>
                                        </label>
                                    )}
                                    <input id="screenshot-upload" type="file" className="hidden" accept="image/png, image/jpeg, image/webp" onChange={handleFileChange} />
                               </div>
                                <div className="space-y-2">
                                    <Label htmlFor="userIdentifier">How can we identify YOUR messages?</Label>
                                    <Input
                                        id="userIdentifier"
                                        type="text"
                                        value={userIdentifier}
                                        onChange={(e) => setUserIdentifier(e.target.value)}
                                        placeholder="e.g., I'm the blue bubbles, my messages are on the right"
                                        required
                                    />
                                </div>
                                <Button type="submit" disabled={isReviewLoading || !screenshotFile} className="w-full text-md">
                                    {isReviewLoading && <LoadingSpinner className="mr-2 h-5 w-5" />}
                                    {isReviewLoading ? 'Analyzing...' : 'Review My Chat'}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                     <div className="mt-8">
                        {isReviewLoading && <CenteredLoader />}
                        {reviewError && <Alert variant="destructive"><AlertTitle>Error</AlertTitle><AlertDescription>{reviewError}</AlertDescription></Alert>}
                        {reviewResult && (
                            <div className="space-y-6 animate-fade-in">
                                <Card className="bg-secondary/50">
                                    <CardHeader>
                                        <CardTitle className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">Overall Feedback</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-muted-foreground">{reviewResult.overallFeedback}</p>
                                    </CardContent>
                                </Card>
                                <h2 className="text-xl font-semibold text-center text-foreground mb-4">Message Breakdown</h2>
                                {reviewResult.critiques.map((item, index) => (
                                    <Card key={index} className="bg-secondary/50">
                                        <CardContent className="p-4 space-y-3">
                                            <p className="text-sm text-muted-foreground italic border-l-2 border-border pl-3">Your message: “{item.originalMessage}”</p>
                                            <div>
                                                <p className="text-sm font-semibold text-destructive/80">Critique:</p>
                                                <p className="text-muted-foreground">{item.critique}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-green-400">Suggestion:</p>
                                                <div className="flex justify-between items-start">
                                                    <p className="flex-grow mr-4 text-foreground">“{item.suggestion}”</p>
                                                    <CopyButton textToCopy={item.suggestion} />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                        {hasReviewInitialState && <ReviewInitialState />}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default ConversationCoach;