import { View, Text, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-expo";
import Shared from "@/Shared/Shared";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/config/FirebaseConfig";
import PetListItem from "@/components/Home/PetListItem";

export default function Favorite() {
  const { user } = useUser();
  const [faIds, setFavIds] = useState([]);
  const [favPetList, setFavPetList] = useState<any[]>([]);
  const [loaders, setLoaders] = useState(false);
  useEffect(() => {
    if (user) {
      getFavPetIds();
    }
  }, [user]);
  const getFavPetIds = async () => {
    setLoaders(true);
    const result = await Shared.getFavList(user);
    setFavIds(result?.favorites);
    setLoaders(false);
    setFavPetList([]);
    getFavPetList(result?.favorites);
  };

  const getFavPetList = async (favId: any) => {
    setLoaders(true);
    const q = query(collection(db, "Pets"), where("id", "in", favId));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      setFavPetList((pre) => [...pre, doc.data()]);
    });
    setLoaders(false);
  };
  return (
    <View style={{ padding: 20, marginTop: 20 }}>
      <Text style={{ fontFamily: "outfit-medium", fontSize: 30 }}>Favorites</Text>
      {loaders ? (
        <View style={{ display: "flex", flexDirection: "row", gap: 6, marginTop: 20, flexWrap: "wrap" }}>
          <View style={{ width: "49%", height: 160, backgroundColor: "#9e9e9e", opacity: 0.4, borderRadius: 20 }}></View>
          <View style={{ width: "49%", height: 160, backgroundColor: "#9e9e9e", opacity: 0.4, borderRadius: 20 }}></View>
          <View style={{ width: "49%", height: 160, backgroundColor: "#9e9e9e", opacity: 0.4, borderRadius: 20 }}></View>
          <View style={{ width: "49%", height: 160, backgroundColor: "#9e9e9e", opacity: 0.4, borderRadius: 20 }}></View>
        </View>
      ) : favPetList.length == 0 ? (
        <View style={{ marginTop: 20, display: "flex", justifyContent: "center", alignItems: "center" }}>
          <Text>You don't have any favorites pet </Text>
        </View>
      ) : (
        <FlatList
          data={favPetList}
          numColumns={2}
          onRefresh={getFavPetIds}
          refreshing={loaders}
          renderItem={({ item, index }) => (
            <View>
              <PetListItem pet={item} />
            </View>
          )}
        />
      )}
    </View>
  );
}
