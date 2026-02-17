export interface VoiceAtmospherePreset {
  id: string;
  label: string;
  rate: number;
  pitch: number;
  volume: number;
}

export const VOICE_ATMOSPHERE_PRESETS: VoiceAtmospherePreset[] = [
  {
    id: 'normal',
    label: 'Normal',
    rate: 1.0,
    pitch: 1.0,
    volume: 1.0,
  },
  {
    id: 'calm',
    label: 'Calm',
    rate: 0.85,
    pitch: 0.9,
    volume: 0.9,
  },
  {
    id: 'tense',
    label: 'Tense',
    rate: 1.2,
    pitch: 1.1,
    volume: 1.0,
  },
  {
    id: 'mysterious',
    label: 'Mysterious',
    rate: 0.9,
    pitch: 0.85,
    volume: 0.85,
  },
  {
    id: 'excited',
    label: 'Excited',
    rate: 1.3,
    pitch: 1.2,
    volume: 1.0,
  },
  {
    id: 'somber',
    label: 'Somber',
    rate: 0.8,
    pitch: 0.8,
    volume: 0.8,
  },
];

export function getPresetById(id: string): VoiceAtmospherePreset | undefined {
  return VOICE_ATMOSPHERE_PRESETS.find(preset => preset.id === id);
}
