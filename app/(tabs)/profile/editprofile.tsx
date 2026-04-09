import * as ImagePicker from "expo-image-picker";
import {supabase as supabaseClient} from "@/app/utils/supabase";
import {toByteArray} from "base64-js";
import {useCallback, useContext, useEffect, useState} from "react";
import {AuthContext} from "@/app/authentication/use-auth-context";
import TabPage from "@/components/Tabs/TabPage";
import {Alert, Pressable, Text, View, ActivityIndicator} from "react-native";
import {useLocalSearchParams, useRouter} from "expo-router";
import SignInTextField from "@/components/Signin/SignInTextField";

import { defaultIcon, fetchProfileImage } from "./[handle]"
import {Image} from "expo-image";
import {WrappedButton} from "@/components/WrappedButton";
import {FontAwesome6} from "@react-native-vector-icons/fontawesome6";

export const baseEditButtonStyle = " w-[90vw] text-md rounded-xl p-[10px] border-1 border-neutral-700 "
export const editButtonStyle = baseEditButtonStyle + " bg-neutral-800 text-neutral-300 "

const logout = async () => {
    const {error} = await supabaseClient.auth.signOut();
}

const Editprofile = () => {
    const {profile, fetchProfile} = useContext(AuthContext);
    const router = useRouter();

    const params = useLocalSearchParams();

    const [imageUri, setImageUri] = useState<string | null>(defaultIcon);
    const [description, setDescription] = useState<string>("");
    const [handle, setHandle] = useState<string>("");
    const [name, setName] = useState<string>("");
    const [reloadCounter, setReloadCounter] = useState(0);

    const [uploading, setUploading] = useState<boolean>(false);

    const fetchProfileData = () => {
        if (profile == undefined) return;

        setName(profile.display_name);
        setHandle(profile.handle);
        setDescription(profile.description);
    }

    const openUpdateDetail = (detail: string) => {
        router.push({pathname: "profile/updatedetail", params: {detail: detail}})
    }

    const uploadProfileImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: "images",
            quality: 1,
            base64: true,
        });

        if (result.canceled || !result.assets.length) return;
        const chosenImage = result.assets[0];

        if (chosenImage.base64 == undefined) return;

        const { data, error } = await supabaseClient.storage
            .from('avatars')
            .upload(`/${profile.id}/avatar.jpg`, toByteArray(chosenImage.base64), { contentType:"image/jpg", upsert: true });

        if (error) console.error(error);
        else Alert.alert("Success", "Avatar picture successfully updated!");
    };

    const updatePage = () => {
        fetchProfile()
        setReloadCounter(prev => prev + 1)
    }

    const refreshPage = async (setRefreshing: React.Dispatch<React.SetStateAction<boolean>>) => {
        setRefreshing(true);
        updatePage()
        setRefreshing(false)
    }

    const promptUploadProfileImage = async () => {
        setUploading(true)
        await uploadProfileImage()
        setUploading(false)

        updatePage()
    }

    const renderProfileImage = async () => {
        const uri = await fetchProfileImage(profile?.id);
        setImageUri(uri)
    }

    useEffect(() => {
        fetchProfileData()
        renderProfileImage()
    }, [profile, reloadCounter]);

    return (
        <TabPage title={"Edit Index"} onRefresh={refreshPage}>
          <View className="p-4 flex gap-10">
              <Pressable onPress={() => router.back()} className="p-2 w-26 ">
                  <Text className={"color-amber-500"}> <Text className={"font-bold"}>&lt;</Text> Go Back</Text>
              </Pressable>

              <View className={"flex gap-10 p-4"}>
                  <View className={"items-center gap-6"}>
                        <Pressable onPress={promptUploadProfileImage}>
                            <View className={"z-30 h-[200px] w-[200px] absolute flex justify-center items-center"}>

                                <ActivityIndicator size="large" color="#ffb900" className={`absolute ${!uploading && "hidden"}`} />

                                {!uploading && (<FontAwesome6 name={"image"} size={50} color={"white"}  />)}
                            </View>

                            <Image source={imageUri} contentFit={"cover"} style={{width:200, height:200, borderRadius: 100, borderWidth:4, borderColor:"#2f2f2f", opacity:0.7}} />
                        </Pressable>

                     <View className={"flex items-center"}>
                         <Text className={"text-2xl color-amber-400 opacity-70"}>@{handle}</Text>
                         <Text className={"text-5xl color-white font-bold"}>{name}</Text>
                     </View>

                  </View>

              </View>

              <View className={"flex gap-6"}>
                  <Text className={"text-neutral-500 text-center font-bold text-xl"}>Info</Text>
                  <SignInTextField title={"Display Name"} iconName={"lock"} value={name} disabled={true}></SignInTextField>
                  <SignInTextField title={"Handle"} iconName={"lock"} value={handle} disabled={true}></SignInTextField>
              </View>

              <View className={"flex gap-6 mb-24"}>
                  <Text className={"text-neutral-500 text-center font-bold text-xl"}>Update Account</Text>
                  <WrappedButton isActive={true} title={"Change Display Name"} onClick={() => openUpdateDetail("display_name")} isAnimated={true} extraClassName={editButtonStyle}></WrappedButton>
                  <WrappedButton isActive={true} title={"Change Handle"} onClick={() => openUpdateDetail("handle")} isAnimated={true} extraClassName={editButtonStyle}></WrappedButton>
              </View>

              <View className={"flex gap-6"}>
                  <Text className={"text-neutral-500 text-center font-bold text-xl"}>Account</Text>
                  <WrappedButton isActive={true} title={"Delete Account"} onClick={() => router.push("profile/updatedetail")} isAnimated={true} extraClassName={editButtonStyle + " bg-red-600 text-white"}></WrappedButton>
                  <WrappedButton isActive={true} title={"Sign Out"} onClick={logout} isAnimated={true} extraClassName={editButtonStyle}></WrappedButton>
              </View>

              <View className={"flex mb-24"}>

              </View>
            </View>
        </TabPage>
    )
}

export default Editprofile;