import React, { useState, useCallback } from 'react';
import { generateProfileAnalysis } from '../services/geminiService';
import { ProfileAnalysisResponse } from '../types';
import LoadingSpinner, { CenteredLoader } from './LoadingSpinner';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

const UploadIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
);
const RemoveIcon: React.FC = () => (
     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
);

const InitialState = () => (
    <div className="text-center p-8 mt-8 border border-dashed border-border rounded-lg animate-fade-in flex flex-col items-center">
       <div className="mb-4 h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
       </div>
       <h3 className="text-lg font-semibold text-foreground mt-2">Is Your Profile Ready?</h3>
       <p className="text-muted-foreground mt-1 text-sm max-w-xs">Upload your profile pictures and bio to get an expert AI analysis and actionable tips.</p>
   </div>
);


const ProfileAnalyzer: React.FC = () => {
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [bio, setBio] = useState('');
    const [goals, setGoals] = useState('a serious relationship');
    const [analysisResult, setAnalysisResult] = useState<ProfileAnalysisResponse | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            const newFiles = Array.from(files);
            if (imageFiles.length + newFiles.length > 6) {
                setError("You can upload a maximum of 6 photos.");
                return;
            }
            const currentFiles = [...imageFiles, ...newFiles];
            setImageFiles(currentFiles);

            const filePromises = newFiles.map(file => {
                return new Promise<string>((resolve) => {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        resolve(reader.result as string);
                    };
                    reader.readAsDataURL(file);
                });
            });

            Promise.all(filePromises).then(newPreviews => {
                setImagePreviews(prev => [...prev, ...newPreviews]);
            });
        }
    };

    const removeImage = useCallback((index: number) => {
        setImageFiles(prev => prev.filter((_, i) => i !== index));
        setImagePreviews(prev => prev.filter((_, i) => i !== index));
    }, []);

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        if (imageFiles.length === 0) {
            setError("Please upload at least one screenshot of your profile.");
            return;
        }
        setIsLoading(true);
        setError(null);
        setAnalysisResult(null);

        try {
            const result = await generateProfileAnalysis(imageFiles, bio, goals);
            setAnalysisResult(result);
        } catch (err) {
             setError(err instanceof Error ? err.message : 'An unknown error occurred.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [imageFiles, bio, goals]);

    const hasInitialState = !isLoading && !error && !analysisResult;

    return (
        <div className="animate-slide-in-fade">
            <Card>
                <CardHeader>
                    <CardTitle>Profile Analyzer</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label>Upload profile pictures (max 6)</Label>
                            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                                {imagePreviews.map((preview, index) => (
                                    <div key={index} className="relative aspect-square">
                                        <img src={preview} alt={`Preview ${index + 1}`} className="w-full h-full object-cover rounded-md" />
                                        <button type="button" onClick={() => removeImage(index)} className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full p-0.5" aria-label="Remove image">
                                            <RemoveIcon />
                                        </button>
                                    </div>
                                ))}
                                {imageFiles.length < 6 && (
                                     <label htmlFor="photos-upload" className="w-full aspect-square cursor-pointer bg-secondary border-2 border-dashed border-border rounded-lg text-center text-muted-foreground hover:border-primary hover:text-primary transition-colors flex flex-col items-center justify-center">
                                        <UploadIcon className="h-8 w-8 text-muted-foreground mb-1" />
                                        <span className="text-xs">Add</span>
                                    </label>
                                )}
                            </div>
                            <input id="photos-upload" type="file" className="hidden" accept="image/png, image/jpeg, image/webp" onChange={handleFileChange} multiple />
                        </div>

                         <div className="space-y-2">
                            <Label htmlFor="bio">Your Profile Bio (optional)</Label>
                            <Textarea
                                id="bio"
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                placeholder="Paste your bio here..."
                                rows={4}
                            />
                        </div>
                        
                        <div className="space-y-2">
                            <Label htmlFor="goals">What are you looking for?</Label>
                            <Input
                                id="goals"
                                type="text"
                                value={goals}
                                onChange={(e) => setGoals(e.target.value)}
                                placeholder="e.g., something casual, new friends, a long-term partner"
                                required
                            />
                        </div>
                        <Button type="submit" disabled={isLoading || imageFiles.length === 0} className="w-full text-md">
                            {isLoading && <LoadingSpinner className="mr-2 h-5 w-5" />}
                            {isLoading ? 'Analyzing...' : 'Analyze My Profile'}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <div className="mt-8">
                {isLoading && <CenteredLoader />}
                {error && <Alert variant="destructive"><AlertTitle>Error</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>}
                {analysisResult && (
                     <div className="space-y-6 animate-fade-in">
                        <Card className="bg-secondary/50">
                            <CardHeader>
                                <CardTitle className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">Overall Feedback</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground whitespace-pre-wrap">{analysisResult.overallFeedback}</p>
                            </CardContent>
                        </Card>
                        
                        <h2 className="text-xl font-semibold text-center text-foreground pt-4">Photo Breakdown</h2>
                        {analysisResult.photoAnalysis.map((item, index) => (
                            <Card key={index} className="bg-secondary/50">
                                <CardHeader>
                                    <CardTitle className="text-lg">Photo: {item.photoDescription}</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div>
                                        <p className="text-sm font-semibold text-destructive/80">Critique:</p>
                                        <p className="text-muted-foreground">{item.critique}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-green-400">Suggestion:</p>
                                        <p className="text-foreground">{item.suggestion}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}

                        <h2 className="text-xl font-semibold text-center text-foreground pt-4">Bio Breakdown</h2>
                         <Card className="bg-secondary/50">
                             <CardHeader>
                                 <CardTitle className="text-lg">Bio Analysis</CardTitle>
                             </CardHeader>
                            <CardContent className="space-y-3">
                                <div>
                                    <p className="text-sm font-semibold text-destructive/80">Critique:</p>
                                    <p className="text-muted-foreground">{analysisResult.bioAnalysis.critique}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-green-400">Suggestion:</p>
                                    <p className="text-foreground whitespace-pre-wrap">“{analysisResult.bioAnalysis.suggestion}”</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}
                {hasInitialState && <InitialState />}
            </div>
        </div>
    );
};

export default ProfileAnalyzer;
