import React, { useRef, useCallback } from 'react';
import { DrumTrack } from '../types';
import './StepSequencer.css';

// SVG icons for each drum type
const DrumIcons: Record<string, React.FC<{ className?: string }>> = {
  'kick': ({ className }) => (
    <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="3"/>
      <circle cx="32" cy="32" r="18" stroke="currentColor" strokeWidth="2"/>
      <circle cx="32" cy="32" r="8" fill="currentColor"/>
      <path d="M32 4V14M32 50V60M4 32H14M50 32H60" stroke="currentColor" strokeWidth="2"/>
    </svg>
  ),
  'snare': ({ className }) => (
    <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="32" cy="20" rx="26" ry="10" stroke="currentColor" strokeWidth="3"/>
      <path d="M6 20V44C6 50 18 56 32 56C46 56 58 50 58 44V20" stroke="currentColor" strokeWidth="3"/>
      <ellipse cx="32" cy="44" rx="26" ry="10" stroke="currentColor" strokeWidth="2" strokeDasharray="4 2"/>
      <line x1="14" y1="22" x2="14" y2="42" stroke="currentColor" strokeWidth="2"/>
      <line x1="50" y1="22" x2="50" y2="42" stroke="currentColor" strokeWidth="2"/>
    </svg>
  ),
  'hihat-closed': ({ className }) => (
    <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="32" cy="30" rx="28" ry="8" stroke="currentColor" strokeWidth="3"/>
      <ellipse cx="32" cy="34" rx="28" ry="8" stroke="currentColor" strokeWidth="3"/>
      <circle cx="32" cy="32" r="6" fill="currentColor"/>
      <line x1="32" y1="42" x2="32" y2="60" stroke="currentColor" strokeWidth="3"/>
      <line x1="24" y1="58" x2="40" y2="58" stroke="currentColor" strokeWidth="2"/>
    </svg>
  ),
  'hihat-open': ({ className }) => (
    <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="32" cy="24" rx="28" ry="8" stroke="currentColor" strokeWidth="3"/>
      <ellipse cx="32" cy="40" rx="28" ry="8" stroke="currentColor" strokeWidth="3"/>
      <circle cx="32" cy="24" r="5" fill="currentColor"/>
      <circle cx="32" cy="40" r="5" fill="currentColor"/>
      <line x1="32" y1="48" x2="32" y2="60" stroke="currentColor" strokeWidth="3"/>
      <path d="M10 28L10 36M54 28L54 36" stroke="currentColor" strokeWidth="2" strokeDasharray="2 2"/>
    </svg>
  ),
  'clap': ({ className }) => (
    <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 36L24 16C24 14 26 12 28 12C30 12 32 14 32 16V28" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
      <path d="M32 28V12C32 10 34 8 36 8C38 8 40 10 40 12V28" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
      <path d="M40 28V16C40 14 42 12 44 12C46 12 48 14 48 16V32" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
      <path d="M20 36C18 38 16 42 18 48C20 54 28 58 36 56C44 54 50 46 48 38L46 32" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
      <path d="M8 20L12 24M56 20L52 24M32 2V8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  'tom-low': ({ className }) => (
    <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="32" cy="14" rx="26" ry="10" stroke="currentColor" strokeWidth="3"/>
      <path d="M6 14V50C6 56 18 62 32 62C46 62 58 56 58 50V14" stroke="currentColor" strokeWidth="3"/>
      <ellipse cx="32" cy="14" rx="16" ry="6" stroke="currentColor" strokeWidth="2"/>
      <text x="32" y="42" textAnchor="middle" fill="currentColor" fontSize="14" fontWeight="bold">L</text>
    </svg>
  ),
  'tom-mid': ({ className }) => (
    <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="32" cy="16" rx="24" ry="10" stroke="currentColor" strokeWidth="3"/>
      <path d="M8 16V46C8 52 18 58 32 58C46 58 56 52 56 46V16" stroke="currentColor" strokeWidth="3"/>
      <ellipse cx="32" cy="16" rx="14" ry="6" stroke="currentColor" strokeWidth="2"/>
      <text x="32" y="40" textAnchor="middle" fill="currentColor" fontSize="14" fontWeight="bold">M</text>
    </svg>
  ),
  'tom-high': ({ className }) => (
    <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="32" cy="18" rx="22" ry="10" stroke="currentColor" strokeWidth="3"/>
      <path d="M10 18V44C10 50 20 54 32 54C44 54 54 50 54 44V18" stroke="currentColor" strokeWidth="3"/>
      <ellipse cx="32" cy="18" rx="12" ry="5" stroke="currentColor" strokeWidth="2"/>
      <text x="32" y="40" textAnchor="middle" fill="currentColor" fontSize="14" fontWeight="bold">H</text>
    </svg>
  ),
};

interface StepSequencerProps {
  tracks: DrumTrack[];
  currentStep: number;
  selectedTrack: number;
  onStepToggle: (trackIndex: number, stepIndex: number) => void;
  onSelectTrack: (trackIndex: number) => void;
  mode: 'sequencer' | 'pad';
  onPadTrigger: (trackIndex: number, velocity?: number) => void;
}

const StepSequencer: React.FC<StepSequencerProps> = ({
  tracks,
  currentStep,
  selectedTrack,
  onStepToggle,
  onSelectTrack,
  mode,
  onPadTrigger,
}) => {
  const touchedRef = useRef<boolean>(false);

  const handlePadTrigger = useCallback((trackIndex: number, e?: React.TouchEvent) => {
    onSelectTrack(trackIndex);

    // Get velocity from touch force if available, otherwise default
    let velocity = 0.8;
    if (e && e.touches && e.touches[0]) {
      const touch = e.touches[0] as any;
      // Use force if available (Force Touch / 3D Touch)
      if (touch.force && touch.force > 0) {
        velocity = Math.min(1, 0.3 + touch.force * 0.7);
      }
    }

    onPadTrigger(trackIndex, velocity);
  }, [onSelectTrack, onPadTrigger]);

  if (mode === 'pad') {
    return (
      <div className="drum-pads">
        {tracks.map((track, trackIndex) => (
          <button
            key={track.id}
            className={`drum-pad ${trackIndex === selectedTrack ? 'selected' : ''}`}
            onClick={() => {
              // Only trigger on click if not touched (prevents double trigger on mobile)
              if (!touchedRef.current) {
                handlePadTrigger(trackIndex);
              }
              touchedRef.current = false;
            }}
            onTouchStart={(e) => {
              e.preventDefault();
              touchedRef.current = true;
              handlePadTrigger(trackIndex, e);
            }}
            onTouchEnd={() => {
              // Reset after a short delay to allow click to be blocked
              setTimeout(() => {
                touchedRef.current = false;
              }, 100);
            }}
          >
            {DrumIcons[track.soundEngine] && (
              <span className="drum-pad-icon">
                {React.createElement(DrumIcons[track.soundEngine], { className: 'pad-icon-svg' })}
              </span>
            )}
            <span className="drum-pad-name">{track.name}</span>
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="step-sequencer">
      <div className="step-grid">
        {tracks.map((track, trackIndex) => (
          <div
            key={track.id}
            className={`step-row ${trackIndex === selectedTrack ? 'selected' : ''}`}
          >
            <button
              className={`track-label ${trackIndex === selectedTrack ? 'selected' : ''}`}
              onClick={() => onSelectTrack(trackIndex)}
            >
              {track.name}
            </button>
            <div className="step-buttons">
              {track.steps.map((active, stepIndex) => (
                <button
                  key={stepIndex}
                  className={`step-btn ${active ? 'active' : ''} ${
                    stepIndex === currentStep ? 'current' : ''
                  } ${stepIndex % 4 === 0 ? 'beat' : ''}`}
                  onClick={() => onStepToggle(trackIndex, stepIndex)}
                >
                  <div className="step-led" />
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StepSequencer;
