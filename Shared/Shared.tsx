import { db } from "@/config/FirebaseConfig";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

const getFavList = async (user: any) => {
  const docSnap = await getDoc(doc(db, "UserFavPet", user?.primaryEmailAddress?.emailAddress));
  if (docSnap?.exists()) {
    return docSnap.data();
  } else {
    await setDoc(doc(db, "UserFavPet", user?.primaryEmailAddress?.emailAddress), {
      email: user?.primaryEmailAddress?.emailAddress,
      favorites: [],
    });
  }
};

const UpdateFav = async (user: any, favorites: any) => {
  const docRef = doc(db, "UserFavPet", user?.primaryEmailAddress?.emailAddress);
  try {
    await updateDoc(docRef, {
      favorites: favorites,
    });
  } catch (error) {}
};

export default {
  getFavList,
  UpdateFav,
};
