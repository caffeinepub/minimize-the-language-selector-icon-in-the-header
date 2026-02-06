export const idlFactory = ({ IDL }) => {
  const Time = IDL.Int;
  const InstagramFeedItem = IDL.Record({
    'id' : IDL.Text,
    'link' : IDL.Opt(IDL.Text),
    'published' : IDL.Bool,
    'mediaUrl' : IDL.Text,
    'timestamp' : Time,
    'caption' : IDL.Text,
    'mediaType' : IDL.Text,
  });
  const ShopProduct = IDL.Record({
    'id' : IDL.Text,
    'title' : IDL.Text,
    'published' : IDL.Bool,
    'popular' : IDL.Bool,
    'description' : IDL.Text,
    'timestamp' : Time,
    'affiliateLink' : IDL.Text,
    'price' : IDL.Float64,
    'images' : IDL.Vec(IDL.Text),
  });
  const UserRole = IDL.Variant({
    'admin' : IDL.Null,
    'user' : IDL.Null,
    'guest' : IDL.Null,
  });
  const EmailCapture = IDL.Record({ 'email' : IDL.Text, 'timestamp' : Time });
  const BlogPost = IDL.Record({
    'id' : IDL.Text,
    'title' : IDL.Text,
    'content' : IDL.Text,
    'published' : IDL.Bool,
    'tags' : IDL.Vec(IDL.Text),
    'author' : IDL.Text,
    'coverImage' : IDL.Opt(IDL.Text),
    'timestamp' : Time,
    'excerpt' : IDL.Text,
  });
  const AdminSettings = IDL.Record({
    'instagramApiKey' : IDL.Text,
    'comingSoonEnabled' : IDL.Bool,
    'tiktokApiKey' : IDL.Text,
  });
  const ContactSubmission = IDL.Record({
    'id' : IDL.Text,
    'consent' : IDL.Bool,
    'subject' : IDL.Text,
    'name' : IDL.Text,
    'email' : IDL.Text,
    'message' : IDL.Text,
    'timestamp' : Time,
  });
  const UserProfile = IDL.Record({
    'name' : IDL.Text,
    'email' : IDL.Text,
    'newsletter' : IDL.Bool,
  });
  const FileReference = IDL.Record({ 'hash' : IDL.Text, 'path' : IDL.Text });
  const http_header = IDL.Record({ 'value' : IDL.Text, 'name' : IDL.Text });
  const http_request_result = IDL.Record({
    'status' : IDL.Nat,
    'body' : IDL.Vec(IDL.Nat8),
    'headers' : IDL.Vec(http_header),
  });
  const TransformationInput = IDL.Record({
    'context' : IDL.Vec(IDL.Nat8),
    'response' : http_request_result,
  });
  const TransformationOutput = IDL.Record({
    'status' : IDL.Nat,
    'body' : IDL.Vec(IDL.Nat8),
    'headers' : IDL.Vec(http_header),
  });
  return IDL.Service({
    'addInstagramFeedItem' : IDL.Func([InstagramFeedItem], [], []),
    'addShopProduct' : IDL.Func([ShopProduct], [], []),
    'assignCallerUserRole' : IDL.Func([IDL.Principal, UserRole], [], []),
    'captureEmail' : IDL.Func([EmailCapture], [], []),
    'createBlogPost' : IDL.Func([BlogPost], [], []),
    'deleteBlogPost' : IDL.Func([IDL.Text], [], []),
    'deleteInstagramFeedItem' : IDL.Func([IDL.Text], [], []),
    'deleteShopProduct' : IDL.Func([IDL.Text], [], []),
    'dropFileReference' : IDL.Func([IDL.Text], [], []),
    'fetchInstagramFeed' : IDL.Func([], [IDL.Text], []),
    'fetchInstagramLogo' : IDL.Func([], [IDL.Text], []),
    'fetchTikTokFeed' : IDL.Func([], [IDL.Text], []),
    'getAdminSettings' : IDL.Func([], [IDL.Opt(AdminSettings)], ['query']),
    'getAllBlogPosts' : IDL.Func([], [IDL.Vec(BlogPost)], ['query']),
    'getAllCapturedEmails' : IDL.Func([], [IDL.Vec(EmailCapture)], ['query']),
    'getAllContactSubmissions' : IDL.Func(
        [],
        [IDL.Vec(ContactSubmission)],
        ['query'],
      ),
    'getAllInstagramFeedItems' : IDL.Func(
        [],
        [IDL.Vec(InstagramFeedItem)],
        ['query'],
      ),
    'getAllShopProducts' : IDL.Func([], [IDL.Vec(ShopProduct)], ['query']),
    'getAllUsersWithProfiles' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(IDL.Principal, IDL.Opt(UserProfile)))],
        ['query'],
      ),
    'getBlogPost' : IDL.Func([IDL.Text], [IDL.Opt(BlogPost)], ['query']),
    'getCallerUserProfile' : IDL.Func([], [IDL.Opt(UserProfile)], ['query']),
    'getCallerUserRole' : IDL.Func([], [UserRole], ['query']),
    'getFileReference' : IDL.Func([IDL.Text], [FileReference], ['query']),
    'getLatestBlogPosts' : IDL.Func([], [IDL.Vec(BlogPost)], ['query']),
    'getPopularShopProducts' : IDL.Func([], [IDL.Vec(ShopProduct)], ['query']),
    'getPublishedBlogPosts' : IDL.Func([], [IDL.Vec(BlogPost)], ['query']),
    'getPublishedInstagramFeedItems' : IDL.Func(
        [],
        [IDL.Vec(InstagramFeedItem)],
        ['query'],
      ),
    'getPublishedShopProducts' : IDL.Func(
        [],
        [IDL.Vec(ShopProduct)],
        ['query'],
      ),
    'getUserProfile' : IDL.Func(
        [IDL.Principal],
        [IDL.Opt(UserProfile)],
        ['query'],
      ),
    'initializeAccessControl' : IDL.Func([], [], []),
    'isCallerAdmin' : IDL.Func([], [IDL.Bool], ['query']),
    'listFileReferences' : IDL.Func([], [IDL.Vec(FileReference)], ['query']),
    'registerFileReference' : IDL.Func([IDL.Text, IDL.Text], [], []),
    'saveCallerUserProfile' : IDL.Func([UserProfile], [], []),
    'submitContactForm' : IDL.Func([ContactSubmission], [], []),
    'transform' : IDL.Func(
        [TransformationInput],
        [TransformationOutput],
        ['query'],
      ),
    'updateAdminSettings' : IDL.Func([AdminSettings], [], []),
    'updateBlogPost' : IDL.Func([BlogPost], [], []),
    'updateInstagramFeedItem' : IDL.Func([InstagramFeedItem], [], []),
    'updateShopProduct' : IDL.Func([ShopProduct], [], []),
  });
};
export const init = ({ IDL }) => { return []; };
