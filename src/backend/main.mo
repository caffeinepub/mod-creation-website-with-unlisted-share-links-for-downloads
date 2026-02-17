import Text "mo:core/Text";
import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";



actor {
  type ModFile = {
    filename : Text;
    contentType : Text;
    content : [Nat8];
  };

  public type UserProfile = {
    name : Text;
  };

  public type ModData = {
    id : Text;
    title : Text;
    description : Text;
    prompt : Text;
    version : Text;
    creator : Principal;
    gameName : Text;
    files : [ModFile];
    unlistedId : Text;
    enabled : Bool;
  };

  public type Quest = {
    id : Nat;
    title : Text;
    description : Text;
    isCompleted : Bool;
    unlistedId : Text;
  };

  public type Scene = {
    id : Nat;
    title : Text;
    content : Text;
    voiceOver : Text;
    hasDialogue : Bool;
    voiceCoachingText : Text;
    context : Text;
    audioRecording : ?Storage.ExternalBlob;
    speechVoicePreset : ?Text;
  };

  public type Chapter = {
    id : Nat;
    title : Text;
    quests : [Quest];
    scenes : [Scene];
    unlistedId : Text;
  };

  public type StoryMode = {
    id : Text;
    title : Text;
    description : Text;
    chapters : [Chapter];
    unlistedId : Text;
    creator : Principal;
    characterDescription : Text;
    interactionCapabilities : Text;
  };

  public type CharacterShowcase = {
    id : Text;
    title : Text;
    characterName : Text;
    description : Text;
    author : Text;
    creator : Principal;
    photo : ?Storage.ExternalBlob;
    video : ?Storage.ExternalBlob;
    unlistedId : Text;
  };

  let mods = Map.empty<Text, ModData>();
  let storyModes = Map.empty<Text, StoryMode>();
  let characterShowcases = Map.empty<Text, CharacterShowcase>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  let userShowcaseMapping = Map.empty<Principal, Text>();

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  // User profile management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Story Mode management
  public shared ({ caller }) func createStoryMode(
    id : Text,
    title : Text,
    description : Text,
    chapters : [Chapter],
    unlistedId : Text,
    characterDescription : Text,
    interactionCapabilities : Text,
  ) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can create stories");
    };

    if (title == "" or description == "") {
      Runtime.trap("Title and description are required");
    };

    if (storyModes.containsKey(id)) {
      Runtime.trap("Story with this ID already exists");
    };

    let verifiedChapters = verifyChapters(chapters);

    let storyMode : StoryMode = {
      id;
      title;
      description;
      chapters = verifiedChapters;
      unlistedId;
      creator = caller;
      characterDescription;
      interactionCapabilities;
    };

    storyModes.add(id, storyMode);
  };

  public shared ({ caller }) func updateStoryMode(
    id : Text,
    title : Text,
    description : Text,
    chapters : [Chapter],
    characterDescription : Text,
    interactionCapabilities : Text,
  ) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can update stories");
    };

    switch (storyModes.get(id)) {
      case (null) {
        Runtime.trap("Story not found");
      };
      case (?existingStory) {
        // Only creator or admin can update
        if (existingStory.creator != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only the creator or admin can update this story");
        };

        if (title == "" or description == "") {
          Runtime.trap("Title and description are required");
        };

        let verifiedChapters = verifyChapters(chapters);

        let updatedStory : StoryMode = {
          existingStory with
          title;
          description;
          chapters = verifiedChapters;
          characterDescription;
          interactionCapabilities;
        };

        storyModes.add(id, updatedStory);
      };
    };
  };

  // Character Showcase management
  public shared ({ caller }) func createCharacterShowcase(
    id : Text,
    title : Text,
    characterName : Text,
    description : Text,
    author : Text,
    photo : ?Storage.ExternalBlob,
    video : ?Storage.ExternalBlob,
    unlistedId : Text,
  ) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can create character showcases");
    };

    // Enforce one showcase per user
    switch (userShowcaseMapping.get(caller)) {
      case (?existingId) {
        Runtime.trap("User already has a character showcase. Only one showcase per user is allowed.");
      };
      case (null) {};
    };

    if (title == "" or characterName == "" or description == "") {
      Runtime.trap("All fields are required");
    };

    if (characterShowcases.containsKey(id)) {
      Runtime.trap("Showcase with this ID already exists");
    };

    // Enforce exactly one media item
    switch (photo, video) {
      case (null, null) {
        Runtime.trap("Exactly one media item (photo or video) is required");
      };
      case (?_, ?_) {
        Runtime.trap("Only one media item (photo or video) is allowed");
      };
      case _ {};
    };

    let showcase : CharacterShowcase = {
      id;
      title;
      characterName;
      description;
      author;
      creator = caller;
      photo;
      video;
      unlistedId;
    };

    characterShowcases.add(id, showcase);
    userShowcaseMapping.add(caller, id);
  };

  public shared ({ caller }) func updateCharacterShowcase(
    id : Text,
    title : Text,
    characterName : Text,
    description : Text,
    author : Text,
    photo : ?Storage.ExternalBlob,
    video : ?Storage.ExternalBlob,
  ) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can update character showcases");
    };

    switch (characterShowcases.get(id)) {
      case (null) {
        Runtime.trap("Showcase not found");
      };
      case (?existingShowcase) {
        // Only creator or admin can update
        if (existingShowcase.creator != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only the creator or admin can update this showcase");
        };

        if (title == "" or characterName == "" or description == "") {
          Runtime.trap("All fields are required");
        };

        // Enforce exactly one media item
        switch (photo, video) {
          case (null, null) {
            Runtime.trap("Exactly one media item (photo or video) is required");
          };
          case (?_, ?_) {
            Runtime.trap("Only one media item (photo or video) is allowed");
          };
          case _ {};
        };

        let updatedShowcase : CharacterShowcase = {
          existingShowcase with
          title;
          characterName;
          description;
          author;
          photo;
          video;
        };

        characterShowcases.add(id, updatedShowcase);
      };
    };
  };

  public shared ({ caller }) func updateStoryModeEnabledState(storyModeId : Text, enabled : Bool) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can update stories");
    };

    if (storyModeId == "") { Runtime.trap("Story not found") };

    switch (storyModes.get(storyModeId)) {
      case (null) { Runtime.trap("Story not found") };
      case (?storyMode) {
        // Only creator or admin can update
        if (storyMode.creator != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only the creator or admin can update this story");
        };
        storyModes.add(storyModeId, storyMode);
      };
    };
  };

  public query ({ caller }) func getStoryMode(storyModeId : Text) : async ?StoryMode {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can access stories");
    };

    storyModes.get(storyModeId);
  };

  public query ({ caller }) func listStoryModes() : async [StoryMode] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can list stories");
    };
    storyModes.values().toArray();
  };

  // Public access for character showcases (unlisted-style)
  public query func getCharacterShowcase(showcaseId : Text) : async ?CharacterShowcase {
    // No authentication required - public access with link
    characterShowcases.get(showcaseId);
  };

  public query func listCharacterShowcases() : async [CharacterShowcase] {
    // No authentication required - public access
    characterShowcases.values().toArray();
  };

  func verifyChapters(chapters : [Chapter]) : [Chapter] {
    if (chapters.size() == 0) {
      Runtime.trap("At least one chapter is required");
    };

    chapters;
  };
};
