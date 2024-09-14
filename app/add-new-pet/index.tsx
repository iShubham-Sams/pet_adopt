import { View, Text, Image, TextInput, StyleSheet, ScrollView, TouchableOpacity, Pressable, ToastAndroid, Platform, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { useNavigation, useRouter } from "expo-router";
import Colors from "@/constants/Colors";
import { Picker } from "@react-native-picker/picker";
import Shared from "@/Shared/Shared";
import { useToast } from "react-native-toast-notifications";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "@/config/FirebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import { useUser } from "@clerk/clerk-expo";

export default function AddNewPet() {
  const { user } = useUser();
  const toast = useToast();
  const navigation = useNavigation();
  const [gender, setGender] = useState();
  const [formData, setFormData] = useState<Record<any, any>>({
    category: "Dogs",
    sex: "Male",
  });
  const [categoryList, setCategoryList] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<any>();
  const [image, setImage] = useState<string | null>(null);
  const [creatingNewPet, setCreatingNewPet] = useState(false);
  const router = useRouter();
  useEffect(() => {
    navigation.setOptions({
      headerTitle: "Add New Pet",
    });
    Shared.getCategory(setCategoryList);
  }, []);

  const handelInputChange = (filedName: string, filedValue: string) => {
    setFormData((pre) => {
      if (pre) {
        return { ...pre, [filedName]: [filedValue] };
      } else {
        return { [filedName]: [filedValue] };
      }
    });
  };

  const imagePicker = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };
  const onAddPetSubmit = () => {
    if (Object.keys(formData).length !== 8 || !image) {
      if (Platform.OS == "android") {
        ToastAndroid.showWithGravityAndOffset("Please fill all field", 1, ToastAndroid.BOTTOM, 25, 50);
        return;
      } else {
        toast.show("Please fill all field");
        return;
      }
    } else {
      uploadImage();
    }
  };

  const uploadImage = async () => {
    setCreatingNewPet(true);
    if (image) {
      const res = await fetch(image);
      const blobImage = await res.blob();
      const storageRef = ref(storage, "/petImage/" + Date.now() + ".jpg");
      uploadBytes(storageRef, blobImage)
        .then((res) =>
          getDownloadURL(storageRef).then(async (downloadUrl) => {
            saveFormData(downloadUrl);
          })
        )
        .catch((er) => console.error(er));
    }
  };

  const saveFormData = async (imageUrl: string) => {
    const docId = Date.now().toString();
    await setDoc(doc(db, "Pets", docId), {
      ...formData,
      imageUrl: imageUrl,
      username: user?.fullName,
      email: user?.primaryEmailAddress?.emailAddress,
      id: docId,
      userImage: user?.imageUrl,
    });
    setCreatingNewPet(false);
    router.replace("/(tabs)/home");
  };
  return (
    <ScrollView style={{ padding: 20 }}>
      <Text
        style={{
          fontFamily: "outfit-medium",
          fontSize: 20,
        }}>
        Add New Pet For Adoption
      </Text>
      <Pressable onPress={imagePicker}>
        {image ? (
          <Image source={{ uri: image }} style={{ width: 100, height: 100, borderRadius: 15 }} />
        ) : (
          <Image source={require("../../assets/images/placeholder.jpeg")} style={{ width: 100, height: 100, borderRadius: 15, borderColor: Colors.GRAY, borderWidth: 1 }} />
        )}
      </Pressable>

      <View style={style.inputContainer}>
        <Text style={style.label}>Pet Name *</Text>
        <TextInput style={style.input} onChangeText={(value) => handelInputChange("name", value)} />
      </View>

      <View style={style.inputContainer}>
        <Text style={style.label}>Category *</Text>
        <Picker
          selectedValue={selectedCategory}
          onValueChange={(itemValue, itemIndex) => {
            setSelectedCategory(itemValue);
            if (itemValue) {
              handelInputChange("category", itemValue);
            }
          }}
          style={style.input}>
          {categoryList?.map((category, ind) => (
            <Picker.Item key={ind} label={category.name} value={category.name} />
          ))}
        </Picker>
      </View>

      <View style={style.inputContainer}>
        <Text style={style.label}>Breed *</Text>
        <TextInput style={style.input} onChangeText={(value) => handelInputChange("breed", value)} />
      </View>

      <View style={style.inputContainer}>
        <Text style={style.label}>Age *</Text>
        <TextInput keyboardType="numeric" style={style.input} onChangeText={(value) => handelInputChange("age", value)} />
      </View>
      <View style={style.inputContainer}>
        <Text style={style.label}>Gender *</Text>
        <Picker
          selectedValue={gender}
          onValueChange={(itemValue, itemIndex) => {
            setGender(itemValue);
            if (itemValue) {
              handelInputChange("sex", itemValue);
            }
          }}
          style={style.input}>
          <Picker.Item label="Male" value="male" />
          <Picker.Item label="Female" value="female" />
        </Picker>
      </View>

      <View style={style.inputContainer}>
        <Text style={style.label}>Weight *</Text>
        <TextInput keyboardType="numeric" style={style.input} onChangeText={(value) => handelInputChange("weight", value)} />
      </View>

      <View style={style.inputContainer}>
        <Text style={style.label}>Address *</Text>
        <TextInput style={style.input} onChangeText={(value) => handelInputChange("address", value)} />
      </View>

      <View style={style.inputContainer}>
        <Text style={style.label}>About *</Text>
        <TextInput numberOfLines={5} multiline={true} style={style.input} onChangeText={(value) => handelInputChange("about", value)} />
      </View>

      <TouchableOpacity style={style.button} onPress={onAddPetSubmit} disabled={creatingNewPet}>
        {creatingNewPet ? <ActivityIndicator size={"large"} /> : <Text style={{ fontFamily: "outfit-medium", textAlign: "center" }}>Submit</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
}

const style = StyleSheet.create({
  inputContainer: {
    marginVertical: 5,
  },
  input: {
    padding: 10,
    backgroundColor: Colors.WHITE,
    borderRadius: 7,
    fontFamily: "outfit",
  },
  label: {
    marginVertical: 5,
    fontFamily: "outfit",
  },
  button: {
    padding: 15,
    backgroundColor: Colors.PRIMARY,
    borderRadius: 7,
    marginVertical: 10,
    marginBottom: 50,
    zIndex: 0,
  },
});
