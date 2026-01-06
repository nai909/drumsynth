import React, { useState, useEffect, useRef } from 'react';
import { DrumSynth } from './audio/DrumSynth';
import { Sequencer } from './audio/Sequencer';
import { Pattern, DrumTrack } from './types';
import Header from './components/Header';
import StepSequencer from './components/StepSequencer';
import Transport from './components/Transport';
import TrackControls from './components/TrackControls';
import TrackParams from './components/TrackParams';
import './styles/App.css';

const createInitialPattern = (): Pattern => {
  const tracks: DrumTrack[] = [
    {
      id: '1',
      name: 'Kick',
      type: 'analog',
      soundEngine: 'kick',
      steps: new Array(16).fill(false),
      velocity: new Array(16).fill(1),
      muted: false,
      solo: false,
      volume: 0.8,
      pan: 0,
      tune: 0,
      decay: 0.4,
      attack: 0.001,
      tone: 0.5,
      snap: 0.3,
      filterCutoff: 0.8,
      filterResonance: 0.2,
      drive: 0,
    },
    {
      id: '2',
      name: 'Snare',
      type: 'analog',
      soundEngine: 'snare',
      steps: new Array(16).fill(false),
      velocity: new Array(16).fill(1),
      muted: false,
      solo: false,
      volume: 0.7,
      pan: 0,
      tune: 0,
      decay: 0.2,
      attack: 0.001,
      tone: 0.6,
      snap: 0.4,
      filterCutoff: 0.9,
      filterResonance: 0.15,
      drive: 0.1,
    },
    {
      id: '3',
      name: 'Closed HH',
      type: 'analog',
      soundEngine: 'hihat-closed',
      steps: new Array(16).fill(false),
      velocity: new Array(16).fill(1),
      muted: false,
      solo: false,
      volume: 0.6,
      pan: 0.2,
      tune: 0,
      decay: 0.1,
      attack: 0.001,
      tone: 0.7,
      snap: 0.2,
      filterCutoff: 1,
      filterResonance: 0.1,
      drive: 0,
    },
    {
      id: '4',
      name: 'Open HH',
      type: 'analog',
      soundEngine: 'hihat-open',
      steps: new Array(16).fill(false),
      velocity: new Array(16).fill(1),
      muted: false,
      solo: false,
      volume: 0.5,
      pan: -0.2,
      tune: 0,
      decay: 0.3,
      attack: 0.001,
      tone: 0.7,
      snap: 0.2,
      filterCutoff: 1,
      filterResonance: 0.1,
      drive: 0,
    },
    {
      id: '5',
      name: 'Clap',
      type: 'analog',
      soundEngine: 'clap',
      steps: new Array(16).fill(false),
      velocity: new Array(16).fill(1),
      muted: false,
      solo: false,
      volume: 0.7,
      pan: 0,
      tune: 0,
      decay: 0.15,
      attack: 0.001,
      tone: 0.5,
      snap: 0.3,
      filterCutoff: 0.85,
      filterResonance: 0.2,
      drive: 0.15,
    },
    {
      id: '6',
      name: 'Tom Low',
      type: 'analog',
      soundEngine: 'tom-low',
      steps: new Array(16).fill(false),
      velocity: new Array(16).fill(1),
      muted: false,
      solo: false,
      volume: 0.7,
      pan: -0.3,
      tune: 0,
      decay: 0.3,
      attack: 0.001,
      tone: 0.4,
      snap: 0.2,
      filterCutoff: 0.7,
      filterResonance: 0.15,
      drive: 0,
    },
    {
      id: '7',
      name: 'Tom Mid',
      type: 'analog',
      soundEngine: 'tom-mid',
      steps: new Array(16).fill(false),
      velocity: new Array(16).fill(1),
      muted: false,
      solo: false,
      volume: 0.7,
      pan: 0,
      tune: 0,
      decay: 0.25,
      attack: 0.001,
      tone: 0.45,
      snap: 0.2,
      filterCutoff: 0.75,
      filterResonance: 0.15,
      drive: 0,
    },
    {
      id: '8',
      name: 'Tom High',
      type: 'analog',
      soundEngine: 'tom-high',
      steps: new Array(16).fill(false),
      velocity: new Array(16).fill(1),
      muted: false,
      solo: false,
      volume: 0.7,
      pan: 0.3,
      tune: 0,
      decay: 0.2,
      attack: 0.001,
      tone: 0.5,
      snap: 0.2,
      filterCutoff: 0.8,
      filterResonance: 0.15,
      drive: 0,
    },
  ];

  return {
    id: '1',
    name: 'Pattern 1',
    tracks,
    tempo: 120,
    steps: 16,
  };
};

const App: React.FC = () => {
  const [pattern, setPattern] = useState<Pattern>(createInitialPattern());
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedTrack, setSelectedTrack] = useState(0);
  const [showParams, setShowParams] = useState(false);

  const drumSynthRef = useRef<DrumSynth | null>(null);
  const sequencerRef = useRef<Sequencer | null>(null);

  useEffect(() => {
    drumSynthRef.current = new DrumSynth();
    sequencerRef.current = new Sequencer(drumSynthRef.current);

    sequencerRef.current.onStep((step) => {
      setCurrentStep(step);
    });

    sequencerRef.current.setPattern(pattern);

    return () => {
      sequencerRef.current?.dispose();
      drumSynthRef.current?.dispose();
    };
  }, []);

  useEffect(() => {
    if (sequencerRef.current) {
      sequencerRef.current.setPattern(pattern);
    }
  }, [pattern]);

  const handlePlay = async () => {
    if (sequencerRef.current) {
      await sequencerRef.current.play();
      setIsPlaying(true);
    }
  };

  const handlePause = () => {
    if (sequencerRef.current) {
      sequencerRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleStop = () => {
    if (sequencerRef.current) {
      sequencerRef.current.stop();
      setIsPlaying(false);
      setCurrentStep(0);
    }
  };

  const handleTempoChange = (tempo: number) => {
    setPattern({ ...pattern, tempo });
    if (sequencerRef.current) {
      sequencerRef.current.setTempo(tempo);
    }
  };

  const handleStepToggle = (trackIndex: number, stepIndex: number) => {
    const newPattern = { ...pattern };
    newPattern.tracks[trackIndex].steps[stepIndex] = !newPattern.tracks[trackIndex].steps[stepIndex];
    setPattern(newPattern);
  };

  const handleTrackMute = (trackIndex: number) => {
    const newPattern = { ...pattern };
    newPattern.tracks[trackIndex].muted = !newPattern.tracks[trackIndex].muted;
    setPattern(newPattern);
  };

  const handleTrackSolo = (trackIndex: number) => {
    const newPattern = { ...pattern };
    newPattern.tracks[trackIndex].solo = !newPattern.tracks[trackIndex].solo;
    setPattern(newPattern);
  };

  const handleParamChange = (param: keyof DrumTrack, value: number) => {
    const newPattern = { ...pattern };
    (newPattern.tracks[selectedTrack] as any)[param] = value;
    setPattern(newPattern);
  };

  return (
    <div className="app">
      <Header />
      <div className="main-content">
        <TrackControls
          tracks={pattern.tracks}
          selectedTrack={selectedTrack}
          onSelectTrack={setSelectedTrack}
          onMute={handleTrackMute}
          onSolo={handleTrackSolo}
        />
        <div className="center-section">
          <div className="sequencer-container">
            <StepSequencer
              tracks={pattern.tracks}
              currentStep={currentStep}
              onStepToggle={handleStepToggle}
            />
            <button
              className={`params-toggle ${showParams ? 'active' : ''}`}
              onClick={() => setShowParams(!showParams)}
            >
              {showParams ? 'HIDE PARAMETERS' : 'SHOW PARAMETERS'}
            </button>
          </div>
          {showParams && (
            <TrackParams
              track={pattern.tracks[selectedTrack]}
              onParamChange={handleParamChange}
            />
          )}
        </div>
      </div>
      <Transport
        isPlaying={isPlaying}
        tempo={pattern.tempo}
        onPlay={handlePlay}
        onPause={handlePause}
        onStop={handleStop}
        onTempoChange={handleTempoChange}
      />
    </div>
  );
};

export default App;
