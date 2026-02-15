import Text "mo:core/Text";
import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
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
    enabled : Bool;
  };

  let mods = Map.empty<Text, ModData>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public query ({ caller }) func getModByUnlistedId(unlistedId : Text) : async ModData {
    if (unlistedId == "") {
      Runtime.trap("Mod not found");
    };

    switch (mods.values().find(func(mod) { mod.unlistedId == unlistedId })) {
      case (?mod) {
        if (mod.enabled) { mod } else {
          Runtime.trap("Mod not found");
        };
      };
      case (null) { Runtime.trap("Mod not found") };
    };
  };

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
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can create mods");
    };

    if (title == "" or description == "" or version == "") {
      Runtime.trap("Title, description, and version are required");
    };

    if (files.size() == 0) {
      Runtime.trap("At least one mod file is required");
    };

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
      enabled = true;
    };

    mods.add(modId, modData);
  };

  public shared ({ caller }) func updateModFiles(modId : Text, newFiles : [ModFile]) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
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
          enabled = modData.enabled;
        };

        mods.add(modId, updatedMod);
      };
    };
  };

  public shared ({ caller }) func setModEnabledState(modId : Text, enabled : Bool) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can update mods");
    };

    if (modId == "") { Runtime.trap("Mod not found") };

    switch (mods.get(modId)) {
      case (null) { Runtime.trap("Mod not found") };
      case (?modData) {
        if (caller != modData.creator and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only the mod creator or admin can toggle this mod");
        };

        let updatedMod : ModData = {
          id = modData.id;
          title = modData.title;
          description = modData.description;
          version = modData.version;
          prompt = modData.prompt;
          creator = modData.creator;
          gameName = modData.gameName;
          files = modData.files;
          unlistedId = modData.unlistedId;
          enabled;
        };

        mods.add(modId, updatedMod);
      };
    };
  };

  public query ({ caller }) func getModEnabledState(modId : Text) : async Bool {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can check mod state");
    };

    if (modId == "") { Runtime.trap("Mod not found") };

    switch (mods.get(modId)) {
      case (null) { Runtime.trap("Mod not found") };
      case (?modData) {
        if (caller != modData.creator and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only the mod creator or admin can check this mod's state");
        };
        modData.enabled;
      };
    };
  };

  public query ({ caller }) func getMod(modId : Text) : async ModData {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
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

  public query ({ caller }) func listModsForGame(gameName : Text) : async [ModData] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can list mods");
    };

    mods.values().filter(func(mod) { mod.gameName == gameName and mod.creator == caller }).toArray();
  };

  public query ({ caller }) func listModsForCreator(creator : Principal) : async [ModData] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can list mods");
    };

    if (caller != creator and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only list your own mods");
    };

    mods.values().filter(func(mod) { mod.creator == creator }).toArray();
  };

  public query ({ caller }) func listModFiles(modId : Text) : async [ModFile] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
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
