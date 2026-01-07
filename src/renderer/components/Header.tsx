import React from 'react';
import './Header.css';

const PsychedelicSmiley: React.FC = () => (
  <svg className="psychedelic-smiley" viewBox="0 0 64 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="meltGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="var(--accent-primary)">
          <animate attributeName="stop-color" values="var(--accent-primary);var(--accent-secondary);var(--trigger-primary);var(--accent-primary)" dur="4s" repeatCount="indefinite" />
        </stop>
        <stop offset="50%" stopColor="var(--accent-secondary)">
          <animate attributeName="stop-color" values="var(--accent-secondary);var(--trigger-primary);var(--accent-primary);var(--accent-secondary)" dur="4s" repeatCount="indefinite" />
        </stop>
        <stop offset="100%" stopColor="var(--trigger-primary)">
          <animate attributeName="stop-color" values="var(--trigger-primary);var(--accent-primary);var(--accent-secondary);var(--trigger-primary)" dur="4s" repeatCount="indefinite" />
        </stop>
      </linearGradient>
      <filter id="smileyGlow">
        <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>

    {/* Melting face blob with drips */}
    <path
      d="M32 4
         C14 4 4 16 4 32
         C4 44 10 52 14 56
         L14 66 C14 70 12 74 12 74 C12 78 16 78 16 74 L16 62
         C18 64 22 66 24 68
         L24 72 C24 76 22 80 22 80 C22 84 26 84 26 80 L26 70
         C28 71 30 71 32 71
         C34 71 36 71 38 70
         L38 76 C38 80 36 84 36 84 C36 88 40 88 40 80 L40 68
         C42 66 46 64 48 62
         L48 70 C48 74 46 78 46 78 C46 82 50 82 50 78 L50 58
         C54 54 60 46 60 32
         C60 16 50 4 32 4Z"
      fill="url(#meltGradient)"
      filter="url(#smileyGlow)"
    >
      <animate
        attributeName="d"
        values="M32 4 C14 4 4 16 4 32 C4 44 10 52 14 56 L14 66 C14 70 12 74 12 74 C12 78 16 78 16 74 L16 62 C18 64 22 66 24 68 L24 72 C24 76 22 80 22 80 C22 84 26 84 26 80 L26 70 C28 71 30 71 32 71 C34 71 36 71 38 70 L38 76 C38 80 36 84 36 84 C36 88 40 88 40 80 L40 68 C42 66 46 64 48 62 L48 70 C48 74 46 78 46 78 C46 82 50 82 50 78 L50 58 C54 54 60 46 60 32 C60 16 50 4 32 4Z;
               M32 4 C14 4 4 16 4 32 C4 44 10 52 14 56 L14 68 C14 72 12 76 12 76 C12 80 16 80 16 76 L16 62 C18 64 22 66 24 68 L24 74 C24 78 22 82 22 82 C22 86 26 86 26 82 L26 70 C28 71 30 71 32 71 C34 71 36 71 38 70 L38 74 C38 78 36 82 36 82 C36 86 40 86 40 82 L40 68 C42 66 46 64 48 62 L48 68 C48 72 46 76 46 76 C46 80 50 80 50 76 L50 58 C54 54 60 46 60 32 C60 16 50 4 32 4Z;
               M32 4 C14 4 4 16 4 32 C4 44 10 52 14 56 L14 66 C14 70 12 74 12 74 C12 78 16 78 16 74 L16 62 C18 64 22 66 24 68 L24 72 C24 76 22 80 22 80 C22 84 26 84 26 80 L26 70 C28 71 30 71 32 71 C34 71 36 71 38 70 L38 76 C38 80 36 84 36 84 C36 88 40 88 40 80 L40 68 C42 66 46 64 48 62 L48 70 C48 74 46 78 46 78 C46 82 50 82 50 78 L50 58 C54 54 60 46 60 32 C60 16 50 4 32 4Z"
        dur="3s"
        repeatCount="indefinite"
      />
    </path>

    {/* Left eye - dripping */}
    <ellipse cx="20" cy="28" rx="5" ry="8" fill="#1a1a1a">
      <animate attributeName="ry" values="8;10;8" dur="2s" repeatCount="indefinite"/>
    </ellipse>

    {/* Right eye - dripping */}
    <ellipse cx="44" cy="28" rx="5" ry="8" fill="#1a1a1a">
      <animate attributeName="ry" values="8;10;8" dur="2s" repeatCount="indefinite" begin="0.3s"/>
    </ellipse>

    {/* Wavy smile */}
    <path
      d="M16 44 Q24 54, 32 52 Q40 50, 48 44"
      stroke="#1a1a1a"
      strokeWidth="4"
      fill="none"
      strokeLinecap="round"
    >
      <animate
        attributeName="d"
        values="M16 44 Q24 54, 32 52 Q40 50, 48 44;M16 46 Q24 56, 32 54 Q40 52, 48 46;M16 44 Q24 54, 32 52 Q40 50, 48 44"
        dur="2.5s"
        repeatCount="indefinite"
      />
    </path>
  </svg>
);

const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <PsychedelicSmiley />
          <div className="logo-text">IZ DRUM MACHINE</div>
        </div>
      </div>
    </header>
  );
};

export default Header;
