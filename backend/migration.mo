import OrderedMap "mo:base/OrderedMap";
import Principal "mo:base/Principal";
import Text "mo:base/Text";

module {
    type OldActor = {
        userProfiles : OrderedMap.Map<Principal, {
            name : Text;
            email : Text;
            newsletter : Bool;
            language : Text;
        }>;
    };

    type NewActor = {
        userProfiles : OrderedMap.Map<Principal, {
            name : Text;
            email : Text;
            newsletter : Bool;
            language : Text;
        }>;
        travelStyles : OrderedMap.Map<Text, {
            id : Text;
            name : Text;
            description : Text;
            baseImage : ?Text;
            timestamp : Int;
        }>;
    };

    public func run(old : OldActor) : NewActor {
        let textMap = OrderedMap.Make<Text>(Text.compare);
        {
            userProfiles = old.userProfiles;
            travelStyles = textMap.empty();
        };
    };
};
