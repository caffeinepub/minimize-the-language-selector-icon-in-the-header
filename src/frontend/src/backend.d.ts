import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface BlogPost {
    id: string;
    categories: Array<string>;
    title: string;
    content: string;
    published: boolean;
    tags: Array<string>;
    publishedAt?: Time;
    directPublish: boolean;
    author: string;
    coverImage?: string;
    timestamp: Time;
    excerpt: string;
    scheduledAt?: Time;
    images: Array<string>;
}
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export type Time = bigint;
export interface InstagramFeedItem {
    id: string;
    link?: string;
    published: boolean;
    mediaUrl: string;
    story: boolean;
    timestamp: Time;
    caption: string;
    mediaType: string;
}
export interface ContactSubmission {
    id: string;
    consent: boolean;
    subject: string;
    name: string;
    email: string;
    message: string;
    timestamp: Time;
}
export interface AdminSettings {
    instagramApiKey: string;
    comingSoonEnabled: boolean;
    tiktokApiKey: string;
}
export interface http_header {
    value: string;
    name: string;
}
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface EmailCapture {
    email: string;
    timestamp: Time;
}
export interface ShopProduct {
    id: string;
    title: string;
    featured: boolean;
    inventory: bigint;
    published: boolean;
    popular: boolean;
    description: string;
    timestamp: Time;
    category: string;
    affiliateLink: string;
    price: number;
    images: Array<string>;
}
export interface DeploymentFailure {
    failed_attempts: bigint;
    failed_step: string;
    error_message: string;
    timestamp: Time;
    environment: string;
}
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export interface BuildFailure {
    failed_attempts: bigint;
    failed_step: string;
    error_message: string;
    timestamp: Time;
    environment: string;
}
export interface ShopCategory {
    id: string;
    name: string;
    description: string;
    timestamp: Time;
}
export interface FileReference {
    hash: string;
    path: string;
}
export interface BlogCategory {
    id: string;
    name: string;
    description: string;
    timestamp: Time;
}
export interface UserProfile {
    name: string;
    email: string;
    language: string;
    newsletter: boolean;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addBlogCategory(category: BlogCategory): Promise<void>;
    addInstagramFeedItem(item: InstagramFeedItem): Promise<void>;
    addShopCategory(category: ShopCategory): Promise<void>;
    addShopProduct(product: ShopProduct): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    captureEmail(capture: EmailCapture): Promise<void>;
    createBlogPost(post: BlogPost): Promise<void>;
    deleteBlogCategory(id: string): Promise<void>;
    deleteBlogPost(id: string): Promise<void>;
    deleteInstagramFeedItem(id: string): Promise<void>;
    deleteShopCategory(id: string): Promise<void>;
    deleteShopProduct(id: string): Promise<void>;
    dropFileReference(path: string): Promise<void>;
    fetchInstagramFeed(): Promise<string>;
    fetchInstagramLogo(): Promise<string>;
    fetchTikTokFeed(): Promise<string>;
    getAdminSettings(): Promise<AdminSettings | null>;
    getAllBlogCategories(): Promise<Array<BlogCategory>>;
    getAllBlogPosts(): Promise<Array<BlogPost>>;
    getAllBlogViewCounts(): Promise<Array<[string, bigint]>>;
    getAllCapturedEmails(): Promise<Array<EmailCapture>>;
    getAllContactSubmissions(): Promise<Array<ContactSubmission>>;
    getAllInstagramFeedItems(): Promise<Array<InstagramFeedItem>>;
    getAllShopCategories(): Promise<Array<ShopCategory>>;
    getAllShopProducts(): Promise<Array<ShopProduct>>;
    getAllUsersWithProfiles(): Promise<Array<[Principal, UserProfile | null]>>;
    getBlogPost(id: string): Promise<BlogPost | null>;
    getBlogPostsByAuthor(author: string): Promise<Array<BlogPost>>;
    getBlogPostsByCategory(category: string): Promise<Array<BlogPost>>;
    getBlogPostsByTag(tag: string): Promise<Array<BlogPost>>;
    getBlogViewCount(id: string): Promise<bigint>;
    getBuildFailures(): Promise<Array<BuildFailure>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getDeploymentFailures(): Promise<Array<DeploymentFailure>>;
    getFileReference(path: string): Promise<FileReference>;
    getInstagramStories(): Promise<Array<InstagramFeedItem>>;
    getLatestBlogPosts(): Promise<Array<BlogPost>>;
    getPopularShopProducts(): Promise<Array<ShopProduct>>;
    getPublishedBlogPosts(): Promise<Array<BlogPost>>;
    getPublishedBlogsPaginated(offset: bigint, limit: bigint): Promise<Array<BlogPost>>;
    getPublishedInstagramFeedItems(): Promise<Array<InstagramFeedItem>>;
    getPublishedShopProducts(): Promise<Array<ShopProduct>>;
    getShopProductsByCategory(category: string): Promise<Array<ShopProduct>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    incrementBlogViewCount(id: string): Promise<void>;
    initializeAccessControl(): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    listFileReferences(): Promise<Array<FileReference>>;
    registerBuildFailure(): Promise<void>;
    registerDeploymentFailure(): Promise<void>;
    registerFileReference(path: string, hash: string): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitContactForm(submission: ContactSubmission): Promise<void>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
    triggerPublicationCheck(): Promise<void>;
    updateAdminSettings(settings: AdminSettings): Promise<void>;
    updateBlogCategory(category: BlogCategory): Promise<void>;
    updateBlogPost(post: BlogPost): Promise<void>;
    updateInstagramFeedItem(item: InstagramFeedItem): Promise<void>;
    updateShopCategory(category: ShopCategory): Promise<void>;
    updateShopProduct(product: ShopProduct): Promise<void>;
}
