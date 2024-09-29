import { StyleSheet, Text, TouchableOpacity, View, ScrollView } from "react-native";
import React, { useState } from "react";
import Header from "@/components/Home/Header";
import Slider from "@/components/Home/Slider";
import PetListByCategory from "@/components/Home/PetListByCategory";
import { MaterialIcons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import { Link } from "expo-router";
import { useUser } from "@clerk/clerk-expo";

export default function HomeScreen() {
  const { user } = useUser();
  return (
    <View style={{ padding: 20, marginTop: 20 }}>
      <View>
        {/* Header */}
        <Header />
        {/* Slider */}
        <Slider />
        {/* Category  And Pet List*/}
        <PetListByCategory />
        {/* Add New Pet Option */}
        <Link href={"/add-new-pet"} style={style.addNewPetContainer}>
          <MaterialIcons name="pets" size={24} color={Colors.PRIMARY} />
          <Text style={{ fontFamily: "outfit-medium", color: Colors.PRIMARY, fontSize: 18 }}>Add New Pet</Text>
        </Link>
      </View>
    </View>
  );
}

const style = StyleSheet.create({
  addNewPetContainer: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    textAlign: "center",
    padding: 20,
    marginTop: 20,
    backgroundColor: Colors.LIGHT_PRIMARY,
    borderRadius: 15,
    borderStyle: "dashed",
    justifyContent: "center",
  },
});
