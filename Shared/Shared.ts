import { db } from "@/config/FirebaseConfig";
import { collection, doc, getDoc, getDocs, setDoc, updateDoc } from "firebase/firestore";
import { Dispatch, SetStateAction } from "react";

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
  } catch (error) { }
};

const getCategory = async (setCategoryList: Dispatch<SetStateAction<Array<any>>>) => {
  setCategoryList([]);
  const snapShot = await getDocs(collection(db, "Category"));
  snapShot.forEach((doc) => {
    setCategoryList((cat) => [...cat, doc.data()]);
  });
};
export default {
  getFavList,
  UpdateFav,
  getCategory
};
