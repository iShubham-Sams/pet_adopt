import { View } from "react-native";
import React from "react";
import Header from "@/components/Home/Header";
import Slider from "@/components/Home/Slider";

export default function HomeScreen() {
  return (
    <View style={{ padding: 20, marginTop: 20 }}>
      {/* Header */}
      <Header />
      {/* Slider */}
      <Slider />
      {/* Category */}
      {/* List Of Pets */}
      {/* Add New Pet Option */}
    </View>
  );
}
