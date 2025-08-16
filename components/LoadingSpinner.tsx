
import React from 'react';
import { cn } from '../lib/utils';

interface LoadingSpinnerProps {
    className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ className }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cn("animate-spin text-primary", className)}
        >
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
    );
};

export const CenteredLoader: React.FC = () => (
    <div className="flex justify-center items-center py-12">
        <LoadingSpinner className="h-10 w-10" />
    </div>
);


export default LoadingSpinner;