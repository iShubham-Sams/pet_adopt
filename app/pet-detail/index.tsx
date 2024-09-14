import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import React, { useEffect } from "react";
import PetInfo from "@/components/PetDetails/PetInfo";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import PetSubInfo from "@/components/PetDetails/PetSubInfo";
import AboutPet from "@/components/PetDetails/AboutPet";
import OwnerInfo from "@/components/PetDetails/OwnerInfo";
import Colors from "@/constants/Colors";
import { useUser } from "@clerk/clerk-expo";
import { collection, doc, getDocs, query, setDoc, where } from "firebase/firestore";
import { db } from "@/config/FirebaseConfig";

export default function PetDetailsScreen() {
  const router = useRouter();
  const pet = useLocalSearchParams();
  const navigation = useNavigation();
  const { user } = useUser();

  useEffect(() => {
    navigation.setOptions({
      headerTransparent: true,
      headerTitle: "",
    });
  }, []);

  const initiateChat = async () => {
    const docId1 = user?.primaryEmailAddress?.emailAddress + "_" + pet?.email;
    const docId2 = pet?.email + "_" + user?.primaryEmailAddress?.emailAddress;

    const q = query(collection(db, "Chat"), where("id", "in", [docId1, docId2]));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.docs?.length === 0) {
      await setDoc(doc(db, "Chat", docId1), {
        id: docId1,
        users: [
          {
            email: user?.primaryEmailAddress?.emailAddress,
            imageUrl: user?.imageUrl,
            name: user?.fullName,
          },
          {
            email: pet?.email,
            imageUrl: pet?.userImage,
            name: pet?.username,
          },
        ],
      });
      router.push({
        pathname: "/chat",
        params: {
          id: docId1,
        },
      });
    }

    querySnapshot.forEach((doc) => {
      router.push({
        pathname: "/chat",
        params: {
          id: doc.id,
        },
      });
    });
  };
  return (
    <View>
      <ScrollView>
        <PetInfo pet={pet} />
        <PetSubInfo pet={pet} />
        <AboutPet pet={pet} />
        <OwnerInfo pet={pet} />
        <View style={{ height: 70 }}></View>
      </ScrollView>
      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.adoptBtn} onPress={initiateChat}>
          <Text style={{ textAlign: "center", fontFamily: "outfit-medium", fontSize: 20 }}>Adopt Me</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  adoptBtn: {
    padding: 15,
    backgroundColor: Colors.PRIMARY,
  },
  bottomContainer: {
    position: "absolute",
    width: "100%",
    bottom: 0,
  },
});
