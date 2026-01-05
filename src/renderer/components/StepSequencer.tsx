import React from 'react';
import { DrumTrack } from '../types';
import './StepSequencer.css';

interface StepSequencerProps {
  tracks: DrumTrack[];
  currentStep: number;
  onStepToggle: (trackIndex: number, stepIndex: number) => void;
}

const StepSequencer: React.FC<StepSequencerProps> = ({
  tracks,
  currentStep,
  onStepToggle,
}) => {
  return (
    <div className="step-sequencer">
      <div className="step-sequencer-header">
        <div className="step-numbers">
          {Array.from({ length: 16 }, (_, i) => (
            <div key={i} className="step-number">
              {i + 1}
            </div>
          ))}
        </div>
      </div>
      <div className="step-grid">
        {tracks.map((track, trackIndex) => (
          <div key={track.id} className="step-row">
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
        ))}
      </div>
    </div>
  );
};

export default StepSequencer;
