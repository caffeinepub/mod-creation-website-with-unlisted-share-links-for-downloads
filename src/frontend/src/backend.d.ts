import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface ModFile {
    content: Uint8Array;
    contentType: string;
    filename: string;
}
export interface UserProfile {
    name: string;
}
export interface ModData {
    id: string;
    files: Array<ModFile>;
    title: string;
    creator: Principal;
    description: string;
    version: string;
    gameName: string;
    prompt: string;
    unlistedId: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createMod(modId: string, title: string, description: string, prompt: string, version: string, gameName: string, files: Array<ModFile>, unlistedId: string): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getMod(modId: string): Promise<ModData>;
    getModByUnlistedId(unlistedId: string): Promise<ModData>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    listModFiles(modId: string): Promise<Array<ModFile>>;
    listModsForCreator(creator: Principal): Promise<Array<ModData>>;
    listModsForGame(gameName: string): Promise<Array<ModData>>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateModFiles(modId: string, newFiles: Array<ModFile>): Promise<void>;
}
