import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import Header from "@/components/Home/Header";
import Slider from "@/components/Home/Slider";
import PetListByCategory from "@/components/Home/PetListByCategory";
import { MaterialIcons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";

export default function HomeScreen() {
  return (
    <View style={{ padding: 20, marginTop: 20 }}>
      {/* Header */}
      <Header />
      {/* Slider */}
      <Slider />
      {/* Category  And Pet List*/}
      <PetListByCategory />
      {/* Add New Pet Option */}
      <TouchableOpacity style={style.addNewPetContainer}>
        <MaterialIcons name="pets" size={24} color={Colors.PRIMARY} />
        <Text style={{ fontFamily: "outfit-medium", color: Colors.PRIMARY, fontSize: 18 }}>Add New Pet</Text>
      </TouchableOpacity>
    </View>
  );
}

const style = StyleSheet.create({
  addNewPetContainer: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    padding: 20,
    marginTop: 20,
    backgroundColor: Colors.LIGHT_PRIMARY,
    borderRadius: 15,
    borderStyle: "dashed",
    justifyContent: "center",
  },
});
