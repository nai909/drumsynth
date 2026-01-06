import React from 'react';
import { DrumTrack } from '../types';
import './StepSequencer.css';

interface StepSequencerProps {
  tracks: DrumTrack[];
  currentStep: number;
  selectedTrack: number;
  onStepToggle: (trackIndex: number, stepIndex: number) => void;
  mode: 'sequencer' | 'pad';
  onPadTrigger: (trackIndex: number) => void;
}

const StepSequencer: React.FC<StepSequencerProps> = ({
  tracks,
  currentStep,
  selectedTrack,
  onStepToggle,
  mode,
  onPadTrigger,
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
          <div
            key={track.id}
            className={`step-row ${trackIndex === selectedTrack ? 'selected' : ''}`}
          >
            {track.steps.map((active, stepIndex) => (
              <button
                key={stepIndex}
                className={`step-btn ${active ? 'active' : ''} ${
                  stepIndex === currentStep ? 'current' : ''
                } ${stepIndex % 4 === 0 ? 'beat' : ''} ${mode === 'pad' ? 'pad-mode' : ''}`}
                onClick={() => {
                  if (mode === 'sequencer') {
                    onStepToggle(trackIndex, stepIndex);
                  } else {
                    onPadTrigger(trackIndex);
                  }
                }}
                onTouchStart={(e) => {
                  if (mode === 'pad') {
                    e.preventDefault();
                    onPadTrigger(trackIndex);
                  }
                }}
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
