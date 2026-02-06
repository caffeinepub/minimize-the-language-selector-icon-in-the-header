import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import { BlogPost, ContactSubmission, EmailCapture, AdminSettings, UserRole, UserProfile, InstagramFeedItem, ShopProduct } from '../backend';
import { Principal } from '@dfinity/principal';
import { showToast } from '../utils/toast';

// Admin Queries
export function useIsAdmin() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<boolean>({
    queryKey: ['isAdmin'],
    queryFn: async () => {
      if (!actor || !identity) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching && !!identity,
  });
}

// User Profile Queries
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching && !!identity,
    retry: false,
  });

  // Return custom state that properly reflects actor dependency
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
      queryClient.invalidateQueries({ queryKey: ['allUsers'] });
      queryClient.invalidateQueries({ queryKey: ['isAdmin'] });
    },
    onError: (error: any) => {
      showToast(error.message || 'Failed to save profile', 'error');
    },
  });
}

// User Management Queries
interface UserInfo {
  principal: string;
  profile?: UserProfile;
  role: UserRole;
  isCurrentUser: boolean;
}

export function useGetAllUsers() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<UserInfo[]>({
    queryKey: ['allUsers'],
    queryFn: async () => {
      if (!actor || !identity) return [];
      
      try {
        const usersWithProfiles = await actor.getAllUsersWithProfiles();
        const currentUserPrincipal = identity.getPrincipal().toString();
        
        // Convert the backend response to UserInfo format
        const userInfos: UserInfo[] = [];
        
        for (const [principal, profile] of usersWithProfiles) {
          const principalString = principal.toString();
          
          // For each user, we need to determine their role
          let role = UserRole.user; // Default to user role
          
          // Check if this user is an admin by trying to see if they have admin permissions
          // We can only definitively know the current user's role
          if (principalString === currentUserPrincipal) {
            try {
              role = await actor.getCallerUserRole();
            } catch (error) {
              console.warn('Could not get caller role:', error);
              role = UserRole.user;
            }
          } else {
            // For other users, we'll assume they are regular users unless we have other information
            // In a real implementation, the backend should return role information for all users
            role = UserRole.user;
          }
          
          userInfos.push({
            principal: principalString,
            profile: profile || undefined,
            role,
            isCurrentUser: principalString === currentUserPrincipal
          });
        }
        
        return userInfos;
      } catch (error) {
        console.error('Error fetching users:', error);
        return [];
      }
    },
    enabled: !!actor && !isFetching && !!identity,
  });
}

export function useAssignUserRole() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userPrincipal, role }: { userPrincipal: string, role: UserRole }) => {
      if (!actor) throw new Error('Actor not available');
      const principal = Principal.fromText(userPrincipal);
      return actor.assignCallerUserRole(principal, role);
    },
    onSuccess: (_, variables) => {
      // Immediately update the cache to reflect the role change
      queryClient.setQueryData(['allUsers'], (oldData: UserInfo[] | undefined) => {
        if (!oldData) return oldData;
        
        return oldData.map(user => 
          user.principal === variables.userPrincipal 
            ? { ...user, role: variables.role }
            : user
        );
      });
      
      // Also invalidate to ensure fresh data
      queryClient.invalidateQueries({ queryKey: ['allUsers'] });
      queryClient.invalidateQueries({ queryKey: ['isAdmin'] });
      
      // Show success message
      const actionText = variables.role === UserRole.admin ? 'promoted to admin' : 'removed from admin role';
      showToast(`User has been ${actionText} successfully`, 'success');
    },
    onError: (error: any) => {
      showToast(error.message || 'Failed to assign user role', 'error');
    },
  });
}

// Blog Queries
export function useGetLatestBlogPosts() {
  const { actor, isFetching } = useActor();

  return useQuery<BlogPost[]>({
    queryKey: ['latestBlogPosts'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getLatestBlogPosts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetPublishedBlogPosts() {
  const { actor, isFetching } = useActor();

  return useQuery<BlogPost[]>({
    queryKey: ['publishedBlogPosts'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPublishedBlogPosts();
    },
    enabled: !!actor && !isFetching,
    // Automatically refetch every 60 seconds to check for newly published scheduled posts
    refetchInterval: 60000, // 60 seconds
    // Keep previous data while refetching to prevent UI flicker
    placeholderData: (previousData) => previousData,
  });
}

export function useGetAllBlogPosts() {
  const { actor, isFetching } = useActor();

  return useQuery<BlogPost[]>({
    queryKey: ['allBlogPosts'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllBlogPosts();
    },
    enabled: !!actor && !isFetching,
    // Automatically refetch every 60 seconds for admin dashboard to show updated publication status
    refetchInterval: 60000, // 60 seconds
    placeholderData: (previousData) => previousData,
  });
}

// New query for individual blog post
export function useGetBlogPost(id: string) {
  const { actor, isFetching } = useActor();

  return useQuery<BlogPost | null>({
    queryKey: ['blogPost', id],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getBlogPost(id);
    },
    enabled: !!actor && !isFetching && !!id,
  });
}

export function useCreateBlogPost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (post: BlogPost) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createBlogPost(post);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['latestBlogPosts'] });
      queryClient.invalidateQueries({ queryKey: ['publishedBlogPosts'] });
      queryClient.invalidateQueries({ queryKey: ['allBlogPosts'] });
      showToast('Blog post created successfully!', 'success');
    },
    onError: (error: any) => {
      showToast(error.message || 'Failed to create blog post', 'error');
    },
  });
}

export function useUpdateBlogPost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (post: BlogPost) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateBlogPost(post);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['latestBlogPosts'] });
      queryClient.invalidateQueries({ queryKey: ['publishedBlogPosts'] });
      queryClient.invalidateQueries({ queryKey: ['allBlogPosts'] });
      showToast('Blog post updated successfully!', 'success');
    },
    onError: (error: any) => {
      showToast(error.message || 'Failed to update blog post', 'error');
    },
  });
}

export function useDeleteBlogPost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteBlogPost(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['latestBlogPosts'] });
      queryClient.invalidateQueries({ queryKey: ['publishedBlogPosts'] });
      queryClient.invalidateQueries({ queryKey: ['allBlogPosts'] });
      queryClient.invalidateQueries({ queryKey: ['blogViewCounts'] });
      showToast('Blog post deleted successfully!', 'success');
    },
    onError: (error: any) => {
      showToast(error.message || 'Failed to delete blog post', 'error');
    },
  });
}

// Blog View Counter Queries
export function useGetBlogViewCount(id: string) {
  const { actor, isFetching } = useActor();

  return useQuery<number>({
    queryKey: ['blogViewCount', id],
    queryFn: async () => {
      if (!actor) return 0;
      const count = await actor.getBlogViewCount(id);
      return Number(count);
    },
    enabled: !!actor && !isFetching && !!id,
  });
}

export function useIncrementBlogViewCount() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.incrementBlogViewCount(id);
    },
    onSuccess: (_, id) => {
      // Invalidate the specific blog view count to refetch updated count
      queryClient.invalidateQueries({ queryKey: ['blogViewCount', id] });
      queryClient.invalidateQueries({ queryKey: ['blogViewCounts'] });
    },
    onError: (error: any) => {
      console.error('Failed to increment view count:', error);
    },
  });
}

export function useGetAllBlogViewCounts() {
  const { actor, isFetching } = useActor();

  return useQuery<Map<string, number>>({
    queryKey: ['blogViewCounts'],
    queryFn: async () => {
      if (!actor) return new Map();
      const counts = await actor.getAllBlogViewCounts();
      const countMap = new Map<string, number>();
      counts.forEach(([id, count]) => {
        countMap.set(id, Number(count));
      });
      return countMap;
    },
    enabled: !!actor && !isFetching,
  });
}

// Contact Form
export function useSubmitContactForm() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (submission: ContactSubmission) => {
      if (!actor) throw new Error('Actor not available');
      return actor.submitContactForm(submission);
    },
    onSuccess: () => {
      showToast('Message sent successfully! We\'ll get back to you soon.', 'success');
    },
    onError: (error: any) => {
      showToast(error.message || 'Failed to send message', 'error');
    },
  });
}

export function useGetAllContactSubmissions() {
  const { actor, isFetching } = useActor();

  return useQuery<ContactSubmission[]>({
    queryKey: ['contactSubmissions'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllContactSubmissions();
    },
    enabled: !!actor && !isFetching,
  });
}

// Email Capture
export function useCaptureEmail() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (capture: EmailCapture) => {
      if (!actor) throw new Error('Actor not available');
      return actor.captureEmail(capture);
    },
    onSuccess: () => {
      showToast('Thanks for subscribing! We\'ll keep you updated.', 'success');
    },
    onError: (error: any) => {
      showToast(error.message || 'Failed to subscribe', 'error');
    },
  });
}

export function useGetAllCapturedEmails() {
  const { actor, isFetching } = useActor();

  return useQuery<EmailCapture[]>({
    queryKey: ['capturedEmails'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllCapturedEmails();
    },
    enabled: !!actor && !isFetching,
  });
}

// Admin Settings
export function useGetAdminSettings() {
  const { actor, isFetching } = useActor();

  return useQuery<AdminSettings | null>({
    queryKey: ['adminSettings'],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getAdminSettings();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdateAdminSettings() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (settings: AdminSettings) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateAdminSettings(settings);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminSettings'] });
      showToast('Settings updated successfully!', 'success');
    },
    onError: (error: any) => {
      showToast(error.message || 'Failed to update settings', 'error');
    },
  });
}

// Social Media
export function useFetchInstagramFeed() {
  const { actor, isFetching } = useActor();

  return useQuery<string>({
    queryKey: ['instagramFeed'],
    queryFn: async () => {
      if (!actor) return '';
      return actor.fetchInstagramFeed();
    },
    enabled: !!actor && !isFetching,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Instagram Feed Items (Backend Integration) - Updated to use backend instead of localStorage
export function useGetInstagramFeedItems() {
  const { actor, isFetching } = useActor();

  return useQuery<InstagramFeedItem[]>({
    queryKey: ['instagramFeedItems'],
    queryFn: async () => {
      if (!actor) return [];
      // Always fetch from backend, never from localStorage
      return actor.getAllInstagramFeedItems();
    },
    enabled: !!actor && !isFetching,
    // Ensure we always fetch fresh data from backend
    staleTime: 0,
    gcTime: 0, // Updated from cacheTime to gcTime for newer React Query versions
  });
}

export function useCreateInstagramFeedItem() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (item: InstagramFeedItem) => {
      if (!actor) throw new Error('Actor not available');
      
      // Use backend method to add Instagram feed item
      return actor.addInstagramFeedItem(item);
    },
    onSuccess: () => {
      // Invalidate and refetch to ensure all users see the new item
      queryClient.invalidateQueries({ queryKey: ['instagramFeedItems'] });
      showToast('Instagram item added successfully!', 'success');
    },
    onError: (error: any) => {
      showToast(error.message || 'Failed to add Instagram item', 'error');
    },
  });
}

export function useUpdateInstagramFeedItem() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (item: InstagramFeedItem) => {
      if (!actor) throw new Error('Actor not available');
      
      // Use backend method to update Instagram feed item
      return actor.updateInstagramFeedItem(item);
    },
    onSuccess: () => {
      // Invalidate and refetch to ensure all users see the updated item
      queryClient.invalidateQueries({ queryKey: ['instagramFeedItems'] });
      showToast('Instagram item updated successfully!', 'success');
    },
    onError: (error: any) => {
      showToast(error.message || 'Failed to update Instagram item', 'error');
    },
  });
}

export function useDeleteInstagramFeedItem() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not available');
      
      // Use backend method to delete Instagram feed item
      return actor.deleteInstagramFeedItem(id);
    },
    onSuccess: () => {
      // Invalidate and refetch to ensure all users see the item is removed
      queryClient.invalidateQueries({ queryKey: ['instagramFeedItems'] });
      showToast('Instagram item deleted successfully!', 'success');
    },
    onError: (error: any) => {
      showToast(error.message || 'Failed to delete Instagram item', 'error');
    },
  });
}

// Shop Product Queries
export function useGetAllShopProducts() {
  const { actor, isFetching } = useActor();

  return useQuery<ShopProduct[]>({
    queryKey: ['allShopProducts'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllShopProducts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetPublishedShopProducts() {
  const { actor, isFetching } = useActor();

  return useQuery<ShopProduct[]>({
    queryKey: ['publishedShopProducts'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPublishedShopProducts();
    },
    enabled: !!actor && !isFetching,
  });
}

// New query for popular products (homepage)
export function useGetPopularShopProducts() {
  const { actor, isFetching } = useActor();

  return useQuery<ShopProduct[]>({
    queryKey: ['popularShopProducts'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPopularShopProducts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateShopProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (product: ShopProduct) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addShopProduct(product);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allShopProducts'] });
      queryClient.invalidateQueries({ queryKey: ['publishedShopProducts'] });
      queryClient.invalidateQueries({ queryKey: ['popularShopProducts'] });
      showToast('Product added successfully!', 'success');
    },
    onError: (error: any) => {
      showToast(error.message || 'Failed to add product', 'error');
    },
  });
}

export function useUpdateShopProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (product: ShopProduct) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateShopProduct(product);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allShopProducts'] });
      queryClient.invalidateQueries({ queryKey: ['publishedShopProducts'] });
      queryClient.invalidateQueries({ queryKey: ['popularShopProducts'] });
      showToast('Product updated successfully!', 'success');
    },
    onError: (error: any) => {
      showToast(error.message || 'Failed to update product', 'error');
    },
  });
}

export function useDeleteShopProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteShopProduct(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allShopProducts'] });
      queryClient.invalidateQueries({ queryKey: ['publishedShopProducts'] });
      queryClient.invalidateQueries({ queryKey: ['popularShopProducts'] });
      showToast('Product deleted successfully!', 'success');
    },
    onError: (error: any) => {
      showToast(error.message || 'Failed to delete product', 'error');
    },
  });
}
