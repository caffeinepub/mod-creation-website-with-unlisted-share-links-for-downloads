import Map "mo:core/Map";
import Principal "mo:core/Principal";

module {
  type ModFile = {
    filename : Text;
    contentType : Text;
    content : [Nat8];
  };

  type ModData = {
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

  type OldActor = {
    mods : Map.Map<Text, ModData>;
    userProfiles : Map.Map<Principal, { name : Text }>;
  };

  type NewActor = {
    mods : Map.Map<Text, ModData>;
    userProfiles : Map.Map<Principal, { name : Text }>;
  };

  public func run(old : OldActor) : NewActor {
    old;
  };
};
