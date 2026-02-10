import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { ModData, ModFile, UserProfile } from '../backend';
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

// Mod Queries
export function useCreateMod() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      modId,
      title,
      description,
      prompt,
      version,
      gameName,
      files,
      unlistedId,
    }: {
      modId: string;
      title: string;
      description: string;
      prompt: string;
      version: string;
      gameName: string;
      files: ModFile[];
      unlistedId: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createMod(modId, title, description, prompt, version, gameName, files, unlistedId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mods'] });
    },
  });
}

export function useGetMod(modId: string) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<ModData>({
    queryKey: ['mod', modId],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getMod(modId);
    },
    enabled: !!actor && !actorFetching && !!modId,
  });
}

export function useGetModByUnlistedId(unlistedId: string) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<ModData>({
    queryKey: ['mod', 'unlisted', unlistedId],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getModByUnlistedId(unlistedId);
    },
    enabled: !!actor && !actorFetching && !!unlistedId,
  });
}

export function useListModsForCreator(creator: Principal) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<ModData[]>({
    queryKey: ['mods', 'creator', creator.toString()],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.listModsForCreator(creator);
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useUpdateModFiles() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ modId, newFiles }: { modId: string; newFiles: ModFile[] }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateModFiles(modId, newFiles);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['mod', variables.modId] });
      queryClient.invalidateQueries({ queryKey: ['mods'] });
    },
  });
}
