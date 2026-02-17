import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { UserProfile, StoryMode, Chapter, CharacterShowcase } from '../backend';
import type { ModFile, ModData } from '../lib/modTypes';
import { Principal } from '@dfinity/principal';

// User Profile Queries
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

// Mod Queries (Stubs - backend does not support mods)
export function useCreateMod() {
  return useMutation({
    mutationFn: async () => {
      throw new Error('Mod functionality is not available in the backend');
    },
  });
}

export function useGetMod(modId: string) {
  return useQuery<ModData>({
    queryKey: ['mod', modId],
    queryFn: async () => {
      throw new Error('Mod functionality is not available in the backend');
    },
    enabled: false,
  });
}

export function useGetModByUnlistedId(unlistedId: string) {
  return useQuery<ModData>({
    queryKey: ['mod', 'unlisted', unlistedId],
    queryFn: async () => {
      throw new Error('Mod functionality is not available in the backend');
    },
    enabled: false,
    retry: false,
  });
}

export function useListModsForCreator(creator: Principal) {
  return useQuery<ModData[]>({
    queryKey: ['mods', 'creator', creator?.toString()],
    queryFn: async () => {
      return [];
    },
    enabled: false,
  });
}

export function useUpdateModFiles() {
  return useMutation({
    mutationFn: async () => {
      throw new Error('Mod functionality is not available in the backend');
    },
  });
}

export function useGetModEnabledState(modId: string) {
  return useQuery<boolean>({
    queryKey: ['mod', modId, 'enabled'],
    queryFn: async () => {
      throw new Error('Mod functionality is not available in the backend');
    },
    enabled: false,
    retry: 1,
  });
}

export function useSetModEnabledState() {
  return useMutation({
    mutationFn: async ({ modId, enabled }: { modId: string; enabled: boolean }) => {
      throw new Error('Mod functionality is not available in the backend');
    },
  });
}

// Story Mode Queries
export function useListStoryModes() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<StoryMode[]>({
    queryKey: ['storyModes'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.listStoryModes();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetStoryMode(storyId: string) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<StoryMode | null>({
    queryKey: ['storyMode', storyId],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getStoryMode(storyId);
    },
    enabled: !!actor && !actorFetching && !!storyId,
  });
}

export function useCreateStoryMode() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      title,
      description,
      chapters,
      unlistedId,
      characterDescription,
      interactionCapabilities,
    }: {
      id: string;
      title: string;
      description: string;
      chapters: Chapter[];
      unlistedId: string;
      characterDescription: string;
      interactionCapabilities: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createStoryMode(
        id,
        title,
        description,
        chapters,
        unlistedId,
        characterDescription,
        interactionCapabilities
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['storyModes'] });
    },
  });
}

export function useUpdateStoryMode() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      title,
      description,
      chapters,
      characterDescription,
      interactionCapabilities,
    }: {
      id: string;
      title: string;
      description: string;
      chapters: Chapter[];
      characterDescription: string;
      interactionCapabilities: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateStoryMode(
        id,
        title,
        description,
        chapters,
        characterDescription,
        interactionCapabilities
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['storyModes'] });
    },
  });
}

// Character Showcase Queries
export function useGetCharacterShowcase(showcaseId: string) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<CharacterShowcase | null>({
    queryKey: ['characterShowcase', showcaseId],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCharacterShowcase(showcaseId);
    },
    enabled: !!actor && !actorFetching && !!showcaseId,
    retry: false,
  });
}

export function useListCharacterShowcases() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<CharacterShowcase[]>({
    queryKey: ['characterShowcases'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.listCharacterShowcases();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useCreateCharacterShowcase() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      title,
      characterName,
      description,
      author,
      photo,
      video,
      unlistedId,
    }: {
      id: string;
      title: string;
      characterName: string;
      description: string;
      author: string;
      photo: any;
      video: any;
      unlistedId: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createCharacterShowcase(id, title, characterName, description, author, photo, video, unlistedId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['characterShowcases'] });
    },
  });
}
