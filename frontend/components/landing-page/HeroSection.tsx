"use client";

import * as React from 'react';
import {
    FloatingIconsHero,
    type FloatingIconsHeroProps,
} from '@/components/landing-page/floating-icon-hero-section';

// --- Legal & Enterprise Company Logo SVG Components ---

// VakilVerify Logo (VV monogram)
const IconVakilVerify = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 6L12 18L20 6" stroke="url(#vv-grad)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M8 6L12 13L16 6" stroke="url(#vv-grad2)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <defs>
            <linearGradient id="vv-grad" x1="4" y1="6" x2="20" y2="18" gradientUnits="userSpaceOnUse">
                <stop stopColor="#8B5CF6" />
                <stop offset="1" stopColor="#D946EF" />
            </linearGradient>
            <linearGradient id="vv-grad2" x1="8" y1="6" x2="12" y2="13" gradientUnits="userSpaceOnUse">
                <stop stopColor="#A78BFA" />
                <stop offset="1" stopColor="#C084FC" />
            </linearGradient>
        </defs>
    </svg>
);

// AWS (Amazon Web Services)
const IconAWS = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6.5 11L8.5 7L10.5 11" stroke="#FF9900" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M7.5 9.5H9.5" stroke="#FF9900" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M12 7L13 11L14 8.5L15 11L16 7" stroke="#FF9900" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M17.5 7.5C17.5 7.5 18.5 7 18.5 8.5C18.5 10 17 10 17 10C17 10 18.5 10 18.5 11.5C18.5 13 17 12.5 17 12.5" stroke="#FF9900" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M3 14C8 17 16 17 21 14" stroke="#FF9900" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M19 15L21 14L20 16" stroke="#FF9900" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

// Microsoft
const IconMicrosoft = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M11.4 2H2v9.4h9.4V2Z" fill="#F25022" />
        <path d="M22 2h-9.4v9.4H22V2Z" fill="#7FBA00" />
        <path d="M11.4 12.6H2V22h9.4V12.6Z" fill="#00A4EF" />
        <path d="M22 12.6h-9.4V22H22V12.6Z" fill="#FFB900" />
    </svg>
);

// Google
const IconGoogle = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M21.9999 12.24C21.9999 11.4933 21.9333 10.76 21.8066 10.0533H12.3333V14.16H17.9533C17.7333 15.3467 17.0133 16.3733 15.9666 17.08V19.68H19.5266C21.1933 18.16 21.9999 15.4533 21.9999 12.24Z" fill="#4285F4" />
        <path d="M12.3333 22C15.2333 22 17.6866 21.0533 19.5266 19.68L15.9666 17.08C15.0199 17.7333 13.7933 18.16 12.3333 18.16C9.52659 18.16 7.14659 16.28 6.27992 13.84H2.59326V16.5133C4.38659 20.0267 8.05992 22 12.3333 22Z" fill="#34A853" />
        <path d="M6.2799 13.84C6.07324 13.2267 5.9599 12.58 5.9599 11.92C5.9599 11.26 6.07324 10.6133 6.2799 10L2.59326 7.32667C1.86659 8.78667 1.45326 10.32 1.45326 11.92C1.45326 13.52 1.86659 15.0533 2.59326 16.5133L6.2799 13.84Z" fill="#FBBC05" />
        <path d="M12.3333 5.68C13.8933 5.68 15.3133 6.22667 16.3866 7.24L19.6 4.02667C17.68 2.29333 15.2266 1.33333 12.3333 1.33333C8.05992 1.33333 4.38659 3.97333 2.59326 7.32667L6.27992 10C7.14659 7.56 9.52659 5.68 12.3333 5.68Z" fill="#EA4335" />
    </svg>
);

// Thomson Reuters
const IconThomsonReuters = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" fill="#FF6600" />
        <path d="M8 8H16V10H13V16H11V10H8V8Z" fill="white" />
    </svg>
);

// LexisNexis (LN)
const IconLexisNexis = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="2" width="20" height="20" rx="4" fill="#CC0000" />
        <path d="M7 7V17H10V7H7Z" fill="white" />
        <path d="M12 7V17L17 7H14.5L12 11.5V7Z" fill="white" />
        <path d="M14.5 17H17V12L14.5 17Z" fill="white" />
    </svg>
);

// DocuSign
const IconDocuSign = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="3" y="3" width="18" height="18" rx="3" fill="#FFCC00" />
        <path d="M7 12C7 12 9 10 12 10C15 10 17 12 17 12" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" />
        <path d="M17 12L15 10" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" />
        <path d="M17 12L15 14" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" />
    </svg>
);

// Salesforce
const IconSalesforce = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 5C7.5 5 5.5 7 5.5 9.5C5.5 9.7 5.52 9.9 5.55 10.1C3.5 10.5 2 12.3 2 14.5C2 17 4 19 6.5 19H18C20.5 19 22.5 17 22.5 14.5C22.5 12.3 20.8 10.5 18.5 10.1C18.5 7.3 16.2 5 13.5 5C12.3 5 11.2 5.4 10.3 6.1C10.2 5.4 10 5 10 5Z" fill="#00A1E0" />
    </svg>
);

// Clio (Legal Practice Management)
const IconClio = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" fill="#1B365D" />
        <path d="M12 6V12L16 14" stroke="#4FC3F7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="12" cy="12" r="2" fill="#4FC3F7" />
    </svg>
);

// Kira Systems (AI Legal)
const IconKira = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="2" width="20" height="20" rx="4" fill="#5C2D91" />
        <path d="M8 7V17M8 12L14 7M8 12L14 17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

// Relativity (eDiscovery)
const IconRelativity = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="2" width="20" height="20" rx="4" fill="#FF6B35" />
        <path d="M8 7H12C14 7 15 8 15 10C15 12 14 13 12 13H8V7Z" stroke="white" strokeWidth="2" />
        <path d="M11 13L15 17" stroke="white" strokeWidth="2" strokeLinecap="round" />
    </svg>
);

// iManage (Document Management)
const IconiManage = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" fill="#0066CC" />
        <rect x="10" y="6" width="4" height="12" rx="2" fill="white" />
    </svg>
);

// NetDocuments
const IconNetDocuments = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="2" width="20" height="20" rx="4" fill="#00B4D8" />
        <path d="M7 8H17M7 12H17M7 16H13" stroke="white" strokeWidth="2" strokeLinecap="round" />
    </svg>
);

// Wolters Kluwer
const IconWoltersKluwer = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="2" width="20" height="20" rx="4" fill="#007A4D" />
        <path d="M6 10L9 16L12 10L15 16L18 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

// Westlaw
const IconWestlaw = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" fill="#8B0000" />
        <path d="M8 9L10 15L12 11L14 15L16 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

// GitHub
const IconGitHub = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} viewBox="0 0 24 24" fill="currentColor" className="text-foreground/80" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
);

// Stripe
const IconStripe = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="2" width="20" height="20" rx="4" fill="#635BFF" />
        <path d="M12 7C9.5 7 8 8 8 9.5C8 12 13 11.5 13 13C13 13.5 12.5 14 11 14C9.5 14 8.5 13.5 8 13M12 7V5M12 17V14M12 7C14 7 16 8 16 10" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
);

// Define the icons with their unique positions
const demoIcons: FloatingIconsHeroProps['icons'] = [
    { id: 1, icon: IconVakilVerify, className: 'top-[8%] left-[8%]' },
    { id: 2, icon: IconAWS, className: 'top-[15%] right-[12%]' },
    { id: 3, icon: IconMicrosoft, className: 'top-[75%] left-[8%]' },
    { id: 4, icon: IconGoogle, className: 'bottom-[15%] right-[8%]' },
    { id: 5, icon: IconThomsonReuters, className: 'top-[5%] left-[30%]' },
    { id: 6, icon: IconLexisNexis, className: 'top-[8%] right-[30%]' },
    { id: 7, icon: IconDocuSign, className: 'bottom-[12%] left-[25%]' },
    { id: 8, icon: IconSalesforce, className: 'top-[38%] left-[12%]' },
    { id: 9, icon: IconClio, className: 'top-[70%] right-[22%]' },
    { id: 10, icon: IconKira, className: 'top-[85%] left-[65%]' },
    { id: 11, icon: IconRelativity, className: 'top-[48%] right-[6%]' },
    { id: 12, icon: IconiManage, className: 'top-[55%] left-[5%]' },
    { id: 13, icon: IconNetDocuments, className: 'top-[5%] left-[55%]' },
    { id: 14, icon: IconWoltersKluwer, className: 'bottom-[8%] right-[42%]' },
    { id: 15, icon: IconWestlaw, className: 'top-[28%] right-[18%]' },
    { id: 16, icon: IconGitHub, className: 'top-[62%] left-[30%]' },
];

export default function HeroSection() {
    return (
        <FloatingIconsHero
            title="Vakil.ai"
            subtitle="Legal AI Auditor — High-precision contract analysis for Indian legal frameworks. Powered by AWS Textract & Bedrock. Upload a PDF to visualize clause-level risks, redline heatmaps, and AI-generated safe counter-clauses."
            ctaText="Analyze a Contract"
            ctaHref="/upload"
            icons={demoIcons}
        />
    );
}
