import React from 'react';
import { DrumTrack } from '../types';
import './TrackParams.css';

interface TrackParamsProps {
  track: DrumTrack;
  onParamChange: (param: keyof DrumTrack, value: number) => void;
}

const TrackParams: React.FC<TrackParamsProps> = ({ track, onParamChange }) => {
  const handleChange = (param: keyof DrumTrack, value: number) => {
    onParamChange(param, value);
  };

  return (
    <div className="track-params">
      <div className="track-params-header">
        <h3 className="track-params-title">{track.name}</h3>
        <div className="track-params-type">{track.type.toUpperCase()}</div>
      </div>

      <div className="params-grid">
        <div className="param-row">
          <div className="param-control">
            <label className="param-label">TUNE</label>
            <input
              type="range"
              min="-1"
              max="1"
              step="0.01"
              value={track.tune}
              onChange={(e) => handleChange('tune', parseFloat(e.target.value))}
              className="param-slider"
            />
            <div className="param-value">{(track.tune * 100).toFixed(0)}</div>
          </div>

          <div className="param-control">
            <label className="param-label">DECAY</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={track.decay}
              onChange={(e) => handleChange('decay', parseFloat(e.target.value))}
              className="param-slider"
            />
            <div className="param-value">{(track.decay * 100).toFixed(0)}</div>
          </div>

          <div className="param-control">
            <label className="param-label">ATTACK</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={track.attack}
              onChange={(e) => handleChange('attack', parseFloat(e.target.value))}
              className="param-slider"
            />
            <div className="param-value">{(track.attack * 100).toFixed(0)}</div>
          </div>
        </div>

        <div className="param-row">
          <div className="param-control">
            <label className="param-label">TONE</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={track.tone}
              onChange={(e) => handleChange('tone', parseFloat(e.target.value))}
              className="param-slider"
            />
            <div className="param-value">{(track.tone * 100).toFixed(0)}</div>
          </div>

          <div className="param-control">
            <label className="param-label">SNAP</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={track.snap}
              onChange={(e) => handleChange('snap', parseFloat(e.target.value))}
              className="param-slider"
            />
            <div className="param-value">{(track.snap * 100).toFixed(0)}</div>
          </div>

          <div className="param-control">
            <label className="param-label">LEVEL</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={track.volume}
              onChange={(e) => handleChange('volume', parseFloat(e.target.value))}
              className="param-slider"
            />
            <div className="param-value">{(track.volume * 100).toFixed(0)}</div>
          </div>
        </div>

        <div className="param-row">
          <div className="param-control">
            <label className="param-label">FILTER</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={track.filterCutoff}
              onChange={(e) => handleChange('filterCutoff', parseFloat(e.target.value))}
              className="param-slider"
            />
            <div className="param-value">{(track.filterCutoff * 100).toFixed(0)}</div>
          </div>

          <div className="param-control">
            <label className="param-label">RESO</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={track.filterResonance}
              onChange={(e) => handleChange('filterResonance', parseFloat(e.target.value))}
              className="param-slider"
            />
            <div className="param-value">{(track.filterResonance * 100).toFixed(0)}</div>
          </div>

          <div className="param-control">
            <label className="param-label">DRIVE</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={track.drive}
              onChange={(e) => handleChange('drive', parseFloat(e.target.value))}
              className="param-slider"
            />
            <div className="param-value">{(track.drive * 100).toFixed(0)}</div>
          </div>
        </div>

        <div className="param-row">
          <div className="param-control param-pan">
            <label className="param-label">PAN</label>
            <input
              type="range"
              min="-1"
              max="1"
              step="0.01"
              value={track.pan}
              onChange={(e) => handleChange('pan', parseFloat(e.target.value))}
              className="param-slider"
            />
            <div className="param-value">
              {track.pan === 0 ? 'C' : track.pan > 0 ? `R${(track.pan * 100).toFixed(0)}` : `L${Math.abs(track.pan * 100).toFixed(0)}`}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackParams;
