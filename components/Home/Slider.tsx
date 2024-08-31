import { View, Image, StyleSheet, Dimensions } from "react-native";
import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/config/FirebaseConfig";
import { FlatList } from "react-native";

export default function Slider() {
  const [sliderList, setSliderList] = useState<any[]>([]);

  useEffect(() => {
    getSlider();
  }, []);

  const getSlider = async () => {
    const snapshot = await getDocs(collection(db, "Sliders"));
    snapshot.forEach((doc) => {
      setSliderList((list) => [...list, doc.data()]);
    });
  };

  return (
    <View style={{ marginTop: 15 }}>
      {sliderList.length > 0 && (
        <FlatList
          data={sliderList}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <View>
              <Image source={{ uri: item?.imageUrl }} style={styles.sliderImage} />
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  sliderImage: {
    width: Dimensions.get("screen").width * 0.9,
    height: 170,
    borderRadius: 15,
    marginRight: 15,
  },
});
