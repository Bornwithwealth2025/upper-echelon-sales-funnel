import React from 'react';

export const Crest: React.FC<{ size?: number; className?: string; tone?: 'default' | 'light' }> = ({
  size = 72,
  className,
  tone = 'default',
}) => (
  <svg width={size} height={size * 0.98} viewBox="0 0 200 196" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="ue-gold" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#F2D989" />
        <stop offset="45%" stopColor="#C9A445" />
        <stop offset="100%" stopColor="#8A6E24" />
      </linearGradient>
      <linearGradient id="ue-gold-crown" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#F6E3A8" />
        <stop offset="100%" stopColor="#B4903C" />
      </linearGradient>
    </defs>
    <path
      d="M38 52 C42 40 46 30 50 20 C56 30 60 38 62 46 C70 32 78 20 86 8 C90 22 92 34 92 44
         C100 30 108 18 100 8 C108 20 112 32 112 44 C120 34 128 22 132 8 C140 20 144 30 150 20
         C154 30 158 40 162 52 Z"
      fill="url(#ue-gold-crown)"
    />
    <circle cx="50" cy="18" r="5.5" fill="url(#ue-gold-crown)" />
    <circle cx="100" cy="7" r="6.5" fill="url(#ue-gold-crown)" />
    <circle cx="150" cy="18" r="5.5" fill="url(#ue-gold-crown)" />
    <rect x="38" y="50" width="124" height="9" rx="1.5" fill="url(#ue-gold-crown)" />
    <text
      x="100"
      y="156"
      textAnchor="middle"
      fontFamily="'Playfair Display','Georgia',serif"
      fontWeight={800}
      fontSize="112"
      fill="url(#ue-gold)"
    >
      U
    </text>
    <text
      x="124"
      y="156"
      textAnchor="middle"
      fontFamily="'Playfair Display','Georgia',serif"
      fontWeight={800}
      fontSize="112"
      fill={tone === 'light' ? '#F6F3EC' : '#0A1628'}
    >
      E
    </text>
    <path d="M76 150 C86 168 108 170 118 156" stroke="url(#ue-gold)" strokeWidth="4" strokeLinecap="round" fill="none" />
  </svg>
);

export const Wordmark: React.FC<{ tone?: 'dark' | 'light'; className?: string }> = ({ tone = 'dark', className }) => {
  const textColor = tone === 'dark' ? 'text-[#0A1628]' : 'text-[#F6F3EC]';
  const lineColor = tone === 'dark' ? 'bg-[#0A1628]/25' : 'bg-[#F6F3EC]/25';
  return (
    <div className={`text-left ${className ?? ''}`}>
      <div className="flex items-center gap-1.5 mb-0.5">
        <span className={`h-px w-4 ${lineColor}`} />
        <span className={`text-[0.55rem] tracking-[0.45em] ${textColor}`}>THE</span>
      </div>
      <div
        className={`text-[1.05rem] leading-none tracking-[0.06em] ${textColor}`}
        style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700 }}
      >
        UPPER ECHELON
      </div>
    </div>
  );
};

export const XMark: React.FC<{ size?: number; className?: string }> = ({ size = 18, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className} fill="none">
    <path d="M3 3 L21 21 M21 3 L3 21" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
  </svg>
);

export const InstagramIcon: React.FC<{ size?: number; className?: string }> = ({ size = 18, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.6" />
    <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.6" />
    <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" />
  </svg>
);

export const LinkedinIcon: React.FC<{ size?: number; className?: string }> = ({ size = 18, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.6" />
    <line x1="7.5" y1="10" x2="7.5" y2="17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <circle cx="7.5" cy="6.8" r="1.1" fill="currentColor" />
    <path d="M11.5 17V10 M11.5 13c0-1.7 1.2-3 3-3s2.5 1.3 2.5 3v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none" />
  </svg>
);

export const YoutubeIcon: React.FC<{ size?: number; className?: string }> = ({ size = 18, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <rect x="2.5" y="5.5" width="19" height="13" rx="4" stroke="currentColor" strokeWidth="1.6" />
    <path d="M10.5 9.5 L15 12 L10.5 14.5 Z" fill="currentColor" />
  </svg>
);