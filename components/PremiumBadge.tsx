import React from 'react';

const CrownIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
        <path d="M2 5l2-3 4 4 2-4 2 4 4-4 2 3-8 9-8-9zM2 15h16v2H2v-2z" />
    </svg>
);

const PremiumBadge: React.FC = () => {
    return (
        <div className="text-yellow-400" title="Premium Feature">
            <CrownIcon className="h-3.5 w-3.5" />
        </div>
    );
};

export default PremiumBadge;