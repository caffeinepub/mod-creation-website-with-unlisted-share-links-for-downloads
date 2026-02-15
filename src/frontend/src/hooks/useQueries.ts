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
    retry: false,
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

// Mod Enabled State Queries
export function useGetModEnabledState(modId: string) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['mod', modId, 'enabled'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getModEnabledState(modId);
    },
    enabled: !!actor && !actorFetching && !!modId,
    retry: 1,
  });
}

export function useSetModEnabledState() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ modId, enabled }: { modId: string; enabled: boolean }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.setModEnabledState(modId, enabled);
    },
    onSuccess: (_, variables) => {
      // Immediately set the cached value to ensure UI reflects backend state
      queryClient.setQueryData(['mod', variables.modId, 'enabled'], variables.enabled);
      
      // Invalidate related queries to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['mod', variables.modId] });
      queryClient.invalidateQueries({ queryKey: ['mods'] });
      queryClient.invalidateQueries({ queryKey: ['mod', 'unlisted'] });
    },
  });
}
