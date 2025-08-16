import React, { useState } from 'react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import LoadingSpinner from './LoadingSpinner';

interface GatedFeatureModalProps {
    isOpen: boolean;
    onClose: () => void;
    onWatchAd: () => void;
}

const PlayIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
        <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
    </svg>
);


const GatedFeatureModal: React.FC<GatedFeatureModalProps> = ({ isOpen, onClose, onWatchAd }) => {
    const [isWatchingAd, setIsWatchingAd] = useState(false);

    const handleWatchAdClick = () => {
        setIsWatchingAd(true);
        // Simulate a 3-second ad
        setTimeout(() => {
            onWatchAd();
            setIsWatchingAd(false);
        }, 3000);
    };

    const handleOpenChange = (open: boolean) => {
        if (!open && !isWatchingAd) {
            onClose();
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogContent>
                <DialogHeader className="text-center flex flex-col items-center">
                    <div className="text-5xl mb-2">👑</div>
                    <DialogTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                        Unlock Premium Features
                    </DialogTitle>
                    <DialogDescription className="max-w-xs mx-auto">
                        Get expert AI coaching, profile analysis, and more. Access all features for free for your current session.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 pt-4">
                     <Button
                        onClick={handleWatchAdClick}
                        disabled={isWatchingAd}
                        className="w-full text-lg h-14"
                    >
                        {isWatchingAd ? (
                            <>
                                <LoadingSpinner className="mr-2 h-5 w-5" />
                                <span>Unlocking...</span>
                            </>
                        ) : (
                            <>
                                <PlayIcon className="h-5 w-5 mr-2" />
                                <span>Watch Ad to Unlock</span>
                            </>
                        )}
                         
                    </Button>
                    <p className="text-xs text-center text-muted-foreground">
                        Unlocks all premium features for your current session.
                    </p>

                    <div className="relative flex py-2 items-center">
                        <div className="flex-grow border-t border-border"></div>
                        <span className="flex-shrink mx-4 text-muted-foreground text-xs uppercase">Or</span>
                        <div className="flex-grow border-t border-border"></div>
                    </div>

                     <Button
                        disabled
                        variant="secondary"
                        className="w-full h-14"
                    >
                        Upgrade to Premium
                        <span className="ml-2 bg-muted text-muted-foreground text-xs font-bold px-2 py-0.5 rounded-sm">
                            Coming Soon
                        </span>
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default GatedFeatureModal;