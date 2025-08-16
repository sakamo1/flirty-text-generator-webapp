
import React, { useState } from 'react';
import { Button } from './ui/button';

interface CopyButtonProps {
    textToCopy: string;
}

const CopyIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
        <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </svg>
);

const CheckIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <polyline points="20 6 9 17 4 12" />
    </svg>
);


const CopyButton: React.FC<CopyButtonProps> = ({ textToCopy }) => {
    const [isCopied, setIsCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(textToCopy);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

    return (
        <Button
            onClick={handleCopy}
            variant="ghost"
            size="icon"
            aria-label={isCopied ? 'Copied' : 'Copy'}
        >
            {isCopied ? (
                <CheckIcon className="h-5 w-5 text-green-500" />
            ) : (
                <CopyIcon className="h-5 w-5 text-muted-foreground" />
            )}
        </Button>
    );
};

export default CopyButton;