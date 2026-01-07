import React from 'react';
import './PsychedelicBackground.css';

const PsychedelicBackground: React.FC = () => {
  return (
    <div className="psychedelic-bg">
      <svg className="svg-filters">
        <defs>
          <filter id="goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8"
              result="goo"
            />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>

      <div className="blob-container">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
        <div className="blob blob-4"></div>
        <div className="blob blob-5"></div>
        <div className="blob blob-6"></div>
      </div>

      <div className="drip-container">
        <div className="drip drip-1"></div>
        <div className="drip drip-2"></div>
        <div className="drip drip-3"></div>
        <div className="drip drip-4"></div>
        <div className="drip drip-5"></div>
      </div>

      <div className="wave-container">
        <div className="wave wave-1"></div>
        <div className="wave wave-2"></div>
        <div className="wave wave-3"></div>
      </div>
    </div>
  );
};

export default PsychedelicBackground;
