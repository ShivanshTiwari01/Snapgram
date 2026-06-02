import {
  useMutation,
  useQuery,
  useInfiniteQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { apiClient } from './api';
import {
  type INewUser,
  type INewPost,
  type IUpdatePost,
  type IUpdateUser,
} from '@/types';

// Query keys
export const queryKeys = {
  auth: ['auth'] as const,
  currentUser: () => [...queryKeys.auth, 'currentUser'] as const,
  users: ['users'] as const,
  userList: () => [...queryKeys.users, 'list'] as const,
  userById: (id: string) => [...queryKeys.users, id] as const,
  userPosts: (id: string) => [...queryKeys.users, id, 'posts'] as const,
  posts: ['posts'] as const,
  postsList: () => [...queryKeys.posts, 'list'] as const,
  postById: (id: string) => [...queryKeys.posts, id] as const,
  recentPosts: () => [...queryKeys.posts, 'recent'] as const,
  infinitePosts: () => [...queryKeys.posts, 'infinite'] as const,
  searchPosts: (query: string) =>
    [...queryKeys.posts, 'search', query] as const,
  saves: ['saves'] as const,
  savedPosts: () => [...queryKeys.saves, 'list'] as const,
};

// ============ AUTH HOOKS ============

export function useSignUp() {
  return useMutation({
    mutationFn: (user: INewUser) => apiClient.signup(user),
  });
}

export function useSignIn() {
  return useMutation({
    mutationFn: (credentials: { email: string; password: string }) =>
      apiClient.signin(credentials),
  });
}

export function useSignOut() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => apiClient.signout(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.auth });
    },
  });
}

export function useGetCurrentUser() {
  return useQuery({
    queryKey: queryKeys.currentUser(),
    queryFn: () => apiClient.getCurrentUser(),
    retry: false,
    enabled: !!localStorage.getItem('token'),
  });
}

// ============ POST HOOKS ============

export function useCreatePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (post: INewPost) => apiClient.createPost(post),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.postsList() });
      queryClient.invalidateQueries({ queryKey: queryKeys.recentPosts() });
      queryClient.invalidateQueries({ queryKey: queryKeys.infinitePosts() });
    },
  });
}

export function useUpdatePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (post: IUpdatePost) => apiClient.updatePost(post),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.postsList() });
      queryClient.invalidateQueries({ queryKey: queryKeys.postById(data.id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.infinitePosts() });
    },
  });
}

export function useDeletePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (postId: string) => apiClient.deletePost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.postsList() });
      queryClient.invalidateQueries({ queryKey: queryKeys.recentPosts() });
      queryClient.invalidateQueries({ queryKey: queryKeys.infinitePosts() });
    },
  });
}

export function useGetPostById(postId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.postById(postId || ''),
    queryFn: () => apiClient.getPostById(postId!),
    enabled: !!postId,
  });
}

export function useGetPosts(page: number = 1, limit: number = 10) {
  return useQuery({
    queryKey: [...queryKeys.postsList(), page],
    queryFn: () => apiClient.getPosts(page, limit),
  });
}

export function useGetInfinitePosts(limit: number = 10) {
  return useInfiniteQuery({
    queryKey: queryKeys.infinitePosts(),
    queryFn: ({ pageParam = 1 }) =>
      apiClient.getPosts(pageParam as number, limit),
    getNextPageParam: (lastPage, allPages) => {
      // Backend returns { data: [], meta: { total, page, limit, totalPages } }
      if (lastPage.data.length < limit) return undefined;
      if (allPages.length >= lastPage.meta.totalPages) return undefined;
      return allPages.length + 1;
    },
    initialPageParam: 1,
  });
}

export function useSearchPosts(query: string) {
  return useQuery({
    queryKey: queryKeys.searchPosts(query),
    queryFn: () => apiClient.searchPosts(query),
    enabled: !!query && query.length > 0,
  });
}

export function useLikePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (postId: string) => apiClient.likePost(postId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.postById(data.id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.postsList() });
      queryClient.invalidateQueries({ queryKey: queryKeys.infinitePosts() });
    },
  });
}

// ============ USER HOOKS ============

export function useGetUsers() {
  return useQuery({
    queryKey: queryKeys.userList(),
    queryFn: () => apiClient.getUsers(),
  });
}

export function useGetUserById(userId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.userById(userId || ''),
    queryFn: () => apiClient.getUserById(userId!),
    enabled: !!userId,
  });
}

export function useGetUserPosts(userId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.userPosts(userId || ''),
    queryFn: () => apiClient.getUserPosts(userId!),
    enabled: !!userId,
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (user: IUpdateUser) => apiClient.updateUser(user),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.userById(data.id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.currentUser() });
    },
  });
}

// ============ SAVE HOOKS ============

export function useSavePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (postId: string) => apiClient.savePost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.savedPosts() });
    },
  });
}

export function useUnsavePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (saveId: string) => apiClient.unsavePost(saveId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.savedPosts() });
    },
  });
}

export function useGetSavedPosts() {
  return useQuery({
    queryKey: queryKeys.savedPosts(),
    queryFn: () => apiClient.getSavedPosts(),
  });
}
