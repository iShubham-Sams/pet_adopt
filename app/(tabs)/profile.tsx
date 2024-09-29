import { View, Text, Image, FlatList, TouchableOpacity, ActivityIndicator } from "react-native";
import React, { useState } from "react";
import { useAuth, useUser } from "@clerk/clerk-expo";
import Colors from "@/constants/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { Overlay } from "react-native-elements";

type IconTypes = "add-circle" | "heart" | "chatbubble" | "exit";
const Menu = [
  { id: 1, name: "Add New Pet", icon: "add-circle", path: "/add-new-pet" },
  { id: 2, name: "My Post", icon: "bookmark", path: "/user-post" },
  { id: 3, name: "Favorites", icon: "heart", path: "/(tabs)/favorite" },
  { id: 4, name: "Inbox", icon: "chatbubble", path: "/(tabs)/inbox" },
  { id: 5, name: "Logout", icon: "exit", path: "logout" },
];
type MenuType = typeof Menu;
export default function Profile() {
  const { user } = useUser();
  const [logOuting, setLogOuting] = useState(false);
  const { signOut } = useAuth();
  const router = useRouter();
  const onPressMenuItem = async (item: MenuType[0]) => {
    if (item.path == "logout") {
      setLogOuting(true);
      await signOut();
      setLogOuting(false);
      router.push("/login");
      return;
    } else {
      router.push(item.path as any);
    }
  };
  return (
    <View style={{ padding: 20, marginTop: 20 }}>
      <Overlay isVisible={logOuting} style={{ height: 100, width: 40, backgroundColor: Colors.LIGHT_PRIMARY }}>
        <ActivityIndicator size="large" />
      </Overlay>
      <Text style={{ fontFamily: "outfit-medium", fontSize: 30 }}>Profile</Text>
      <View style={{ display: "flex", alignItems: "center", marginVertical: 25 }}>
        <Image source={{ uri: user?.imageUrl }} style={{ width: 80, height: 80, borderRadius: 99, gap: 7, marginTop: 6 }} />
        <Text style={{ fontFamily: "outfit-bold", fontSize: 20 }}>{user?.fullName}</Text>
        <Text style={{ fontFamily: "outfit", fontSize: 16, color: Colors.GRAY }}>{user?.primaryEmailAddress?.emailAddress}</Text>
      </View>
      <FlatList
        data={Menu}
        renderItem={({ item, index }) => {
          return (
            <TouchableOpacity onPress={() => onPressMenuItem(item)} key={index} style={{ marginVertical: 10, display: "flex", flexDirection: "row", alignItems: "center", backgroundColor: Colors.WHITE, padding: 10, borderRadius: 10 }}>
              <Ionicons name={item.icon as IconTypes} size={30} color={Colors.PRIMARY} style={{ padding: 10, backgroundColor: Colors.LIGHT_PRIMARY, borderRadius: 10 }} />
              <Text style={{ fontFamily: "outfit", fontSize: 20 }}>{item.name}</Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}
