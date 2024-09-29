import { useUser } from "@clerk/clerk-expo";
import { Redirect, useRootNavigationState } from "expo-router";
import { useEffect } from "react";
import { Text, View } from "react-native";
import "../style";

export default function Index() {
  const { user } = useUser();
  const rootNavigationState = useRootNavigationState();
  useEffect(() => {
    CheckNavLoaded();
  }, []);
  const CheckNavLoaded = () => {
    if (!rootNavigationState?.key) {
      return null;
    }
  };
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}>
      <Text>{user?.fullName}</Text>
      {user ? <Redirect href={"/(tabs)/home"} /> : <Redirect href="/login" />}
    </View>
  );
}
