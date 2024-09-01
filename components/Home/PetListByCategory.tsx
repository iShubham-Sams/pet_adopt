import { View, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import Category from "./Category";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/config/FirebaseConfig";
import PetListItem from "./PetListItem";

export default function PetListByCategory() {
  const [petList, setPetList] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<any>("Dogs");
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    getPetList(selectedCategory);
  }, []);
  const getPetList = async (category: string) => {
    setLoader(true);
    setPetList([]);
    const q = query(collection(db, "Pets"), where("category", "==", category));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      setPetList((p) => [...p, doc.data()]);
    });
    setLoader(false);
  };
  return (
    <View>
      <Category getPetList={getPetList} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
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
    </View>
  );
}
