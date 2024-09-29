import { View, Text, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/config/FirebaseConfig";
import { useUser } from "@clerk/clerk-expo";
import UserItem from "@/components/Inbox/UserItem";

export default function Inbox() {
  const { user } = useUser();
  const [userList, setUserList] = useState<any>();
  const [loader, setLoader] = useState(false);
  useEffect(() => {
    if (user) {
      getUserList();
    }
  }, [user]);
  const getUserList = async () => {
    setLoader(true);
    setUserList([]);
    const q = query(collection(db, "Chat"), where("userIds", "array-contains", user?.primaryEmailAddress?.emailAddress));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      setUserList((pre: any) => [...pre, doc.data()]);
    });
    setLoader(false);
  };

  const MapOtherUserList = () => {
    const list: any = [];
    userList?.forEach((record: any) => {
      const otherUser = record.users?.filter((u: any) => u?.email != user?.primaryEmailAddress?.emailAddress);
      const result = {
        docId: record.id,
        ...otherUser[0],
      };
      list.push(result);
    });
    return list;
  };
  return (
    <View style={{ padding: 20, margin: 20 }}>
      <Text style={{ fontFamily: "outfit-medium", fontSize: 30 }}>Inbox</Text>
      {loader ? (
        <View style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 20, flexWrap: "wrap" }}>
          <View style={{ width: "100%", height: 60, backgroundColor: "#9e9e9e", opacity: 0.4, borderRadius: 20 }}></View>
          <View style={{ width: "100%", height: 60, backgroundColor: "#9e9e9e", opacity: 0.4, borderRadius: 20 }}></View>
          <View style={{ width: "100%", height: 60, backgroundColor: "#9e9e9e", opacity: 0.4, borderRadius: 20 }}></View>
          <View style={{ width: "100%", height: 60, backgroundColor: "#9e9e9e", opacity: 0.4, borderRadius: 20 }}></View>
        </View>
      ) : (
        <FlatList
          refreshing={loader}
          onRefresh={() => getUserList()}
          style={{ marginTop: 20 }}
          data={MapOtherUserList()}
          renderItem={({ item, index }) => {
            return <UserItem userInfo={item} key={index} />;
          }}
        />
      )}
    </View>
  );
}
