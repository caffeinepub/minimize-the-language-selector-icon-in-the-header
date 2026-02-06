import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface AdminSettings {
  'instagramApiKey' : string,
  'comingSoonEnabled' : boolean,
  'tiktokApiKey' : string,
}
export interface BlogPost {
  'id' : string,
  'title' : string,
  'content' : string,
  'published' : boolean,
  'tags' : Array<string>,
  'author' : string,
  'coverImage' : [] | [string],
  'timestamp' : Time,
  'excerpt' : string,
}
export interface ContactSubmission {
  'id' : string,
  'consent' : boolean,
  'subject' : string,
  'name' : string,
  'email' : string,
  'message' : string,
  'timestamp' : Time,
}
export interface EmailCapture { 'email' : string, 'timestamp' : Time }
export interface FileReference { 'hash' : string, 'path' : string }
export interface InstagramFeedItem {
  'id' : string,
  'link' : [] | [string],
  'published' : boolean,
  'mediaUrl' : string,
  'timestamp' : Time,
  'caption' : string,
  'mediaType' : string,
}
export interface ShopProduct {
  'id' : string,
  'title' : string,
  'published' : boolean,
  'popular' : boolean,
  'description' : string,
  'timestamp' : Time,
  'affiliateLink' : string,
  'price' : number,
  'images' : Array<string>,
}
export type Time = bigint;
export interface TransformationInput {
  'context' : Uint8Array | number[],
  'response' : http_request_result,
}
export interface TransformationOutput {
  'status' : bigint,
  'body' : Uint8Array | number[],
  'headers' : Array<http_header>,
}
export interface UserProfile {
  'name' : string,
  'email' : string,
  'newsletter' : boolean,
}
export type UserRole = { 'admin' : null } |
  { 'user' : null } |
  { 'guest' : null };
export interface http_header { 'value' : string, 'name' : string }
export interface http_request_result {
  'status' : bigint,
  'body' : Uint8Array | number[],
  'headers' : Array<http_header>,
}
export interface _SERVICE {
  'addInstagramFeedItem' : ActorMethod<[InstagramFeedItem], undefined>,
  'addShopProduct' : ActorMethod<[ShopProduct], undefined>,
  'assignCallerUserRole' : ActorMethod<[Principal, UserRole], undefined>,
  'captureEmail' : ActorMethod<[EmailCapture], undefined>,
  'createBlogPost' : ActorMethod<[BlogPost], undefined>,
  'deleteBlogPost' : ActorMethod<[string], undefined>,
  'deleteInstagramFeedItem' : ActorMethod<[string], undefined>,
  'deleteShopProduct' : ActorMethod<[string], undefined>,
  'dropFileReference' : ActorMethod<[string], undefined>,
  'fetchInstagramFeed' : ActorMethod<[], string>,
  'fetchInstagramLogo' : ActorMethod<[], string>,
  'fetchTikTokFeed' : ActorMethod<[], string>,
  'getAdminSettings' : ActorMethod<[], [] | [AdminSettings]>,
  'getAllBlogPosts' : ActorMethod<[], Array<BlogPost>>,
  'getAllCapturedEmails' : ActorMethod<[], Array<EmailCapture>>,
  'getAllContactSubmissions' : ActorMethod<[], Array<ContactSubmission>>,
  'getAllInstagramFeedItems' : ActorMethod<[], Array<InstagramFeedItem>>,
  'getAllShopProducts' : ActorMethod<[], Array<ShopProduct>>,
  'getAllUsersWithProfiles' : ActorMethod<
    [],
    Array<[Principal, [] | [UserProfile]]>
  >,
  'getBlogPost' : ActorMethod<[string], [] | [BlogPost]>,
  'getCallerUserProfile' : ActorMethod<[], [] | [UserProfile]>,
  'getCallerUserRole' : ActorMethod<[], UserRole>,
  'getFileReference' : ActorMethod<[string], FileReference>,
  'getLatestBlogPosts' : ActorMethod<[], Array<BlogPost>>,
  'getPopularShopProducts' : ActorMethod<[], Array<ShopProduct>>,
  'getPublishedBlogPosts' : ActorMethod<[], Array<BlogPost>>,
  'getPublishedInstagramFeedItems' : ActorMethod<[], Array<InstagramFeedItem>>,
  'getPublishedShopProducts' : ActorMethod<[], Array<ShopProduct>>,
  'getUserProfile' : ActorMethod<[Principal], [] | [UserProfile]>,
  'initializeAccessControl' : ActorMethod<[], undefined>,
  'isCallerAdmin' : ActorMethod<[], boolean>,
  'listFileReferences' : ActorMethod<[], Array<FileReference>>,
  'registerFileReference' : ActorMethod<[string, string], undefined>,
  'saveCallerUserProfile' : ActorMethod<[UserProfile], undefined>,
  'submitContactForm' : ActorMethod<[ContactSubmission], undefined>,
  'transform' : ActorMethod<[TransformationInput], TransformationOutput>,
  'updateAdminSettings' : ActorMethod<[AdminSettings], undefined>,
  'updateBlogPost' : ActorMethod<[BlogPost], undefined>,
  'updateInstagramFeedItem' : ActorMethod<[InstagramFeedItem], undefined>,
  'updateShopProduct' : ActorMethod<[ShopProduct], undefined>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
