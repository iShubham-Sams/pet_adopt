import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/config/FirebaseConfig";
import Colors from "@/constants/Colors";

export default function Category() {
  const [categoryList, setCategoryList] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<any>("Dogs");

  useEffect(() => {
    getCategory();
  }, []);

  const getCategory = async () => {
    setCategoryList([]);
    const snapShot = await getDocs(collection(db, "Category"));
    snapShot.forEach((doc) => {
      setCategoryList((cat) => [...cat, doc.data()]);
    });
  };

  return (
    <View style={{ marginTop: 20 }}>
      <Text style={{ fontFamily: "outfit-medium", fontSize: 20 }}>Category</Text>
      <FlatList
        data={categoryList}
        numColumns={4}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            onPress={() => {
              setSelectedCategory(item?.name);
            }}
            style={{ flex: 1 }}>
            <View style={[style.container, selectedCategory == item?.name && style.selectedCategoryContainer]}>
              <Image source={{ uri: item?.imageUrl }} style={{ width: 40, height: 40 }} />
            </View>
            <Text style={{ textAlign: "center", fontFamily: "outfit" }}>{item?.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    backgroundColor: Colors.LIGHT_PRIMARY,
    padding: 15,
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 15,
    borderColor: Colors.PRIMARY,
    margin: 5,
  },
  selectedCategoryContainer: {
    backgroundColor: Colors.SECONDARY,
    borderColor: Colors.SECONDARY,
  },
});
