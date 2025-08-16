import React from 'react';
import { Button } from './ui/button';

interface HeaderProps {
    onOpenGatedModal: () => void;
}

const HeartIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
    </svg>
);

const CrownIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
        <path d="M2 5l2-3 4 4 2-4 2 4 4-4 2 3-8 9-8-9zM2 15h16v2H2v-2z" />
    </svg>
);

const Header: React.FC<HeaderProps> = ({ onOpenGatedModal }) => {
  return (
    <header className="bg-transparent pt-4">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
                <HeartIcon />
                <h1 className="text-2xl md:text-3xl font-bold tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                  Flirty AI
                </h1>
            </div>

            <Button onClick={onOpenGatedModal} variant="outline" size="sm">
                <CrownIcon className="h-4 w-4 mr-2 text-yellow-400" />
                Premium
            </Button>
        </div>
    </header>
  );
};

export default Header;