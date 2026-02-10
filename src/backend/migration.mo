import Map "mo:core/Map";
import Principal "mo:core/Principal";

module {
  type OldModData = {
    id : Text;
    title : Text;
    description : Text;
    version : Text;
    creator : Principal;
    gameId : Text;
    files : [OldModFile];
    unlistedId : Text;
  };

  type OldModFile = {
    filename : Text;
    contentType : Text;
    content : [Nat8];
  };

  type OldActor = {
    mods : Map.Map<Text, OldModData>;
    userProfiles : Map.Map<Principal, { name : Text }>;
    games : Map.Map<Text, { id : Text; title : Text; description : Text }>;
  };

  type NewModData = {
    id : Text;
    title : Text;
    description : Text;
    prompt : Text;
    version : Text;
    creator : Principal;
    gameName : Text;
    files : [NewModFile];
    unlistedId : Text;
  };

  type NewModFile = {
    filename : Text;
    contentType : Text;
    content : [Nat8];
  };

  type NewActor = {
    mods : Map.Map<Text, NewModData>;
    userProfiles : Map.Map<Principal, { name : Text }>;
  };

  public func run(old : OldActor) : NewActor {
    let newMods = old.mods.map<Text, OldModData, NewModData>(
      func(_id, oldMod) {
        {
          id = oldMod.id;
          title = oldMod.title;
          description = oldMod.description;
          prompt = "No prompt provided";
          version = oldMod.version;
          creator = oldMod.creator;
          gameName = oldMod.gameId;
          files = oldMod.files.map(func(f) { f });
          unlistedId = oldMod.unlistedId;
        };
      }
    );
    {
      mods = newMods;
      userProfiles = old.userProfiles;
    };
  };
};
