import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface StoryMode {
    id: string;
    title: string;
    creator: Principal;
    characterDescription: string;
    description: string;
    interactionCapabilities: string;
    chapters: Array<Chapter>;
    unlistedId: string;
}
export interface CharacterShowcase {
    id: string;
    title: string;
    creator: Principal;
    video?: ExternalBlob;
    characterName: string;
    description: string;
    author: string;
    unlistedId: string;
    photo?: ExternalBlob;
}
export interface Quest {
    id: bigint;
    title: string;
    isCompleted: boolean;
    description: string;
    unlistedId: string;
}
export interface Chapter {
    id: bigint;
    title: string;
    scenes: Array<Scene>;
    unlistedId: string;
    quests: Array<Quest>;
}
export interface UserProfile {
    name: string;
}
export interface Scene {
    id: bigint;
    voiceOver: string;
    audioRecording?: ExternalBlob;
    title: string;
    content: string;
    context: string;
    hasDialogue: boolean;
    speechVoicePreset?: string;
    voiceCoachingText: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createCharacterShowcase(id: string, title: string, characterName: string, description: string, author: string, photo: ExternalBlob | null, video: ExternalBlob | null, unlistedId: string): Promise<void>;
    createStoryMode(id: string, title: string, description: string, chapters: Array<Chapter>, unlistedId: string, characterDescription: string, interactionCapabilities: string): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCharacterShowcase(showcaseId: string): Promise<CharacterShowcase | null>;
    getStoryMode(storyModeId: string): Promise<StoryMode | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    listCharacterShowcases(): Promise<Array<CharacterShowcase>>;
    listStoryModes(): Promise<Array<StoryMode>>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateCharacterShowcase(id: string, title: string, characterName: string, description: string, author: string, photo: ExternalBlob | null, video: ExternalBlob | null): Promise<void>;
    updateStoryMode(id: string, title: string, description: string, chapters: Array<Chapter>, characterDescription: string, interactionCapabilities: string): Promise<void>;
    updateStoryModeEnabledState(storyModeId: string, enabled: boolean): Promise<void>;
}
