import OrderedMap "mo:base/OrderedMap";
import Nat "mo:base/Nat";
import Text "mo:base/Text";

module {
    type Actor = {
        blogViewCounts : OrderedMap.Map<Text, Nat>;
    };

    public func run(old : Actor) : Actor {
        let textMap = OrderedMap.Make<Text>(Text.compare);
        let blogViewCounts = textMap.map<Nat, Nat>(old.blogViewCounts, func(_k, v) { v });
        { blogViewCounts };
    };
};
