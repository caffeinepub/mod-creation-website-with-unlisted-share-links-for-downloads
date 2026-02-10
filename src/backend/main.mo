import Text "mo:core/Text";
import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Array "mo:core/Array";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import Migration "migration";

(with migration = Migration.run)
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
  };

  let mods = Map.empty<Text, ModData>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User profile management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
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
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Mod management
  public shared ({ caller }) func createMod(
    modId : Text,
    title : Text,
    description : Text,
    prompt : Text,
    version : Text,
    gameName : Text,
    files : [ModFile],
    unlistedId : Text,
  ) : async () {
    // Only authenticated users can create mods
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can create mods");
    };

    if (title == "" or description == "" or version == "") {
      Runtime.trap("Title, description, and version are required");
    };

    if (files.size() == 0) {
      Runtime.trap("At least one mod file is required");
    };

    // The check for game existence has been removed from the
    // new system since mods reference the game by name
    // if (games.get(gameName) == null) {
    //   Runtime.trap("Game not found");
    // };

    if (mods.containsKey(modId)) {
      Runtime.trap("Mod with this ID already exists");
    };

    let verifiedFiles = verifyFiles(files);

    let modData : ModData = {
      id = modId;
      title;
      description;
      prompt;
      version;
      creator = caller;
      gameName;
      files = verifiedFiles;
      unlistedId;
    };

    mods.add(modId, modData);
  };

  public shared ({ caller }) func updateModFiles(modId : Text, newFiles : [ModFile]) : async () {
    // Only authenticated users can update mods
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can update mods");
    };

    switch (mods.get(modId)) {
      case (null) { Runtime.trap("Mod not found") };
      case (?modData) {
        if (caller != modData.creator) {
          Runtime.trap("Unauthorized: Only the mod creator can update files");
        };

        if (newFiles.size() == 0) {
          Runtime.trap("At least one file is required");
        };

        let verifiedFiles = verifyFiles(newFiles);

        let updatedMod : ModData = {
          id = modData.id;
          title = modData.title;
          description = modData.description;
          version = modData.version;
          prompt = modData.prompt;
          creator = modData.creator;
          gameName = modData.gameName;
          files = verifiedFiles;
          unlistedId = modData.unlistedId;
        };

        mods.add(modId, updatedMod);
      };
    };
  };

  public query ({ caller }) func getMod(modId : Text) : async ModData {
    // Only the mod creator can access mod by direct ID
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can access mods by ID");
    };

    switch (mods.get(modId)) {
      case (?modData) {
        if (caller != modData.creator and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only the mod creator can access this mod");
        };
        modData;
      };
      case (null) { Runtime.trap("Mod not found") };
    };
  };

  public query ({ caller }) func getModByUnlistedId(unlistedId : Text) : async ModData {
    // Public access via unlisted ID - no authentication required
    // This is the share link feature
    let iter = mods.values();
    let modOpt = iter.find(
      func(mod) {
        mod.unlistedId == unlistedId;
      }
    );

    switch (modOpt) {
      case (?modData) { modData };
      case (null) { Runtime.trap("Mod not found") };
    };
  };

  public query ({ caller }) func listModsForGame(gameName : Text) : async [ModData] {
    // Only authenticated users can list mods, and only their own
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can list mods");
    };

    let iter = mods.values().filter(
      func(mod) {
        mod.gameName == gameName and mod.creator == caller;
      }
    );
    iter.toArray();
  };

  public query ({ caller }) func listModsForCreator(creator : Principal) : async [ModData] {
    // Users can only list their own mods, admins can list any user's mods
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can list mods");
    };

    if (caller != creator and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only list your own mods");
    };

    let iter = mods.values().filter(
      func(mod) {
        mod.creator == creator;
      }
    );
    iter.toArray();
  };

  public query ({ caller }) func listModFiles(modId : Text) : async [ModFile] {
    // Only the mod creator can list files by mod ID
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can list mod files");
    };

    switch (mods.get(modId)) {
      case (null) { Runtime.trap("Mod not found") };
      case (?modData) {
        if (caller != modData.creator and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only the mod creator can list files");
        };
        modData.files;
      };
    };
  };

  func verifyFiles(files : [ModFile]) : [ModFile] {
    let textFilesCount = files.filter(
      func(file) {
        file.contentType == "text/plain";
      }
    ).size();

    if (files.size() > 10) {
      Runtime.trap("A maximum of 10 files per mod is allowed");
    };

    if (textFilesCount > 5) {
      Runtime.trap("A maximum of 5 text files per mod is allowed");
    };

    files;
  };
};

