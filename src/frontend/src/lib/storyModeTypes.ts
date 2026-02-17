import type { Chapter, Quest, Scene } from '../backend';
import { ExternalBlob } from '../backend';

export interface ChapterFormData {
  id: number;
  title: string;
  quests: QuestFormData[];
  scenes: SceneFormData[];
  unlistedId: string;
}

export interface QuestFormData {
  id: number;
  title: string;
  description: string;
  isCompleted: boolean;
  unlistedId: string;
}

export interface SceneFormData {
  id: number;
  title: string;
  content: string;
  voiceOver: string;
  hasDialogue: boolean;
  voiceCoachingText: string;
  context: string;
  audioRecording?: ExternalBlob | null;
  speechVoicePreset?: string;
}

export function createEmptyChapter(id: number): ChapterFormData {
  return {
    id,
    title: '',
    quests: [],
    scenes: [],
    unlistedId: generateLocalId(),
  };
}

export function createEmptyQuest(id: number): QuestFormData {
  return {
    id,
    title: '',
    description: '',
    isCompleted: false,
    unlistedId: generateLocalId(),
  };
}

export function createEmptyScene(id: number): SceneFormData {
  return {
    id,
    title: '',
    content: '',
    voiceOver: '',
    hasDialogue: false,
    voiceCoachingText: '',
    context: '',
    audioRecording: null,
    speechVoicePreset: 'normal',
  };
}

function generateLocalId(): string {
  return Math.random().toString(36).substring(2, 15);
}

export function convertToBackendChapter(chapter: ChapterFormData): Chapter {
  return {
    id: BigInt(chapter.id),
    title: chapter.title,
    quests: chapter.quests.map(q => ({
      id: BigInt(q.id),
      title: q.title,
      description: q.description,
      isCompleted: q.isCompleted,
      unlistedId: q.unlistedId,
    })),
    scenes: chapter.scenes.map(s => ({
      id: BigInt(s.id),
      title: s.title,
      content: s.content,
      voiceOver: s.voiceOver,
      hasDialogue: s.hasDialogue,
      voiceCoachingText: s.voiceCoachingText,
      context: s.context,
      audioRecording: s.audioRecording || undefined,
      speechVoicePreset: s.speechVoicePreset || undefined,
    })),
    unlistedId: chapter.unlistedId,
  };
}
