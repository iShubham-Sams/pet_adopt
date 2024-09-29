import { View, Text, FlatList, Pressable, StyleSheet, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "expo-router";
import { useUser } from "@clerk/clerk-expo";
import { collection, deleteDoc, doc, getDocs, query, where } from "firebase/firestore";
import { db } from "@/config/FirebaseConfig";
import PetListItem from "@/components/Home/PetListItem";
import Colors from "@/constants/Colors";

export default function UserPostScreen() {
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const { user } = useUser();
  const [userPostList, setUserPostList] = useState<any>();
  useEffect(() => {
    navigation.setOptions({
      headerTitle: "User Post",
    });
    if (user) {
      getUserPost();
    }
  }, [user]);
  const getUserPost = async () => {
    setUserPostList([]);
    setLoading(true);
    const q = query(collection(db, "Pets"), where("email", "==", user?.primaryEmailAddress?.emailAddress));
    const querySnapShot = await getDocs(q);
    querySnapShot.forEach((doc) => {
      setUserPostList((pre: any) => [...pre, doc.data()]);
    });
    setLoading(false);
  };

  const onDeletePost = (docId: string) => {
    Alert.alert("Do you really want to Delete?", "Do you really want to delete this post", [
      {
        text: "Cancel",
        // onPress: () => {},
        style: "cancel",
      },
      {
        text: "Delete",
        onPress: () => deletePost(docId),
      },
    ]);
  };

  const deletePost = async (id: string) => {
    await deleteDoc(doc(db, "Pets", id));
    getUserPost();
  };
  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontFamily: "outfit-medium", fontSize: 20 }}>UserPost</Text>
      <FlatList
        refreshing={loading}
        onRefresh={getUserPost}
        numColumns={2}
        data={userPostList}
        renderItem={({ item, index }) => (
          <View>
            <PetListItem pet={item} key={index} />
            <Pressable onPress={() => onDeletePost(item?.id)} style={styles.deleteButton}>
              <Text style={{ fontFamily: "outfit", textAlign: "center" }}>Delete</Text>
            </Pressable>
          </View>
        )}
      />
      {userPostList.length === 0 && <Text>No post found</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  deleteButton: {
    backgroundColor: Colors.LIGHT_PRIMARY,
    padding: 5,
    borderRadius: 7,
    marginTop: 5,
    marginRight: 10,
  },
});
