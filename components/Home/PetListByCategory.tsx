import { View, FlatList, Text } from "react-native";
import React, { useEffect, useState } from "react";
import Category from "./Category";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/config/FirebaseConfig";
import PetListItem from "./PetListItem";
import Shared from "@/Shared/Shared";

export default function PetListByCategory() {
  const [categoryList, setCategoryList] = useState<any[]>([]);
  const [petList, setPetList] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<any>("Dogs");
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    Shared.getCategory(setCategoryList);
  }, []);
  useEffect(() => {
    getPetList(selectedCategory);
  }, [selectedCategory]);
  const getPetList = async (category: string) => {
    setLoader(true);
    const q = query(collection(db, "Pets"), where("category", "==", category));
    const querySnapshot = await getDocs(q);
    setPetList([]);
    querySnapshot.forEach((doc) => {
      setPetList((p: any) => [...p, doc.data()]);
    });
    setLoader(false);
  };
  return (
    <View>
      {loader ? (
        <View style={{ margin: 2, gap: 6 }}>
          <View style={{ width: "100%", height: 100, backgroundColor: "#9e9e9e", opacity: 0.4, borderRadius: 20 }}></View>
          <View style={{ display: "flex", flexDirection: "row", gap: 4 }}>
            <View style={{ width: "49%", height: 160, backgroundColor: "#9e9e9e", opacity: 0.4, borderRadius: 20 }}></View>
            <View style={{ width: "49%", height: 160, backgroundColor: "#9e9e9e", opacity: 0.4, borderRadius: 20 }}></View>
          </View>
        </View>
      ) : (
        <View>
          <Category getPetList={getPetList} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} categoryList={categoryList} />
          {petList.length == 0 ? (
            <View style={{ marginTop: 20 }}>
              <Text style={{ fontSize: 14, fontFamily: "outfit-medium", fontWeight: "bold" }}>Sorry we don't have any pet in this category you can add a pet in this category</Text>
            </View>
          ) : (
            <FlatList
              refreshing={loader}
              onRefresh={() => {
                getPetList(selectedCategory);
              }}
              style={{ marginTop: 10 }}
              data={petList}
              horizontal={true}
              renderItem={({ item, index }) => <PetListItem pet={item} />}
            />
          )}
        </View>
      )}
    </View>
  );
}
