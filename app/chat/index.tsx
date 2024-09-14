import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { addDoc, collection, doc, getDoc, onSnapshot } from "firebase/firestore";
import { db } from "@/config/FirebaseConfig";
import { useUser } from "@clerk/clerk-expo";
import { GiftedChat } from "react-native-gifted-chat";
import moment from "moment";

export default function ChatScreen() {
  const params = useLocalSearchParams();
  const navigation = useNavigation();
  const { user } = useUser();
  const [messages, setMessages] = useState<any[]>([]);

  const onSend = async (messages: any[]) => {
    setMessages((previousMessages) => GiftedChat.append(previousMessages, messages));
    messages[0].createdAt = moment().format("MM-DD-YYYY HH:mm:ss");
    await addDoc(collection(db, "Chat", params?.id as string, "Message"), messages[0]);
  };

  useEffect(() => {
    getUserDetails();
    const unsubscribe = onSnapshot(collection(db, "Chat", params.id as string, "Message"), (snapshot) => {
      const messageData = snapshot.docs.map((doc) => ({
        _id: doc.id,
        ...doc.data(),
      }));

      setMessages(messageData);
    });
    return () => unsubscribe();
  }, []);
  const getUserDetails = async () => {
    const docRef = doc(db, "Chat", params.id as string);
    const docSnap = await getDoc(docRef);
    const result = docSnap.data();
    const otherUser = result?.users.filter((item: any) => item.email !== user?.primaryEmailAddress?.emailAddress);
    navigation.setOptions({
      headerTitle: otherUser[0].name,
    });
  };
  if (!user) {
    return <></>;
  }
  return (
    <GiftedChat
      messages={messages}
      onSend={(messages) => onSend(messages)}
      showUserAvatar={true}
      user={{
        _id: user?.primaryEmailAddress?.emailAddress!,
        name: user?.fullName!,
        avatar: user?.imageUrl,
      }}
    />
  );
}
