import AccessControl "authorization/access-control";
import Registry "blob-storage/registry";
import BlobStorage "blob-storage/Mixin";
import OutCall "http-outcalls/outcall";
import Principal "mo:base/Principal";
import OrderedMap "mo:base/OrderedMap";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Debug "mo:base/Debug";
import Array "mo:base/Array";
import Iter "mo:base/Iter";
import List "mo:base/List";
import Int "mo:base/Int";
import Timer "mo:base/Timer";
import Nat "mo:base/Nat";

actor {
    let accessControlState = AccessControl.initState();

    public shared ({ caller }) func initializeAccessControl() : async () {
        AccessControl.initialize(accessControlState, caller);
    };

    public query ({ caller }) func getCallerUserRole() : async AccessControl.UserRole {
        AccessControl.getUserRole(accessControlState, caller);
    };

    public shared ({ caller }) func assignCallerUserRole(user : Principal, role : AccessControl.UserRole) : async () {
        if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
            Debug.trap("Unauthorized: Only admins can assign roles");
        };
        AccessControl.assignRole(accessControlState, caller, user, role);
    };

    public query ({ caller }) func isCallerAdmin() : async Bool {
        AccessControl.isAdmin(accessControlState, caller);
    };

    public type UserProfile = {
        name : Text;
        email : Text;
        newsletter : Bool;
        language : Text;
    };

    transient let principalMap = OrderedMap.Make<Principal>(Principal.compare);
    transient let textMap = OrderedMap.Make<Text>(Text.compare);
    var userProfiles = principalMap.empty<UserProfile>();

    public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
        if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
            Debug.trap("Unauthorized: Only users can view profiles");
        };
        principalMap.get(userProfiles, caller);
    };

    public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
        if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
            Debug.trap("Unauthorized: You can only view your own profile");
        };
        principalMap.get(userProfiles, user);
    };

    public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
        if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
            Debug.trap("Unauthorized: Only users can save profiles");
        };
        userProfiles := principalMap.put(userProfiles, caller, profile);
    };

    public query ({ caller }) func getAllUsersWithProfiles() : async [(Principal, ?UserProfile)] {
        if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
            Debug.trap("Unauthorized: Only admins can view users");
        };
        let users = Iter.toArray(principalMap.keys(userProfiles));
        Array.map<Principal, (Principal, ?UserProfile)>(
            users,
            func(p) { (p, principalMap.get(userProfiles, p)) },
        );
    };

    let registry = Registry.new();
    include BlobStorage(registry);

    public shared ({ caller }) func registerFileReference(path : Text, hash : Text) : async () {
        if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
            Debug.trap("Unauthorized: Only admins can upload files");
        };
        Registry.add(registry, path, hash);
    };

    public query func getFileReference(path : Text) : async Registry.FileReference {
        Registry.get(registry, path);
    };

    public query func listFileReferences() : async [Registry.FileReference] {
        Registry.list(registry);
    };

    public shared ({ caller }) func dropFileReference(path : Text) : async () {
        if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
            Debug.trap("Unauthorized: Only admins can delete files");
        };
        Registry.remove(registry, path);
    };

    public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
        OutCall.transform(input);
    };

    public shared ({ caller }) func fetchInstagramLogo() : async Text {
        if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
            Debug.trap("Unauthorized: Only admins can call external APIs");
        };
        let url = "https://www.instagram.com/travelbuttsofficial/?__a=1";
        await OutCall.httpGetRequest(url, [], transform);
    };

    public type BlogPost = {
        id : Text;
        title : Text;
        content : Text;
        author : Text;
        timestamp : Time.Time;
        published : Bool;
        coverImage : ?Text;
        images : [Text];
        tags : [Text];
        excerpt : Text;
        categories : [Text];
        scheduledAt : ?Time.Time;
        directPublish : Bool;
        publishedAt : ?Time.Time;
    };

    var blogPosts = textMap.empty<BlogPost>();

    func isAmsterdamDST(currentTime : Time.Time) : Bool {
        let year = getYear(currentTime);
        let marchLastSunday = getMarchLastSunday(year);
        let octoberLastSunday = getOctoberLastSunday(year);
        let marchTransition = getTransitionTime(year, marchLastSunday);
        let octoberTransition = getTransitionTime(year, octoberLastSunday);
        currentTime >= marchTransition and currentTime < octoberTransition;
    };

    func getYear(timestamp : Time.Time) : Int {
        let SECONDS_PER_YEAR = 365 * 24 * 60 * 60;
        let EPOCH_YEAR = 1970;
        let secondsSinceEpoch = timestamp / 1_000_000_000;
        let yearsSinceEpoch = secondsSinceEpoch / SECONDS_PER_YEAR;
        EPOCH_YEAR + yearsSinceEpoch;
    };

    func getMarchLastSunday(year : Int) : Int {
        let marchFirstDay = getWeekday(year, 3, 1);
        let offset = (marchFirstDay + 6) % 7;
        31 - offset;
    };

    func getOctoberLastSunday(year : Int) : Int {
        let octoberFirstDay = getWeekday(year, 10, 1);
        let offset = (octoberFirstDay + 6) % 7;
        31 - offset;
    };

    func getWeekday(year : Int, month : Int, day : Int) : Int {
        var y = year;
        var m = month;
        if (m < 3) {
            y -= 1;
            m += 12;
        };
        let k = y % 100;
        let j = y / 100;
        (day + (13 * (m + 1)) / 5 + k + (k / 4) + (j / 4) + 5 * j) % 7;
    };

    func getTransitionTime(year : Int, day : Int) : Time.Time {
        let monthValue = if (day > 20) 2 else 9;
        let monthsSinceEpoch = (year - 1970) * 12 + monthValue;
        let timestamp = monthsSinceEpoch * 30 * 24 * 60 * 60 * 1_000_000_000;
        timestamp + (day - 1) * 24 * 60 * 60 * 1_000_000_000 + 1 * 60 * 60 * 1_000_000_000;
    };

    func toAmsterdamTime(timestamp : Time.Time) : Time.Time {
        let baseOffset = 3600_000_000_000;
        let dstOffset = 3600_000_000_000;
        let offset = if (isAmsterdamDST(timestamp)) baseOffset + dstOffset else baseOffset;
        timestamp + offset;
    };

    func checkScheduledPublications() : async () {
        let currentTime = Time.now();
        let currentAmsterdamTime = toAmsterdamTime(currentTime);

        var updatedBlogPosts = blogPosts;
        for ((id, post) in textMap.entries(blogPosts)) {
            if (not post.published and (not post.directPublish)) {
                switch (post.scheduledAt) {
                    case (?scheduledAt) {
                        let scheduledAmsterdamTime = toAmsterdamTime(scheduledAt);
                        if (currentAmsterdamTime >= scheduledAmsterdamTime) {
                            let updatedPost = {
                                post with published = true;
                                            publishedAt = ?currentTime;
                            };
                            updatedBlogPosts := textMap.put(updatedBlogPosts, id, updatedPost);
                        };
                    };
                    case null {};
                };
            };
        };

        blogPosts := updatedBlogPosts;
    };

    transient let _publicationTimer = Timer.recurringTimer<system>(#nanoseconds(300 * 1_000_000_000), checkScheduledPublications);

    public shared ({ caller }) func createBlogPost(post : BlogPost) : async () {
        if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
            Debug.trap("Unauthorized: Only admins can create blog posts");
        };

        let postWithPublishStatus = {
            post with publishedAt = if (post.published) ?Time.now() else null;
        };

        blogPosts := textMap.put(blogPosts, post.id, postWithPublishStatus);
    };

    public query func getBlogPost(id : Text) : async ?BlogPost {
        textMap.get(blogPosts, id);
    };

    func defaultIfNull(time : Time.Time) : Time.Time {
        Int.abs(time);
    };

    public query func getAllBlogPosts() : async [BlogPost] {
        let allPosts = Iter.toArray(textMap.vals(blogPosts));
        let sortedPosts = Array.sort<BlogPost>(
            allPosts,
            func(a, b) {
                let aTime = toAmsterdamTime(a.timestamp);
                let bTime = toAmsterdamTime(b.timestamp);
                if (aTime > bTime) { #less } else if (aTime < bTime) { #greater } else {
                    #equal;
                };
            },
        );
        sortedPosts;
    };

    public query func getPublishedBlogPosts() : async [BlogPost] {
        var publishedPosts = List.nil<BlogPost>();
        let currentTime = Time.now();
        let currentAmsterdamTime = toAmsterdamTime(currentTime);

        for (post in textMap.vals(blogPosts)) {
            if (post.published) {
                switch (post.scheduledAt) {
                    case null {
                        publishedPosts := List.push(post, publishedPosts);
                    };
                    case (?scheduledAt) {
                        let scheduledAmsterdamTime = toAmsterdamTime(scheduledAt);
                        let defaultCurrentTime = defaultIfNull(currentAmsterdamTime);
                        let defaultScheduledTime = defaultIfNull(scheduledAmsterdamTime);

                        if (defaultCurrentTime >= defaultScheduledTime) {
                            publishedPosts := List.push(post, publishedPosts);
                        };
                    };
                };
            };
        };

        let publishedArray = List.toArray(publishedPosts);
        let sortedArray = Array.sort<BlogPost>(
            publishedArray,
            func(a, b) {
                let aTime = toAmsterdamTime(a.timestamp);
                let bTime = toAmsterdamTime(b.timestamp);
                if (aTime > bTime) { #less } else if (aTime < bTime) { #greater } else {
                    #equal;
                };
            },
        );

        let cutArraySize = if (sortedArray.size() < 6) sortedArray.size() else 6;
        Array.subArray(sortedArray, 0, cutArraySize);
    };

    public query func getPublishedBlogsPaginated(offset : Nat, limit : Nat) : async [BlogPost] {
        let allPosts = Iter.toArray(textMap.vals(blogPosts));
        var publishedPosts = List.nil<BlogPost>();
        let currentTime = Time.now();
        let currentAmsterdamTime = toAmsterdamTime(currentTime);

        for (post in allPosts.vals()) {
            if (post.published) {
                switch (post.scheduledAt) {
                    case null {
                        publishedPosts := List.push(post, publishedPosts);
                    };
                    case (?scheduledAt) {
                        let scheduledAmsterdamTime = toAmsterdamTime(scheduledAt);
                        let defaultCurrentTime = defaultIfNull(currentAmsterdamTime);
                        let defaultScheduledTime = defaultIfNull(scheduledAmsterdamTime);

                        if (defaultCurrentTime >= defaultScheduledTime) {
                            publishedPosts := List.push(post, publishedPosts);
                        };
                    };
                };
            };
        };

        let publishedArray = List.toArray(publishedPosts);
        let sortedArray = Array.sort<BlogPost>(
            publishedArray,
            func(a, b) {
                let aTime = toAmsterdamTime(a.timestamp);
                let bTime = toAmsterdamTime(b.timestamp);
                if (aTime > bTime) { #less } else if (aTime < bTime) { #greater } else {
                    #equal;
                };
            },
        );

        let start = if (offset >= sortedArray.size()) 0 else offset;
        let end = if ((start + limit) > sortedArray.size()) sortedArray.size() else (start + limit);
        if (start >= end) {
            [];
        } else {
            Array.subArray(sortedArray, start, end - start);
        };
    };

    public query func getBlogPostsByAuthor(author : Text) : async [BlogPost] {
        var authorPosts = List.nil<BlogPost>();
        for (post in textMap.vals(blogPosts)) {
            if (post.author == author) {
                authorPosts := List.push(post, authorPosts);
            };
        };
        let authorArray = List.toArray(authorPosts);
        if (authorArray.size() < 6) {
            authorArray;
        } else {
            Array.subArray(authorArray, 0, 6);
        };
    };

    public query func getBlogPostsByCategory(category : Text) : async [BlogPost] {
        var categoryPosts = List.nil<BlogPost>();
        for (post in textMap.vals(blogPosts)) {
            for (c in post.categories.vals()) {
                if (c == category) {
                    categoryPosts := List.push(post, categoryPosts);
                };
            };
        };
        let categoryArray = List.toArray(categoryPosts);
        if (categoryArray.size() < 6) {
            categoryArray;
        } else {
            Array.subArray(categoryArray, 0, 6);
        };
    };

    public shared ({ caller }) func updateBlogPost(post : BlogPost) : async () {
        if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
            Debug.trap("Unauthorized: Only admins can update blog posts");
        };

        if (not post.published and post.publishedAt != null) {
            let postWithNullPublishDate = { post with publishedAt = null };
            blogPosts := textMap.put(blogPosts, postWithNullPublishDate.id, postWithNullPublishDate);
        } else {
            blogPosts := textMap.put(blogPosts, post.id, post);
        };
    };

    public shared ({ caller }) func deleteBlogPost(id : Text) : async () {
        if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
            Debug.trap("Unauthorized: Only admins can delete blog posts");
        };
        blogPosts := textMap.delete(blogPosts, id);
        blogViewCounts := textMap.delete(blogViewCounts, id);
    };

    public type BlogCategory = {
        id : Text;
        name : Text;
        description : Text;
        timestamp : Time.Time;
    };

    var blogCategories = textMap.empty<BlogCategory>();

    public shared ({ caller }) func addBlogCategory(category : BlogCategory) : async () {
        if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
            Debug.trap("Unauthorized: Only admins can add categories");
        };
        blogCategories := textMap.put(blogCategories, category.id, category);
    };

    public query func getAllBlogCategories() : async [BlogCategory] {
        Iter.toArray(textMap.vals(blogCategories));
    };

    public shared ({ caller }) func updateBlogCategory(category : BlogCategory) : async () {
        if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
            Debug.trap("Unauthorized: Only admins can update categories");
        };
        blogCategories := textMap.put(blogCategories, category.id, category);
    };

    public shared ({ caller }) func deleteBlogCategory(id : Text) : async () {
        if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
            Debug.trap("Unauthorized: Only admins can delete categories");
        };
        blogCategories := textMap.delete(blogCategories, id);
    };

    public type ContactSubmission = {
        id : Text;
        name : Text;
        email : Text;
        subject : Text;
        message : Text;
        timestamp : Time.Time;
        consent : Bool;
    };

    var contactSubmissions = textMap.empty<ContactSubmission>();

    public func submitContactForm(submission : ContactSubmission) : async () {
        contactSubmissions := textMap.put(contactSubmissions, submission.id, submission);
    };

    public query ({ caller }) func getAllContactSubmissions() : async [ContactSubmission] {
        if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
            Debug.trap("Unauthorized: Only admins can view contact submissions");
        };
        Iter.toArray(textMap.vals(contactSubmissions));
    };

    public type AdminSettings = {
        instagramApiKey : Text;
        tiktokApiKey : Text;
        comingSoonEnabled : Bool;
    };

    var adminSettings : ?AdminSettings = null;

    public shared ({ caller }) func updateAdminSettings(settings : AdminSettings) : async () {
        if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
            Debug.trap("Unauthorized: Only admins can update settings");
        };
        adminSettings := ?settings;
    };

    public query ({ caller }) func getAdminSettings() : async ?AdminSettings {
        if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
            Debug.trap("Unauthorized: Only admins can view settings");
        };
        adminSettings;
    };

    public type EmailCapture = {
        email : Text;
        timestamp : Time.Time;
    };

    var emailCaptures = textMap.empty<EmailCapture>();

    public func captureEmail(capture : EmailCapture) : async () {
        emailCaptures := textMap.put(emailCaptures, capture.email, capture);
    };

    public query ({ caller }) func getAllCapturedEmails() : async [EmailCapture] {
        if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
            Debug.trap("Unauthorized: Only admins can view emails");
        };
        Iter.toArray(textMap.vals(emailCaptures));
    };

    public shared ({ caller }) func fetchInstagramFeed() : async Text {
        if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
            Debug.trap("Unauthorized: Only admins can call external APIs");
        };
        let url = "https://www.instagram.com/travelbuttsofficial/?__a=1";
        await OutCall.httpGetRequest(url, [], transform);
    };

    public shared ({ caller }) func fetchTikTokFeed() : async Text {
        if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
            Debug.trap("Unauthorized: Only admins can call external APIs");
        };
        let url = "https://www.tiktok.com/@travelbutts";
        await OutCall.httpGetRequest(url, [], transform);
    };

    public query func getLatestBlogPosts() : async [BlogPost] {
        let allPosts = Iter.toArray(textMap.vals(blogPosts));
        let sortedPosts = Array.sort<BlogPost>(
            allPosts,
            func(a, b) {
                if (a.timestamp > b.timestamp) { #less } else if (a.timestamp < b.timestamp) {
                    #greater;
                } else { #equal };
            },
        );
        Array.subArray(sortedPosts, 0, if (sortedPosts.size() < 6) sortedPosts.size() else 6);
    };

    public query func getBlogPostsByTag(tag : Text) : async [BlogPost] {
        var taggedPosts = List.nil<BlogPost>();
        for (post in textMap.vals(blogPosts)) {
            for (t in post.tags.vals()) {
                if (t == tag) {
                    taggedPosts := List.push(post, taggedPosts);
                };
            };
        };
        List.toArray(taggedPosts);
    };

    public type InstagramFeedItem = {
        id : Text;
        mediaType : Text;
        mediaUrl : Text;
        caption : Text;
        link : ?Text;
        timestamp : Time.Time;
        published : Bool;
        story : Bool;
    };

    var instagramFeed = textMap.empty<InstagramFeedItem>();

    public shared ({ caller }) func addInstagramFeedItem(item : InstagramFeedItem) : async () {
        if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
            Debug.trap("Unauthorized: Only admins can add Instagram items");
        };
        instagramFeed := textMap.put(instagramFeed, item.id, item);
    };

    public query func getAllInstagramFeedItems() : async [InstagramFeedItem] {
        Iter.toArray(textMap.vals(instagramFeed));
    };

    public query func getPublishedInstagramFeedItems() : async [InstagramFeedItem] {
        var publishedItems = List.nil<InstagramFeedItem>();
        for (item in textMap.vals(instagramFeed)) {
            if (item.published) {
                publishedItems := List.push(item, publishedItems);
            };
        };
        List.toArray(publishedItems);
    };

    public query func getInstagramStories() : async [InstagramFeedItem] {
        var stories = List.nil<InstagramFeedItem>();
        for (item in textMap.vals(instagramFeed)) {
            if (item.story) {
                stories := List.push(item, stories);
            };
        };
        List.toArray(stories);
    };

    public shared ({ caller }) func updateInstagramFeedItem(item : InstagramFeedItem) : async () {
        if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
            Debug.trap("Unauthorized: Only admins can update Instagram items");
        };
        instagramFeed := textMap.put(instagramFeed, item.id, item);
    };

    public shared ({ caller }) func deleteInstagramFeedItem(id : Text) : async () {
        if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
            Debug.trap("Unauthorized: Only admins can delete Instagram items");
        };
        instagramFeed := textMap.delete(instagramFeed, id);
    };

    public type ShopProduct = {
        id : Text;
        title : Text;
        description : Text;
        price : Float;
        affiliateLink : Text;
        images : [Text];
        timestamp : Time.Time;
        published : Bool;
        popular : Bool;
        category : Text;
        inventory : Nat;
        featured : Bool;
    };

    var shopProducts = textMap.empty<ShopProduct>();

    public shared ({ caller }) func addShopProduct(product : ShopProduct) : async () {
        if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
            Debug.trap("Unauthorized: Only admins can add products");
        };
        shopProducts := textMap.put(shopProducts, product.id, product);
    };

    public query func getAllShopProducts() : async [ShopProduct] {
        Iter.toArray(textMap.vals(shopProducts));
    };

    public query func getPublishedShopProducts() : async [ShopProduct] {
        var publishedProducts = List.nil<ShopProduct>();
        for (product in textMap.vals(shopProducts)) {
            if (product.published) {
                publishedProducts := List.push(product, publishedProducts);
            };
        };
        List.toArray(publishedProducts);
    };

    public query func getPopularShopProducts() : async [ShopProduct] {
        var popularProducts = List.nil<ShopProduct>();
        for (product in textMap.vals(shopProducts)) {
            if (product.popular) {
                popularProducts := List.push(product, popularProducts);
            };
        };
        let popularArray = List.toArray(popularProducts);
        Array.subArray(popularArray, 0, if (popularArray.size() < 6) popularArray.size() else 6);
    };

    public query func getShopProductsByCategory(category : Text) : async [ShopProduct] {
        var categoryProducts = List.nil<ShopProduct>();
        for (product in textMap.vals(shopProducts)) {
            if (product.category == category) {
                categoryProducts := List.push(product, categoryProducts);
            };
        };
        List.toArray(categoryProducts);
    };

    public shared ({ caller }) func updateShopProduct(product : ShopProduct) : async () {
        if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
            Debug.trap("Unauthorized: Only admins can update products");
        };
        shopProducts := textMap.put(shopProducts, product.id, product);
    };

    public shared ({ caller }) func deleteShopProduct(id : Text) : async () {
        if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
            Debug.trap("Unauthorized: Only admins can delete products");
        };
        shopProducts := textMap.delete(shopProducts, id);
    };

    public type ShopCategory = {
        id : Text;
        name : Text;
        description : Text;
        timestamp : Time.Time;
    };

    var shopCategories = textMap.empty<ShopCategory>();

    public shared ({ caller }) func addShopCategory(category : ShopCategory) : async () {
        if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
            Debug.trap("Unauthorized: Only admins can add shop categories");
        };
        shopCategories := textMap.put(shopCategories, category.id, category);
    };

    public query func getAllShopCategories() : async [ShopCategory] {
        Iter.toArray(textMap.vals(shopCategories));
    };

    public shared ({ caller }) func updateShopCategory(category : ShopCategory) : async () {
        if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
            Debug.trap("Unauthorized: Only admins can update shop categories");
        };
        shopCategories := textMap.put(shopCategories, category.id, category);
    };

    public shared ({ caller }) func deleteShopCategory(id : Text) : async () {
        if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
            Debug.trap("Unauthorized: Only admins can delete shop categories");
        };
        shopCategories := textMap.delete(shopCategories, id);
    };

    public shared ({ caller }) func triggerPublicationCheck() : async () {
        if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
            Debug.trap("Unauthorized: Only admins can trigger publication checks");
        };
        await checkScheduledPublications();
    };

    var blogViewCounts = textMap.empty<Nat>();

    let minViews : Nat = 700;
    let maxViews : Nat = 1000;

    func generateRandomViews() : Nat {
        let range : Int = maxViews - minViews + 1;
        let currentTime = Int.abs(Time.now());
        let randomView : Nat = Int.abs(currentTime % range);
        randomView + minViews;
    };

    public shared func incrementBlogViewCount(id : Text) : async () {
        let currentCount = switch (textMap.get(blogViewCounts, id)) {
            case null {
                let randomViews = generateRandomViews();
                blogViewCounts := textMap.put(blogViewCounts, id, randomViews);
                randomViews;
            };
            case (?count) { count };
        };
        blogViewCounts := textMap.put(blogViewCounts, id, currentCount + 1);
    };

    public query func getBlogViewCount(id : Text) : async Nat {
        switch (textMap.get(blogViewCounts, id)) {
            case null { 0 };
            case (?count) { count };
        };
    };

    public query ({ caller }) func getAllBlogViewCounts() : async [(Text, Nat)] {
        if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
            Debug.trap("Unauthorized: Only admins can view all view counts");
        };
        Iter.toArray(textMap.entries(blogViewCounts));
    };

    var deploymentFailures = principalMap.empty<DeploymentFailure>();
    transient let natMap = OrderedMap.Make<Nat>(Nat.compare);
    var buildFailures = natMap.empty<BuildFailure>();

    public type DeploymentFailure = {
        timestamp : Time.Time;
        error_message : Text;
        failed_step : Text;
        environment : Text;
        failed_attempts : Nat;
    };

    public type BuildFailure = {
        timestamp : Time.Time;
        error_message : Text;
        failed_step : Text;
        environment : Text;
        failed_attempts : Nat;
    };

    public query func getDeploymentFailures() : async [DeploymentFailure] {
        let failures = Iter.toArray(principalMap.vals(deploymentFailures));
        let sortedFailures = Array.sort<DeploymentFailure>(
            failures,
            func(a, b) {
                if (a.timestamp > b.timestamp) { #less } else if (a.timestamp < b.timestamp) {
                    #greater;
                } else { #equal };
            },
        );
        sortedFailures;
    };

    public shared func registerDeploymentFailure() : async () {
        let failure : DeploymentFailure = {
            timestamp = Time.now();
            error_message = "Transient deployment failure, logs rotating";
            failed_step = "deploy";
            environment = "icx";
            failed_attempts = 1;
        };
        deploymentFailures := principalMap.put(deploymentFailures, Principal.fromText("2vxsx-fae"), failure);
    };

    public query func getBuildFailures() : async [BuildFailure] {
        let failures = Iter.toArray(natMap.vals(buildFailures));
        let sortedFailures = Array.sort<BuildFailure>(
            failures,
            func(a, b) {
                if (a.timestamp > b.timestamp) { #less } else if (a.timestamp < b.timestamp) {
                    #greater;
                } else { #equal };
            },
        );
        sortedFailures;
    };

    public shared func registerBuildFailure() : async () {
        let failure : BuildFailure = {
            timestamp = Time.now();
            error_message = "Transient build failure, logs rotating";
            failed_step = "build";
            environment = "icx";
            failed_attempts = 1;
        };
        buildFailures := natMap.put(buildFailures, 0, failure);
    };
};

