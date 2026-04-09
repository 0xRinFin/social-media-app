import * as ImagePicker from "expo-image-picker";
import {supabase as supabaseClient} from "@/app/utils/supabase";
import {toByteArray} from "base64-js";
import {useCallback, useContext, useEffect, useState} from "react";
import {AuthContext} from "@/app/authentication/use-auth-context";
import TabPage from "@/components/Tabs/TabPage";
import {Pressable, Text, View} from "react-native";
import {useRouter} from "expo-router";
import SignInTextField from "@/components/Signin/SignInTextField";

import { defaultIcon, fetchProfileImage } from "./profile"
import {Image} from "expo-image";
import {WrappedButton} from "@/components/WrappedButton";

const editButtonStyle = "w-[90vw] text-md rounded-xl p-[10px] bg-neutral-800 border-1 border-neutral-700 text-neutral-300"

const logout = async () => {
    const {error} = await supabaseClient.auth.signOut();
}

const Editprofile = () => {
    const {profile} = useContext(AuthContext);
    const router = useRouter();

    const [imageUri, setImageUri] = useState<string | null>(defaultIcon);
    const [description, setDescription] = useState<string>("");
    const [handle, setHandle] = useState<string>("");
    const [name, setName] = useState<string>("");

    const fetchProfileData = () => {
        if (profile == undefined) return;

        setName(profile.display_name);
        setHandle(profile.handle);
        setDescription(profile.description);
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
        else console.log('Upload success', data);
    };

    const renderProfileImage = async () => {
        const uri = await fetchProfileImage(profile?.id);
        setImageUri(uri)
    }

    useEffect(() => {
        fetchProfileData()
        renderProfileImage()
    }, [profile]);


    return (
        <TabPage title={"Edit Profile"}>
          <View className="p-4 flex gap-10">
              <Pressable onPress={() => router.back()} className="p-2 w-24 ">
                  <Text className={"color-amber-500"}>Go Back</Text>
              </Pressable>

              <View className={"flex gap-10 p-4"}>
                  <View className={"items-center gap-6"}>
                        <Image source={imageUri} contentFit={"cover"} style={{width:200, height:200, borderRadius: 100, borderWidth:4, borderColor:"#2f2f2f"}} />

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
                  <WrappedButton isActive={true} title={"Change Display Name"} onClick={() => router.push("profile/editprofile")} isAnimated={true} extraClassName={editButtonStyle}></WrappedButton>
                  <WrappedButton isActive={true} title={"Change Handle"} onClick={() => router.push("profile/editprofile")} isAnimated={true} extraClassName={editButtonStyle}></WrappedButton>
              </View>

              <View className={"flex gap-6"}>
                  <Text className={"text-neutral-500 text-center font-bold text-xl"}>Account</Text>
                  <WrappedButton isActive={true} title={"Delete Account"} onClick={() => router.push("profile/editprofile")} isAnimated={true} extraClassName={editButtonStyle + " bg-red-600 text-white"}></WrappedButton>
                  <WrappedButton isActive={true} title={"Sign Out"} onClick={logout} isAnimated={true} extraClassName={editButtonStyle}></WrappedButton>
              </View>

              <View className={"flex mb-24"}>

              </View>
            </View>
        </TabPage>
    )
}

export default Editprofile;